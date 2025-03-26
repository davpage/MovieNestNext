import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    const { userId, code } = await req.json();
    try {
        const result = await pool.query(
            'UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE id = $1 AND verification_code = $2 RETURNING id, name, email',
            [userId, code]
        );
        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
        return NextResponse.json({ token });
    } catch (error) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}