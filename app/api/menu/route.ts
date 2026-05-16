import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rawItems = await sql`SELECT * FROM menu_items ORDER BY id ASC`;
    
    // スネークケース（DB）をキャメルケース（フロントエンド）に変換する
    const menuItems = rawItems.map(item => ({
      id: String(item.id),
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.image_url,
      isSoldOut: item.is_sold_out
    }));

    return NextResponse.json(menuItems);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
