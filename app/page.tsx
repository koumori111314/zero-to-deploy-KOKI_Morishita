"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Plus, X, Minus } from "lucide-react";
import { MENU_DATA, MenuItem } from "@/data/menu";

type CartItem = MenuItem & { quantity: number };

export default function Home() {
  // --- 状態管理 ---
  const categories = ["すべて", ...Array.from(new Set(MENU_DATA.map(item => item.category)))];
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  
  // 注文リスト（カート）の状態
  const [cart, setCart] = useState<CartItem[]>([]);
  // エラーメッセージの状態
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // カート（注文リスト）画面の開閉状態
  const [isCartOpen, setIsCartOpen] = useState(false);
  // 商品詳細ポップアップの状態
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [detailQuantity, setDetailQuantity] = useState<number>(1);

  // --- 計算ロジック ---
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // --- アクション ---
  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        // すでにある場合は数量を増やす
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + quantity } 
            : cartItem
        );
      }
      // 新規追加
      return [...prev, { ...item, quantity }];
    });
  };

  const handleOpenDetail = (item: MenuItem) => {
    if (item.isSoldOut) {
      setErrorMessage(`${item.name}は現在品切れです。`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    setSelectedMenuItem(item);
    setDetailQuantity(1);
  };

  const handleConfirmAddToCart = () => {
    if (selectedMenuItem) {
      handleAddToCart(selectedMenuItem, detailQuantity);
      setSelectedMenuItem(null);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(cartItem => {
        if (cartItem.id === id) {
          const newQuantity = cartItem.quantity + delta;
          return { ...cartItem, quantity: Math.max(0, newQuantity) };
        }
        return cartItem;
      }).filter(cartItem => cartItem.quantity > 0);
    });
  };

  const displayCategories = selectedCategory === "すべて" 
    ? categories.filter(c => c !== "すべて") 
    : [selectedCategory];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-stone-50 relative pb-24 shadow-xl">
      {/* エラーメッセージ（トースト表示） */}
      {errorMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-6 py-3 rounded-full shadow-lg z-50 transition-opacity font-bold whitespace-nowrap">
          {errorMessage}
        </div>
      )}

      {/* 1. Header (Sticky) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 flex flex-col">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-widest text-red-900 font-serif">OSAKI亭</h1>
          <Button variant="ghost" size="icon" aria-label="メニュー">
            <span className="sr-only">メニュー</span>
            <div className="space-y-1">
              <div className="w-5 h-0.5 bg-stone-600"></div>
              <div className="w-5 h-0.5 bg-stone-600"></div>
              <div className="w-5 h-0.5 bg-stone-600"></div>
            </div>
          </Button>
        </div>
        
        {/* カテゴリフィルター */}
        <div className="px-4 py-2 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-2 border-t border-stone-100 bg-stone-50/50">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors border ${
                selectedCategory === category
                  ? "bg-red-900 text-white border-red-900 shadow-sm"
                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* 2. Menu Area */}
      <main className="p-4 space-y-8">
        {displayCategories.map((category) => (
          <section key={category}>
            <h2 className="text-lg font-bold mb-4 border-l-4 border-red-900 pl-2 text-stone-800">
              {category}
            </h2>
            <div className="space-y-4">
              {MENU_DATA.filter(item => item.category === category).map((item) => (
                <Card 
                  key={item.id} 
                  className={`overflow-hidden border-stone-100 shadow-sm transition-all ${item.isSoldOut ? 'opacity-60 grayscale-[0.5]' : 'cursor-pointer hover:shadow-md hover:border-red-100'}`}
                  onClick={() => handleOpenDetail(item)}
                >
                  <div className="flex gap-4 p-3 pr-4 pointer-events-none">
                    <div className="w-24 h-24 bg-stone-200 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                       <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                       {item.isSoldOut && (
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                           <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">売切</span>
                         </div>
                       )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-base leading-tight">{item.name}</h3>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`font-bold ${item.isSoldOut ? 'text-stone-500 line-through' : 'text-red-900'}`}>
                          ¥{item.price.toLocaleString()}
                        </span>
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
      <div className="fixed bottom-0 left-0 w-full z-30 pointer-events-none">
        <div className="max-w-md mx-auto px-4 pb-6 pt-12 bg-gradient-to-t from-stone-50 via-stone-50/90 to-transparent pointer-events-auto">
          <Button 
            className="w-full h-14 bg-red-900 hover:bg-red-800 text-white rounded-full font-bold text-lg shadow-xl relative active:scale-[0.98] transition-all flex items-center justify-center"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="absolute left-6 h-6 w-6" />
            <span>注文リストを見る</span>
            {totalQuantity > 0 && (
              <div className="absolute right-2 top-2 bottom-2 aspect-square bg-white text-red-900 rounded-full flex items-center justify-center font-bold text-base shadow-sm">
                {totalQuantity}
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* 4. Cart Modal / Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end max-w-md mx-auto">
          {/* オーバーレイクリックで閉じる */}
          <div className="flex-1" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="bg-white rounded-t-3xl min-h-[50vh] max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-200">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                注文リスト
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="rounded-full bg-stone-100 hover:bg-stone-200">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* カートの中身リスト */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 py-12">
                  <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                  <p className="font-bold">リストには何もありません</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center gap-4 bg-stone-50 p-3 rounded-xl">
                    <div className="flex-1">
                      <p className="font-bold leading-tight">{item.name}</p>
                      <p className="text-sm text-red-900 font-medium">¥{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-full px-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleUpdateQuantity(item.id, -1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleUpdateQuantity(item.id, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 合計計算エリア */}
            <div className="p-6 border-t bg-white space-y-4 rounded-t-xl shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-end border-b border-stone-100 pb-4">
                <span className="font-bold text-stone-500">合計金額</span>
                <span className="font-bold text-3xl text-red-900 leading-none">¥{totalPrice.toLocaleString()}</span>
              </div>
              
              <Button 
                disabled={cart.length === 0}
                className="w-full bg-red-900 hover:bg-red-800 text-white rounded-full h-14 text-lg font-bold shadow-lg mt-2"
              >
                注文を確定する
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Product Detail Modal */}
      {selectedMenuItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end max-w-md mx-auto">
          {/* オーバーレイクリックで閉じる */}
          <div className="flex-1" onClick={() => setSelectedMenuItem(null)}></div>
          
          <div className="bg-white rounded-t-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-200 overflow-hidden">
            <div className="relative h-64 bg-stone-200">
              <img src={selectedMenuItem.imageUrl} alt={selectedMenuItem.name} className="w-full h-full object-cover" />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedMenuItem(null)} 
                className="absolute top-4 right-4 bg-black/40 text-white hover:bg-black/60 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h2 className="font-bold text-2xl leading-tight mb-2">{selectedMenuItem.name}</h2>
                <p className="text-stone-600 text-sm leading-relaxed">{selectedMenuItem.description}</p>
              </div>
              <p className="text-xl font-bold text-red-900">¥{selectedMenuItem.price.toLocaleString()}</p>
              
              <div className="flex items-center justify-center gap-6 py-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-full border-stone-300"
                  onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                  disabled={detailQuantity <= 1}
                >
                  <Minus className="h-6 w-6" />
                </Button>
                <span className="font-bold text-3xl w-12 text-center">{detailQuantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-full border-stone-300"
                  onClick={() => setDetailQuantity(detailQuantity + 1)}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>

              <Button 
                className="w-full bg-red-900 hover:bg-red-800 text-white rounded-full h-14 text-lg font-bold shadow-lg flex items-center justify-center gap-2"
                onClick={handleConfirmAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>カートに追加</span>
                <span className="ml-2 font-normal opacity-80">・ ¥{(selectedMenuItem.price * detailQuantity).toLocaleString()}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
