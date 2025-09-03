import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        'SELECT id, name, address, city, image FROM schools ORDER BY id DESC'
      );
      return NextResponse.json(rows);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('DB fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}
