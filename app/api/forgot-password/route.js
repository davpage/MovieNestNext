import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: { user: process.env.SENDER_EMAIL, pass: process.env.SENDER_PASSWORD },
});

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(req) {
    const { email } = await req.json();
    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const resetCode = generateCode();
        await pool.query('UPDATE users SET verification_code = $1 WHERE id = $2', [resetCode, user.id]);
        await transporter.sendMail({
            from: `"MovieNest" <${process.env.SENDER_EMAIL}>`,
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
        return NextResponse.json({ message: 'Password reset code sent to your email', userId: user.id });
    } catch (error) {
        return NextResponse.json({ error: 'Could not process password reset' }, { status: 500 });
    }
}