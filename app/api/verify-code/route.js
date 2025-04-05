import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const JWT_SECRET = process.env.JWT_SECRET;

const withCors = (response) => {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
};

export async function POST(req) {
    const { userId, code } = await req.json();
    try {
        if (!userId || !code) {
            return withCors(NextResponse.json({ error: 'User ID and code are required' }, { status: 400 }));
        }

        const result = await pool.query(
            'UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE id = $1 AND verification_code = $2 RETURNING id, name, email, admin',
            [userId, code]
        );

        if (result.rowCount === 0) {
            return withCors(NextResponse.json({ error: 'Invalid verification code' }, { status: 400 }));
        }

        const user = result.rows[0];

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, admin: user.admin },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return withCors(NextResponse.json({ message: 'Verification successful', token }));
    } catch (error) {
        console.error('Error in verification:', error);
        return withCors(NextResponse.json({ error: 'Verification failed', details: error.message }, { status: 500 }));
    }
}

export async function OPTIONS() {
    return withCors(NextResponse.json({}, { status: 200 }));
}
