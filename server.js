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
        rejectUnauthorized: false
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
            res.json({ user: result.rows[0], token });
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
                from: `"MovieNest" <${SENDER_EMAIL}>`,
                to: email,
                subject: 'Հաստատման կոդ',
                html: `
                    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                        <div style="background: linear-gradient(90deg, #ff2e63, #ff5733); padding: 25px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">MovieNest</h1>
                            <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Ձեր կինոյի աշխարհը</p>
                        </div>
                        <div style="padding: 40px 30px; text-align: center;">
                            <h2 style="font-size: 22px; color: #ffffff; margin: 0 0 20px;">Բարի գալուստ MovieNest!</h2>
                            <p style="font-size: 16px; color: #cccccc; line-height: 1.6; margin: 0 0 25px;">
                                Շնորհակալություն մեր կայքում գրանցվելու համար: Ձեր հաշիվը հաստատելու համար օգտագործեք ստորև նշված կոդը:
                            </p>
                            <div style="display: inline-block; background-color: #ff5733; color: #ffffff; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
                                ${verificationCode}
                            </div>
                            <p style="font-size: 14px; color: #999999; line-height: 1.5; margin: 25px 0 0;">
                                Կոդը վավեր է 10 րոպե: Եթե չեք գրանցվել, անտեսեք այս նամակը:
                            </p>
                        </div>
                        <div style="background-color: #141414; padding: 20px; text-align: center;">
                            <a href="https://movienest.live" style="color: #ff5733; text-decoration: none; font-size: 16px; font-weight: bold;">Այցելեք MovieNest</a>
                            <p style="font-size: 12px; color: #666666; margin: 10px 0 0;">© 2025 MovieNest. Բոլոր իրավունքները պաշտպանված են:</p>
                        </div>
                    </div>
                `
            });

            res.status(201).json({
                message: 'Registration successful, check your email for verification code',
                userId: user.id
            });
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
                    from: `"MovieNest" <${SENDER_EMAIL}>`,
                    to: email,
                    subject: 'Հաստատման կոդ',
                    html: `
                        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                            <div style="background: linear-gradient(90deg, #ff2e63, #ff5733); padding: 25px; text-align: center;">
                                <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">MovieNest</h1>
                                <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Ձեր կինոյի աշխարհը</p>
                            </div>
                            <div style="padding: 40px 30px; text-align: center;">
                                <h2 style="font-size: 22px; color: #ffffff; margin: 0 0 20px;">Հաստատեք Ձեր Հաշիվը</h2>
                                <p style="font-size: 16px; color: #cccccc; line-height: 1.6; margin: 0 0 25px;">
                                    Ձեր հաշիվը դեռ հաստատված չէ: Օգտագործեք ստորև նշված կոդը՝ հաստատման համար:
                                </p>
                                <div style="display: inline-block; background-color: #ff5733; color: #ffffff; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
                                    ${verificationCode}
                                </div>
                                <p style="font-size: 14px; color: #999999; line-height: 1.5; margin: 25px 0 0;">
                                    Կոդը վավեր է 10 րոպե: Եթե խնդիրներ ունեք, կապվեք մեզ հետ:
                                </p>
                            </div>
                            <div style="background-color: #141414; padding: 20px; text-align: center;">
                                <a href="https://movienest.live" style="color: #ff5733; text-decoration: none; font-size: 16px; font-weight: bold;">Այցելեք MovieNest</a>
                                <p style="font-size: 12px; color: #666666; margin: 10px 0 0;">© 2025 MovieNest. Բոլոր իրավունքները պաշտպանված են:</p>
                            </div>
                        </div>
                    `
                });
                return res.status(200).json({
                    message: 'Account not verified, check your email for verification code',
                    userId: user.id,
                    needsVerification: true
                });
            }
            const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    });

    // Ավելացված endpoint՝ Forgot Password
    server.post('/api/forgot-password', async (req, res) => {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const resetCode = generateCode();
            await pool.query('UPDATE users SET verification_code = $1 WHERE id = $2', [resetCode, user.id]);

            await transporter.sendMail({
                from: `"MovieNest" <${SENDER_EMAIL}>`,
                to: email,
                subject: 'Գաղտնաբառի Վերականգնման Կոդ',
                html: `
                    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                        <div style="background: linear-gradient(90deg, #ff2e63, #ff5733); padding: 25px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">MovieNest</h1>
                            <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Ձեր կինոյի աշխարհը</p>
                        </div>
                        <div style="padding: 40px 30px; text-align: center;">
                            <h2 style="font-size: 22px; color: #ffffff; margin: 0 0 20px;">Գաղտնաբառի Վերականգնում</h2>
                            <p style="font-size: 16px; color: #cccccc; line-height: 1.6; margin: 0 0 25px;">
                                Դուք խնդրել եք վերականգնել Ձեր գաղտնաբառը: Օգտագործեք ստորև նշված կոդը՝ գործընթացը ավարտելու համար:
                            </p>
                            <div style="display: inline-block; background-color: #ff5733; color: #ffffff; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
                                ${resetCode}
                            </div>
                            <p style="font-size: 14px; color: #999999; line-height: 1.5; margin: 25px 0 0;">
                                Կոդը վավեր է 10 րոպե: Եթե դուք չեք խնդրել վերականգնում, անտեսեք այս նամակը:
                            </p>
                        </div>
                        <div style="background-color: #141414; padding: 20px; text-align: center;">
                            <a href="https://movienest.live/reset" style="color: #ff5733; text-decoration: none; font-size: 16px; font-weight: bold;">Վերականգնել գաղտնաբառը</a>
                            <p style="font-size: 12px; color: #666666; margin: 10px 0 0;">© 2025 MovieNest. Բոլոր իրավունքները պաշտպանված են:</p>
                        </div>
                    </div>
                `
            });

            res.status(200).json({
                message: 'Password reset code sent to your email',
                userId: user.id
            });
        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({ error: 'Could not process password reset' });
        }
    });

    // Ավելացված endpoint՝ Reset Password
    server.post('/api/reset-password', async (req, res) => {
        const { userId, code, newPassword } = req.body;
        if (!userId || !code || !newPassword) {
            return res.status(400).json({ error: 'User ID, code, and new password are required' });
        }
        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE id = $1 AND verification_code = $2',
                [userId, code]
            );
            const user = result.rows[0];
            if (!user) {
                return res.status(400).json({ error: 'Invalid reset code' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await pool.query(
                'UPDATE users SET password = $1, verification_code = NULL WHERE id = $2 RETURNING id, name, email',
                [hashedPassword, userId]
            );

            const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Password reset successful', token });
        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({ error: 'Could not reset password' });
        }
    });

    server.all('*', (req, res) => handle(req, res));

    server.listen(7000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:7000');
    });
});
