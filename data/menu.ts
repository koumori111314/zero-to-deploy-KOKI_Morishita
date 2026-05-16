export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isSoldOut?: boolean;
};

export const MENU_DATA: MenuItem[] = [
  // 御膳・定食
  { id: "1", name: "特製 すき焼き御膳", description: "厳選和牛を贅沢に使用した当店自慢の逸品。", price: 1800, category: "御膳・定食", imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80", isSoldOut: false },
  { id: "2", name: "季節の刺身盛り合わせ", description: "旬の鮮魚を市場から直接仕入れた新鮮なお造り。", price: 2400, category: "御膳・定食", imageUrl: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&q=80", isSoldOut: false },
  { id: "3", name: "極上 海鮮丼", description: "新鮮な海の幸をふんだんに盛り込んだ贅沢な一杯。", price: 2100, category: "御膳・定食", imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80", isSoldOut: true },
  { id: "4", name: "天ぷら盛り合わせ御膳", description: "サクサクの衣で揚げた旬の野菜と海老の天ぷら。", price: 1600, category: "御膳・定食", imageUrl: "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400&q=80", isSoldOut: false },
  // 一品料理
  { id: "5", name: "銀だらの西京焼き", description: "特製味噌にじっくり漬け込んだ、香ばしく上品な味わい。", price: 1450, category: "一品料理", imageUrl: "https://images.unsplash.com/photo-1598511726623-d09fff26be4c?w=400&q=80", isSoldOut: false },
  { id: "6", name: "自家製 だし巻き卵", description: "こだわりの出汁をたっぷり含んだふんわり卵焼き。", price: 680, category: "一品料理", imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80", isSoldOut: false },
  { id: "7", name: "若鶏の唐揚げ", description: "外はカリッと、中はジューシーな定番メニュー。", price: 750, category: "一品料理", imageUrl: "https://images.unsplash.com/photo-1569058242253-1df34b0e8f15?w=400&q=80", isSoldOut: false },
  // お飲み物
  { id: "8", name: "生ビール（プレミアムモルツ）", description: "キンキンに冷えた生ビールで乾杯。", price: 600, category: "お飲み物", imageUrl: "https://images.unsplash.com/photo-1518176258769-f227c798e50b?w=400&q=80", isSoldOut: false },
  // デザート
  { id: "9", name: "自家製 抹茶アイス", description: "濃厚な宇治抹茶を使用したひんやりデザート。", price: 450, category: "デザート", imageUrl: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80", isSoldOut: false },
  // 追加した1件
  { id: "10", name: "季節のフルーツ盛り合わせ", description: "旬のフルーツをたっぷり使った贅沢な盛り合わせ。", price: 800, category: "デザート", imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80", isSoldOut: false },
];