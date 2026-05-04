import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Check if user exists
        const checkUser = await sql`SELECT email FROM users WHERE email = ${email}`;
        
        if (checkUser.length > 0) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        const displayName = name || email.split('@')[0];

        // Save user
        await sql`
            INSERT INTO users (email, name, passwordHash)
            VALUES (${email}, ${displayName}, ${passwordHash})
        `;

        return NextResponse.json({ message: 'User created successfully' });
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
