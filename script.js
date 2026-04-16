/**
 * MobiShop - Main Script (script.js)
 * Chứa logic điều hướng, giỏ hàng và quản trị hệ thống
 */

// --- Dữ liệu mẫu ban đầu ---
const INITIAL_PRODUCTS = [
    {
        id: '1',
        name: 'iPhone 15 Pro Max',
        price: 34990000,
        image: 'https://picsum.photos/seed/iphone15/600/600',
        description: 'Chip A17 Pro mạnh mẽ, khung viền Titan siêu bền, camera 48MP đỉnh cao với khả năng zoom quang học 5x.',
    },
    {
        id: '2',
        name: 'Samsung Galaxy S24 Ultra',
        price: 29990000,
        image: 'https://picsum.photos/seed/s24ultra/600/600',
        description: 'Galaxy AI quyền năng, bút S Pen tích hợp, màn hình 120Hz siêu mượt và camera 200MP siêu sắc nét.',
    },
    {
        id: '3',
        name: 'Xiaomi 14 Ultra',
        price: 26990000,
        image: 'https://picsum.photos/seed/xiaomi14/600/600',
        description: 'Ống kính Leica Summilux thế hệ mới, cảm biến 1 inch, sạc nhanh 90W và thiết kế sang trọng.',
    },
    {
        id: '4',
        name: 'Oppo Find X7 Ultra',
        price: 22500000,
        image: 'https://picsum.photos/seed/oppofind/600/600',
        description: 'Hệ thống camera Hasselblad kép, màn hình LTPO 120Hz và hiệu năng Snapdragon 8 Gen 3 đỉnh cao.',
    },
    {
        id: '5',
        name: 'Google Pixel 8 Pro',
        price: 19990000,
        image: 'https://picsum.photos/seed/pixel8/600/600',
        description: 'Trải nghiệm Android thuần khiết, chip Tensor G3 thông minh và khả năng xử lý ảnh AI tuyệt vời.',
    },
    {
        id: '6',
        name: 'Sony Xperia 1 V',
        price: 28990000,
        image: 'https://picsum.photos/seed/sony1v/600/600',
        description: 'Màn hình 4K OLED 21:9, cảm biến Exmor T cho di động và trải nghiệm âm thanh Hi-Res chuyên nghiệp.',
    },
    {
        id: '7',
        name: 'Asus ROG Phone 8 Pro',
        price: 32990000,
        image: 'https://picsum.photos/seed/rog8/600/600',
        description: 'Quái vật hiệu năng với Snapdragon 8 Gen 3, màn hình 165Hz và hệ thống tản nhiệt tiên tiến nhất.',
    },
    {
        id: '8',
        name: 'Nothing Phone (2)',
        price: 15500000,
        image: 'https://picsum.photos/seed/nothing2/600/600',
        description: 'Thiết kế mặt lưng Glyph độc đáo, giao diện Nothing OS mượt mà và camera 50MP kép ấn tượng.',
    }
];

// --- Quản lý Trạng thái (State Management) ---
let state = {
    products: JSON.parse(localStorage.getItem('mobishop_products')) || INITIAL_PRODUCTS,
    cart: JSON.parse(localStorage.getItem('mobishop_cart')) || [],
    orders: JSON.parse(localStorage.getItem('mobishop_orders')) || [],
    admins: JSON.parse(localStorage.getItem('mobishop_admins')) || [{ username: 'admin', password: '123456' }],
    currentView: 'home',
    adminTab: 'overview',
    isAdmin: localStorage.getItem('mobishop_isAdmin') === 'true',
    selectedProduct: null,
    searchQuery: '',
    selectedCategory: 'Tất cả'
};

// --- Tiện ích (Utilities) ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const saveState = () => {
    localStorage.setItem('mobishop_products', JSON.stringify(state.products));
    localStorage.setItem('mobishop_cart', JSON.stringify(state.cart));
    localStorage.setItem('mobishop_orders', JSON.stringify(state.orders));
    localStorage.setItem('mobishop_admins', JSON.stringify(state.admins));
    localStorage.setItem('mobishop_isAdmin', state.isAdmin);
};

