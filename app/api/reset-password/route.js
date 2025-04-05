import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    const { userId, code, newPassword } = await req.json();
    if (!userId || !code || !newPassword) {
        return NextResponse.json({ error: 'User ID, code, and new password are required' }, { status: 400 });
    }
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1 AND verification_code = $2',
            [userId, code]
        );
        const user = result.rows[0];
        if (!user) {
            return NextResponse.json({ error: 'Invalid reset code' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateResult = await pool.query(
            'UPDATE users SET password = $1, verification_code = NULL, is_verified = TRUE WHERE id = $2 RETURNING id, name, email',
            [hashedPassword, userId]
        );

        const updatedUser = updateResult.rows[0];
        const token = jwt.sign(
            { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return NextResponse.json({ message: 'Password reset successful', token });
    } catch (error) {
        return NextResponse.json({ error: 'Could not reset password' }, { status: 500 });
    }
}
