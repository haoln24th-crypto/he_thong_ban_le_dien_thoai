/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 34990000,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop',
    description: 'Chip A17 Pro mạnh mẽ, camera 48MP, khung viền Titan siêu bền.',
    category: 'Apple',
    isNew: true
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 29990000,
    image: 'https://images.unsplash.com/photo-1707241285324-4054a1be42ce?q=80&w=800&auto=format&fit=crop',
    description: 'Bút S Pen huyền thoại, AI thông minh, camera zoom 100x.',
    category: 'Samsung',
    isNew: true
  },
  {
    id: '3',
    name: 'Xiaomi 14 Ultra',
    price: 32990000,
    image: 'https://images.unsplash.com/photo-1710531206122-ce5343516541?q=80&w=800&auto=format&fit=crop',
    description: 'Ống kính Leica chuyên nghiệp, hiệu năng đỉnh cao.',
    category: 'Xiaomi',
    isNew: true
  },
  {
    id: '4',
    name: 'Google Pixel 8 Pro',
    price: 24500000,
    image: 'https://images.unsplash.com/photo-1696614131580-0010839a8c17?q=80&w=800&auto=format&fit=crop',
    description: 'Trải nghiệm Android thuần khiết, camera AI xuất sắc.',
    category: 'Google'
  },
  {
    id: '5',
    name: 'iPad Pro M2 12.9 inch',
    price: 31990000,
    image: 'https://images.unsplash.com/photo-1544244015-0cd4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
    description: 'Màn hình Liquid Retina XDR, hiệu năng khủng khiếp từ chip M2.',
    category: 'Tablets'
  },
  {
    id: '6',
    name: 'AirPods Pro Gen 2',
    price: 5990000,
    image: 'https://images.unsplash.com/photo-1588423770574-d1993216ba27?q=80&w=800&auto=format&fit=crop',
    description: 'Khử ổn chủ động thông minh, âm thanh không gian sống động.',
    category: 'Accessories'
  },
  {
    id: '7',
    name: 'Sony WH-1000XM5',
    price: 8490000,
    image: 'https://images.unsplash.com/photo-1628202926206-c63a34b1618f?q=80&w=800&auto=format&fit=crop',
    description: 'Tai nghe chống ồn tốt nhất hiện nay, thiết kế sang trọng.',
    category: 'Accessories'
  },
  {
    id: '8',
    name: 'MacBook Air M3 2024',
    price: 27990000,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?q=80&w=800&auto=format&fit=crop',
    description: 'Chip M3 siêu nhanh, thiết kế mỏng nhẹ không tiếng ồn.',
    category: 'Laptop',
    isNew: true
  },
  {
    id: '9',
    name: 'Apple Watch Series 9',
    price: 10490000,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop',
    description: 'Theo dõi sức khỏe chuyên sâu, màn hình sáng gấp đôi.',
    category: 'Accessories'
  },
  {
    id: '10',
    name: 'Samsung Galaxy Tab S9 Ultra',
    price: 22990000,
    image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=800&auto=format&fit=crop',
    description: 'Màn hình Dynamic AMOLED 2X cực đại, chuẩn kháng nước IP68.',
    category: 'Tablets'
  },
  {
    id: '11',
    name: 'ASUS ROG Phone 8 Pro',
    price: 28990000,
    image: 'https://images.unsplash.com/photo-1610067304523-7a099b421049?q=80&w=800&auto=format&fit=crop',
    description: 'Gaming phone mạnh nhất thế giới với chip Snapdragon 8 Gen 3 và màn hình 165Hz.',
    category: 'Gaming',
    isNew: true
  },
  {
    id: '12',
    name: 'iPhone 14 Plus',
    price: 21490000,
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?q=80&w=800&auto=format&fit=crop',
    description: 'Màn hình lớn 6.7 inch, thời lượng pin cực dài và hệ thống camera kép tiên tiến.',
    category: 'Apple'
  },
  {
    id: '13',
    name: 'Sony Xperia 1 V',
    price: 25990000,
    image: 'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?q=80&w=800&auto=format&fit=crop',
    description: 'Cảm biến Exmor T cho di động, màn hình 4K HDR OLED tỷ lệ 21:9 chuẩn điện ảnh.',
    category: 'Sony',
    isNew: true
  },
  {
    id: '14',
    name: 'Huawei P60 Pro',
    price: 21990000,
    image: 'https://images.unsplash.com/photo-1595941069915-4ebc5197c14a?q=80&w=800&auto=format&fit=crop',
    description: 'Camera XMAGE với khả năng thay đổi khẩu độ vật lý, thiết kế ngọc trai Rococo độc bản.',
    category: 'Huawei'
  },
  {
    id: '15',
    name: 'Oppo Find X7 Ultra',
    price: 24990000,
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=800&auto=format&fit=crop',
    description: 'Hệ thống camera Hasselblad tiên tiến, màn hình 2K siêu nét.',
    category: 'Oppo',
    isNew: true
  },
  {
    id: '16',
    name: 'Google Pixel 8 Pro',
    price: 22500000,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop',
    description: 'Trải nghiệm Android thuần khiết nhất với camera AI thông minh.',
    category: 'Google',
    isNew: true
  },
  {
    id: '17',
    name: 'iPad Pro M4 2024',
    price: 28990000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
    description: 'Máy tính bảng mỏng nhất và mạnh nhất thế giới với màn hình OLED.',
    category: 'Tablets'
  },
  {
    id: '18',
    name: 'AirPods Pro Gen 2 (USB-C)',
    price: 5990000,
    image: 'https://images.unsplash.com/photo-1588423770519-715bd5c1be39?q=80&w=800&auto=format&fit=crop',
    description: 'Khử tiếng ồn chủ động gấp 2 lần, âm thanh thích ứng.',
    category: 'Accessories'
  }
];
