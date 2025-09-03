import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import pool from '@/app/lib/db';

// Disable Next.js default body parser so formidable can handle the stream
export const config = {
  api: {
    bodyParser: false,
  },
};

// Upload directory inside public for static serving
const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');

// Create upload dir if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper to parse form with formidable
function parseForm(req: Request): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => `${Date.now()}_${part.originalFilename}`,
  });

  // NodeJS.ReadableStream is needed here
  return new Promise((resolve, reject) => {
    // cast to any to satisfy formidable typings (Next.js Request is a Web Request)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: Request) {
  try {
    const { fields, files } = await parseForm(req);

    const { name, address, city, state, contact, email_id } = fields;
    const fileField = files.file;

    if (
      !name ||
      !address ||
      !city ||
      !state ||
      !contact ||
      !email_id ||
      !fileField
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle single or multiple file upload
    const imageFile = Array.isArray(fileField) ? fileField[0] : fileField;

    if (!imageFile.filepath) {
      return NextResponse.json({ error: 'File upload error' }, { status: 400 });
    }

    // Image path relative to /public to serve statically
    const relativeImagePath = path.relative(path.join(process.cwd(), 'public'), imageFile.filepath).replace(/\\/g, '/');

    // Insert into MySQL
    const conn = await pool.getConnection();
    try {
      const sql =
        'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
      await conn.query(sql, [
        name,
        address,
        city,
        state,
        contact,
        relativeImagePath,
        email_id,
      ]);
    } finally {
      conn.release();
    }

    return NextResponse.json({ message: 'School added successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
