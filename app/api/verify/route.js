import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const withCors = (response) => {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS'); // GET-ի համար
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
};

export async function GET(req) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return withCors(NextResponse.json({ error: 'No token provided' }, { status: 401 }));
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.admin) {
            return withCors(NextResponse.json({ error: 'Սխալ։Օգտատերը Ադմին չի համարվում' }, { status: 403 }));
        }

        return withCors(NextResponse.json({ message: 'Token valid', user: decoded }));
    } catch (error) {
        console.error('Error verifying token:', error);
        return withCors(NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 }));
    }
}

export async function OPTIONS() {
    return withCors(NextResponse.json({}, { status: 200 }));
}