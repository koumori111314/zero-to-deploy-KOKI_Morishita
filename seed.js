const { neon } = require('@neondatabase/serverless');

async function seed() {
  require('dotenv').config();
  const sql = neon(process.env.DATABASE_URL);
  
  await sql`
    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      category VARCHAR(255) NOT NULL,
      image_url TEXT,
      is_sold_out BOOLEAN DEFAULT false
    );
  `;

  await sql`TRUNCATE TABLE menu_items RESTART IDENTITY CASCADE;`;

  await sql`
    INSERT INTO menu_items (name, description, price, category, image_url, is_sold_out) VALUES 
    ('特製 すき焼き御膳', '厳選和牛を贅沢に使用した当店自慢の逸品。', 1800, '御膳・定食', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80', false),
    ('季節の刺身盛り合わせ', '旬の鮮魚を市場から直接仕入れた新鮮なお造り。', 2400, '御膳・定食', 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&q=80', false),
    ('極上 海鮮丼', '新鮮な海の幸をふんだんに盛り込んだ贅沢な一杯。', 2100, '御膳・定食', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', true),
    ('天ぷら盛り合わせ御膳', 'サクサクの衣で揚げた旬の野菜と海老の天ぷら。', 1600, '御膳・定食', 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400&q=80', false),
    ('銀だらの西京焼き', '特製味噌にじっくり漬け込んだ、香ばしく上品な味わい。', 1450, '一品料理', 'https://images.unsplash.com/photo-1598511726623-d09fff26be4c?w=400&q=80', false),
    ('自家製 だし巻き卵', 'こだわりの出汁をたっぷり含んだふんわり卵焼き。', 680, '一品料理', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80', false),
    ('若鶏の唐揚げ', '外はカリッと、中はジューシーな定番メニュー。', 750, '一品料理', 'https://images.unsplash.com/photo-1569058242253-1df34b0e8f15?w=400&q=80', false),
    ('生ビール（プレミアムモルツ）', 'キンキンに冷えた生ビールで乾杯。', 600, 'お飲み物', 'https://images.unsplash.com/photo-1518176258769-f227c798e50b?w=400&q=80', false),
    ('自家製 抹茶アイス', '濃厚な宇治抹茶を使用したひんやりデザート。', 450, 'デザート', 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80', false),
    ('季節のフルーツ盛り合わせ', '旬のフルーツをたっぷり使った贅沢な盛り合わせ。', 800, 'デザート', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80', false);
  `;
  console.log("Seeding complete!");
}

seed().catch(console.error);