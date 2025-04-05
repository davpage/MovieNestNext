import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req) => {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) throw new Error('Unauthorized');
    return jwt.verify(token, JWT_SECRET);
};

const withCors = (response) => {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
};

export async function POST(req) {
    try {
        authMiddleware(req);
        const { name, description } = await req.json();

        if (!name) {
            return withCors(NextResponse.json({ error: 'Category name is required' }, { status: 400 }));
        }

        const result = await pool.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
            [name, description || null]
        );

        const newCategory = result.rows[0];
        return withCors(NextResponse.json({ message: 'Category added successfully', category: newCategory }, { status: 201 }));
    } catch (error) {
        console.error('Error in POST /api/categories:', error); // Լոգավորել սխալը
        if (error.message === 'Unauthorized') {
            return withCors(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
        }
        return withCors(NextResponse.json({ error: 'Could not add category', details: error.message }, { status: 500 }));
    }
}

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM categories');
        return withCors(NextResponse.json(result.rows));
    } catch (error) {
        console.error('Error in GET /api/categories:', error); // Լոգավորել սխալը
        return withCors(NextResponse.json({ error: 'Could not fetch categories' }, { status: 500 }));
    }
}

export async function OPTIONS() {
    return withCors(NextResponse.json({}, { status: 200 }));
}