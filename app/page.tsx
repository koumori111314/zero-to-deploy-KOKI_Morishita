import { getMenuItems } from "@/lib/db";
import ClientPage from "@/components/ClientPage";

// Next.js の Server Component
export default async function Home() {
  // DBからメニューを取得
  const menuData = await getMenuItems();

  return <ClientPage initialMenu={menuData} />;
}
