import { NextResponse } from 'next/server';
import formidable, { Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/app/lib/prisma';
import { Readable } from 'stream';
import { IncomingMessage } from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function requestToIncomingMessage(req: Request): IncomingMessage {
  const reader = req.body?.getReader();
  const readable = new Readable({
    async read() {
      if (!reader) {
        this.push(null);
        return;
      }
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
          break;
        }
        if (value) this.push(value);
      }
    },
  });

  const headers = Object.fromEntries(req.headers.entries());

  return Object.assign(readable, {
    headers,
    method: req.method,
    url: req.url,
  }) as IncomingMessage;
}

function getFieldString(field: string | string[] | undefined): string {
  if (!field) return '';
  return Array.isArray(field) ? field[0] : field;
}

function parseForm(req: Request): Promise<{ fields: Fields; files: Files }> {
  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => `${Date.now()}_${part.originalFilename}`,
  });

  const incomingReq = requestToIncomingMessage(req);

  return new Promise((resolve, reject) => {
    form.parse(incomingReq, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: Request) {
  try {
    const { fields, files } = await parseForm(req);

    const name = getFieldString(fields.name);
    const address = getFieldString(fields.address);
    const city = getFieldString(fields.city);
    const state = getFieldString(fields.state);
    const contact = getFieldString(fields.contact);
    const email_id = getFieldString(fields.email_id);
    const fileField = files.file;

    if (!name || !address || !city || !state || !contact || !email_id || !fileField) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const imageFile = Array.isArray(fileField) ? fileField[0] : fileField;

    if (!imageFile.filepath) {
      return NextResponse.json({ error: 'File upload error' }, { status: 400 });
    }

    const relativeImagePath = path
      .relative(path.join(process.cwd(), 'public'), imageFile.filepath)
      .replace(/\\/g, '/');

    await prisma.school.create({
      data: {
        name,
        address,
        city,
        state,
        contact,
        image: relativeImagePath,
        email_id,
      },
    });

    return NextResponse.json({ message: 'School added successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
