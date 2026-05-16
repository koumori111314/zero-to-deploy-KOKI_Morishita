import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { items, totalPrice } = await request.json();

    // バリデーション
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'カートが空です' }, { status: 400 });
    }
    
    if (typeof totalPrice !== 'number' || totalPrice <= 0) {
      return NextResponse.json({ error: '合計金額が不正です' }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // トランザクションのように扱うために、まず orders テーブルにINSERTしてIDを取得
    const orderResult = await sql`
      INSERT INTO orders (total_price, status) 
      VALUES (${totalPrice}, 'pending') 
      RETURNING id;
    `;
    
    const orderId = orderResult[0].id;

    // order_items にデータを挿入
    for (const item of items) {
      if (!item.id || !item.quantity || !item.price) {
         continue; // 不正なアイテムデータはスキップ
      }
      
      await sql`
        INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_time)
        VALUES (${orderId}, ${Number(item.id)}, ${item.quantity}, ${item.price});
      `;
    }

    return NextResponse.json({ success: true, orderId, message: '注文が完了しました！' });

  } catch (error: any) {
    console.error('Order error:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