const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type} animate__animated animate__fadeInDown`;
    
    const icon = type === 'success' 
        ? '<i class="fas fa-check-circle text-success"></i>' 
        : '<i class="fas fa-exclamation-circle text-danger"></i>';
        
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.replace('animate__fadeInDown', 'animate__fadeOutUp');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
};

// --- Logic Điều hướng (Navigation) ---
const navigateTo = (view, productId = null) => {
    // Nếu đã đăng nhập admin mà vào trang login thì chuyển thẳng vào dashboard
    if (view === 'admin-login' && state.isAdmin) {
        view = 'admin-dashboard';
    }
    
    state.currentView = view;
    if (productId) {
        state.selectedProduct = state.products.find(p => p.id === productId);
    }
    render();
    window.scrollTo(0, 0);
};

// --- Logic Giỏ hàng (Cart) ---
const addToCart = (productId) => {
    const product = state.products.find(p => p.id === productId);
    const existing = state.cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }
    
    saveState();
    render();
    showToast(`Đã thêm ${product.name} vào giỏ hàng`);
};

const updateQuantity = (productId, delta) => {
    const item = state.cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        saveState();
        render();
    }
};

const removeFromCart = (productId) => {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveState();
    render();
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'error');
};

// --- Logic Admin ---
const handleAdminLogin = (e) => {
    e.preventDefault();
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    
    const admin = state.admins.find(a => a.username === user && a.password === pass);
    if (admin) {
        state.isAdmin = true;
        saveState();
        state.currentView = 'admin-dashboard';
        showToast('Đăng nhập Admin thành công!');
        render();
    } else {
        showToast('Sai tài khoản hoặc mật khẩu', 'error');
    }
};

const handleLogout = () => {
    state.isAdmin = false;
    saveState();
    state.currentView = 'home';
    showToast('Đã đăng xuất');
    render();
};

const deleteProduct = (id) => {
    state.products = state.products.filter(p => p.id !== id);
    saveState();
    render();
    showToast('Đã xóa sản phẩm', 'error');
};

// --- Render Functions ---
const render = () => {
    const app = document.getElementById('app');
    
    // Đảm bảo trạng thái Admin luôn đồng bộ
    state.isAdmin = localStorage.getItem('mobishop_isAdmin') === 'true';
    
    // Header (Always visible except in admin dashboard)
    const isDashboard = state.currentView === 'admin-dashboard';
    
    let html = '';
    
    if (!isDashboard) {
        html += renderHeader();
    }
    
    html += '<main class="min-h-screen">';
    
    switch (state.currentView) {
        case 'home':
            html += renderHome();
            break;
        case 'detail':
            html += renderDetail();
            break;
        case 'cart':
            html += renderCart();
            break;
        case 'checkout':
            html += renderCheckout();
            break;
        case 'order-success':
            html += renderOrderSuccess();
            break;
        case 'admin-login':
            html += renderAdminLogin();
            break;
        case 'admin-register':
            html += renderAdminRegister();
            break;
        case 'admin-dashboard':
            html += renderAdminDashboard();
            break;
    }
    
    html += '</main>';
    
    if (!isDashboard) {
        html += renderFooter();
    }
    
    app.innerHTML = html;
    
    // Re-attach event listeners after render
    attachEventListeners();
};

const renderHeader = () => `
    <header class="glass sticky top-0 z-50 border-b border-gray-100">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
            <div class="flex items-center gap-2 cursor-pointer" onclick="navigateTo('home')">
                <div class="bg-blue-600 p-1.5 rounded-lg">
                    <i class="fas fa-mobile-alt text-white"></i>
                </div>
                <span class="text-2xl font-black text-gray-900 tracking-tighter">MobiShop</span>
            </div>
            
            <div class="hidden md:flex items-center bg-gray-100 rounded-2xl px-4 py-2 w-1/3">
                <i class="fas fa-search text-gray-400 mr-2"></i>
                <input type="text" placeholder="Tìm kiếm điện thoại..." class="bg-transparent border-none outline-none w-full text-sm" oninput="state.searchQuery = this.value; render()">
            </div>
            
            <div class="flex items-center gap-4">
                ${state.isAdmin ? `
                    <button onclick="navigateTo('admin-dashboard')" class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                        <i class="fas fa-chart-pie"></i> Dashboard Admin
                    </button>
                ` : `
                    <button onclick="navigateTo('admin-login')" class="flex items-center gap-2 p-2 text-gray-600 hover:text-blue-600 transition-colors group">
                        <i class="fas fa-user-shield text-xl"></i>
                        <span class="text-xs font-bold hidden md:block">Admin</span>
                    </button>
                `}
                <button onclick="navigateTo('cart')" class="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <i class="fas fa-shopping-cart text-xl"></i>
                    ${state.cart.length > 0 ? `<span class="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">${state.cart.reduce((s, i) => s + i.quantity, 0)}</span>` : ''}
                </button>
            </div>
        </div>
    </header>
