import { NextResponse } from 'next/server';
import { getMenuItems } from '@/lib/db';

export async function GET() {
  try {
    const menuItems = await getMenuItems();
    return NextResponse.json({ success: true, data: menuItems }, { status: 200 });
  } catch (error) {
    console.error('メニュー取得エラー:', error);
    return NextResponse.json({ error: 'メニューの取得に失敗しました' }, { status: 500 });
  }
}
