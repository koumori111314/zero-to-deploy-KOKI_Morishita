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

export async function createOrder(cart: any[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_price INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'pending'
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        menu_item_id INTEGER REFERENCES menu_items(id),
        menu_item_name VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL
      );
    `);
    
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const orderRes = await client.query(
      'INSERT INTO orders (total_price) VALUES ($1) RETURNING *',
      [totalPrice]
    );
    const orderId = orderRes.rows[0].id;
    
    for (const item of cart) {
      await client.query(
        'INSERT INTO order_items (order_id, menu_item_id, menu_item_name, price, quantity) VALUES ($1, $2, $3, $4, $5)',
        [orderId, parseInt(item.id), item.name, item.price, item.quantity]
      );
    }
    
    await client.query('COMMIT');
    
    return { ...orderRes.rows[0], items: cart };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
