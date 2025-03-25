require('dotenv').config();
const express = require('express');
const next = require('next');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_PASSWORD = process.env.SENDER_PASSWORD;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Railway-ում SSL պարտադիր է
    },
});


const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
    },
});

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

app.prepare().then(() => {
    const server = express();
    server.use(express.json());

    server.get('/api/users/:id', authMiddleware, async (req, res) => {
        const { id } = req.params;
        if (parseInt(id) !== req.user.id) {
            return res.status(403).json({ error: 'You can only view your own data' });
        }
        try {
            const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1 AND is_verified = TRUE', [id]);
            if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Database error' });
        }
    });

    server.put('/api/users/:id', authMiddleware, async (req, res) => {
        const { id } = req.params;
        const { name, password } = req.body;
        if (parseInt(id) !== req.user.id) {
            return res.status(403).json({ error: 'You can only edit your own data' });
        }
        try {
            let queryText = 'UPDATE users SET name = $1 WHERE id = $2 AND is_verified = TRUE RETURNING id, name, email';
            let queryParams = [name, id];

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                queryText = 'UPDATE users SET name = $1, password = $2 WHERE id = $3 AND is_verified = TRUE RETURNING id, name, email';
                queryParams = [name, hashedPassword, id];
            }

            const result = await pool.query(queryText, queryParams);
            if (result.rowCount === 0) return res.status(404).json({ error: 'User not found or not verified' });
            const user = result.rows[0];
            const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ user: result.rows[0], token }); // Վերադարձնել նոր token
        } catch (error) {
            res.status(500).json({ error: 'Could not update user' });
        }
    });

    server.delete('/api/users/:id', authMiddleware, async (req, res) => {
        const { id } = req.params;
        if (parseInt(id) !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own account' });
        }
        try {
            const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
            if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
            res.json({ message: 'Account deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Could not delete user' });
        }
    });

    server.post('/api/register', async (req, res) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationCode = generateCode();

            const result = await pool.query(
                'INSERT INTO users (name, email, password, verification_code) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
                [name, email, hashedPassword, verificationCode]
            );
            const user = result.rows[0];

            await transporter.sendMail({
                from: SENDER_EMAIL,
                to: email,
                subject: 'Հաստատման կոդ',
                text: `Ձեր հաստատման կոդն է: ${verificationCode}`,
            });

            res.status(201).json({ message: 'Registration successful, check your email for verification code', userId: user.id });
        } catch (error) {
            console.error('Email sending error:', error);
            if (error.code === '23505') {
                return res.status(409).json({ error: 'Email already exists' });
            }
            res.status(500).json({ error: 'Could not register user', details: error.message });
        }
    });

    server.post('/api/verify', async (req, res) => {
        const { userId, code } = req.body;
        try {
            const result = await pool.query(
                'UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE id = $1 AND verification_code = $2 RETURNING id, name, email',
                [userId, code]
            );
            if (result.rowCount === 0) {
                return res.status(400).json({ error: 'Invalid verification code' });
            }
            const user = result.rows[0];
            const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Verification failed' });
        }
    });

    server.post('/api/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            if (!user.is_verified) {
                const verificationCode = generateCode();
                await pool.query('UPDATE users SET verification_code = $1 WHERE id = $2', [verificationCode, user.id]);
                await transporter.sendMail({
                    from: SENDER_EMAIL,
                    to: email,
                    subject: 'Հաստատման կոդ',
                    text: `Ձեր հաստատման կոդն է: ${verificationCode}`,
                });
                return res.status(200).json({ message: 'Account not verified, check your email for verification code', userId: user.id, needsVerification: true });
            }
            const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    });

    server.all('*', (req, res) => handle(req, res));

    server.listen(5000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:5000');
    });
});
