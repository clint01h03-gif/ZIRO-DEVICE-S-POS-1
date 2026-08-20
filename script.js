        // ==================== DATA & STATE ====================
        const APP_VERSION = '1.3.0';

        const STORAGE_KEY = 'zero_device_pos_data';
        
        let state = {
            currentUser: null,
            products: [],
            customers: [],
            bills: [],
            users: [],
            settings: {
                businessName: 'Zero Device',
                businessAddress: '123 Tech Avenue, Colombo 03, Sri Lanka',
                businessPhone: '+94 11 234 5678',
                businessEmail: 'info@zerodevice.lk',
                businessWebsite: 'www.zerodevice.lk',
                businessDescription: 'Zero Device is a premium technology retail store dedicated to providing high-quality laptops, computers, accessories, and modern digital solutions. We offer carefully selected products from trusted brands with a strong focus on quality, reliability, performance, and customer satisfaction. Whether you are a student, professional, business owner, creator, or technology enthusiast, Zero Device helps you find the right technology for your needs.',
                currency: 'LKR',
                taxRate: 0,
                invoicePrefix: 'ZD',
                lowStockThreshold: 5,
                theme: 'light',
                qrCodeType: 'location',
                qrCodeLink: 'https://www.zerodevice.lk',
                thankYouMessage: 'Thank you for shopping with us! We truly appreciate your trust and support.',
                termsAndConditions: 'Goods once sold are not returnable or exchangeable, except under the applicable warranty terms above.\nWarranty does not cover physical damage, liquid damage, or unauthorized repairs/modifications.\nThis invoice must be presented for any warranty claim or after-sales service request.\nFor Advance / Loan payments, the outstanding balance must be settled as agreed with the store.'
            },

            nextProductId: 1001,
            nextBillId: 1,
            nextCustomerId: 1
        };

        // Sample product images (using placeholder service with laptop themes)
        const sampleImages = [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=200&fit=crop'
        ];

        // ==================== INITIALIZATION ====================
        function initApp() {
            loadData();
            
            // Ensure default admin exists
            if (state.users.length === 0) {
                state.users.push({
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    name: 'Administrator',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                });
                saveData();
            }
            
            // Seed sample data if empty
            if (state.products.length === 0) {
                seedSampleData();
            }
            
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('hidden');
                checkAuth();
            }, 1200);
            
            updateDateTime();
            setInterval(updateDateTime, 1000);
            
            // Event listeners
            document.getElementById('login-form').addEventListener('submit', handleLogin);
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
            document.getElementById('quick-bill-btn').addEventListener('click', () => navigateTo('billing'));
            
            document.querySelectorAll('.sidebar-item').forEach(btn => {
                btn.addEventListener('click', () => navigateTo(btn.dataset.page));
            });
        }

        function seedSampleData() {
            const samples = [
                { name: 'MacBook Pro 14" M3 Pro', category: 'Laptop', buy: 485000, sell: 575000, stock: 8, brand: 'Apple', ram: '18GB', storage: '512GB SSD', size: '14"', chip: 'Apple M3 Pro', specs: 'Liquid Retina XDR Display' },
                { name: 'MacBook Air 13" M2', category: 'Laptop', buy: 285000, sell: 349000, stock: 12, brand: 'Apple', ram: '8GB', storage: '256GB SSD', size: '13"', chip: 'Apple M2', specs: 'Midnight Colour' },
                { name: 'Dell XPS 15 9530', category: 'Laptop', buy: 420000, sell: 499000, stock: 6, brand: 'Dell', ram: '32GB', storage: '1TB SSD', size: '15.6"', chip: 'Intel Core i9', specs: 'OLED Touch Display' },
                { name: 'ASUS ROG Zephyrus G14', category: 'Gaming Laptop', buy: 380000, sell: 449000, stock: 5, brand: 'ASUS', ram: '16GB', storage: '1TB SSD', size: '14"', chip: 'AMD Ryzen 9', specs: 'RTX 4060 GPU' },
                { name: 'HP Spectre x360 14', category: 'Laptop', buy: 310000, sell: 379000, stock: 7, brand: 'HP', ram: '16GB', storage: '1TB SSD', size: '14"', chip: 'Intel Ultra 7', specs: 'OLED Touch, 2-in-1' },
                { name: 'Lenovo ThinkPad X1 Carbon', category: 'Business Laptop', buy: 350000, sell: 425000, stock: 9, brand: 'Lenovo', ram: '32GB', storage: '1TB SSD', size: '14"', chip: 'Intel Ultra 7', specs: 'Carbon Fiber Chassis' },
                { name: 'Microsoft Surface Laptop 5', category: 'Laptop', buy: 290000, sell: 349000, stock: 4, brand: 'Microsoft', ram: '16GB', storage: '512GB SSD', size: '13.5"', chip: 'Intel Core i7', specs: 'Platinum Finish' },
                { name: 'Acer Swift Go 14', category: 'Laptop', buy: 165000, sell: 199000, stock: 15, brand: 'Acer', ram: '16GB', storage: '512GB SSD', size: '14"', chip: 'Intel Ultra 5', specs: 'OLED Display' },
                { name: 'USB-C Docking Station', category: 'Accessory', buy: 18500, sell: 24900, stock: 25, brand: 'Anker', ram: '', storage: '', size: '', chip: '', specs: '12-in-1, Dual 4K, 100W PD' },
                { name: 'Logitech MX Master 3S', category: 'Accessory', buy: 22000, sell: 28900, stock: 30, brand: 'Logitech', ram: '', storage: '', size: '', chip: '', specs: 'Wireless, Quiet Clicks, MagSpeed' },
                { name: 'Apple Magic Keyboard', category: 'Accessory', buy: 28000, sell: 34900, stock: 18, brand: 'Apple', ram: '', storage: '', size: '', chip: '', specs: 'Wireless, Touch ID, White' },
                { name: 'Samsung T7 Shield 1TB', category: 'Storage', buy: 28000, sell: 35900, stock: 22, brand: 'Samsung', ram: '', storage: '1TB', size: '', chip: '', specs: 'USB 3.2, IP65, Rugged' }
            ];
            
            samples.forEach((s, i) => {
                state.products.push({
                    id: state.nextProductId++,
                    name: s.name,
                    category: s.category,
                    brand: s.brand,
                    buyingCost: s.buy,
                    sellingPrice: s.sell,
                    stock: s.stock,
                    image: sampleImages[i % sampleImages.length],
                    ram: s.ram || '',
                    storage: s.storage || '',
                    size: s.size || '',
                    chip: s.chip || '',
                    specs: s.specs,
                    description: `${s.brand} ${s.name} - ${s.specs}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            });
            
            // Sample customers
            state.customers.push(
                { id: state.nextCustomerId++, name: 'Kasun Perera', nic: '199512345678', mobile: '0771234567', email: 'kasun@email.com', createdAt: new Date().toISOString() },
                { id: state.nextCustomerId++, name: 'Nimali Fernando', nic: '198823456789', mobile: '0719876543', email: 'nimali@email.com', createdAt: new Date().toISOString() },
                { id: state.nextCustomerId++, name: 'Ruwan Silva', nic: '199034567890', mobile: '0765432109', email: '', createdAt: new Date().toISOString() }
            );
            
            saveData();
        }

        // ==================== DATA PERSISTENCE ====================
        function loadData() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const data = JSON.parse(raw);
                    state = { ...state, ...data };
                    // Ensure newer settings fields exist for older saves
                    if (!state.settings.businessDescription) {
                        state.settings.businessDescription = 'Zero Device is a premium technology retail store dedicated to providing high-quality laptops, computers, accessories, and modern digital solutions. We offer carefully selected products from trusted brands with a strong focus on quality, reliability, performance, and customer satisfaction. Whether you are a student, professional, business owner, creator, or technology enthusiast, Zero Device helps you find the right technology for your needs.';
                    }
                    if (!state.settings.businessWebsite) {
                        state.settings.businessWebsite = 'www.zerodevice.lk';
                    }
                    if (!state.settings.qrCodeType) {
                        state.settings.qrCodeType = 'location';
                    }
                    if (!state.settings.qrCodeLink) {
                        state.settings.qrCodeLink = 'https://www.zerodevice.lk';
                    }
                    if (!state.settings.thankYouMessage) {
                        state.settings.thankYouMessage = 'Thank you for shopping with us! We truly appreciate your trust and support.';
                    }
                    if (!state.settings.termsAndConditions) {
                        state.settings.termsAndConditions = 'Goods once sold are not returnable or exchangeable, except under the applicable warranty terms above.\nWarranty does not cover physical damage, liquid damage, or unauthorized repairs/modifications.\nThis invoice must be presented for any warranty claim or after-sales service request.\nFor Advance / Loan payments, the outstanding balance must be settled as agreed with the store.';
                    }
                    // Migrate older bills without paymentStatus / advance / warranty
                    if (state.bills && state.bills.length) {
                        state.bills.forEach(b => {
                            if (!b.paymentStatus) b.paymentStatus = 'Paid';
                            if (typeof b.advance !== 'number') b.advance = 0;
                            if (!b.warranty) b.warranty = 'No Warranty';
                        });
                    }
                }
            } catch (e) {
                console.error('Failed to load data:', e);
                showToast('Failed to load saved data', 'error');
            }
        }


        function saveData() {
            try {
                const toSave = {
                    products: state.products,
                    customers: state.customers,
                    bills: state.bills,
                    users: state.users,
                    settings: state.settings,
                    nextProductId: state.nextProductId,
                    nextBillId: state.nextBillId,
                    nextCustomerId: state.nextCustomerId
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
            } catch (e) {
                console.error('Failed to save data:', e);
                showToast('Failed to save data', 'error');
            }
        }

        function exportData() {
            const data = {
                version: APP_VERSION,
                exportedAt: new Date().toISOString(),
                products: state.products,
                customers: state.customers,
                bills: state.bills,
                users: state.users.map(u => ({ ...u, password: '***' })), // mask passwords
                settings: state.settings,
                nextProductId: state.nextProductId,
                nextBillId: state.nextBillId,
                nextCustomerId: state.nextCustomerId
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `zero_device_backup_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Data exported successfully', 'success');
        }

        function importData(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.products) state.products = data.products;
                    if (data.customers) state.customers = data.customers;
                    if (data.bills) state.bills = data.bills;
                    if (data.settings) state.settings = { ...state.settings, ...data.settings };
                    if (data.nextProductId) state.nextProductId = data.nextProductId;
                    if (data.nextBillId) state.nextBillId = data.nextBillId;
                    if (data.nextCustomerId) state.nextCustomerId = data.nextCustomerId;
                    // Note: users not imported for security, or handle carefully
                    saveData();
                    showToast('Data imported successfully. Refreshing...', 'success');
                    setTimeout(() => location.reload(), 1000);
                } catch (err) {
                    showToast('Invalid backup file', 'error');
                }
            };
            reader.readAsText(file);
        }

        // ==================== AUTH ====================
        function checkAuth() {
            const session = sessionStorage.getItem('zd_session');
            if (session) {
                try {
                    const user = JSON.parse(session);
                    state.currentUser = user;
                    document.getElementById('current-user-name').textContent = user.name || user.username;
                    document.getElementById('login-screen').classList.add('hidden');
                    document.getElementById('main-app').classList.remove('hidden');
                    navigateTo('dashboard');
                } catch {
                    showLogin();
                }
            } else {
                showLogin();
            }
        }

        function showLogin() {
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('main-app').classList.add('hidden');
        }

        function handleLogin(e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;
            
            const user = state.users.find(u => u.username === username && u.password === password);
            if (user) {
                state.currentUser = { id: user.id, username: user.username, name: user.name, role: user.role };
                sessionStorage.setItem('zd_session', JSON.stringify(state.currentUser));
                document.getElementById('current-user-name').textContent = user.name || user.username;
                document.getElementById('login-screen').classList.add('hidden');
                document.getElementById('main-app').classList.remove('hidden');
                showToast(`Welcome back, ${user.name || user.username}!`, 'success');
                navigateTo('dashboard');
            } else {
                showToast('Invalid username or password', 'error');
            }
        }

        function handleLogout() {
            sessionStorage.removeItem('zd_session');
            state.currentUser = null;
            showLogin();
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';
            showToast('Logged out successfully', 'info');
        }

        // ==================== NAVIGATION ====================
        function navigateTo(page) {
            document.querySelectorAll('.sidebar-item').forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('text-slate-600');
                if (btn.dataset.page === page) {
                    btn.classList.add('active');
                    btn.classList.remove('text-slate-600');
                }
            });
            
            const titles = {
                dashboard: ['Dashboard', 'Overview of your business'],
                billing: ['Billing', 'Create new invoices & process sales'],
                inventory: ['Inventory', 'Manage products and stock'],
                customers: ['Customers', 'View and manage customer records'],
                sales: ['Sales History', 'View all past transactions'],
                settings: ['Settings', 'Configure your POS system']
            };
            
            document.getElementById('page-title').textContent = titles[page][0];
            document.getElementById('page-subtitle').textContent = titles[page][1];
            
            const content = document.getElementById('page-content');
            content.innerHTML = '';
            content.className = 'p-6 animate-fade-in';
            
            switch(page) {
                case 'dashboard': renderDashboard(); break;
                case 'billing': renderBilling(); break;
                case 'inventory': renderInventory(); break;
                case 'customers': renderCustomers(); break;
                case 'sales': renderSalesHistory(); break;
                case 'settings': renderSettings(); break;
            }
        }

        // ==================== UTILITIES ====================
        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-LK', {
                style: 'currency',
                currency: state.settings.currency || 'LKR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        }

        function formatDate(iso) {
            return new Date(iso).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        }

        function formatDateTime(iso) {
            return new Date(iso).toLocaleString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        }

        function updateDateTime() {
            const now = new Date();
            document.getElementById('current-date').textContent = now.toLocaleDateString('en-GB', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            });
            document.getElementById('current-time').textContent = now.toLocaleTimeString('en-GB', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }

        function showToast(message, type = 'info') {
            const container = document.getElementById('toast-container');
            const colors = {
                success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
                error: 'bg-red-50 border-red-200 text-red-800',
                info: 'bg-blue-50 border-blue-200 text-blue-800',
                warning: 'bg-amber-50 border-amber-200 text-amber-800'
            };
            const icons = {
                success: 'fa-check-circle text-emerald-500',
                error: 'fa-exclamation-circle text-red-500',
                info: 'fa-info-circle text-blue-500',
                warning: 'fa-exclamation-triangle text-amber-500'
            };
            
            const toast = document.createElement('div');
            toast.className = `toast flex items-center gap-3 px-4 py-3 rounded-lg border shadow-soft ${colors[type]} min-w-[280px]`;
            toast.innerHTML = `
                <i class="fas ${icons[type]}"></i>
                <span class="text-sm font-medium flex-1">${message}</span>
                <button class="text-slate-400 hover:text-slate-600" onclick="this.parentElement.remove()">
                    <i class="fas fa-times text-xs"></i>
                </button>
            `;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(20px)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }

        function openModal(content, size = 'md') {
            const sizes = {
                sm: 'max-w-md',
                md: 'max-w-lg',
                lg: 'max-w-2xl',
                xl: 'max-w-4xl',
                full: 'max-w-6xl'
            };
            const container = document.getElementById('modal-container');
            container.innerHTML = `
                <div class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onclick="if(event.target===this) closeModal()">
                    <div class="bg-white rounded-2xl shadow-premium w-full ${sizes[size]} max-h-[90vh] overflow-hidden animate-scale-in flex flex-col" onclick="event.stopPropagation()">
                        ${content}
                    </div>
                </div>
            `;
        }

        function closeModal() {
            document.getElementById('modal-container').innerHTML = '';
        }

        function generateInvoiceNumber() {
            const prefix = state.settings.invoicePrefix || 'ZD';
            const num = String(state.nextBillId).padStart(5, '0');
            return `${prefix}-${num}`;
        }

        // ==================== DASHBOARD ====================
        function renderDashboard() {
            const content = document.getElementById('page-content');
            
            const totalSales = state.bills.reduce((sum, b) => sum + b.grandTotal, 0);
            const totalProfit = state.bills.reduce((sum, b) => sum + (b.profit || 0), 0);
            const totalStock = state.products.reduce((sum, p) => sum + p.stock, 0);
            const stockWorth = state.products.reduce((sum, p) => sum + (p.stock * p.buyingCost), 0);
            const lowStock = state.products.filter(p => p.stock <= state.settings.lowStockThreshold).length;
            
            // Time-based sales
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekStart = new Date(todayStart);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            
            const dailySales = state.bills.filter(b => new Date(b.createdAt) >= todayStart).reduce((s, b) => s + b.grandTotal, 0);
            const weeklySales = state.bills.filter(b => new Date(b.createdAt) >= weekStart).reduce((s, b) => s + b.grandTotal, 0);
            const monthlySales = state.bills.filter(b => new Date(b.createdAt) >= monthStart).reduce((s, b) => s + b.grandTotal, 0);
            
            // Best selling
            const productSales = {};
            state.bills.forEach(bill => {
                bill.items.forEach(item => {
                    productSales[item.productId] = (productSales[item.productId] || 0) + item.qty;
                });
            });
            const bestSellers = Object.entries(productSales)
                .map(([id, qty]) => ({ product: state.products.find(p => p.id == id), qty }))
                .filter(x => x.product)
                .sort((a, b) => b.qty - a.qty)
                .slice(0, 5);
            
            content.innerHTML = `
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                    <div class="stat-card bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <i class="fas fa-coins text-emerald-600"></i>
                            </div>
                        </div>
                        <p class="text-2xl font-bold text-slate-800">${formatCurrency(totalSales)}</p>
                        <p class="text-xs text-slate-500 mt-1">Total Sales</p>
                    </div>
                    <div class="stat-card bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <i class="fas fa-chart-line text-blue-600"></i>
                            </div>
                        </div>
                        <p class="text-2xl font-bold text-slate-800">${formatCurrency(totalProfit)}</p>
                        <p class="text-xs text-slate-500 mt-1">Total Profit</p>
                    </div>
                    <div class="stat-card bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                                <i class="fas fa-boxes text-violet-600"></i>
                            </div>
                        </div>
                        <p class="text-2xl font-bold text-slate-800">${totalStock}</p>
                        <p class="text-xs text-slate-500 mt-1">Total Stock Units</p>
                    </div>
                    <div class="stat-card bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                <i class="fas fa-warehouse text-amber-600"></i>
                            </div>
                        </div>
                        <p class="text-2xl font-bold text-slate-800">${formatCurrency(stockWorth)}</p>
                        <p class="text-xs text-slate-500 mt-1">Stock Worth</p>
                    </div>
                    <div class="stat-card bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                                <i class="fas fa-laptop text-cyan-600"></i>
                            </div>
                        </div>
                        <p class="text-2xl font-bold text-slate-800">${state.products.length}</p>
                        <p class="text-xs text-slate-500 mt-1">Products</p>
                    </div>
                    <div class="stat-card bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                                <i class="fas fa-users text-rose-600"></i>
                            </div>
                        </div>
                        <p class="text-2xl font-bold text-slate-800">${state.customers.length}</p>
                        <p class="text-xs text-slate-500 mt-1">Customers</p>
                    </div>
                </div>
                
                <!-- Period Sales -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-5 text-white shadow-premium">
                        <p class="text-sm opacity-80 mb-1">Today's Sales</p>
                        <p class="text-2xl font-bold">${formatCurrency(dailySales)}</p>
                    </div>
                    <div class="bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl p-5 text-white shadow-premium">
                        <p class="text-sm opacity-80 mb-1">This Week</p>
                        <p class="text-2xl font-bold">${formatCurrency(weeklySales)}</p>
                    </div>
                    <div class="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-5 text-white shadow-premium">
                        <p class="text-sm opacity-80 mb-1">This Month</p>
                        <p class="text-2xl font-bold">${formatCurrency(monthlySales)}</p>
                    </div>
                </div>
                
                <!-- Charts Row -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <h3 class="font-semibold text-slate-800 mb-4">Sales Trend (Last 7 Days)</h3>
                        <div class="h-64">
                            <canvas id="sales-chart"></canvas>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <h3 class="font-semibold text-slate-800 mb-4">Profit Overview</h3>
                        <div class="h-64">
                            <canvas id="profit-chart"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <h3 class="font-semibold text-slate-800 mb-4">Best Selling Products</h3>
                        <div class="space-y-3">
                            ${bestSellers.length ? bestSellers.map((item, i) => `
                                <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                                    <span class="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">${i+1}</span>
                                    <img src="${item.product.image}" class="w-10 h-10 rounded-lg object-cover" onerror="this.src='https://via.placeholder.com/40'">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-slate-800 truncate">${item.product.name}</p>
                                        <p class="text-xs text-slate-400">${item.product.category}</p>
                                    </div>
                                    <span class="text-sm font-semibold text-primary-600">${item.qty} sold</span>
                                </div>
                            `).join('') : '<p class="text-sm text-slate-400 text-center py-8">No sales data yet</p>'}
                        </div>
                    </div>
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-slate-800">Low Stock Alert</h3>
                            <span class="badge px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">${lowStock} items</span>
                        </div>
                        <div class="space-y-2 max-h-64 overflow-y-auto">
                            ${state.products.filter(p => p.stock <= state.settings.lowStockThreshold).map(p => `
                                <div class="flex items-center gap-3 p-2 rounded-lg ${p.stock === 0 ? 'bg-red-50' : 'bg-amber-50'}">
                                    <img src="${p.image}" class="w-9 h-9 rounded object-cover" onerror="this.src='https://via.placeholder.com/36'">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-slate-800 truncate">${p.name}</p>
                                        <p class="text-xs text-slate-500">ID: ${p.id}</p>
                                    </div>
                                    <span class="text-sm font-bold ${p.stock === 0 ? 'text-red-600' : 'text-amber-600'}">${p.stock} left</span>
                                </div>
                            `).join('') || '<p class="text-sm text-slate-400 text-center py-8">All products well stocked</p>'}
                        </div>
                    </div>
                </div>
            `;
            
            // Render charts
            setTimeout(() => {
                renderSalesChart();
                renderProfitChart();
            }, 100);
        }

        function renderSalesChart() {
            const ctx = document.getElementById('sales-chart');
            if (!ctx) return;
            
            const labels = [];
            const data = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                labels.push(d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }));
                const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                const dayEnd = new Date(dayStart);
                dayEnd.setDate(dayEnd.getDate() + 1);
                const sales = state.bills
                    .filter(b => {
                        const bd = new Date(b.createdAt);
                        return bd >= dayStart && bd < dayEnd;
                    })
                    .reduce((s, b) => s + b.grandTotal, 0);
                data.push(sales);
            }
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Sales',
                        data,
                        borderColor: '#0c8ce9',
                        backgroundColor: 'rgba(12, 140, 233, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#0c8ce9',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#f1f5f9' },
                            ticks: {
                                callback: v => formatCurrency(v).replace('LKR', '').trim()
                            }
                        },
                        x: { grid: { display: false } }
                    },
                    animation: { duration: 1000, easing: 'easeOutQuart' }
                }
            });
        }

        function renderProfitChart() {
            const ctx = document.getElementById('profit-chart');
            if (!ctx) return;
            
            // Monthly profit for last 6 months
            const labels = [];
            const data = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                labels.push(d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }));
                const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
                const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);
                const profit = state.bills
                    .filter(b => {
                        const bd = new Date(b.createdAt);
                        return bd >= monthStart && bd < monthEnd;
                    })
                    .reduce((s, b) => s + (b.profit || 0), 0);
                data.push(profit);
            }
            
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Profit',
                        data,
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#f1f5f9' },
                            ticks: {
                                callback: v => formatCurrency(v).replace('LKR', '').trim()
                            }
                        },
                        x: { grid: { display: false } }
                    },
                    animation: { duration: 1000, easing: 'easeOutQuart' }
                }
            });
        }

        // ==================== BILLING ====================
        let billingCart = [];
        let selectedCustomer = null;

        function renderBilling() {
            const content = document.getElementById('page-content');
            billingCart = [];
            selectedCustomer = null;
            
            content.innerHTML = `
                <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <!-- Product Selection -->
                    <div class="xl:col-span-2 space-y-4">
                        <!-- Customer Info Card -->
                        <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-semibold text-slate-800 flex items-center gap-2">
                                    <i class="fas fa-user-circle text-primary-500"></i>
                                    Customer Information
                                </h3>
                                <button onclick="openCustomerSearch()" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                    <i class="fas fa-search mr-1"></i>Search Existing
                                </button>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs font-medium text-slate-500 mb-1">Full Name *</label>
                                    <input type="text" id="bill-customer-name" required
                                        class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                        placeholder="Customer full name">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-slate-500 mb-1">NIC Number</label>
                                    <input type="text" id="bill-customer-nic"
                                        class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                        placeholder="199512345678 (optional)">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-slate-500 mb-1">Mobile Number *</label>
                                    <input type="tel" id="bill-customer-mobile" required
                                        class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                        placeholder="0771234567">
                                </div>
                            </div>
                        </div>
                        
                        <!-- Product Search & Grid -->
                        <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="relative flex-1">
                                    <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                                    <input type="text" id="product-search" placeholder="Search products by name, ID, or category..."
                                        class="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                                        oninput="filterBillingProducts()">
                                </div>
                                <select id="category-filter" onchange="filterBillingProducts()"
                                    class="px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-white">
                                    <option value="">All Categories</option>
                                    ${[...new Set(state.products.map(p => p.category))].map(c => `<option value="${c}">${c}</option>`).join('')}
                                </select>
                            </div>
                            <div id="billing-product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
                                ${renderBillingProductCards(state.products)}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Cart & Checkout -->
                    <div class="space-y-4">
                        <div class="bg-white rounded-xl border border-slate-100 shadow-card sticky top-24">
                            <div class="p-4 border-b border-slate-100">
                                <h3 class="font-semibold text-slate-800 flex items-center gap-2">
                                    <i class="fas fa-shopping-cart text-primary-500"></i>
                                    Current Bill
                                    <span id="cart-count" class="ml-auto badge px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">0 items</span>
                                </h3>
                            </div>
                            <div id="cart-items" class="p-4 max-h-64 overflow-y-auto space-y-2">
                                <p class="text-sm text-slate-400 text-center py-6">No items added yet</p>
                            </div>
                            <div class="p-4 border-t border-slate-100 space-y-3">
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Subtotal</span>
                                    <span id="cart-subtotal" class="font-medium">LKR 0</span>
                                </div>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-slate-500">Discount</span>
                                    <div class="flex items-center gap-1">
                                        <input type="number" id="cart-discount" value="0" min="0" 
                                            class="w-20 px-2 py-1 rounded border border-slate-200 text-right text-sm"
                                            oninput="updateCartTotals()">
                                        <span class="text-slate-400 text-xs">LKR</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-slate-500">Advance</span>
                                    <div class="flex items-center gap-1">
                                        <input type="number" id="cart-advance" value="0" min="0" 
                                            class="w-20 px-2 py-1 rounded border border-slate-200 text-right text-sm"
                                            oninput="updateCartTotals()">
                                        <span class="text-slate-400 text-xs">LKR</span>
                                    </div>
                                </div>
                                <div class="flex justify-between text-base font-bold pt-2 border-t border-slate-100">
                                    <span>Total</span>
                                    <span id="cart-total" class="text-primary-600">LKR 0</span>
                                </div>
                                <div class="pt-2">
                                    <label class="block text-xs font-medium text-slate-500 mb-1">Payment Method</label>
                                    <select id="payment-method" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" onchange="onPaymentMethodChange()">
                                        <option value="Cash">Cash</option>
                                        <option value="Card">Card</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Mobile Payment">Mobile Payment</option>
                                        <option value="Loan">Loan / Credit</option>
                                    </select>
                                </div>
                                <div class="pt-1">
                                    <label class="block text-xs font-medium text-slate-500 mb-1">Payment Status</label>
                                    <select id="payment-status" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                                        <option value="Paid">Paid</option>
                                        <option value="Advance Only">Advance Only</option>
                                        <option value="Unpaid">Unpaid / Loan</option>
                                    </select>
                                    <p class="text-[10px] text-slate-400 mt-1">Choose Advance Only when only a partial advance is received</p>
                                </div>
                                <div class="pt-1">
                                    <label class="block text-xs font-medium text-slate-500 mb-1">Warranty</label>
                                    <select id="warranty-status" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                                        <option value="Full Warranty">Full Warranty</option>
                                        <option value="No Warranty">No Warranty</option>
                                        <option value="Board Warranty">Board Warranty</option>
                                    </select>
                                </div>
                                <button onclick="processBill()" class="w-full btn-primary text-white font-medium py-3 rounded-lg mt-2 flex items-center justify-center gap-2">
                                    <i class="fas fa-file-invoice"></i>
                                    Generate Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderBillingProductCards(products) {
            if (!products.length) return '<p class="text-sm text-slate-400 col-span-full text-center py-8">No products found</p>';
            return products.map(p => {
                const bits = [p.chip, p.ram, p.storage, p.size].filter(Boolean).join(' · ');
                return `
                <div class="product-card border border-slate-100 rounded-xl p-3 cursor-pointer hover:border-primary-200 ${p.stock <= 0 ? 'opacity-50 pointer-events-none' : ''}"
                    onclick="addToCart(${p.id})">
                    <div class="flex gap-3">
                        <img src="${p.image}" class="w-16 h-16 rounded-lg object-cover flex-shrink-0" onerror="this.src='https://via.placeholder.com/64'">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-slate-800 truncate">${p.name}</p>
                            <p class="text-xs text-slate-400 mb-0.5">${p.category} · ID: ${p.id}</p>
                            ${bits ? `<p class="text-[11px] text-slate-500 truncate mb-1">${bits}</p>` : ''}
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-bold text-primary-600">${formatCurrency(p.sellingPrice)}</span>
                                <span class="text-xs ${p.stock <= state.settings.lowStockThreshold ? 'text-amber-600' : 'text-slate-400'}">
                                    ${p.stock} in stock
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `}).join('');
        }

        function filterBillingProducts() {
            const query = document.getElementById('product-search').value.toLowerCase();
            const cat = document.getElementById('category-filter').value;
            let filtered = state.products;
            if (query) {
                filtered = filtered.filter(p => 
                    p.name.toLowerCase().includes(query) ||
                    String(p.id).includes(query) ||
                    (p.category || '').toLowerCase().includes(query) ||
                    (p.brand || '').toLowerCase().includes(query)
                );
            }
            if (cat) filtered = filtered.filter(p => p.category === cat);
            document.getElementById('billing-product-grid').innerHTML = renderBillingProductCards(filtered);
        }

        function addToCart(productId) {
            const product = state.products.find(p => p.id === productId);
            if (!product || product.stock <= 0) {
                showToast('Product out of stock', 'warning');
                return;
            }
            
            const existing = billingCart.find(c => c.productId === productId);
            if (existing) {
                if (existing.qty >= product.stock) {
                    showToast('Cannot exceed available stock', 'warning');
                    return;
                }
                existing.qty++;
            } else {
                billingCart.push({
                    productId: product.id,
                    name: product.name,
                    price: product.sellingPrice,
                    cost: product.buyingCost,
                    qty: 1,
                    image: product.image,
                    brand: product.brand || '',
                    ram: product.ram || '',
                    storage: product.storage || '',
                    size: product.size || '',
                    chip: product.chip || '',
                    specs: product.specs || ''
                });
            }
            updateCartUI();
            showToast(`Added ${product.name}`, 'success');
        }

        function updateCartQty(productId, delta) {
            const item = billingCart.find(c => c.productId === productId);
            if (!item) return;
            const product = state.products.find(p => p.id === productId);
            const newQty = item.qty + delta;
            if (newQty <= 0) {
                billingCart = billingCart.filter(c => c.productId !== productId);
            } else if (newQty > product.stock) {
                showToast('Cannot exceed available stock', 'warning');
                return;
            } else {
                item.qty = newQty;
            }
            updateCartUI();
        }

        function removeFromCart(productId) {
            billingCart = billingCart.filter(c => c.productId !== productId);
            updateCartUI();
        }

        function updateCartUI() {
            const container = document.getElementById('cart-items');
            const countEl = document.getElementById('cart-count');
            
            if (!billingCart.length) {
                container.innerHTML = '<p class="text-sm text-slate-400 text-center py-6">No items added yet</p>';
                countEl.textContent = '0 items';
            } else {
                countEl.textContent = `${billingCart.reduce((s, i) => s + i.qty, 0)} items`;
                container.innerHTML = billingCart.map(item => `
                    <div class="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                        <img src="${item.image}" class="w-10 h-10 rounded object-cover" onerror="this.src='https://via.placeholder.com/40'">
                        <div class="flex-1 min-w-0">
                            <p class="text-xs font-medium text-slate-800 truncate">${item.name}</p>
                            <p class="text-xs text-slate-500">${formatCurrency(item.price)} × ${item.qty}</p>
                        </div>
                        <div class="flex items-center gap-1">
                            <button onclick="updateCartQty(${item.productId}, -1)" class="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="text-xs font-medium w-5 text-center">${item.qty}</span>
                            <button onclick="updateCartQty(${item.productId}, 1)" class="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button onclick="removeFromCart(${item.productId})" class="w-6 h-6 rounded text-red-500 hover:bg-red-50 text-xs ml-1">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
            updateCartTotals();
        }

        function updateCartTotals() {
            const subtotal = billingCart.reduce((s, i) => s + (i.price * i.qty), 0);
            const discount = parseFloat(document.getElementById('cart-discount')?.value) || 0;
            const advance = parseFloat(document.getElementById('cart-advance')?.value) || 0;
            const total = Math.max(0, subtotal - discount - advance);
            
            document.getElementById('cart-subtotal').textContent = formatCurrency(subtotal);
            document.getElementById('cart-total').textContent = formatCurrency(total);
        }

        function openCustomerSearch() {
            openModal(`
                <div class="p-5 border-b border-slate-100">
                    <h3 class="font-semibold text-lg text-slate-800">Search Customers</h3>
                </div>
                <div class="p-5">
                    <input type="text" id="customer-search-input" placeholder="Search by name, NIC, or mobile..."
                        class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm mb-4"
                        oninput="searchCustomersForBill()">
                    <div id="customer-search-results" class="max-h-64 overflow-y-auto space-y-2">
                        ${state.customers.slice(0, 10).map(c => `
                            <div class="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-primary-200 cursor-pointer"
                                onclick="selectCustomerForBill(${c.id})">
                                <div>
                                    <p class="text-sm font-medium text-slate-800">${c.name}</p>
                                    <p class="text-xs text-slate-400">NIC: ${c.nic} · ${c.mobile}</p>
                                </div>
                                <i class="fas fa-chevron-right text-slate-300 text-xs"></i>
                            </div>
                        `).join('') || '<p class="text-sm text-slate-400 text-center py-4">No customers found</p>'}
                    </div>
                </div>
                <div class="p-4 border-t border-slate-100 flex justify-end">
                    <button onclick="closeModal()" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Close</button>
                </div>
            `, 'md');
        }

        function searchCustomersForBill() {
            const q = document.getElementById('customer-search-input').value.toLowerCase();
            const results = state.customers.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.nic.includes(q) ||
                c.mobile.includes(q)
            ).slice(0, 15);
            
            document.getElementById('customer-search-results').innerHTML = results.map(c => `
                <div class="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-primary-200 cursor-pointer"
                    onclick="selectCustomerForBill(${c.id})">
                    <div>
                        <p class="text-sm font-medium text-slate-800">${c.name}</p>
                        <p class="text-xs text-slate-400">NIC: ${c.nic} · ${c.mobile}</p>
                    </div>
                    <i class="fas fa-chevron-right text-slate-300 text-xs"></i>
                </div>
            `).join('') || '<p class="text-sm text-slate-400 text-center py-4">No matching customers</p>';
        }

        function selectCustomerForBill(id) {
            const c = state.customers.find(x => x.id === id);
            if (c) {
                document.getElementById('bill-customer-name').value = c.name;
                document.getElementById('bill-customer-nic').value = c.nic;
                document.getElementById('bill-customer-mobile').value = c.mobile;
                selectedCustomer = c;
                closeModal();
                showToast(`Customer ${c.name} selected`, 'success');
            }
        }

        function onPaymentMethodChange() {
            const method = document.getElementById('payment-method')?.value;
            const statusEl = document.getElementById('payment-status');
            if (!statusEl) return;
            if (method === 'Loan') {
                statusEl.value = 'Unpaid';
            } else if (statusEl.value === 'Unpaid' && method !== 'Loan') {
                // leave as-is so user can still choose Unpaid for other methods if needed
            } else {
                statusEl.value = 'Paid';
            }
        }

        function processBill() {
            const name = document.getElementById('bill-customer-name').value.trim();
            const nic = document.getElementById('bill-customer-nic').value.trim();
            const mobile = document.getElementById('bill-customer-mobile').value.trim();
            
            if (!name || !mobile) {
                showToast('Customer name and mobile are mandatory', 'error');
                return;
            }
            
            if (!billingCart.length) {
                showToast('Please add at least one product', 'error');
                return;
            }
            
            // Validate stock
            for (const item of billingCart) {
                const product = state.products.find(p => p.id === item.productId);
                if (!product || product.stock < item.qty) {
                    showToast(`Insufficient stock for ${item.name}`, 'error');
                    return;
                }
            }
            
            const subtotal = billingCart.reduce((s, i) => s + (i.price * i.qty), 0);
            const discount = parseFloat(document.getElementById('cart-discount').value) || 0;
            const advance = parseFloat(document.getElementById('cart-advance')?.value) || 0;
            const grandTotal = Math.max(0, subtotal - discount - advance);
            const profit = billingCart.reduce((s, i) => s + ((i.price - i.cost) * i.qty), 0) - discount;
            const paymentMethod = document.getElementById('payment-method').value;
            let paymentStatus = document.getElementById('payment-status')?.value || 'Paid';
            const warranty = document.getElementById('warranty-status')?.value || 'No Warranty';
            // Auto-set Unpaid when Loan is selected
            if (paymentMethod === 'Loan') paymentStatus = 'Unpaid';

            if (paymentStatus === 'Advance Only' && advance <= 0) {
                showToast('Enter an advance amount for Advance Only payments', 'error');
                return;
            }
            
            // Find or create customer (only match by NIC when one was entered)
            let customer = nic ? state.customers.find(c => c.nic === nic) : null;
            if (!customer) {
                customer = {
                    id: state.nextCustomerId++,
                    name,
                    nic,
                    mobile,
                    email: '',
                    createdAt: new Date().toISOString()
                };
                state.customers.push(customer);
            } else {
                // Update name/mobile if changed
                customer.name = name;
                customer.mobile = mobile;
            }
            
            // Create bill
            const invoiceNo = generateInvoiceNumber();
            const bill = {
                id: state.nextBillId++,
                invoiceNo,
                customerId: customer.id,
                customerName: name,
                customerNic: nic,
                customerMobile: mobile,
                items: billingCart.map(i => ({ ...i })),
                subtotal,
                discount,
                advance,
                grandTotal,
                profit,
                paymentMethod,
                paymentStatus,
                warranty,
                createdAt: new Date().toISOString(),
                createdBy: state.currentUser?.username || 'admin'
            };
            
            // Deduct stock
            billingCart.forEach(item => {
                const product = state.products.find(p => p.id === item.productId);
                if (product) {
                    product.stock -= item.qty;
                    product.updatedAt = new Date().toISOString();
                }
            });
            
            state.bills.push(bill);
            saveData();
            
            // Show invoice
            showInvoice(bill);
            
            // Reset
            billingCart = [];
            updateCartUI();
            document.getElementById('bill-customer-name').value = '';
            document.getElementById('bill-customer-nic').value = '';
            document.getElementById('bill-customer-mobile').value = '';
            document.getElementById('cart-discount').value = 0;
            document.getElementById('cart-advance').value = 0;
            document.getElementById('warranty-status').value = 'Full Warranty';
            filterBillingProducts();
            
            showToast('Invoice generated successfully!', 'success');
        }

        function getQrCodeContent() {
            const s = state.settings;
            if (s.qrCodeType === 'link' && s.qrCodeLink) {
                return s.qrCodeLink.startsWith('http') ? s.qrCodeLink : 'https://' + s.qrCodeLink;
            }
            // Default: location / address
            return s.businessAddress || s.businessName || 'Zero Device';
        }

        function showInvoice(bill) {
            const s = state.settings;
            const status = bill.paymentStatus || 'Paid';
            const isPaid = status === 'Paid';
            const isAdvanceOnly = status === 'Advance Only';
            const statusClass = isPaid ? 'invoice-status-paid' : (isAdvanceOnly ? 'invoice-status-advance' : 'invoice-status-unpaid');
            const statusIcon = isPaid ? 'fa-check-circle' : (isAdvanceOnly ? 'fa-hand-holding-dollar' : 'fa-clock');
            const statusLabel = isPaid ? 'PAID' : (isAdvanceOnly ? 'ADVANCE' : 'UNPAID');
            const statusSub = isPaid ? 'Payment Completed' : (isAdvanceOnly ? 'Advance Received' : 'Loan / Credit');

            // Build a Specifications box from the first item that actually has spec data
            const specItem = bill.items.find(i => i.ram || i.storage || i.chip || i.size);
            const specRows = specItem ? [
                { label: 'RAM', value: specItem.ram },
                { label: 'Storage', value: specItem.storage },
                { label: 'Chip', value: specItem.chip },
                { label: 'Size', value: specItem.size }
            ].filter(r => r.value) : [];

            openModal(`
                <div id="invoice-print-area" class="invoice-paper invoice-3d-deep overflow-y-auto max-h-[88vh] rounded-2xl" style="max-width: 210mm; margin: 0 auto;">
                    <!-- Top accent bar -->
                    <div class="invoice-header-bar w-full"></div>
                    
                    <div class="invoice-body px-5 pt-4 pb-4">
                        <!-- TOP ROW: Logo+Shop | Status Badge | Invoice No + QR -->
                        <div class="flex items-start justify-between gap-3 mb-4">
                            <!-- Left: Logo + Business -->
                            <div class="flex items-start gap-2.5 min-w-0 flex-1">
                                <div class="w-12 h-12 rounded-2xl invoice-logo-3d flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-laptop text-white text-xl"></i>
                                </div>
                                <div class="min-w-0 pt-0.5">
                                    <h1 class="font-display text-xl font-bold text-slate-900 tracking-tight leading-none">${s.businessName}</h1>
                                    <p class="text-[11px] text-primary-600 font-semibold mt-1">Premium Technology Retail Store</p>
                                    <p class="text-[10px] text-slate-500 mt-1.5 leading-snug">${s.businessAddress}</p>
                                    <p class="text-[10px] text-slate-500">${s.businessPhone}</p>
                                    <p class="text-[9px] text-slate-400 mt-0.5">${s.businessEmail}${s.businessWebsite ? ' · ' + s.businessWebsite : ''}</p>
                                </div>
                            </div>
                            
                            <!-- Center: Big 3D Status Badge -->
                            <div class="${statusClass} rounded-2xl px-5 py-3.5 text-white text-center min-w-[130px] flex-shrink-0 self-center">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="fas ${statusIcon} text-xl"></i>
                                    <span class="text-xl font-black tracking-wider">${statusLabel}</span>
                                </div>
                                <p class="text-[10px] font-semibold opacity-95 mt-1 tracking-wide">${statusSub}</p>
                            </div>
                            
                            <!-- Right: Invoice meta + QR -->
                            <div class="flex flex-col items-end flex-shrink-0 gap-2">
                                <div class="text-right">
                                    <p class="text-[9px] font-bold text-primary-500 uppercase tracking-widest">Invoice No.</p>
                                    <p class="text-lg font-extrabold text-slate-900 leading-tight">${bill.invoiceNo}</p>
                                    <p class="text-[10px] text-slate-500 mt-0.5">${formatDateTime(bill.createdAt)}</p>
                                </div>
                                <div class="flex flex-col items-center">
                                    <div id="invoice-qr-code" class="invoice-qr-frame rounded-xl p-1" style="width:70px;height:70px;"></div>
                                    <p class="text-[8px] text-slate-400 mt-1 text-center leading-tight">${s.qrCodeType === 'link' ? 'Scan for link' : 'Scan location'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Thin gradient divider -->
                        <div class="h-[3px] rounded-full mb-4" style="background: linear-gradient(90deg, #072849, #0c8ce9, #36a7f6, transparent);"></div>
                        
                        <!-- BILL TO + PAYMENT cards -->
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <div class="invoice-info-card rounded-xl p-3.5">
                                <p class="text-[9px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                    <i class="fas fa-user text-[10px]"></i> Bill To
                                </p>
                                <p class="font-bold text-slate-900 text-[15px] leading-snug">${bill.customerName}</p>
                                <p class="text-[11px] text-slate-600 mt-1.5">NIC: <span class="font-medium text-slate-800">${bill.customerNic || '—'}</span></p>
                                <p class="text-[11px] text-slate-600">Mobile: <span class="font-medium text-slate-800">${bill.customerMobile || '—'}</span></p>
                            </div>
                            <div class="invoice-info-card rounded-xl p-3.5 text-right">
                                <p class="text-[9px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 flex items-center justify-end gap-1.5">
                                    Payment <i class="fas fa-wallet text-[10px]"></i>
                                </p>
                                <p class="font-bold text-slate-900 text-[15px]">${bill.paymentMethod}</p>
                                <p class="text-[11px] mt-1.5 font-bold ${isPaid ? 'text-emerald-600' : (isAdvanceOnly ? 'text-blue-600' : 'text-amber-600')}">
                                    <i class="fas ${statusIcon} mr-1"></i>${statusLabel}
                                </p>
                                ${bill.advance > 0 ? `
                                <div class="mt-2 pt-2 border-t border-slate-200">
                                    <div class="flex items-center justify-end gap-2 text-[11px]">
                                        <span class="text-slate-500">Advance Paid</span>
                                        <span class="font-bold text-emerald-600">${formatCurrency(bill.advance)}</span>
                                    </div>
                                    <div class="flex items-center justify-end gap-2 text-[11px] mt-0.5">
                                        <span class="text-slate-500">Balance</span>
                                        <span class="font-bold text-amber-600">${formatCurrency(bill.grandTotal)}</span>
                                    </div>
                                </div>` : ''}
                            </div>
                        </div>
                        
                        <!-- Products table -->
                        <div class="invoice-table-wrap mb-4">
                            <table class="w-full">
                                <thead>
                                    <tr class="invoice-table-head">
                                        <th class="text-left text-[9px] font-bold text-white uppercase tracking-wider py-2.5 px-3">Product</th>
                                        <th class="text-center text-[9px] font-bold text-white uppercase tracking-wider py-2.5 px-2">Qty</th>
                                        <th class="text-right text-[9px] font-bold text-white uppercase tracking-wider py-2.5 px-2">Price</th>
                                        <th class="text-right text-[9px] font-bold text-white uppercase tracking-wider py-2.5 px-3">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${bill.items.map((item, idx) => {
                                        const detailParts = [];
                                        if (item.brand) detailParts.push(item.brand);
                                        if (item.chip) detailParts.push(item.chip);
                                        if (item.ram) detailParts.push(item.ram + ' RAM');
                                        if (item.storage) detailParts.push(item.storage);
                                        if (item.size) detailParts.push(item.size);
                                        if (item.specs) detailParts.push(item.specs);
                                        const detailsLine = detailParts.length ? detailParts.join(' · ') : '';
                                        return `
                                        <tr class="${idx !== bill.items.length - 1 ? 'border-b border-slate-100' : ''} ${idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}">
                                            <td class="py-2.5 px-3">
                                                <div class="flex items-center gap-2.5">
                                                    <img src="${item.image || 'https://via.placeholder.com/40'}" 
                                                         class="invoice-product-img flex-shrink-0 rounded-lg" style="width:40px;height:40px;object-fit:cover;"
                                                         alt="${item.name}"
                                                         onerror="this.src='https://via.placeholder.com/40?text=ZD'">
                                                    <div class="min-w-0">
                                                        <p class="text-[12px] font-bold text-slate-900 leading-snug">${item.name}</p>
                                                        ${detailsLine ? `<p class="text-[9px] text-slate-500 mt-0.5 leading-snug line-clamp-1">${detailsLine}</p>` : ''}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-2.5 px-2 text-center text-[12px] font-semibold text-slate-700">${item.qty}</td>
                                            <td class="py-2.5 px-2 text-right text-[12px] text-slate-600">${formatCurrency(item.price)}</td>
                                            <td class="py-2.5 px-3 text-right text-[12px] font-bold text-slate-900">${formatCurrency(item.price * item.qty)}</td>
                                        </tr>
                                    `}).join('')}
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Specs + Totals row -->
                        <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
                            ${specRows.length ? `
                            <div class="flex-1 min-w-[150px] max-w-[230px]">
                                <div class="rounded-xl invoice-spec-box text-white px-4 py-3 space-y-1.5">
                                    <p class="text-[9px] font-bold text-white/70 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                        <i class="fas fa-microchip text-[9px]"></i> Specifications
                                    </p>
                                    ${specRows.map(r => `
                                    <div class="flex justify-between text-[11px] gap-3">
                                        <span class="text-white/65">${r.label}</span>
                                        <span class="text-white font-bold text-right">${r.value}</span>
                                    </div>`).join('')}
                                </div>
                            </div>` : '<div class="flex-1"></div>'}
                            <div class="w-full sm:w-auto sm:min-w-[200px] flex-shrink-0 ml-auto">
                                <div class="rounded-xl invoice-total-box text-white px-4 py-3.5 space-y-1.5">
                                    <div class="flex justify-between text-[11px]">
                                        <span class="text-white/70">Subtotal</span>
                                        <span class="text-white font-semibold">${formatCurrency(bill.subtotal)}</span>
                                    </div>
                                    ${bill.discount > 0 ? `
                                    <div class="flex justify-between text-[11px]">
                                        <span class="text-white/70">Discount</span>
                                        <span class="text-amber-200 font-semibold">−${formatCurrency(bill.discount)}</span>
                                    </div>` : ''}
                                    ${bill.advance > 0 ? `
                                    <div class="flex justify-between text-[11px]">
                                        <span class="text-white/70">Advance</span>
                                        <span class="text-amber-200 font-semibold">−${formatCurrency(bill.advance)}</span>
                                    </div>` : ''}
                                    <div class="h-px bg-white/25 my-1"></div>
                                    <div class="flex justify-between items-baseline">
                                        <span class="text-[13px] font-extrabold text-white">Total</span>
                                        <span class="text-lg font-black text-white tracking-tight">${formatCurrency(bill.grandTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Warranty Box -->
                        <div class="invoice-warranty-box rounded-xl px-5 py-4 mb-4 flex items-center gap-4">
                            <div class="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-shield-alt text-white text-2xl"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-0.5">Warranty</p>
                                <p class="text-2xl font-black text-white tracking-tight leading-none">${bill.warranty || 'No Warranty'}</p>
                            </div>
                        </div>

                        <!-- Terms & Conditions -->
                        <div class="invoice-terms-box rounded-xl p-3.5 mb-3">
                            <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                <i class="fas fa-file-contract text-[10px]"></i> Terms &amp; Conditions
                            </p>
                            <ul class="text-[9px] text-slate-500 leading-relaxed list-disc list-inside space-y-0.5">
                                ${(s.termsAndConditions || '').split('\n').map(line => line.trim()).filter(Boolean).map(line => `<li>${line}</li>`).join('')}
                            </ul>
                        </div>

                        <!-- Thank You Box -->
                        <div class="invoice-thankyou-box rounded-xl px-4 py-3.5 mb-3 text-center">
                            <p class="text-[12px] font-bold text-white leading-snug">
                                <i class="fas fa-heart mr-1.5"></i>${s.thankYouMessage || ('Thank you for shopping with ' + s.businessName + '!')}
                            </p>
                        </div>

                        <!-- Signatures -->
                        <div class="sign-row grid grid-cols-2 gap-8 mb-3 mt-2">
                            <div class="text-center">
                                <div class="sign-box rounded-xl h-14"></div>
                                <p class="text-[10px] font-bold text-slate-600 mt-1.5">Customer Signature</p>
                            </div>
                            <div class="text-center">
                                <div class="sign-box rounded-xl h-14"></div>
                                <p class="text-[10px] font-bold text-slate-600 mt-1.5">Owner Signature &amp; Seal</p>
                            </div>
                        </div>
                        
                        <!-- Footer -->
                        <div class="pt-2.5 border-t border-slate-200">
                            <div class="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[9px] text-slate-400">
                                <span>${s.businessPhone}</span>
                                <span>·</span>
                                <span>${s.businessEmail}</span>
                                ${s.businessWebsite ? `<span>·</span><span>${s.businessWebsite}</span>` : ''}
                            </div>
                            <p class="text-[8px] text-slate-300 text-center mt-1.5">Computer-generated invoice · ${bill.invoiceNo} · 210×260mm</p>
                        </div>
                    </div>
                </div>
                <div class="p-3 border-t border-slate-100 flex flex-wrap justify-end gap-2 no-print bg-slate-50/90">
                    ${!isPaid ? `
                    <button onclick="markBillAsPaid(${bill.id})" class="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-2">
                        <i class="fas fa-check-circle"></i> Mark as Paid
                    </button>` : ''}
                    <button onclick="closeModal()" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Close</button>
                    <button onclick="window.print()" class="btn-primary text-white text-sm font-medium px-5 py-2 rounded-lg flex items-center gap-2">
                        <i class="fas fa-print"></i> Print / Save PDF
                    </button>
                </div>
            `, 'xl');

            // Generate QR code after modal is in DOM
            setTimeout(() => {
                const qrEl = document.getElementById('invoice-qr-code');
                if (qrEl && typeof QRCode !== 'undefined') {
                    qrEl.innerHTML = '';
                    try {
                        new QRCode(qrEl, {
                            text: getQrCodeContent(),
                            width: 64,
                            height: 64,
                            colorDark: '#0b3f6e',
                            colorLight: '#ffffff',
                            correctLevel: QRCode.CorrectLevel.M
                        });
                    } catch (e) {
                        qrEl.innerHTML = '<span class="text-[9px] text-slate-400 p-2">QR unavailable</span>';
                    }
                } else if (qrEl) {
                    // Fallback: use Google Chart API style image if library missing
                    const data = encodeURIComponent(getQrCodeContent());
                    qrEl.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${data}&color=0b3f6e" width="64" height="64" alt="QR" style="display:block;">`;
                }
            }, 80);
        }

        function markBillAsPaid(billId) {
            const bill = state.bills.find(b => b.id === billId);
            if (!bill) return;
            bill.paymentStatus = 'Paid';
            saveData();
            showToast('Bill marked as Paid', 'success');
            closeModal();
            // Re-open updated invoice
            showInvoice(bill);
            // Refresh sales history if currently on that page
            const active = document.querySelector('.sidebar-item.active');
            if (active && active.dataset.page === 'sales') {
                renderSalesHistory();
            }
        }


        // ==================== INVENTORY ====================
        function renderInventory() {
            const content = document.getElementById('page-content');
            
            content.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div class="relative flex-1 max-w-md">
                        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input type="text" id="inventory-search" placeholder="Search products..."
                            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                            oninput="filterInventory()">
                    </div>
                    <button onclick="openProductModal()" class="btn-primary text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2">
                        <i class="fas fa-plus"></i> Add Product
                    </button>
                </div>
                
                <div class="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th class="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Product</th>
                                    <th class="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">ID</th>
                                    <th class="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Category</th>
                                    <th class="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Buy Cost</th>
                                    <th class="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Sell Price</th>
                                    <th class="text-center text-xs font-semibold text-slate-500 uppercase px-4 py-3">Stock</th>
                                    <th class="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="inventory-table-body">
                                ${renderInventoryRows(state.products)}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function renderInventoryRows(products) {
            if (!products.length) return '<tr><td colspan="7" class="text-center text-sm text-slate-400 py-12">No products found</td></tr>';
            return products.map(p => `
                <tr class="table-row border-b border-slate-50">
                    <td class="px-4 py-3">
                        <div class="flex items-center gap-3">
                            <img src="${p.image}" class="w-12 h-12 rounded-lg object-cover" onerror="this.src='https://via.placeholder.com/48'">
                            <div>
                                <p class="text-sm font-medium text-slate-800">${p.name}</p>
                                <p class="text-xs text-slate-400">${p.brand || ''}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-sm text-slate-600">${p.id}</td>
                    <td class="px-4 py-3">
                        <span class="badge px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">${p.category}</span>
                    </td>
                    <td class="px-4 py-3 text-sm text-right text-slate-600">${formatCurrency(p.buyingCost)}</td>
                    <td class="px-4 py-3 text-sm text-right font-medium text-slate-800">${formatCurrency(p.sellingPrice)}</td>
                    <td class="px-4 py-3 text-center">
                        <span class="badge px-2.5 py-1 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-700' : p.stock <= state.settings.lowStockThreshold ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}">
                            ${p.stock}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-right">
                        <button onclick="openProductModal(${p.id})" class="text-slate-400 hover:text-primary-600 p-1.5" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteProduct(${p.id})" class="text-slate-400 hover:text-red-600 p-1.5" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        function filterInventory() {
            const q = document.getElementById('inventory-search').value.toLowerCase();
            const filtered = state.products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                String(p.id).includes(q) ||
                (p.category || '').toLowerCase().includes(q) ||
                (p.brand || '').toLowerCase().includes(q)
            );
            document.getElementById('inventory-table-body').innerHTML = renderInventoryRows(filtered);
        }

        let pendingProductImage = null; // base64 or null while editing

        function openProductModal(id = null) {
            const product = id ? state.products.find(p => p.id === id) : null;
            const isEdit = !!product;
            pendingProductImage = product?.image || null;
            
            openModal(`
                <div class="p-5 border-b border-slate-100">
                    <h3 class="font-semibold text-lg text-slate-800">${isEdit ? 'Edit Product' : 'Add New Product'}</h3>
                </div>
                <form id="product-form" class="p-5 space-y-4 max-h-[65vh] overflow-y-auto" onsubmit="saveProduct(event, ${id})">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                            <input type="text" name="name" required value="${product?.name || ''}"
                                class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                            <input type="text" name="category" required value="${product?.category || ''}" list="category-list"
                                class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="e.g. Laptop">
                            <datalist id="category-list">
                                ${[...new Set(state.products.map(p => p.category))].map(c => `<option value="${c}">`).join('')}
                            </datalist>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                            <input type="text" name="brand" value="${product?.brand || ''}"
                                class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Buying Cost (LKR) *</label>
                            <input type="number" name="buyingCost" required min="0" value="${product?.buyingCost || ''}"
                                class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Selling Price (LKR) *</label>
                            <input type="number" name="sellingPrice" required min="0" value="${product?.sellingPrice || ''}"
                                class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Stock Quantity *</label>
                            <input type="number" name="stock" required min="0" value="${product?.stock ?? 0}"
                                class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">RAM</label>
                            <input type="text" name="ram" value="${product?.ram || ''}"
                                class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="e.g. 16GB">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Storage</label>
                            <input type="text" name="storage" value="${product?.storage || ''}"
                                class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="e.g. 512GB SSD">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Size / Display</label>
                            <input type="text" name="size" value="${product?.size || ''}"
                                class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="e.g. 14&quot;">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Chip / Processor</label>
                            <input type="text" name="chip" value="${product?.chip || ''}"
                                class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="e.g. Apple M3 Pro">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
                            <div id="image-upload-zone" class="image-upload-zone rounded-xl p-4 ${pendingProductImage ? 'has-image' : ''}"
                                onclick="document.getElementById('product-image-input').click()">
                                <input type="file" id="product-image-input" accept="image/*" class="hidden" onchange="handleProductImageSelect(event)">
                                <div id="image-preview-container" class="flex flex-col items-center justify-center gap-3 min-h-[120px]">
                                    ${pendingProductImage ? `
                                        <img id="product-image-preview" src="${pendingProductImage}" class="w-28 h-28 rounded-xl object-cover shadow-soft border border-slate-100" alt="Preview">
                                        <div class="flex items-center gap-2">
                                            <button type="button" onclick="event.stopPropagation(); document.getElementById('product-image-input').click()" class="text-xs font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg bg-primary-50">
                                                <i class="fas fa-sync-alt mr-1"></i> Replace
                                            </button>
                                            <button type="button" onclick="event.stopPropagation(); removeProductImage()" class="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg bg-red-50">
                                                <i class="fas fa-trash mr-1"></i> Remove
                                            </button>
                                        </div>
                                    ` : `
                                        <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                                            <i class="fas fa-cloud-upload-alt text-slate-400 text-xl"></i>
                                        </div>
                                        <div class="text-center">
                                            <p class="text-sm font-medium text-slate-700">Upload Product Image</p>
                                            <p class="text-xs text-slate-400 mt-0.5">Click to browse · JPG, PNG, WebP</p>
                                        </div>
                                    `}
                                </div>
                            </div>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-slate-700 mb-1">Specifications / Details</label>
                            <textarea name="specs" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">${product?.specs || ''}</textarea>
                        </div>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" onclick="closeModal()" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button type="submit" class="btn-primary text-white text-sm font-medium px-5 py-2 rounded-lg">
                            ${isEdit ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            `, 'lg');
        }

        function handleProductImageSelect(e) {
            const file = e.target.files?.[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                showToast('Please select a valid image file', 'error');
                return;
            }
            if (file.size > 2.5 * 1024 * 1024) {
                showToast('Image must be under 2.5 MB', 'warning');
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                pendingProductImage = ev.target.result;
                const container = document.getElementById('image-preview-container');
                const zone = document.getElementById('image-upload-zone');
                if (container && zone) {
                    zone.classList.add('has-image');
                    container.innerHTML = `
                        <img id="product-image-preview" src="${pendingProductImage}" class="w-28 h-28 rounded-xl object-cover shadow-soft border border-slate-100" alt="Preview">
                        <div class="flex items-center gap-2">
                            <button type="button" onclick="event.stopPropagation(); document.getElementById('product-image-input').click()" class="text-xs font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg bg-primary-50">
                                <i class="fas fa-sync-alt mr-1"></i> Replace
                            </button>
                            <button type="button" onclick="event.stopPropagation(); removeProductImage()" class="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg bg-red-50">
                                <i class="fas fa-trash mr-1"></i> Remove
                            </button>
                        </div>
                    `;
                }
            };
            reader.readAsDataURL(file);
        }

        function removeProductImage() {
            pendingProductImage = null;
            const container = document.getElementById('image-preview-container');
            const zone = document.getElementById('image-upload-zone');
            const input = document.getElementById('product-image-input');
            if (input) input.value = '';
            if (zone) zone.classList.remove('has-image');
            if (container) {
                container.innerHTML = `
                    <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                        <i class="fas fa-cloud-upload-alt text-slate-400 text-xl"></i>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-medium text-slate-700">Upload Product Image</p>
                        <p class="text-xs text-slate-400 mt-0.5">Click to browse · JPG, PNG, WebP</p>
                    </div>
                `;
            }
        }

        function saveProduct(e, id) {
            e.preventDefault();
            const form = e.target;
            const data = {
                name: form.name.value.trim(),
                category: form.category.value.trim(),
                brand: form.brand.value.trim(),
                buyingCost: parseFloat(form.buyingCost.value) || 0,
                sellingPrice: parseFloat(form.sellingPrice.value) || 0,
                stock: parseInt(form.stock.value) || 0,
                ram: (form.ram?.value || '').trim(),
                storage: (form.storage?.value || '').trim(),
                size: (form.size?.value || '').trim(),
                chip: (form.chip?.value || '').trim(),
                image: pendingProductImage || sampleImages[0],
                specs: form.specs.value.trim(),
                updatedAt: new Date().toISOString()
            };
            
            if (id) {
                const idx = state.products.findIndex(p => p.id === id);
                if (idx >= 0) {
                    state.products[idx] = { ...state.products[idx], ...data };
                }
                showToast('Product updated', 'success');
            } else {
                state.products.push({
                    id: state.nextProductId++,
                    ...data,
                    description: data.specs,
                    createdAt: new Date().toISOString()
                });
                showToast('Product added', 'success');
            }
            
            pendingProductImage = null;
            saveData();
            closeModal();
            renderInventory();
        }


        function deleteProduct(id) {
            if (!confirm('Are you sure you want to delete this product?')) return;
            state.products = state.products.filter(p => p.id !== id);
            saveData();
            showToast('Product deleted', 'success');
            renderInventory();
        }

        // ==================== CUSTOMERS ====================
        function renderCustomers() {
            const content = document.getElementById('page-content');
            
            content.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div class="relative flex-1 max-w-md">
                        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input type="text" id="customer-search" placeholder="Search by name, NIC, or mobile..."
                            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm"
                            oninput="filterCustomers()">
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th class="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Customer</th>
                                    <th class="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">NIC</th>
                                    <th class="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Mobile</th>
                                    <th class="text-center text-xs font-semibold text-slate-500 uppercase px-4 py-3">Purchases</th>
                                    <th class="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Total Spent</th>
                                    <th class="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="customers-table-body">
                                ${renderCustomerRows(state.customers)}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function renderCustomerRows(customers) {
            if (!customers.length) return '<tr><td colspan="6" class="text-center text-sm text-slate-400 py-12">No customers yet</td></tr>';
            return customers.map(c => {
                const purchases = state.bills.filter(b => b.customerId === c.id || b.customerNic === c.nic);
                const totalSpent = purchases.reduce((s, b) => s + b.grandTotal, 0);
                return `
                    <tr class="table-row border-b border-slate-50">
                        <td class="px-4 py-3">
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span class="text-sm font-semibold text-primary-700">${c.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-slate-800">${c.name}</p>
                                    <p class="text-xs text-slate-400">Since ${formatDate(c.createdAt)}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-sm text-slate-600">${c.nic}</td>
                        <td class="px-4 py-3 text-sm text-slate-600">${c.mobile}</td>
                        <td class="px-4 py-3 text-center text-sm font-medium text-slate-700">${purchases.length}</td>
                        <td class="px-4 py-3 text-right text-sm font-medium text-slate-800">${formatCurrency(totalSpent)}</td>
                        <td class="px-4 py-3 text-right">
                            <button onclick="viewCustomerHistory(${c.id})" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                View History
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        function filterCustomers() {
            const q = document.getElementById('customer-search').value.toLowerCase();
            const filtered = state.customers.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.nic.includes(q) ||
                c.mobile.includes(q)
            );
            document.getElementById('customers-table-body').innerHTML = renderCustomerRows(filtered);
        }

        function viewCustomerHistory(id) {
            const customer = state.customers.find(c => c.id === id);
            if (!customer) return;
            
            const purchases = state.bills
                .filter(b => b.customerId === id || b.customerNic === customer.nic)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            openModal(`
                <div class="p-5 border-b border-slate-100">
                    <h3 class="font-semibold text-lg text-slate-800">${customer.name}</h3>
                    <p class="text-sm text-slate-500">NIC: ${customer.nic} · Mobile: ${customer.mobile}</p>
                </div>
                <div class="p-5 max-h-[50vh] overflow-y-auto">
                    <h4 class="text-sm font-semibold text-slate-700 mb-3">Purchase History (${purchases.length})</h4>
                    ${purchases.length ? `
                        <div class="space-y-3">
                            ${purchases.map(b => {
                                const st = b.paymentStatus || 'Paid';
                                return `
                                <div class="border border-slate-100 rounded-lg p-3 hover:border-primary-200 cursor-pointer" onclick="showInvoiceById(${b.id})">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <p class="text-sm font-medium text-slate-800">${b.invoiceNo}</p>
                                            <p class="text-xs text-slate-400">${formatDateTime(b.createdAt)}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-sm font-bold text-primary-600">${formatCurrency(b.grandTotal)}</p>
                                            <span class="badge px-1.5 py-0.5 rounded-full text-[10px] ${st==='Paid'?'bg-emerald-100 text-emerald-700':(st==='Advance Only'?'bg-blue-100 text-blue-700':'bg-amber-100 text-amber-700')}">${st}</span>
                                        </div>
                                    </div>
                                    <p class="text-xs text-slate-500 mt-1">${b.items.length} item(s) · ${b.paymentMethod}</p>
                                </div>
                            `}).join('')}
                        </div>
                    ` : '<p class="text-sm text-slate-400 text-center py-6">No purchases yet</p>'}
                </div>
                <div class="p-4 border-t border-slate-100 flex justify-end">
                    <button onclick="closeModal()" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Close</button>
                </div>
            `, 'md');
        }

        function showInvoiceById(billId) {
            const bill = state.bills.find(b => b.id === billId);
            if (bill) showInvoice(bill);
        }

        // ==================== SALES HISTORY ====================
        function renderSalesHistory() {
            const content = document.getElementById('page-content');
            const sortedBills = [...state.bills].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            content.innerHTML = `
                <div class="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th class="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Invoice</th>
                                    <th class="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Date</th>
                                    <th class="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Customer</th>
                                    <th class="text-center text-xs font-semibold text-slate-500 uppercase px-4 py-3">Items</th>
                                    <th class="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Total</th>
                                    <th class="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Profit</th>
                                    <th class="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Payment</th>
                                    <th class="text-center text-xs font-semibold text-slate-500 uppercase px-4 py-3">Status</th>
                                    <th class="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sortedBills.length ? sortedBills.map(b => {
                                    const status = b.paymentStatus || 'Paid';
                                    const isPaid = status === 'Paid';
                                    return `
                                    <tr class="table-row border-b border-slate-50">
                                        <td class="px-4 py-3 text-sm font-medium text-primary-600">${b.invoiceNo}</td>
                                        <td class="px-4 py-3 text-sm text-slate-600">${formatDateTime(b.createdAt)}</td>
                                        <td class="px-4 py-3">
                                            <p class="text-sm font-medium text-slate-800">${b.customerName}</p>
                                            <p class="text-xs text-slate-400">${b.customerMobile}</p>
                                        </td>
                                        <td class="px-4 py-3 text-center text-sm text-slate-600">${b.items.reduce((s,i)=>s+i.qty,0)}</td>
                                        <td class="px-4 py-3 text-right text-sm font-medium text-slate-800">${formatCurrency(b.grandTotal)}</td>
                                        <td class="px-4 py-3 text-right text-sm text-emerald-600">${formatCurrency(b.profit || 0)}</td>
                                        <td class="px-4 py-3 text-sm text-slate-600">${b.paymentMethod}</td>
                                        <td class="px-4 py-3 text-center">
                                            <span class="badge px-2.5 py-1 rounded-full ${isPaid ? 'bg-emerald-100 text-emerald-700' : (status === 'Advance Only' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')}">
                                                ${status}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 text-right whitespace-nowrap">
                                            <button onclick="showInvoiceById(${b.id})" class="text-primary-600 hover:text-primary-700 text-sm font-medium mr-2">
                                                View
                                            </button>
                                            ${!isPaid ? `
                                            <button onclick="markBillAsPaidFromList(${b.id})" class="text-emerald-600 hover:text-emerald-700 text-sm font-medium" title="Mark as Paid">
                                                <i class="fas fa-check-circle"></i> Paid
                                            </button>` : ''}
                                        </td>
                                    </tr>
                                `}).join('') : '<tr><td colspan="9" class="text-center text-sm text-slate-400 py-12">No sales yet</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function markBillAsPaidFromList(billId) {
            const bill = state.bills.find(b => b.id === billId);
            if (!bill) return;
            if (!confirm(`Mark invoice ${bill.invoiceNo} as Paid?`)) return;
            bill.paymentStatus = 'Paid';
            saveData();
            showToast('Invoice marked as Paid', 'success');
            renderSalesHistory();
        }

        // ==================== SETTINGS ====================
        function renderSettings() {
            const content = document.getElementById('page-content');
            const s = state.settings;
            
            content.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Business Info -->
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <h3 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <i class="fas fa-store text-primary-500"></i> Business Information
                        </h3>
                        <form id="business-form" class="space-y-3" onsubmit="saveBusinessSettings(event)">
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Business Name</label>
                                <input type="text" name="businessName" value="${s.businessName}" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Address</label>
                                <input type="text" name="businessAddress" value="${s.businessAddress}" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                                    <input type="text" name="businessPhone" value="${s.businessPhone}" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-slate-500 mb-1">Email</label>
                                    <input type="email" name="businessEmail" value="${s.businessEmail}" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Website</label>
                                <input type="text" name="businessWebsite" value="${s.businessWebsite || ''}" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Business Description</label>
                                <textarea name="businessDescription" rows="4" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm leading-relaxed">${s.businessDescription || ''}</textarea>
                                <p class="text-[11px] text-slate-400 mt-1">Shown on invoices and about section</p>
                            </div>
                            <button type="submit" class="btn-primary text-white text-sm font-medium px-4 py-2 rounded-lg">Save Changes</button>
                        </form>
                    </div>

                    
                    <!-- Billing Settings -->
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <h3 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <i class="fas fa-file-invoice text-primary-500"></i> Billing Settings
                        </h3>
                        <form id="billing-settings-form" class="space-y-3" onsubmit="saveBillingSettings(event)">
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-medium text-slate-500 mb-1">Invoice Prefix</label>
                                    <input type="text" name="invoicePrefix" value="${s.invoicePrefix}" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-slate-500 mb-1">Currency</label>
                                    <select name="currency" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                                        <option value="LKR" ${s.currency==='LKR'?'selected':''}>LKR</option>
                                        <option value="USD" ${s.currency==='USD'?'selected':''}>USD</option>
                                        <option value="EUR" ${s.currency==='EUR'?'selected':''}>EUR</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Low Stock Threshold</label>
                                <input type="number" name="lowStockThreshold" value="${s.lowStockThreshold}" min="0" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                            </div>
                            <div class="pt-2 border-t border-slate-100">
                                <p class="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                                    <i class="fas fa-qrcode text-primary-500"></i> Invoice QR Code
                                </p>
                                <div class="space-y-2">
                                    <div>
                                        <label class="block text-xs font-medium text-slate-500 mb-1">QR Code Content</label>
                                        <select name="qrCodeType" id="qr-code-type" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" onchange="toggleQrLinkField()">
                                            <option value="location" ${(s.qrCodeType||'location')==='location'?'selected':''}>Shop Location / Address</option>
                                            <option value="link" ${s.qrCodeType==='link'?'selected':''}>Custom Link / URL</option>
                                        </select>
                                    </div>
                                    <div id="qr-link-field" class="${s.qrCodeType==='link'?'':'hidden'}">
                                        <label class="block text-xs font-medium text-slate-500 mb-1">Link / URL for QR</label>
                                        <input type="text" name="qrCodeLink" value="${s.qrCodeLink || ''}" placeholder="https://www.zerodevice.lk" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                                        <p class="text-[10px] text-slate-400 mt-1">This URL will be encoded in the QR code on invoices</p>
                                    </div>
                                    <p class="text-[10px] text-slate-400">When set to Location, the shop address from Business Info is used.</p>
                                </div>
                            </div>
                            <div class="pt-2 border-t border-slate-100">
                                <label class="block text-xs font-medium text-slate-500 mb-1">Thank You Box Message</label>
                                <textarea name="thankYouMessage" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm leading-relaxed">${s.thankYouMessage || ''}</textarea>
                                <p class="text-[11px] text-slate-400 mt-1">Shown in the Thank You box on every invoice</p>
                            </div>
                            <div class="pt-2 border-t border-slate-100">
                                <label class="block text-xs font-medium text-slate-500 mb-1">Terms &amp; Conditions</label>
                                <textarea name="termsAndConditions" rows="4" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm leading-relaxed">${s.termsAndConditions || ''}</textarea>
                                <p class="text-[11px] text-slate-400 mt-1">One term per line. Shown as a bullet list on every invoice.</p>
                            </div>
                            <button type="submit" class="btn-primary text-white text-sm font-medium px-4 py-2 rounded-lg">Save Changes</button>
                        </form>
                    </div>
                    
                    <!-- User Management -->
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-slate-800 flex items-center gap-2">
                                <i class="fas fa-users-cog text-primary-500"></i> User Management
                            </h3>
                            <button onclick="openUserModal()" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                <i class="fas fa-plus mr-1"></i>Add User
                            </button>
                        </div>
                        <div class="space-y-2 max-h-48 overflow-y-auto">
                            ${state.users.map(u => `
                                <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                    <div>
                                        <p class="text-sm font-medium text-slate-800">${u.name || u.username}</p>
                                        <p class="text-xs text-slate-400">@${u.username} · ${u.role}</p>
                                    </div>
                                    ${u.username !== 'admin' ? `
                                        <button onclick="deleteUser(${u.id})" class="text-red-500 hover:text-red-600 text-sm">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    ` : '<span class="text-xs text-slate-400">Protected</span>'}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- My Login Details -->
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <h3 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <i class="fas fa-user-shield text-primary-500"></i> My Login Details
                        </h3>
                        <form id="account-form" class="space-y-3" onsubmit="saveAccountSettings(event)">
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Username</label>
                                <input type="text" name="newUsername" value="${state.currentUser?.username || ''}" required class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">New Password</label>
                                <input type="password" name="newPassword" minlength="4" placeholder="Leave blank to keep current password" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Current Password</label>
                                <input type="password" name="currentPassword" required class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                                <p class="text-[11px] text-slate-400 mt-1">Required to confirm any changes</p>
                            </div>
                            <button type="submit" class="btn-primary text-white text-sm font-medium px-4 py-2 rounded-lg">Update Login Details</button>
                        </form>
                    </div>
                    
                    <!-- Data Management -->
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-card">
                        <h3 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <i class="fas fa-database text-primary-500"></i> Data & Backup
                        </h3>
                        <p class="text-sm text-slate-500 mb-4">
                            Data is stored securely in your browser's local storage. Export a backup regularly for safety.
                        </p>
                        <div class="flex flex-wrap gap-3">
                            <button onclick="exportData()" class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                <i class="fas fa-download"></i> Export Backup
                            </button>
                            <label class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                                <i class="fas fa-upload"></i> Import Backup
                                <input type="file" accept=".json" class="hidden" onchange="if(this.files[0]) importData(this.files[0])">
                            </label>
                        </div>
                        <div class="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
                            <p class="text-xs text-amber-800">
                                <i class="fas fa-info-circle mr-1"></i>
                                Clearing browser data will erase all POS records. Always keep backups.
                            </p>
                        </div>
                    </div>
                    
                    <!-- About -->
                    <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-card lg:col-span-2">
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md flex-shrink-0">
                                <i class="fas fa-laptop text-white text-lg"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-slate-800 mb-1">About Zero Device</h3>
                                <p class="text-sm text-slate-600 leading-relaxed mb-3">${s.businessDescription || 'Zero Device is a premium technology retail store dedicated to providing high-quality laptops, computers, accessories, and modern digital solutions.'}</p>
                                <p class="text-xs text-slate-400">POS System v${APP_VERSION} · Data stored locally on this device</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function saveBusinessSettings(e) {
            e.preventDefault();
            const form = e.target;
            state.settings.businessName = form.businessName.value;
            state.settings.businessAddress = form.businessAddress.value;
            state.settings.businessPhone = form.businessPhone.value;
            state.settings.businessEmail = form.businessEmail.value;
            state.settings.businessWebsite = form.businessWebsite?.value || state.settings.businessWebsite;
            state.settings.businessDescription = form.businessDescription?.value || state.settings.businessDescription;
            saveData();
            showToast('Business settings saved', 'success');
            renderSettings();
        }


        function saveBillingSettings(e) {
            e.preventDefault();
            const form = e.target;
            state.settings.invoicePrefix = form.invoicePrefix.value;
            state.settings.currency = form.currency.value;
            state.settings.lowStockThreshold = parseInt(form.lowStockThreshold.value) || 5;
            state.settings.qrCodeType = form.qrCodeType?.value || 'location';
            state.settings.qrCodeLink = form.qrCodeLink?.value?.trim() || state.settings.qrCodeLink || '';
            state.settings.thankYouMessage = form.thankYouMessage?.value?.trim() || state.settings.thankYouMessage || '';
            state.settings.termsAndConditions = form.termsAndConditions?.value?.trim() || state.settings.termsAndConditions || '';
            saveData();
            showToast('Billing settings saved', 'success');
            renderSettings();
        }

        function saveAccountSettings(e) {
            e.preventDefault();
            const form = e.target;
            const newUsername = form.newUsername.value.trim();
            const newPassword = form.newPassword.value;
            const currentPassword = form.currentPassword.value;

            const user = state.users.find(u => u.id === state.currentUser?.id);
            if (!user) {
                showToast('Could not find your user account', 'error');
                return;
            }
            if (user.password !== currentPassword) {
                showToast('Current password is incorrect', 'error');
                return;
            }
            if (!newUsername) {
                showToast('Username cannot be empty', 'error');
                return;
            }
            if (state.users.find(u => u.username === newUsername && u.id !== user.id)) {
                showToast('That username is already taken', 'error');
                return;
            }
            if (newPassword && newPassword.length < 4) {
                showToast('New password must be at least 4 characters', 'error');
                return;
            }

            user.username = newUsername;
            if (newPassword) user.password = newPassword;

            state.currentUser.username = user.username;
            sessionStorage.setItem('zd_session', JSON.stringify(state.currentUser));
            saveData();
            showToast('Login details updated successfully', 'success');
            renderSettings();
        }

        function toggleQrLinkField() {
            const type = document.getElementById('qr-code-type')?.value;
            const field = document.getElementById('qr-link-field');
            if (field) {
                if (type === 'link') field.classList.remove('hidden');
                else field.classList.add('hidden');
            }
        }

        function openUserModal() {
            openModal(`
                <div class="p-5 border-b border-slate-100">
                    <h3 class="font-semibold text-lg text-slate-800">Add New User</h3>
                </div>
                <form class="p-5 space-y-4" onsubmit="addUser(event)">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input type="text" name="name" required class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input type="text" name="username" required class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input type="password" name="password" required minlength="4" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <select name="role" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="closeModal()" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button type="submit" class="btn-primary text-white text-sm font-medium px-5 py-2 rounded-lg">Add User</button>
                    </div>
                </form>
            `, 'sm');
        }

        function addUser(e) {
            e.preventDefault();
            const form = e.target;
            const username = form.username.value.trim();
            if (state.users.find(u => u.username === username)) {
                showToast('Username already exists', 'error');
                return;
            }
            state.users.push({
                id: Date.now(),
                username,
                password: form.password.value,
                name: form.name.value.trim(),
                role: form.role.value,
                createdAt: new Date().toISOString()
            });
            saveData();
            closeModal();
            showToast('User added successfully', 'success');
            renderSettings();
        }

        function deleteUser(id) {
            if (!confirm('Delete this user?')) return;
            state.users = state.users.filter(u => u.id !== id);
            saveData();
            showToast('User deleted', 'success');
            renderSettings();
        }

        // ==================== START ====================
        document.addEventListener('DOMContentLoaded', initApp);
