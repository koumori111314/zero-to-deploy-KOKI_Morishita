import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Plus } from "lucide-react";

// --- メニューデータ ---
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

const MENU_DATA: MenuItem[] = [
  // 御膳・定食
  { id: "1", name: "特製 すき焼き御膳", description: "厳選和牛を贅沢に使用した当店自慢の逸品。", price: 1800, category: "御膳・定食" },
  { id: "2", name: "季節の刺身盛り合わせ", description: "旬の鮮魚を市場から直接仕入れた新鮮なお造り。", price: 2400, category: "御膳・定食" },
  { id: "3", name: "極上 海鮮丼", description: "新鮮な海の幸をふんだんに盛り込んだ贅沢な一杯。", price: 2100, category: "御膳・定食" },
  { id: "4", name: "天ぷら盛り合わせ御膳", description: "サクサクの衣で揚げた旬の野菜と海老の天ぷら。", price: 1600, category: "御膳・定食" },
  // 一品料理
  { id: "5", name: "銀だらの西京焼き", description: "特製味噌にじっくり漬け込んだ、香ばしく上品な味わい。", price: 1450, category: "一品料理" },
  { id: "6", name: "自家製 だし巻き卵", description: "こだわりの出汁をたっぷり含んだふんわり卵焼き。", price: 680, category: "一品料理" },
  { id: "7", name: "若鶏の唐揚げ", description: "外はカリッと、中はジューシーな定番メニュー。", price: 750, category: "一品料理" },
  // お飲み物
  { id: "8", name: "生ビール（プレミアムモルツ）", description: "キンキンに冷えた生ビールで乾杯。", price: 600, category: "お飲み物" },
  // デザート
  { id: "9", name: "自家製 抹茶アイス", description: "濃厚な宇治抹茶を使用したひんやりデザート。", price: 450, category: "デザート" },
];

export default function Home() {
  // カテゴリ一覧を抽出（重複排除）
  const categories = Array.from(new Set(MENU_DATA.map(item => item.category)));

  return (
    <div className="max-w-md mx-auto min-h-screen bg-stone-50 relative pb-24 shadow-xl">
      {/* 1. Header (Sticky) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-widest text-red-900 font-serif">OSAKI亭</h1>
        <Button variant="ghost" size="icon" aria-label="メニュー">
          <span className="sr-only">メニュー</span>
          <div className="space-y-1">
            <div className="w-5 h-0.5 bg-stone-600"></div>
            <div className="w-5 h-0.5 bg-stone-600"></div>
            <div className="w-5 h-0.5 bg-stone-600"></div>
          </div>
        </Button>
      </header>

      {/* 2. Menu Area */}
      <main className="p-4 space-y-8">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="text-lg font-bold mb-4 border-l-4 border-red-900 pl-2 text-stone-800">
              {category}
            </h2>
            <div className="space-y-4">
              {MENU_DATA.filter(item => item.category === category).map((item) => (
                <Card key={item.id} className="overflow-hidden border-stone-100 shadow-sm">
                  <div className="flex gap-4 p-3 pr-4">
                    <div className="w-24 h-24 bg-stone-200 rounded-xl overflow-hidden flex-shrink-0 animate-pulse flex items-center justify-center">
                       <span className="text-stone-400 text-xs text-center px-1 font-medium">No Image</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-base leading-tight">{item.name}</h3>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-red-900">¥{item.price.toLocaleString()}</span>
                        <Button size="icon" variant="outline" className="h-10 w-10 text-red-900 border-red-200 hover:bg-red-50 rounded-full">
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* 3. Footer (Fixed Cart Button) */}
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
        <div className="max-w-md mx-auto px-4 pb-6 pt-12 bg-gradient-to-t from-stone-50 via-stone-50/90 to-transparent pointer-events-auto">
          <Button className="w-full h-14 bg-red-900 hover:bg-red-800 text-white rounded-full font-bold text-lg shadow-xl relative active:scale-[0.98] transition-all">
            <ShoppingCart className="absolute left-6 h-6 w-6" />
            <span>注文リストを見る</span>
            <div className="absolute right-2 top-2 bottom-2 aspect-square bg-white text-red-900 rounded-full flex items-center justify-center font-bold text-base shadow-sm">
              0
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
