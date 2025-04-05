import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const JWT_SECRET = process.env.JWT_SECRET;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_PASSWORD = process.env.SENDER_PASSWORD;

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: { user: SENDER_EMAIL, pass: SENDER_PASSWORD },
});

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const withCors = (response) => {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
};

export async function POST(req) {
    const { email, password } = await req.json();
    try {
        if (!email || !password) {
            return withCors(NextResponse.json({ error: 'Email and password are required' }, { status: 400 }));
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return withCors(NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }));
        }

        // Ստուգել, արդյոք օգտատերը admin է
        if (!user.admin) {
            return withCors(NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 }));
        }

        // Ստուգել, արդյոք օգտատերը հաստատված է
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
                `,
            });
            return withCors(
                NextResponse.json({
                    message: 'Account not verified, check your email for verification code',
                    userId: user.id,
                    needsVerification: true,
                })
            );
        }

        // Եթե օգտատերը admin է և հաստատված, ստեղծել token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, admin: user.admin },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        return withCors(NextResponse.json({ message: 'Login successful', token }));
    } catch (error) {
        console.error('Error in login:', error);
        return withCors(NextResponse.json({ error: 'Login failed', details: error.message }, { status: 500 }));
    }
}

export async function OPTIONS() {
    return withCors(NextResponse.json({}, { status: 200 }));
}