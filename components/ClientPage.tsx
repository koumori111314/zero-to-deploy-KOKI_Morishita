"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Plus, X, Minus, History } from "lucide-react";
import { MENU_DATA, MenuItem } from "@/data/menu";

type CartItem = MenuItem & { quantity: number };
type OrderHistoryItem = { id: number; created_at: string; total_price: number; items: CartItem[] };

export default function ClientPage({ initialMenu }: { initialMenu: MenuItem[] }) {
  // --- 状態管理 ---
  const categories = ["すべて", ...Array.from(new Set(initialMenu.map(item => item.category)))];
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  
  // 注文リスト（カート）の状態
  const [cart, setCart] = useState<CartItem[]>([]);
  // 注文履歴の状態
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  // UIの状態
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [detailQuantity, setDetailQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setOrderHistory(prev => [...prev, data.order]);
        setCart([]);
        setIsCartOpen(false);
        setSuccessMessage("注文が完了しました。");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(data.error || "注文に失敗しました。");
        setTimeout(() => setErrorMessage(null), 3000);
      }
    } catch (error) {
      setErrorMessage("通信エラーが発生しました。");
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayCategories = selectedCategory === "すべて" 
    ? categories.filter(c => c !== "すべて") 
    : [selectedCategory];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-stone-50 relative pb-24 shadow-xl">
      {/* メッセージ（トースト表示） */}
      {errorMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-6 py-3 rounded-full shadow-lg z-50 transition-opacity font-bold whitespace-nowrap">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600/90 text-white px-6 py-3 rounded-full shadow-lg z-50 transition-opacity font-bold whitespace-nowrap">
          {successMessage}
        </div>
      )}

      {/* 1. Header (Sticky) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 flex flex-col">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-widest text-red-900 font-serif">OSAKI亭</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold text-stone-600 border-stone-300 rounded-full bg-white shadow-sm hover:bg-stone-50">
              店員呼出
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold text-stone-600 border-stone-300 rounded-full bg-white shadow-sm hover:bg-stone-50">
              お会計
            </Button>
            <Button variant="ghost" size="icon" aria-label="メニュー" className="-mr-2">
              <span className="sr-only">メニュー</span>
              <div className="space-y-1">
                <div className="w-5 h-0.5 bg-stone-600"></div>
                <div className="w-5 h-0.5 bg-stone-600"></div>
                <div className="w-5 h-0.5 bg-stone-600"></div>
              </div>
            </Button>
          </div>
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
              {initialMenu.filter(item => item.category === category).map((item) => (
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
                        {!item.isSoldOut && (
                          <div className="h-8 px-4 text-white bg-red-900 rounded-full flex items-center justify-center shadow-sm text-xs font-bold">
                            注文する
                          </div>
                        )}
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
        <div className="max-w-md mx-auto px-4 pb-6 pt-12 bg-gradient-to-t from-stone-50 via-stone-50/90 to-transparent pointer-events-auto flex gap-2">
          {orderHistory.length > 0 && (
            <Button 
              variant="outline"
              className="h-14 bg-white hover:bg-stone-50 text-stone-700 rounded-full font-bold shadow-xl relative active:scale-[0.98] transition-all flex items-center justify-center border-stone-200"
              onClick={() => setIsHistoryOpen(true)}
            >
              <History className="h-6 w-6" />
            </Button>
          )}
          <Button 
            className="flex-1 h-14 bg-red-900 hover:bg-red-800 text-white rounded-full font-bold text-lg shadow-xl relative active:scale-[0.98] transition-all flex items-center justify-center"
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
                disabled={cart.length === 0 || isSubmitting}
                className="w-full bg-red-900 hover:bg-red-800 text-white rounded-full h-14 text-lg font-bold shadow-lg mt-2"
                onClick={handleConfirmOrder}
              >
                {isSubmitting ? "注文を送信中..." : "注文を確定する"}
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

      {/* 6. Order History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end max-w-md mx-auto">
          {/* オーバーレイクリックで閉じる */}
          <div className="flex-1" onClick={() => setIsHistoryOpen(false)}></div>
          
          <div className="bg-white rounded-t-3xl min-h-[50vh] max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-200">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <History className="h-5 w-5" />
                注文履歴
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)} className="rounded-full bg-stone-100 hover:bg-stone-200">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 space-y-6">
              {orderHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 py-12">
                  <History className="h-12 w-12 mb-4 opacity-20" />
                  <p className="font-bold">注文履歴はありません</p>
                </div>
              ) : (
                [...orderHistory].reverse().map((order, index) => (
                  <div key={order.id || index} className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-100">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                      <span className="text-sm font-bold text-stone-500">注文 #{order.id}</span>
                      <span className="text-sm text-stone-500">
                        {order.created_at ? new Date(order.created_at).toLocaleTimeString() : new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="font-medium text-stone-700">{item.name} <span className="text-stone-400">×{item.quantity}</span></span>
                          <span className="font-medium text-stone-700">¥{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                      <span className="font-bold text-stone-600">合計</span>
                      <span className="font-bold text-lg text-red-900">¥{order.total_price.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
