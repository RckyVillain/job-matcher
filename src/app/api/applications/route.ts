import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { sql } from '@/lib/neon/db';
import { encryptData, decryptData } from '@/lib/encryption';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const items = await sql`
            SELECT * FROM applications 
            WHERE userEmail = ${session.user.email} 
            ORDER BY createdAt DESC
        `;

        const applications = items.map((data: any) => ({
            id: data.id,
            companyName: decryptData(data.companyname || ''),
            position: data.position,
            jobUrl: data.joburl,
            status: data.status,
            notes: decryptData(data.notes || ''),
            createdAt: data.createdat,
        }));

        return NextResponse.json({ applications });
    } catch (error: any) {
        console.error("GET Applications Error:", error);
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { companyName, position, jobUrl, status, notes } = body;

        if (!companyName || !position) {
            return NextResponse.json({ error: 'Company Name and Position are required' }, { status: 400 });
        }

        const encryptedCompany = encryptData(companyName);
        const encryptedNotes = encryptData(notes || '');
        const finalJobUrl = jobUrl || '';
        const finalStatus = status || 'Belum Apply';

        const result = await sql`
            INSERT INTO applications (userEmail, companyName, position, jobUrl, status, notes)
            VALUES (${session.user.email}, ${encryptedCompany}, ${position}, ${finalJobUrl}, ${finalStatus}, ${encryptedNotes})
            RETURNING id
        `;

        return NextResponse.json({ id: result[0].id, message: 'Application saved successfully' });
    } catch (error: any) {
        console.error("POST Application Error:", error);
        return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
    }
}
