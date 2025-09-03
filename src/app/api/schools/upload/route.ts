// /app/api/schools/upload/route.ts
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
  const form = await req.formData();
  const name = form.get('name')?.toString() || '';
  const address = form.get('address')?.toString() || '';
  const city = form.get('city')?.toString() || '';
  const state = form.get('state')?.toString() || '';
  const contact = form.get('contact')?.toString() || '';
  const email_id = form.get('email_id')?.toString() || '';
  const file = form.get('file') as File | null;

  if (!name || !address || !city || !state || !contact || !email_id || !file) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN, // ✅ Token usage here
    });

    await prisma.school.create({
      data: {
        name,
        address,
        city,
        state,
        contact,
        email_id,
        image: blob.url,
      },
    });

    return NextResponse.json({ message: 'School added successfully', url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
