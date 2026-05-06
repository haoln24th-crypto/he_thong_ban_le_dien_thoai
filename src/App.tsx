/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, User, Search, Store, ArrowLeft, Trash2, Plus, Minus, X, CheckCircle2, ChevronRight, LayoutDashboard, Package, Users, Mail, Phone, MapPin, Send, CreditCard, LogOut, ShieldCheck, Star, Smartphone } from 'lucide-react';
import { Product, CartItem, View, Order, User as UserType } from './types';
import { INITIAL_PRODUCTS } from './constants';

export default function App() {
  // --- State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{message: string, show: boolean}>({message: '', show: false});
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminTab, setAdminTab] = useState<'products' | 'orders' | 'users'>('products');
  
  // Forms
  const [checkoutData, setCheckoutData] = useState({ name: '', phone: '', address: '' });
  const [authData, setAuthData] = useState({ email: '', password: '', name: '' });
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });

  // --- Initial Data & Persistence ---
  useEffect(() => {
    const savedProducts = localStorage.getItem('phone_store_products');
    if (savedProducts && JSON.parse(savedProducts).length > 0) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('phone_store_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    const savedCart = localStorage.getItem('phone_store_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedOrders = localStorage.getItem('phone_store_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    const savedUsers = localStorage.getItem('phone_store_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    const savedCurrentUser = localStorage.getItem('phone_store_current_user');
    if (savedCurrentUser) {
      const user = JSON.parse(savedCurrentUser);
      setCurrentUser(user);
      if (user.role === 'admin') setAdminLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('phone_store_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('phone_store_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('phone_store_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('phone_store_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('phone_store_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('phone_store_current_user');
    }
  }, [currentUser]);

  // --- Actions ---
  const showToast = (message: string) => {
    setNotification({ message, show: true });
    setTimeout(() => setNotification({ message: '', show: false }), 3000);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...cats];
  }, [products]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  // --- View Rendering ---
  const renderHome = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-[2rem] overflow-hidden bg-slate-900 text-white flex items-center px-6 md:px-16">
        <div className="max-w-2xl space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md border border-blue-500/30"
          >
            <Star size={14} fill="currentColor" /> MỚI RA MẮT: IPHONE 15 SERIES
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight"
          >
            Nâng Tầm <br/> <span className="text-blue-500">Trải Nghiệm</span> Di Động
          </motion.h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-lg">Khám phá thế giới công nghệ đỉnh cao với những siêu phẩm mới nhất tại PhoneStore. Bảo hành 12 tháng, giao hàng miễn phí.</p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setCurrentView('products')}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-2xl shadow-blue-500/20 transition-all active:scale-95"
            >
              Mua Sắm Ngay
            </button>
            <button 
              onClick={() => setCurrentView('contact')}
              className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-700 border border-slate-700 transition-all active:scale-95"
            >
              Liên Hệ Tư Vấn
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-2/3 opacity-40 md:opacity-80 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1200&auto=format&fit=crop" alt="Hero" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
        </div>
      </section>

      {/* New Arrivals */}
      <section>
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">Siêu Phẩm Mới</h2>
            <p className="text-slate-500 text-lg">Cập nhật những công nghệ tiên phong nhất</p>
          </div>
          <button onClick={() => setCurrentView('products')} className="bg-slate-100 p-3 rounded-2xl text-slate-900 hover:bg-blue-600 hover:text-white transition-all">
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => p.isNew).slice(0, 4).map(product => renderProductCard(product))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-slate-50 -mx-6 px-6 py-20 rounded-[3rem]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Danh Mục Phổ Biến</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Chúng tôi cung cấp đầy đủ các thiết bị công nghệ từ điện thoại, máy tính bảng đến phụ kiện chính hãng.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Apple', 'Samsung', 'Tablets', 'Accessories'].map(cat => (
              <button 
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentView('products'); }}
                className="group p-8 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-center space-y-4"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  {cat === 'Apple' && <Store size={32} />}
                  {cat === 'Samsung' && <Smartphone size={32} />}
                  {cat === 'Tablets' && <LayoutDashboard size={32} />}
                  {cat === 'Accessories' && <ShieldCheck size={32} />}
                </div>
                <h3 className="font-bold text-lg text-slate-800">{cat}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pb-8 border-b border-slate-100">
        <div className="space-y-3 p-6">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={24} />
          </div>
          <h3 className="font-bold text-xl">Giao Hàng Miễn Phí</h3>
          <p className="text-slate-500">Miễn phí vận chuyển cho đơn hàng trên 10 triệu đồng toàn quốc.</p>
        </div>
        <div className="space-y-3 p-6">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-xl">Bảo Hành Chính Hãng</h3>
          <p className="text-slate-500">Cam kết bảo hành 12-24 tháng cho mọi thiết bị điện tử.</p>
        </div>
        <div className="space-y-3 p-6">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard size={24} />
          </div>
          <h3 className="font-bold text-xl">Trả Góp 0%</h3>
          <p className="text-slate-500">Hỗ trợ trả góp qua thẻ tín dụng hoặc công ty tài chính cực nhanh.</p>
        </div>
      </section>
    </div>
  );

  const renderProductCard = (product: Product) => (
    <motion.div 
      key={product.id}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-all"
    >
      <div 
        className="aspect-[4/5] overflow-hidden bg-slate-50 relative cursor-pointer"
        onClick={() => { setSelectedProduct(product); setCurrentView('detail'); }}
      >
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-600">
          {product.category}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-blue-700">{formatPrice(product.price)}</p>
        <div className="flex gap-2 pt-2">
          <button 
            onClick={() => { setSelectedProduct(product); setCurrentView('detail'); }}
            className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors"
          >
            Chi tiết
          </button>
          <button 
            onClick={() => addToCart(product)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderProductList = () => (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Cửa Hàng</h2>
          <p className="text-slate-500">Tìm thấy {filteredProducts.length} sản phẩm theo yêu cầu</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-sm ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => renderProductCard(product))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-6">
          <div className="inline-flex p-8 bg-slate-100 text-slate-400 rounded-full">
            <Search size={64} strokeWidth={1.5} />
          </div>
          <div className="max-w-xs mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-slate-800">Không tìm thấy sản phẩm</h3>
            <p className="text-slate-500">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ sản phẩm.</p>
          </div>
          <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="text-blue-600 font-bold hover:underline">
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );

  const renderProductDetail = () => {
    if (!selectedProduct) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="aspect-square bg-slate-50 flex items-center justify-center p-8">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="max-h-full object-contain drop-shadow-2xl" />
          </div>
          <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
            <button onClick={() => setCurrentView('products')} className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors">
              <ArrowLeft size={18} /> Quay lại danh sách
            </button>
            <div className="space-y-2">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">{selectedProduct.category}</span>
              <h1 className="text-4xl font-bold text-slate-900">{selectedProduct.name}</h1>
            </div>
            <div className="text-3xl font-bold text-blue-700">{formatPrice(selectedProduct.price)}</div>
            <div className="py-6 border-y border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-2">Mô tả sản phẩm</h3>
              <p className="text-slate-600 leading-relaxed">{selectedProduct.description}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => addToCart(selectedProduct)}
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} /> Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderCheckout = () => (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tight">Hoàn Tất Đặt Hàng</h2>
        <p className="text-slate-500">Vui lòng cung cấp thông tin giao hàng để chúng tôi phục vụ bạn tốt nhất.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <form onSubmit={handleCheckout} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-fit">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <User size={20} className="text-blue-600" /> Thông tin người nhận
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-400 uppercase ml-1">Họ và tên</label>
              <input 
                required
                value={checkoutData.name}
                onChange={e => setCheckoutData(prev => ({...prev, name: e.target.value}))}
                placeholder="Nguyễn Văn A" 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-400 uppercase ml-1">Số điện thoại</label>
              <input 
                required
                value={checkoutData.phone}
                onChange={e => setCheckoutData(prev => ({...prev, phone: e.target.value}))}
                placeholder="09xx xxx xxx" 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-400 uppercase ml-1">Địa chỉ nhận hàng</label>
              <textarea 
                required
                value={checkoutData.address}
                onChange={e => setCheckoutData(prev => ({...prev, address: e.target.value}))}
                placeholder="Số nhà, tên đường, phường/xã..." 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all h-32 resize-none" 
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-2xl shadow-blue-500/20 transition-all active:scale-95">
            Xác Nhận Đặt Hàng
          </button>
        </form>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold">Tóm tắt đơn hàng</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-sm truncate w-32">{item.name}</div>
                      <div className="text-xs text-slate-400">Số lượng: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-bold text-blue-600 text-sm">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="h-px bg-slate-100" />
            <div className="flex justify-between text-2xl font-black">
              <span>Tổng cộng</span>
              <span className="text-blue-700">{formatPrice(cartTotal)}</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4">
             <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0">
               <ShieldCheck size={24} />
             </div>
             <div className="space-y-1">
               <h4 className="font-bold text-blue-900">Thanh toán an toàn</h4>
               <p className="text-sm text-blue-700/70">Mọi thông tin của bạn được bảo mật tuyệt đối 100%.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrderSuccess = () => (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle2 size={48} strokeWidth={2.5} />
      </motion.div>
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-slate-900">Đặt hàng thành công!</h2>
        <p className="text-slate-500 text-lg max-w-sm mx-auto">Cảm ơn bạn đã tin tưởng PhoneStore. Nhân viên của chúng tôi sẽ liên hệ sớm để xác nhận đơn hàng.</p>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm max-w-sm mx-auto">
        <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
          <span>Mã đơn hàng</span>
          <span className="text-blue-600">#{orders[0]?.id || 'N/A'}</span>
        </div>
        <button 
          onClick={() => setCurrentView('home')}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          Trở về trang chủ
        </button>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="max-w-5xl mx-auto py-12 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black tracking-tight">Liên hệ với chúng tôi</h2>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">Bạn có câu hỏi? Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng 24/7 để giải đáp mọi thắc mắc của bạn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all space-y-6">
            <h3 className="text-xl font-bold">Thông tin liên hệ</h3>
            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Gọi cho chúng tôi</div>
                    <div className="font-bold text-slate-800">1900 123 456</div>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Email hỗ trợ</div>
                    <div className="font-bold text-slate-800">support@phonestore.vn</div>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Trụ sở văn phòng</div>
                    <div className="font-bold text-slate-800">Lầu 10, Tòa nhà Bitexco, Q.1, TP.HCM</div>
                  </div>
               </div>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="flex gap-4 justify-center">
               {/* Social Icons */}
            </div>
          </div>
        </div>

        <form onSubmit={handleContactSubmit} className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">Họ và tên</label>
                <input 
                  required
                  value={contactData.name}
                  onChange={e => setContactData(prev => ({...prev, name: e.target.value}))}
                  placeholder="Nhập tên của bạn" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">Địa chỉ Email</label>
                <input 
                  required
                  type="email"
                  value={contactData.email}
                  onChange={e => setContactData(prev => ({...prev, email: e.target.value}))}
                  placeholder="example@gmail.com" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
                />
             </div>
          </div>
          <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">Lời nhắn / Yêu cầu</label>
              <textarea 
                required
                value={contactData.message}
                onChange={e => setContactData(prev => ({...prev, message: e.target.value}))}
                placeholder="Bạn cần chúng tôi giúp gì?" 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all h-40 resize-none" 
              />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-2xl shadow-blue-500/20 transition-all flex items-center gap-3">
             Gửi yêu cầu <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="max-w-md mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-10"
      >
        <div className="text-center space-y-3">
           <h2 className="text-4xl font-black">Tạo Tài Khoản</h2>
           <p className="text-slate-500">Tham gia cộng đồng PhoneStore ngay hôm nay</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-5">
           <div className="space-y-1">
             <label className="text-xs font-bold text-slate-400 uppercase ml-2">Họ và tên</label>
             <input required value={authData.name} onChange={e => setAuthData(prev => ({...prev, name: e.target.value}))} placeholder="Nhập tên" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-slate-400 uppercase ml-2">Email</label>
             <input required type="email" value={authData.email} onChange={e => setAuthData(prev => ({...prev, email: e.target.value}))} placeholder="example@gmail.com" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-slate-400 uppercase ml-2">Mật khẩu</label>
             <input required type="password" value={authData.password} onChange={e => setAuthData(prev => ({...prev, password: e.target.value}))} placeholder="••••••••" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
           </div>
           <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-2xl shadow-blue-500/10">Đăng Ký Miễn Phí</button>
        </form>
        <div className="text-center pt-2">
           <button onClick={() => setCurrentView('admin-login')} className="text-slate-500 font-bold hover:text-blue-600 transition-colors">Đã có tài khoản? Đăng nhập</button>
        </div>
      </motion.div>
    </div>
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd check a database
    const user = users.find(u => u.email === authData.email);
    if (authData.email === 'admin@phonestore.com' && authData.password === 'admin') {
      const admin: UserType = { id: 'admin', email: 'admin@phonestore.com', name: 'Admin', role: 'admin' };
      setCurrentUser(admin);
      setAdminLoggedIn(true);
      setCurrentView('admin-panel');
      showToast('Đăng nhập Admin thành công!');
    } else if (user) {
      setCurrentUser(user);
      setCurrentView('home');
      showToast(`Chào mừng trở lại, ${user.name}!`);
    } else {
      showToast('Tài khoản không tồn tại hoặc sai thông tin.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.some(u => u.email === authData.email)) {
      showToast('Email đã được đăng ký.');
      return;
    }
    const newUser: UserType = {
      id: Date.now().toString(),
      email: authData.email,
      name: authData.name,
      role: 'customer'
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentView('home');
    showToast('Đăng ký tài khoản thành công!');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAdminLoggedIn(false);
    setCurrentView('home');
    showToast('Đã đăng xuất.');
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser?.id,
      customerName: checkoutData.name,
      customerPhone: checkoutData.phone,
      customerAddress: checkoutData.address,
      items: [...cart],
      total: cartTotal,
      status: 'pending',
      createdAt: Date.now()
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setCurrentView('order-success');
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast('Đã cập nhật trạng thái đơn hàng!');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
    setContactData({ name: '', email: '', message: '' });
  };

  const renderCart = () => (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <ShoppingCart strokeWidth={3} className="text-blue-600" /> GIỎ HÀNG
          </h2>
          <p className="text-slate-500 font-medium ml-1">Bạn đang có {cart.length} sản phẩm trong giỏ</p>
        </div>
        {cart.length > 0 && (
          <button onClick={() => setCart([])} className="text-red-500 font-bold hover:underline flex items-center gap-2">
            <Trash2 size={16} /> Xóa tất cả
          </button>
        )}
      </div>
      
      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={item.id}
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center group relative overflow-hidden"
                >
                  <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 group-hover:scale-105 transition-transform">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                    <h4 className="font-black text-lg text-slate-900 truncate">{item.name}</h4>
                    <p className="text-blue-600 font-black text-xl">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-blue-600 rounded-xl transition-all"><Minus size={18} /></button>
                    <span className="w-8 text-center font-black text-lg">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-blue-600 rounded-xl transition-all"><Plus size={18} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-4 text-slate-300 hover:text-red-500 transition-colors">
                    <X size={24} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 h-fit space-y-8 sticky top-28">
            <h3 className="font-black text-2xl pb-4 border-b border-slate-50 uppercase tracking-tight">Thanh toán</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Tạm tính</span>
                <span className="text-slate-900">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Vận chuyển</span>
                <span className="text-green-600 font-bold uppercase text-xs tracking-widest bg-green-50 px-2 py-1 rounded">Miễn phí</span>
              </div>
              <div className="h-px bg-slate-100 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Tổng tiền</span>
                <span className="text-4xl font-black text-blue-700">{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <button 
              onClick={() => setCurrentView('checkout')}
              className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-lg shadow-2xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Đặt Hàng Ngay <ChevronRight size={20} />
            </button>
            <p className="text-center text-xs text-slate-400 font-medium">Sản phẩm của bạn sẽ được bảo mật thông tin tuyệt đối.</p>
          </div>
        </div>
      ) : (
        <div className="py-24 text-center space-y-8 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <div className="inline-flex p-10 bg-slate-50 rounded-full text-slate-300 animate-pulse">
            <ShoppingCart size={80} strokeWidth={1} />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-800">Giỏ hàng đang trống</h3>
            <p className="text-slate-500 text-lg max-w-sm mx-auto">Bạn chưa chọn sản phẩm nào vào giỏ. Hãy quay lại cửa hàng để tìm siêu phẩm cho mình nhé!</p>
          </div>
          <button onClick={() => setCurrentView('products')} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 hover:shadow-2xl transition-all flex items-center gap-3 mx-auto">
            <ArrowLeft size={20} /> Khám phá sản phẩm
          </button>
        </div>
      )}
    </div>
  );

  const renderMyOrders = () => {
    const myOrders = orders.filter(o => o.userId === currentUser?.id);

    return (
      <div className="max-w-5xl mx-auto py-12 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black tracking-tight">Đơn hàng của tôi</h2>
          <p className="text-slate-500 text-lg">Theo dõi trạng thái và lịch sử mua hàng của bạn</p>
        </div>

        {myOrders.length > 0 ? (
          <div className="space-y-6">
            {myOrders.map(order => (
              <div key={order.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/50">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mã đơn hàng</div>
                    <div className="text-xl font-black text-slate-900">#{order.id}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ngày đặt</div>
                    <div className="font-bold text-slate-800">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trạng thái</div>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'processing' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status === 'pending' ? 'Chờ xác nhận' : 
                       order.status === 'confirmed' ? 'Đã xác nhận' :
                       order.status === 'processing' ? 'Đang xử lý' :
                       order.status === 'shipped' ? 'Đang giao' : 'Đã giao'}
                    </span>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng tiền</div>
                    <div className="text-2xl font-black text-blue-600">{formatPrice(order.total)}</div>
                  </div>
                </div>
                <div className="p-8 border-t border-slate-50">
                   <div className="space-y-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                           <img src={item.image} className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
                           <div className="flex-1">
                              <div className="font-bold text-slate-900">{item.name}</div>
                              <div className="text-sm text-slate-500">Số lượng: {item.quantity}</div>
                           </div>
                           <div className="font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-8 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="inline-flex p-10 bg-slate-50 rounded-full text-slate-300">
              <Package size={80} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-800">Chưa có đơn hàng nào</h3>
              <p className="text-slate-500 text-lg max-w-sm mx-auto">Bạn chưa thực hiện giao dịch nào. Hãy khám phá những sản phẩm tuyệt vời của chúng tôi nhé!</p>
            </div>
            <button onClick={() => setCurrentView('products')} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center gap-3 mx-auto">
              <Smartphone size={20} /> Mua sắm ngay
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderAdminLogin = () => (
    <div className="max-w-md mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-10"
      >
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Quản Trị Hệ Thống</h2>
          <p className="text-slate-500 font-medium">Đăng nhập để quản lý cửa hàng của bạn</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-2 tracking-widest">Tài khoản Email</label>
            <input 
              required
              value={authData.email}
              onChange={(e) => setAuthData(prev => ({...prev, email: e.target.value}))}
              placeholder="admin@phonestore.com" 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-2 tracking-widest">Mật khẩu</label>
            <input 
              required
              type="password"
              value={authData.password}
              onChange={(e) => setAuthData(prev => ({...prev, password: e.target.value}))}
              placeholder="••••••••" 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" 
            />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200">
            Đăng Nhập Ngay
          </button>
        </form>
        <div className="text-center">
           <button onClick={() => setCurrentView('register')} className="text-slate-400 font-bold hover:text-blue-600 text-sm">Chưa có tài khoản? Đăng ký ngay</button>
        </div>
      </motion.div>
    </div>
  );

  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.image) {
      showToast('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (editingProduct.id) {
       setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct as Product : p));
       showToast('Cập nhật sản phẩm thành công!');
    } else {
       const newProduct = { ...editingProduct, id: Date.now().toString() } as Product;
       setProducts(prev => [newProduct, ...prev]);
       showToast('Thêm sản phẩm mới thành công!');
    }
    setEditingProduct(null);
  };

  const handleDeleteConfirm = () => {
    if (showDeleteModal) {
      setProducts(prev => prev.filter(p => p.id !== showDeleteModal));
      showToast('Đã xóa sản phẩm.');
      setShowDeleteModal(null);
    }
  };

  const renderAdminPanel = () => {
    if (!adminLoggedIn) return renderAdminLogin();

    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={32} /> Hệ Thống Quản Trị
            </h2>
            <p className="text-slate-500 font-medium ml-1">Xin chào, Admin! Hôm nay bạn muốn quản lý gì?</p>
          </div>
          <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl">
            <button 
              onClick={() => setAdminTab('products')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${adminTab === 'products' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Package size={20} /> Sản phẩm
            </button>
            <button 
              onClick={() => setAdminTab('orders')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${adminTab === 'orders' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ShoppingCart size={20} /> Đơn hàng
            </button>
            <button 
              onClick={() => setAdminTab('users')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${adminTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Users size={20} /> Người dùng
            </button>
            <div className="w-px bg-slate-200 mx-2" />
            <button onClick={handleLogout} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {adminTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center px-4">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Danh sách kho hàng ({products.length})</h3>
              <button 
                onClick={() => {
                  setEditingProduct({});
                  setTimeout(() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }, 100);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                <Plus size={20} /> Thêm sản phẩm
              </button>
            </div>
            
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                           <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Sản phẩm</th>
                           <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Giá bán</th>
                           <th className="px-8 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Thao tác</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                   <img src={p.image} className="w-16 h-16 rounded-2xl object-cover border border-slate-100" />
                                   <div>
                                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</div>
                                      <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">{p.category}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <span className="font-bold text-slate-900">{formatPrice(p.price)}</span>
                             </td>
                             <td className="px-8 py-5 text-right">
                                <div className="flex justify-end gap-2">
                                   <button 
                                      onClick={() => {
                                        setEditingProduct(p);
                                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                      }} 
                                      className="p-3 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                                   >
                                      <Plus size={20} className="rotate-45" />
                                   </button>
                                   <button onClick={() => setShowDeleteModal(p.id)} className="p-3 text-slate-400 hover:bg-red-50 hover:text-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                                </div>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Inline Product Form */}
            <AnimatePresence>
              {editingProduct && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-[2.5rem] p-10 border-2 border-blue-500 shadow-2xl space-y-8 scroll-mt-32"
                  id="product-form"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        {editingProduct.id ? <CheckCircle2 size={24} /> : <Plus size={24} />}
                      </div>
                      <h3 className="font-black text-3xl text-slate-900">{editingProduct.id ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
                    </div>
                    <button onClick={() => setEditingProduct(null)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 flex items-center gap-2 font-bold transition-all">
                      Hủy bỏ <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleProductSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">Tên sản phẩm</label>
                          <input 
                            placeholder="VD: iPhone 15 Pro Max..." 
                            value={editingProduct?.name || ''}
                            onChange={e => setEditingProduct(prev => ({...prev, name: e.target.value}))}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-lg" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">Giá bán (VNĐ)</label>
                            <input 
                              type="number"
                              value={editingProduct?.price || ''}
                              onChange={e => setEditingProduct(prev => ({...prev, price: Number(e.target.value)}))}
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">Hãng / Danh mục</label>
                            <input 
                              placeholder="Apple, Samsung..."
                              value={editingProduct?.category || ''}
                              onChange={e => setEditingProduct(prev => ({...prev, category: e.target.value}))}
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" 
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <input 
                            type="checkbox"
                            id="isNew"
                            className="w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-500 border-slate-300"
                            checked={editingProduct?.isNew || false}
                            onChange={e => setEditingProduct(prev => ({...prev, isNew: e.target.checked}))}
                          />
                          <label htmlFor="isNew" className="font-bold text-slate-700 cursor-pointer select-none">Đánh dấu là "Sản phẩm mới"</label>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">Hình ảnh sản phẩm</label>
                          <div className="flex flex-col gap-4">
                            {editingProduct?.image && (
                              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-100 group">
                                <img src={editingProduct.image} className="w-full h-full object-cover" alt="Preview" />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button 
                                    type="button"
                                    onClick={() => setEditingProduct(prev => ({...prev, image: ''}))}
                                    className="bg-white text-red-500 p-2 rounded-xl font-bold text-sm flex items-center gap-2"
                                  >
                                    <X size={16} /> Xóa ảnh
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="relative">
                                <input 
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setEditingProduct(prev => ({...prev, image: reader.result as string}));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="hidden"
                                  id="file-upload"
                                />
                                <label 
                                  htmlFor="file-upload"
                                  className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-slate-600"
                                >
                                  <Smartphone size={20} className="text-blue-500" /> Tải ảnh từ máy
                                </label>
                              </div>
                              <input 
                                placeholder="Hoặc dán URL ảnh tại đây..."
                                value={editingProduct?.image || ''}
                                onChange={e => setEditingProduct(prev => ({...prev, image: e.target.value}))}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-sm" 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">Mô tả sản phẩm</label>
                          <textarea 
                            placeholder="Nhập mô tả chi tiết về sản phẩm..."
                            value={editingProduct?.description || ''}
                            onChange={e => setEditingProduct(prev => ({...prev, description: e.target.value}))}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all h-32 resize-none font-medium" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <button type="submit" className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 hover:shadow-2xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                         {editingProduct?.id ? <CheckCircle2 size={24} /> : <Plus size={24} />}
                         {editingProduct?.id ? 'Lưu Thông Tin Thay Đổi' : 'Xác Nhận Thêm Sản Phẩm'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

        {adminTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight px-4">Đơn hàng hiện có ({orders.length})</h3>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                           <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Khách hàng</th>
                           <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Tổng tiền</th>
                           <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Trạng thái</th>
                           <th className="px-8 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Ngày đặt</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-8 py-6">
                                <div>
                                   <div className="font-bold text-slate-900">{order.customerName}</div>
                                   <div className="text-sm text-slate-500">{order.customerPhone}</div>
                                </div>
                             </td>
                             <td className="px-8 py-6 font-bold text-blue-600">{formatPrice(order.total)}</td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                    order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                                    order.status === 'processing' ? 'bg-indigo-100 text-indigo-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {order.status === 'pending' ? 'Chờ xác nhận' : 
                                     order.status === 'confirmed' ? 'Đã xác nhận' :
                                     order.status === 'processing' ? 'Đang xử lý' :
                                     order.status === 'shipped' ? 'Đang giao' : 'Đã giao'}
                                  </span>
                                  
                                  {order.status === 'pending' && (
                                    <button 
                                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                      className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                      title="Xác nhận đơn hàng"
                                    >
                                      <CheckCircle2 size={16} />
                                    </button>
                                  )}
                                  
                                  {order.status === 'confirmed' && (
                                    <button 
                                      onClick={() => updateOrderStatus(order.id, 'processing')}
                                      className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all text-[10px] font-bold px-2"
                                    >
                                      XỬ LÝ
                                    </button>
                                  )}

                                  {order.status === 'processing' && (
                                    <button 
                                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                                      className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all text-[10px] font-bold px-2"
                                    >
                                      GIAO HÀNG
                                    </button>
                                  )}

                                  {order.status === 'shipped' && (
                                    <button 
                                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                                      className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all text-[10px] font-bold px-2"
                                    >
                                      HOÀN THÀNH
                                    </button>
                                  )}
                                </div>
                             </td>
                             <td className="px-8 py-6 text-right text-slate-400 text-sm">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}

        {adminTab === 'users' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight px-4">Quản lý người dùng ({users.length})</h3>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                           <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Người dùng</th>
                           <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Email</th>
                           <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Vai trò</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                          <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-8 py-6 font-bold text-slate-900">{user.name}</td>
                             <td className="px-8 py-6 text-slate-500">{user.email}</td>
                             <td className="px-8 py-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                   {user.role}
                                </span>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}

        {/* Delete Modal - keep as is or wrap in AnimatePresence elsewhere */}
        <AnimatePresence>
          {showDeleteModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative z-10 text-center space-y-8">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto rotate-12"><Trash2 size={40} /></div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900">Xóa vĩnh viễn?</h3>
                  <p className="text-slate-500 leading-relaxed">Bạn có chắc chắn muốn xóa sản phẩm này? Thao tác này sẽ xóa mọi dữ liệu liên quan và không thể khôi phục.</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowDeleteModal(null)} className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">Hủy bỏ</button>
                  <button onClick={handleDeleteConfirm} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 shadow-xl shadow-red-200 transition-all">Xác nhận xóa</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
              <Store size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">PhoneStore</span>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {[
              { id: 'home', label: 'Trang chủ' },
              { id: 'products', label: 'Sản phẩm' },
              ...(currentUser?.role === 'customer' ? [{ id: 'my-orders', label: 'Đơn hàng' }] : []),
              { id: 'contact', label: 'Liên hệ' },
            ].map(nav => (
              <button 
                key={nav.id}
                onClick={() => setCurrentView(nav.id as View)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${currentView === nav.id ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {nav.label}
              </button>
            ))}
          </div>

          <div className="flex-1 max-w-sm hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Tìm sản phẩm..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (currentView !== 'products') setCurrentView('products');
                }}
                className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('cart')}
              className="relative p-3 hover:bg-slate-50 rounded-2xl transition-all group active:scale-90"
            >
              <ShoppingCart size={24} className="text-slate-700 group-hover:text-blue-600 transition-colors" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
            <div className="w-px h-6 bg-slate-100" />
            {currentUser ? (
              <div className="flex items-center gap-3">
                 <div className="hidden sm:block text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      {currentUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </div>
                    <div className="text-sm font-black text-slate-800">{currentUser.name}</div>
                 </div>
                 <div className="flex gap-2">
                   <button 
                      onClick={() => currentUser.role === 'admin' ? setCurrentView('admin-panel') : setCurrentView('my-orders')}
                      className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 hover:scale-105 transition-all"
                      title={currentUser.role === 'admin' ? 'Bảng điều khiển' : 'Đơn hàng của tôi'}
                    >
                      {currentUser.role === 'admin' ? <ShieldCheck size={20} /> : <User size={20} />}
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-all active:scale-95"
                      title="Đăng xuất"
                    >
                      <LogOut size={20} />
                    </button>
                 </div>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentView('admin-login')}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95"
              >
                Đăng Nhập
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            {currentView === 'home' && renderHome()}
            {currentView === 'products' && renderProductList()}
            {currentView === 'detail' && renderProductDetail()}
            {currentView === 'cart' && renderCart()}
            {currentView === 'checkout' && renderCheckout()}
            {currentView === 'order-success' && renderOrderSuccess()}
            {currentView === 'contact' && renderContact()}
            {currentView === 'my-orders' && renderMyOrders()}
            {currentView === 'admin-login' && renderAdminLogin()}
            {currentView === 'admin-panel' && renderAdminPanel()}
            {currentView === 'register' && renderRegister()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 min-w-[300px]"
          >
            <CheckCircle2 className="text-green-400" size={20} />
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Store size={18} strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black tracking-tighter">PhoneStore</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              PhoneStore tự hào là đối tác liên kết của các thương hiệu smartphone hàng đầu thế giới. Cam kết chất lượng và dịch vụ tốt nhất.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Danh mục</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="hover:text-blue-600 cursor-pointer">iPhone</li>
              <li className="hover:text-blue-600 cursor-pointer">Samsung</li>
              <li className="hover:text-blue-600 cursor-pointer">Xiaomi</li>
              <li className="hover:text-blue-600 cursor-pointer">Phụ kiện</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="hover:text-blue-600 cursor-pointer">Chính sách bảo hành</li>
              <li className="hover:text-blue-600 cursor-pointer">Giao hàng & đổi trả</li>
              <li className="hover:text-blue-600 cursor-pointer">Hướng dẫn mua trả góp</li>
              <li className="hover:text-blue-600 cursor-pointer">Câu hỏi thường gặp</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Newsletter</h4>
            <div className="flex gap-2">
              <input placeholder="Email của bạn" className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-full" />
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Gửi</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-50 text-center text-slate-400 text-xs">
          © 2024 PhoneStore - Bản quyền thuộc về Team Dev. Trải nghiệm công nghệ đỉnh cao.
        </div>
      </footer>
    </div>
  );
}
