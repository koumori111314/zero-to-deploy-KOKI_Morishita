import { Pool } from 'pg';
import { MenuItem } from '@/data/menu';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function getMenuItems(): Promise<MenuItem[]> {
  const client = await pool.connect();
  try {
    // 1. テーブルがなければ作成
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        category VARCHAR(255) NOT NULL,
        image_url TEXT,
        is_sold_out BOOLEAN DEFAULT FALSE
      );
    `);

    // 2. データが空なら data/menu.ts の初期データを投入
    const countRes = await client.query('SELECT COUNT(*) FROM menu_items');
    if (parseInt(countRes.rows[0].count) === 0) {
      const { MENU_DATA } = await import('@/data/menu');
      for (const item of MENU_DATA) {
        await client.query(
          'INSERT INTO menu_items (name, description, price, category, image_url, is_sold_out) VALUES ($1, $2, $3, $4, $5, $6)',
          [item.name, item.description, item.price, item.category, item.imageUrl, item.isSoldOut || false]
        );
      }
    }

    // 3. データを取得して返す
    const res = await client.query('SELECT * FROM menu_items ORDER BY id ASC');
    return res.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      imageUrl: row.image_url,
      isSoldOut: row.is_sold_out,
    }));
  } finally {
    client.release();
  }
}
