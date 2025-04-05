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

// CORS header-ներ ավելացնելու ֆունկցիա
const withCors = (response) => {
    response.headers.set('Access-Control-Allow-Origin', '*'); // Տեղական համար, production-ում նշեք Ձեր domain-ը
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
};

export async function POST(req) {
    try {
        authMiddleware(req);
        const { name, description, price, image_url, stock, category_id } = await req.json();

        if (!name || !price) {
            return withCors(NextResponse.json({ error: 'Name and price are required' }, { status: 400 }));
        }

        // Ստուգել, որ category_id-ն գոյություն ունի (ըստ ցանկության)
        if (category_id) {
            const categoryCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [category_id]);
            if (categoryCheck.rowCount === 0) {
                return withCors(NextResponse.json({ error: 'Invalid category ID' }, { status: 400 }));
            }
        }

        const result = await pool.query(
            'INSERT INTO products (name, description, price, image_url, stock, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, description || null, price, image_url || null, stock || 0, category_id || null]
        );

        const newProduct = result.rows[0];
        return withCors(NextResponse.json({ message: 'Product added successfully', product: newProduct }, { status: 201 }));
    } catch (error) {
        console.error('Error in POST /api/products:', error); // Լոգավորել սխալը
        if (error.message === 'Unauthorized') {
            return withCors(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
        }
        return withCors(NextResponse.json({ error: 'Could not add products', details: error.message }, { status: 500 }));
    }
}

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT p.*, c.name AS category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
        `);
        return withCors(NextResponse.json(result.rows));
    } catch (error) {
        console.error('Error in GET /api/products:', error); // Լոգավորել սխալը
        return withCors(NextResponse.json({ error: 'Could not fetch products' }, { status: 500 }));
    }
}

export async function OPTIONS() {
    return withCors(NextResponse.json({}, { status: 200 }));
}