`;

const renderHome = () => {
    const filteredProducts = state.products.filter(p => 
        p.name.toLowerCase().includes(state.searchQuery.toLowerCase())
    );

    return `
        <section class="py-12 bg-white">
            <div class="container mx-auto px-4">
                <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-8 md:p-16 text-white mb-16 relative overflow-hidden">
                    <div class="relative z-10 max-w-2xl">
                        <span class="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-6 inline-block">Sản phẩm mới nhất</span>
                        <h1 class="text-4xl md:text-6xl font-black mb-6 leading-tight">iPhone 15 Pro Max <br> Titanium.</h1>
                        <p class="text-blue-100 text-lg mb-8">Trải nghiệm sức mạnh của chip A17 Pro và camera zoom 5x đỉnh cao.</p>
                        <div class="flex flex-wrap gap-4">
                            <button class="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg">Mua ngay</button>
                            <button class="bg-blue-500/30 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">Xem video</button>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-3xl font-black text-gray-900">Sản phẩm nổi bật</h2>
                    <div class="flex gap-2">
                        <button class="p-2 border border-gray-200 rounded-xl hover:bg-gray-50"><i class="fas fa-chevron-left"></i></button>
                        <button class="p-2 border border-gray-200 rounded-xl hover:bg-gray-50"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    ${filteredProducts.map(p => `
                        <div class="product-card bg-white rounded-3xl border border-gray-100 p-4 group">
                            <div class="relative mb-6 overflow-hidden rounded-2xl bg-gray-50 aspect-square flex items-center justify-center" onclick="navigateTo('detail', '${p.id}')">
                                <img src="${p.image}" alt="${p.name}" class="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-500">
                                <button class="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-xl text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                            <div class="px-2">
                                <div class="flex items-center gap-1 mb-2">
                                    <i class="fas fa-star text-yellow-400 text-xs"></i>
                                    <span class="text-xs font-bold text-gray-500">4.9 (120 đánh giá)</span>
                                </div>
                                <h3 class="font-bold text-gray-900 mb-1 truncate cursor-pointer" onclick="navigateTo('detail', '${p.id}')">${p.name}</h3>
                                <p class="text-blue-600 font-black text-lg mb-4">${formatCurrency(p.price)}</p>
                                <button onclick="addToCart('${p.id}')" class="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                                    <i class="fas fa-shopping-cart text-sm"></i> Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
};

const renderDetail = () => {
    const p = state.selectedProduct;
    if (!p) return navigateTo('home');

    return `
        <div class="container mx-auto px-4 py-12">
            <button onclick="navigateTo('home')" class="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 font-bold transition-colors">
                <i class="fas fa-arrow-left"></i> Quay lại
            </button>
            <div class="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div class="bg-gray-50 rounded-[2.5rem] p-8 flex items-center justify-center">
                        <img src="${p.image}" alt="${p.name}" class="max-w-full h-auto object-contain drop-shadow-2xl">
                    </div>
                    <div>
                        <div class="flex items-center gap-2 mb-4">
                            <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Mới về</span>
                            <div class="flex text-yellow-400 text-xs">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                        </div>
                        <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">${p.name}</h1>
                        <p class="text-3xl font-black text-blue-600 mb-8">${formatCurrency(p.price)}</p>
                        <div class="bg-gray-50 p-6 rounded-3xl mb-8">
                            <h3 class="font-bold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                            <p class="text-gray-500 leading-relaxed">${p.description}</p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-4">
                            <button onclick="addToCart('${p.id}')" class="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 text-lg">
                                <i class="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
                            </button>
                            <button class="p-5 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">
                                <i class="far fa-heart text-xl text-gray-400"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const renderCart = () => {
    if (state.cart.length === 0) {
        return `
            <div class="container mx-auto px-4 py-24 text-center">
                <div class="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                    <i class="fas fa-shopping-basket text-4xl text-blue-600"></i>
                </div>
                <h2 class="text-3xl font-black text-gray-900 mb-4">Giỏ hàng trống</h2>
                <p class="text-gray-500 mb-8">Có vẻ như bạn chưa chọn được chiếc điện thoại nào ưng ý.</p>
                <button onclick="navigateTo('home')" class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Tiếp tục mua sắm
                </button>
            </div>
        `;
    }

    const total = state.cart.reduce((s, i) => s + (i.price * i.quantity), 0);

    return `
        <div class="container mx-auto px-4 py-12">
            <h1 class="text-4xl font-black text-gray-900 mb-12">Giỏ hàng của bạn</h1>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div class="lg:col-span-2 space-y-6">
                    ${state.cart.map(item => `
                        <div class="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-6 shadow-sm">
                            <div class="w-24 h-24 bg-gray-50 rounded-2xl p-2 flex items-center justify-center">
                                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain">
                            </div>
                            <div class="flex-1">
                                <h3 class="font-bold text-gray-900 text-lg">${item.name}</h3>
                                <p class="text-blue-600 font-bold">${formatCurrency(item.price)}</p>
                            </div>
                            <div class="flex items-center bg-gray-100 rounded-xl p-1">
                                <button onclick="updateQuantity('${item.id}', -1)" class="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"><i class="fas fa-minus text-xs"></i></button>
                                <span class="w-10 text-center font-bold">${item.quantity}</span>
                                <button onclick="updateQuantity('${item.id}', 1)" class="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"><i class="fas fa-plus text-xs"></i></button>
                            </div>
                            <button onclick="removeFromCart('${item.id}')" class="text-gray-300 hover:text-red-500 transition-colors p-2">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div class="lg:col-span-1">
                    <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-24">
                        <h3 class="text-xl font-black text-gray-900 mb-6">Tổng cộng</h3>
                        <div class="space-y-4 mb-8">
                            <div class="flex justify-between text-gray-500">
                                <span>Tạm tính</span>
                                <span>${formatCurrency(total)}</span>
                            </div>
                            <div class="flex justify-between text-gray-500">
                                <span>Phí vận chuyển</span>
                                <span class="text-green-500 font-bold">Miễn phí</span>
                            </div>
                            <div class="h-px bg-gray-100 my-4"></div>
                            <div class="flex justify-between text-gray-900 text-xl font-black">
                                <span>Tổng tiền</span>
                                <span>${formatCurrency(total)}</span>
                            </div>
                        </div>
                        <button onclick="navigateTo('checkout')" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-lg">
                            Tiến hành thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const renderCheckout = () => {
    const total = state.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    return `
        <div class="container mx-auto px-4 py-12">
            <h1 class="text-4xl font-black text-gray-900 mb-12 text-center">Thanh toán</h1>
            <div class="max-w-4xl mx-auto">
                <form onsubmit="handleOrderSubmit(event)" class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div class="space-y-6">
                        <h3 class="text-xl font-bold text-gray-900">Thông tin giao hàng</h3>
                        <div>
                            <label class="block text-sm font-bold text-gray-500 mb-2">Họ và tên</label>
                            <input type="text" id="order-name" required class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-500 mb-2">Số điện thoại</label>
                            <input type="tel" id="order-phone" required class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-500 mb-2">Địa chỉ nhận hàng</label>
                            <textarea id="order-address" required rows="3" class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"></textarea>
                        </div>
                    </div>
                    <div class="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
                        <h3 class="text-xl font-bold mb-6">Tóm tắt đơn hàng</h3>
                        <div class="space-y-4 mb-8">
                            ${state.cart.map(item => `
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-400">${item.name} x ${item.quantity}</span>
                                    <span>${formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            `).join('')}
                            <div class="h-px bg-white/10 my-4"></div>
                            <div class="flex justify-between text-xl font-black">
                                <span>Tổng tiền</span>
                                <span class="text-blue-400">${formatCurrency(total)}</span>
                            </div>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-500 transition-all text-lg">
                            Xác nhận đặt hàng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
};

const handleOrderSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    const address = document.getElementById('order-address').value;
    
    const orderId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const total = state.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    
    const newOrder = {
        id: orderId,
        customerName: name,
        phone: phone,
        address: address,
        items: [...state.cart],
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    state.orders.unshift(newOrder);
    state.cart = [];
    saveState();
    navigateTo('order-success');
    showToast('Đặt hàng thành công!');
};

const renderOrderSuccess = () => `
    <div class="container mx-auto px-4 py-24 text-center">
        <div class="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate__animated animate__bounceIn">
            <i class="fas fa-check text-4xl text-green-600"></i>
        </div>
        <h2 class="text-4xl font-black text-gray-900 mb-4">Đặt hàng thành công!</h2>
        <p class="text-gray-500 mb-12 max-w-md mx-auto">Cảm ơn bạn đã tin tưởng MobiShop. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.</p>
        <button onclick="navigateTo('home')" class="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg">
            Quay lại trang chủ
        </button>
    </div>
`;

const renderAdminLogin = () => `
    <div class="container mx-auto px-4 py-24">
        <div class="max-w-md mx-auto bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div class="text-center mb-10">
                <div class="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                    <i class="fas fa-lock text-white text-2xl"></i>
                </div>
                <h2 class="text-3xl font-black text-gray-900">Admin Login</h2>
                <p class="text-gray-400">Dành cho quản trị viên hệ thống</p>
            </div>
            <form onsubmit="handleAdminLogin(event)" class="space-y-6">
                <div>
                    <label class="block text-sm font-bold text-gray-500 mb-2">Tài khoản</label>
                    <input type="text" id="admin-user" required class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-500 mb-2">Mật khẩu</label>
                    <input type="password" id="admin-pass" required class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Đăng nhập ngay
                </button>
                <div class="text-center">
                    <p class="text-sm text-gray-500">Chưa có tài khoản? <button onclick="navigateTo('admin-register')" class="text-blue-600 font-bold hover:underline">Đăng ký ngay</button></p>
                </div>
                <button type="button" onclick="navigateTo('home')" class="w-full text-gray-400 font-bold hover:text-gray-600 transition-colors">
                    Quay lại trang chủ
                </button>
            </form>
        </div>
    </div>
`;

const renderAdminRegister = () => `
    <div class="container mx-auto px-4 py-24">
        <div class="max-w-md mx-auto bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div class="text-center mb-10">
                <div class="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                    <i class="fas fa-user-plus text-white text-2xl"></i>
                </div>
                <h2 class="text-3xl font-black text-gray-900">Admin Register</h2>
                <p class="text-gray-400">Tạo tài khoản quản trị mới</p>
            </div>
            <form onsubmit="handleAdminRegister(event)" class="space-y-6">
                <div>
                    <label class="block text-sm font-bold text-gray-500 mb-2">Tài khoản</label>
                    <input type="text" id="reg-user" required class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-500 mb-2">Mật khẩu</label>
                    <input type="password" id="reg-pass" required class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-500 mb-2">Xác nhận mật khẩu</label>
                    <input type="password" id="reg-confirm" required class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                </div>
                <button type="submit" class="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                    Đăng ký tài khoản
                </button>
                <div class="text-center">
                    <p class="text-sm text-gray-500">Đã có tài khoản? <button onclick="navigateTo('admin-login')" class="text-indigo-600 font-bold hover:underline">Đăng nhập</button></p>
                </div>
            </form>
        </div>
    </div>
`;

const renderAdminDashboard = () => {
    const totalRevenue = state.orders.reduce((s, o) => o.status === 'completed' ? s + o.total : s, 0);
    const pendingCount = state.orders.filter(o => o.status === 'pending').length;

    return `
        <div class="flex min-h-screen bg-gray-50">
            <!-- Sidebar -->
            <aside class="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
                <div class="p-6 border-b border-gray-100 flex items-center gap-2">
                    <div class="bg-blue-600 p-1.5 rounded-lg">
                        <i class="fas fa-mobile-alt text-white"></i>
                    </div>
                    <span class="text-xl font-bold text-gray-900">MobiAdmin</span>
                </div>
                <nav class="flex-1 p-4 space-y-2">
                    <button onclick="state.adminTab = 'overview'; render()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.adminTab === 'overview' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}">
                        <i class="fas fa-chart-line"></i> Tổng quan
                    </button>
                    <button onclick="state.adminTab = 'products'; render()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.adminTab === 'products' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}">
                        <i class="fas fa-box"></i> Sản phẩm
                    </button>
                    <button onclick="state.adminTab = 'orders'; render()" class="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${state.adminTab === 'orders' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}">
                        <div class="flex items-center gap-3">
                            <i class="fas fa-clipboard-list"></i> Đơn hàng
                        </div>
                        ${pendingCount > 0 ? `<span class="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">${pendingCount}</span>` : ''}
                    </button>
                </nav>
                <div class="p-4 border-t border-gray-100 space-y-2">
                    <button onclick="navigateTo('home')" class="w-full flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-bold">
                        <i class="fas fa-home"></i> Quay lại trang chủ
                    </button>
                    <button onclick="handleLogout()" class="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold">
                        <i class="fas fa-sign-out-alt"></i> Đăng xuất
                    </button>
                </div>
            </aside>

            <!-- Main -->
            <main class="flex-1 p-8">
                <header class="flex justify-between items-center mb-8">
                    <h2 class="text-2xl font-black text-gray-900">
                        ${state.adminTab === 'overview' ? 'Bảng điều khiển' : ''}
                        ${state.adminTab === 'products' ? 'Quản lý sản phẩm' : ''}
                        ${state.adminTab === 'orders' ? 'Quản lý đơn hàng' : ''}
                    </h2>
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <p class="text-sm font-bold text-gray-900">Admin</p>
                            <p class="text-xs text-gray-400">Quản trị viên</p>
                        </div>
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">A</div>
                    </div>
                </header>

                ${state.adminTab === 'overview' ? renderAdminOverview(totalRevenue, pendingCount) : ''}
                ${state.adminTab === 'products' ? renderAdminProducts() : ''}
                ${state.adminTab === 'orders' ? renderAdminOrders() : ''}
            </main>
        </div>
    `;
};

const renderAdminOverview = (revenue, pending) => `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div class="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                <i class="fas fa-dollar-sign"></i>
            </div>
            <p class="text-gray-400 text-sm font-bold">Doanh thu (Hoàn tất)</p>
            <h3 class="text-2xl font-black text-gray-900">${formatCurrency(revenue)}</h3>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div class="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
                <i class="fas fa-clock"></i>
            </div>
            <p class="text-gray-400 text-sm font-bold">Đơn chờ xử lý</p>
            <h3 class="text-2xl font-black text-gray-900">${pending} đơn</h3>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div class="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                <i class="fas fa-box"></i>
            </div>
            <p class="text-gray-400 text-sm font-bold">Tổng sản phẩm</p>
            <h3 class="text-2xl font-black text-gray-900">${state.products.length}</h3>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div class="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                <i class="fas fa-users"></i>
            </div>
            <p class="text-gray-400 text-sm font-bold">Khách hàng</p>
            <h3 class="text-2xl font-black text-gray-900">1,240</h3>
        </div>
    </div>
    
    <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <h3 class="text-xl font-black text-gray-900 mb-6">Đơn hàng mới nhất</h3>
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Khách hàng</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tổng tiền</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${state.orders.slice(0, 5).map(o => `
                        <tr>
                            <td class="px-6 py-4 font-bold text-gray-900">${o.customerName}</td>
                            <td class="px-6 py-4 font-bold text-blue-600">${formatCurrency(o.total)}</td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase ${o.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}">
                                    ${o.status === 'pending' ? 'Chờ xử lý' : 'Hoàn tất'}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button onclick="deleteOrder('${o.id}')" class="text-gray-300 hover:text-red-500 transition-colors p-2">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
`;

const renderAdminProducts = () => `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
            <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-24">
                <h3 class="text-xl font-black text-gray-900 mb-6">Thêm sản phẩm mới</h3>
                <form onsubmit="handleProductSubmit(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-2">Tên sản phẩm</label>
                        <input type="text" id="p-name" required class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-2">Giá (VND)</label>
                        <input type="number" id="p-price" required class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-2">Hình ảnh sản phẩm</label>
                        <div class="flex flex-col gap-3">
                            <label class="w-full flex flex-col items-center px-4 py-6 bg-gray-50 text-blue-500 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                                <i class="fas fa-cloud-upload-alt text-2xl mb-2"></i>
                                <span class="text-xs font-bold">Chọn ảnh từ máy tính</span>
                                <input type='file' class="hidden" accept="image/*" onchange="handleImageUpload(event)" />
                            </label>
                            <div id="p-image-preview-container" class="hidden relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                <img id="p-image-preview" src="" class="w-full h-full object-contain">
                                <button type="button" onclick="state.tempImageUrl = null; document.getElementById('p-image-preview-container').classList.add('hidden')" class="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-2">Mô tả</label>
                        <textarea id="p-desc" required rows="3" class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"></textarea>
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">Lưu sản phẩm</button>
                </form>
            </div>
        </div>
        <div class="lg:col-span-2">
            <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Sản phẩm</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Giá</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${state.products.map(p => `
                            <tr>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover">
                                        <span class="font-bold text-gray-900">${p.name}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 font-bold text-blue-600">${formatCurrency(p.price)}</td>
                                <td class="px-6 py-4 text-right">
                                    <button onclick="deleteProduct('${p.id}')" class="text-gray-300 hover:text-red-500 transition-colors p-2">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`;

const handleAdminRegister = (e) => {
    e.preventDefault();
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;
    const confirm = document.getElementById('reg-confirm').value;
    
    if (pass !== confirm) {
        showToast('Mật khẩu xác nhận không khớp', 'error');
        return;
    }
    
    if (state.admins.find(a => a.username === user)) {
        showToast('Tài khoản đã tồn tại', 'error');
        return;
    }
    
    state.admins.push({ username: user, password: pass });
    saveState();
    showToast('Đăng ký tài khoản Admin thành công!');
    navigateTo('admin-login');
};

const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('p-image-preview').src = event.target.result;
            document.getElementById('p-image-preview-container').classList.remove('hidden');
            state.tempImageUrl = event.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const handleProductSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('p-name').value;
    const price = Number(document.getElementById('p-price').value);
    const description = document.getElementById('p-desc').value;
    const image = state.tempImageUrl || 'https://via.placeholder.com/600';
    
    const newProduct = {
        id: Date.now().toString(),
        name, price, image, description
    };
    
    state.products.unshift(newProduct);
    state.tempImageUrl = null;
    saveState();
    render();
    showToast('Đã thêm sản phẩm mới');
};

const renderAdminOrders = () => `
    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table class="w-full text-left">
            <thead class="bg-gray-50 border-b border-gray-100">
                <tr>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mã đơn</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Khách hàng</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tổng tiền</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Thao tác</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                ${state.orders.map(o => `
                    <tr>
                        <td class="px-6 py-4 font-bold text-blue-600">#${o.id}</td>
                        <td class="px-6 py-4">
                            <div class="font-bold text-gray-900">${o.customerName}</div>
                            <div class="text-xs text-gray-400">${o.phone}</div>
                        </td>
                        <td class="px-6 py-4 font-bold text-gray-900">${formatCurrency(o.total)}</td>
                        <td class="px-6 py-4">
                            <select onchange="updateOrderStatus('${o.id}', this.value)" class="bg-gray-50 border-none rounded-lg text-xs font-bold px-3 py-1.5 outline-none">
                                <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                                <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>Hoàn tất</option>
                                <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                            </select>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <button onclick="deleteOrder('${o.id}')" class="text-gray-300 hover:text-red-500 transition-colors p-2">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
`;

const updateOrderStatus = (id, status) => {
    const order = state.orders.find(o => o.id === id);
    if (order) {
        order.status = status;
        saveState();
        showToast('Đã cập nhật trạng thái đơn hàng');
        render();
    }
};

const deleteOrder = (id) => {
    state.orders = state.orders.filter(o => o.id !== id);
    saveState();
    render();
    showToast('Đã xóa đơn hàng', 'error');
};

const renderFooter = () => `
    <footer class="bg-white border-t border-gray-100 py-16">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div class="col-span-1 md:col-span-2">
                    <div class="flex items-center gap-2 mb-6">
                        <div class="bg-blue-600 p-1.5 rounded-lg">
                            <i class="fas fa-mobile-alt text-white"></i>
                        </div>
                        <span class="text-2xl font-black text-gray-900">MobiShop</span>
                    </div>
                    <p class="text-gray-400 max-w-sm leading-relaxed">Hệ thống bán lẻ điện thoại di động hàng đầu Việt Nam. Cam kết hàng chính hãng, bảo hành 12 tháng, lỗi 1 đổi 1.</p>
                </div>
                <div>
                    <h4 class="font-bold text-gray-900 mb-6">Khám phá</h4>
                    <ul class="space-y-4 text-gray-500 font-medium">
                        <li><a href="#" onclick="navigateTo('home')" class="hover:text-blue-600 transition-colors">Trang chủ</a></li>
                        <li><a href="#" onclick="navigateTo('home')" class="hover:text-blue-600 transition-colors">Sản phẩm</a></li>
                        <li><a href="#" onclick="navigateTo('cart')" class="hover:text-blue-600 transition-colors">Giỏ hàng</a></li>
                        <li><a href="#" onclick="navigateTo('admin-login')" class="hover:text-blue-600 transition-colors font-bold text-blue-500"><i class="fas fa-user-lock mr-1"></i> Quản trị viên</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold text-gray-900 mb-6">Liên hệ</h4>
                    <ul class="space-y-4 text-gray-500 font-medium">
                        <li><i class="fas fa-phone mr-2"></i> 1800 6601</li>
                        <li><i class="fas fa-envelope mr-2"></i> support@mobishop.vn</li>
                        <li><i class="fas fa-map-marker-alt mr-2"></i> 123 Đường ABC, Quận 1, TP.HCM</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-100 mt-16 pt-8 text-center text-sm text-gray-400 font-medium">
                © 2024 MobiShop. All rights reserved.
            </div>
        </div>
    </footer>
`;

// --- Event Listeners Placeholder ---
const attachEventListeners = () => {
    // Vanilla JS handles most via onclick in HTML strings for simplicity in this 3-file structure
};

// --- Khởi tạo ứng dụng ---
document.addEventListener('DOMContentLoaded', () => {
    render();
});
