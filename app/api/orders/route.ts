import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { cart } = await request.json();
    
    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'カートが空です' }, { status: 400 });
    }

    const order = await createOrder(cart);

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('注文処理エラー:', error);
    return NextResponse.json({ error: '注文の処理中にエラーが発生しました' }, { status: 500 });
  }
}
