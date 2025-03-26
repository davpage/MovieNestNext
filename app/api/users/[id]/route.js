import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req) => {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) throw new Error('Unauthorized');
    return jwt.verify(token, JWT_SECRET);
};

export async function GET(req, { params }) {
    const { id } = params;
    try {
        const user = authMiddleware(req);
        if (parseInt(id) !== user.id) {
            return NextResponse.json({ error: 'You can only view your own data' }, { status: 403 });
        }
        const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1 AND is_verified = TRUE', [id]);
        if (result.rowCount === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { name, password } = await req.json();
    try {
        const user = authMiddleware(req);
        if (parseInt(id) !== user.id) {
            return NextResponse.json({ error: 'You can only edit your own data' }, { status: 403 });
        }
        let queryText = 'UPDATE users SET name = $1 WHERE id = $2 AND is_verified = TRUE RETURNING id, name, email';
        let queryParams = [name, id];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            queryText = 'UPDATE users SET name = $1, password = $2 WHERE id = $3 AND is_verified = TRUE RETURNING id, name, email';
            queryParams = [name, hashedPassword, id];
        }

        const result = await pool.query(queryText, queryParams);
        if (result.rowCount === 0) return NextResponse.json({ error: 'User not found or not verified' }, { status: 404 });
        const updatedUser = result.rows[0];
        const token = jwt.sign({ id: updatedUser.id, email: updatedUser.email, name: updatedUser.name }, JWT_SECRET, { expiresIn: '1h' });
        return NextResponse.json({ user: updatedUser, token });
    } catch (error) {
        return NextResponse.json({ error: 'Could not update user' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;
    try {
        const user = authMiddleware(req);
        if (parseInt(id) !== user.id) {
            return NextResponse.json({ error: 'You can only delete your own account' }, { status: 403 });
        }
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        return NextResponse.json({ message: 'Account deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Could not delete user' }, { status: 500 });
    }
}