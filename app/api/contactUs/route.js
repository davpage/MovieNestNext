import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: { user: process.env.SENDER_EMAIL, pass: process.env.SENDER_PASSWORD },
});

export async function POST(req) {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
        return NextResponse.json({ error: 'Անունը, էլ. փոստը և հաղորդագրությունը պարտադիր են' }, { status: 400 });
    }

    try {
        // Ուղարկել նամակ
        await transporter.sendMail({
            from: `"My Portfailo Web Page" <${process.env.SENDER_EMAIL}>`,
            to: email, // Օգտատիրոջ էլ. փոստը
            bcc: 'davidmeloyan99@gmail.com', // Ձեր էլ. փոստը՝ տվյալները ստանալու համար
            subject: 'Հաղորդագրություն My Portfailo Web Page-ից',
            html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                    <div style="background: linear-gradient(90deg, #ff2e63, #ff5733); padding: 25px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">My Portfailo Web Page</h1>
                    </div>
                    <div style="padding: 40px 30px; text-align: center;">
                        <h2 style="font-size: 22px; color: #ffffff; margin: 0 0 20px;">Նոր հաղորդագրություն My Portfailo Web Page-ից</h2>
                        <p style="font-size: 16px; color: #cccccc; line-height: 1.6; margin: 0 0 25px;">
                            Դուք ստացել եք նոր հաղորդագրություն My Portfailo Web Page-ից:
                        </p>
                        <p style="font-size: 16px; color: #cccccc; line-height: 1.6; margin: 25px 0;">
                            <strong>Անուն:</strong> ${name}<br>
                            <strong>Էլ. փոստ:</strong> ${email}<br>
                            <strong>Հաղորդագրություն:</strong> ${message}
                        </p>
                
                    </div>
                    <div style="background-color: #141414; padding: 20px; text-align: center;">
                        <a href="https://movienest.live" style="color: #ff5733; text-decoration: none; font-size: 16px; font-weight: bold;">Այցելեք Syntax Academy</a>
                        <p style="font-size: 12px; color: #666666; margin: 10px 0 0;">© 2025 David Meloyan. Բոլոր իրավունքները պաշտպանված են:</p>
                    </div>
                </div>
            `
        });

        return NextResponse.json({
            message: 'Հաղորդագրությունն ուղարկվեց հաջողությամբ'
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Չհաջողվեց ուղարկել հաղորդագրությունը', details: error.message }, { status: 500 });
    }
}