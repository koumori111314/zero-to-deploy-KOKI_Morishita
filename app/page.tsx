import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Plus } from "lucide-react";

export default function Home() {
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
        
        <section>
          <h2 className="text-lg font-bold mb-4 border-l-4 border-red-900 pl-2 text-stone-800">おすすめ</h2>
          <div className="space-y-4">
            {/* Menu Item A */}
            <Card className="overflow-hidden border-stone-100 shadow-sm">
              <div className="flex gap-4 p-3 pr-4">
                <div className="w-24 h-24 bg-stone-200 rounded-xl overflow-hidden flex-shrink-0 animate-pulse">
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-base leading-tight">特製 すき焼き御膳</h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">厳選和牛を贅沢に使用した当店自慢の逸品。</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-red-900">¥1,800</span>
                    <Button size="icon" variant="outline" className="h-10 w-10 text-red-900 border-red-200 hover:bg-red-50 rounded-full">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Menu Item B */}
            <Card className="overflow-hidden border-stone-100 shadow-sm">
              <div className="flex gap-4 p-3 pr-4">
                <div className="w-24 h-24 bg-stone-200 rounded-xl overflow-hidden flex-shrink-0 animate-pulse">
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-base leading-tight">季節の刺身盛り合わせ</h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">旬の鮮魚を市場から直接仕入れた新鮮なお造り。</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-red-900">¥2,400</span>
                    <Button size="icon" variant="outline" className="h-10 w-10 text-red-900 border-red-200 hover:bg-red-50 rounded-full">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

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
