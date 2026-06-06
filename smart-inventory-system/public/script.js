/* ==================== AUTHENTICATION ==================== */

// Hardcoded credentials
const USERS = {
    cashier: {
        password: 'cashier123',
        role: 'Cashier'
    },
    owner: {
        password: 'owner123',
        role: 'Owner'
    }
};

// Check if user is on login page
if (document.querySelector('.login-page')) {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validate credentials
        if (USERS[username] && USERS[username].password === password) {
            // Store user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                username: username,
                role: USERS[username].role
            }));

            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            loginError.textContent = '❌ Invalid username or password!';
            loginError.style.display = 'block';
            setTimeout(() => {
                loginError.style.display = 'none';
            }, 3000);
        }
    });
}

// Check authentication on dashboard
if (document.querySelector('.dashboard-page')) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'index.html';
    }

    // ==================== DASHBOARD INITIALIZATION ==================== */

    const userRole = currentUser.role;
    const isCashier = userRole === 'Cashier';
    const isOwner = userRole === 'Owner';

    // Set user info
    document.getElementById('userRole').textContent = userRole;
    document.getElementById('userName').textContent = `👤 ${currentUser.username} (${userRole})`;

    // Show/hide sections based on role
    if (isCashier) {
        document.getElementById('productsLink').style.display = 'flex';
        document.getElementById('salesLink').style.display = 'flex';
    }

    // ==================== DATA MANAGEMENT ==================== */

    class InventoryManager {
        constructor() {
            this.products = this.loadProducts();
            this.sales = this.loadSales();
        }

        loadProducts() {
            const data = localStorage.getItem('products');
            return data ? JSON.parse(data) : [];
        }

        saveProducts() {
            localStorage.setItem('products', JSON.stringify(this.products));
        }

        loadSales() {
            const data = localStorage.getItem('sales');
            return data ? JSON.parse(data) : [];
        }

        saveSales() {
            localStorage.setItem('sales', JSON.stringify(this.sales));
        }

        addProduct(product) {
            const existingProduct = this.products.find(p => p.id === product.id);
            if (existingProduct) {
                return false; // Product ID already exists
            }
            this.products.push(product);
            this.saveProducts();
            return true;
        }

        updateProduct(productId, updatedData) {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                Object.assign(product, updatedData);
                this.saveProducts();
                return true;
            }
            return false;
        }

        deleteProduct(productId) {
            const index = this.products.findIndex(p => p.id === productId);
            if (index !== -1) {
                this.products.splice(index, 1);
                this.saveProducts();
                return true;
            }
            return false;
        }

        getProductById(productId) {
            return this.products.find(p => p.id === productId);
        }

        searchProducts(query) {
            return this.products.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        recordSale(productId, quantity, amount) {
            const product = this.getProductById(productId);
            if (!product || product.quantity < quantity) {
                return false; // Insufficient stock
            }

            // Reduce stock
            product.quantity -= quantity;
            this.saveProducts();

            // Record sale
            const sale = {
                id: Date.now(),
                productId: productId,
                productName: product.name,
                quantity: quantity,
                amount: amount,
                date: new Date().toLocaleString()
            };

            this.sales.push(sale);
            this.saveSales();
            return true;
        }

        getLowStockProducts(threshold = 10) {
            return this.products.filter(p => p.quantity < threshold && p.quantity > 0);
        }

        getOutOfStockProducts() {
            return this.products.filter(p => p.quantity === 0);
        }

        getTotalSales() {
            return this.sales.reduce((sum, sale) => sum + sale.amount, 0);
        }

        getTopSellingProduct() {
            if (this.sales.length === 0) return null;

            const salesByProduct = {};
            this.sales.forEach(sale => {
                salesByProduct[sale.productId] = (salesByProduct[sale.productId] || 0) + sale.quantity;
            });

            const topProductId = Object.keys(salesByProduct).reduce((a, b) =>
                salesByProduct[a] > salesByProduct[b] ? a : b
            );

            return {
                product: this.getProductById(topProductId),
                totalSold: salesByProduct[topProductId]
            };
        }

        getMonthlySales() {
            const monthlySales = {};
            this.sales.forEach(sale => {
                const date = new Date(sale.date);
                const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                monthlySales[monthKey] = (monthlySales[monthKey] || 0) + sale.amount;
            });

            return monthlySales;
        }
    }

    const inventory = new InventoryManager();

    // ==================== UI UTILITIES ==================== */

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function getStockStatus(quantity) {
        if (quantity === 0) return { badge: 'Out of Stock', class: 'status-out-of-stock' };
        if (quantity < 10) return { badge: 'Low Stock', class: 'status-low-stock' };
        return { badge: 'In Stock', class: 'status-in-stock' };
    }

    function showConfirm(message) {
        return confirm(message);
    }

    // ==================== NAVIGATION ==================== */

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update active section
            const sections = document.querySelectorAll('.section');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(section).classList.add('active');

            // Update page title
            const titles = {
                overview: 'Overview',
                products: 'Manage Products',
                sales: 'Record Sales',
                analytics: 'Sales Analytics'
            };
            document.getElementById('pageTitle').textContent = titles[section] || 'Overview';

            // Initialize chart if analytics section
            if (section === 'analytics') {
                initializeChart();
            }
        });
    });

    // ==================== DASHBOARD OVERVIEW ==================== */

    function updateDashboard() {
        const lowStockProducts = inventory.getLowStockProducts();
        const lowStockCount = lowStockProducts.length;

        // Update cards
        document.getElementById('totalProducts').textContent = inventory.products.length;
        document.getElementById('totalStock').textContent = inventory.products.reduce((sum, p) => sum + p.quantity, 0);
        document.getElementById('totalSales').textContent = '$' + inventory.getTotalSales().toFixed(2);
        document.getElementById('lowStockBadge').textContent = lowStockCount;

        // Update top selling product
        const topProduct = inventory.getTopSellingProduct();
        const topProductCard = document.getElementById('topProduct');
        if (topProduct) {
            topProductCard.innerHTML = `
                <strong>${topProduct.product.name}</strong><br>
                <span style="color: #64748b; font-size: 13px;">Sold: ${topProduct.totalSold} units</span>
            `;
        }

        // Update low stock table
        const lowStockTable = document.getElementById('lowStockTable');
        if (lowStockProducts.length > 0) {
            lowStockTable.innerHTML = lowStockProducts.map(product => `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.quantity}</td>
                    <td>
                        <span class="status-badge status-low-stock">⚠️ Low Stock</span>
                    </td>
                </tr>
            `).join('');
        } else {
            lowStockTable.innerHTML = '<tr><td colspan="4" class="text-center">All products in good stock</td></tr>';
        }
    }

    // ==================== PRODUCTS MANAGEMENT (CASHIER) ==================== */

    const productModal = document.getElementById('productModal');
    const productForm = document.getElementById('productForm');
    const addProductBtn = document.getElementById('addProductBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalCancel = document.getElementById('modalCancel');
    const modalClose = document.querySelector('.modal-close');

    let editingProductId = null;

    function openProductModal(productId = null) {
        editingProductId = productId;

        if (productId) {
            const product = inventory.getProductById(productId);
            modalTitle.textContent = 'Edit Product';
            document.getElementById('productId').value = product.id;
            document.getElementById('productId').disabled = true;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productQuantity').value = product.quantity;
        } else {
            modalTitle.textContent = 'Add New Product';
            document.getElementById('productId').disabled = false;
            productForm.reset();
        }

        productModal.classList.add('active');
    }

    function closeProductModal() {
        productModal.classList.remove('active');
        productForm.reset();
        editingProductId = null;
    }

    addProductBtn.addEventListener('click', () => openProductModal());
    modalCancel.addEventListener('click', closeProductModal);
    modalClose.addEventListener('click', closeProductModal);

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const productData = {
            id: document.getElementById('productId').value,
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            quantity: parseInt(document.getElementById('productQuantity').value)
        };

        if (editingProductId) {
            if (inventory.updateProduct(editingProductId, productData)) {
                showToast('✅ Product updated successfully!');
            }
        } else {
            if (inventory.addProduct(productData)) {
                showToast('✅ Product added successfully!');
            } else {
                showToast('❌ Product ID already exists!', 'error');
                return;
            }
        }

        closeProductModal();
        renderProducts();
        updateDashboard();
        updateSalesForm();
    });

    function renderProducts(products = null) {
        const productsToShow = products || inventory.products;
        const productsTable = document.getElementById('productsTable');

        if (productsToShow.length === 0) {
            productsTable.innerHTML = '<tr><td colspan="7" class="text-center">No products found</td></tr>';
            return;
        }

        productsTable.innerHTML = productsToShow.map(product => {
            const status = getStockStatus(product.quantity);
            return `
                <tr>
                    <td><strong>${product.id}</strong></td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.quantity}</td>
                    <td>
                        <span class="status-badge ${status.class}">${status.badge}</span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-primary btn-small" onclick="editProduct('${product.id}')">✏️</button>
                            <button class="btn btn-danger btn-small" onclick="deleteProductConfirm('${product.id}')">🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.editProduct = function(productId) {
        openProductModal(productId);
    };

    window.deleteProductConfirm = function(productId) {
        if (showConfirm('Are you sure you want to delete this product?')) {
            if (inventory.deleteProduct(productId)) {
                showToast('✅ Product deleted successfully!');
                renderProducts();
                updateDashboard();
                updateSalesForm();
            }
        }
    };

    // Search products
    const searchProduct = document.getElementById('searchProduct');
    searchProduct.addEventListener('input', (e) => {
        const query = e.target.value;
        const results = inventory.searchProducts(query);
        renderProducts(results);
    });

    // ==================== SALES MANAGEMENT (CASHIER) ==================== */

    const salesForm = document.getElementById('salesForm');
    const saleProductId = document.getElementById('saleProductId');
    const saleQuantity = document.getElementById('saleQuantity');
    const salePrice = document.getElementById('salePrice');

    function updateSalesForm() {
        saleProductId.innerHTML = '<option value="">Select a product</option>' +
            inventory.products.map(product => `
                <option value="${product.id}" data-price="${product.price}">
                    ${product.name} (Stock: ${product.quantity})
                </option>
            `).join('');
    }

    saleProductId.addEventListener('change', () => {
        const selectedOption = saleProductId.options[saleProductId.selectedIndex];
        salePrice.value = selectedOption.dataset.price || '0.00';
    });

    saleQuantity.addEventListener('change', () => {
        const selectedOption = saleProductId.options[saleProductId.selectedIndex];
        const price = parseFloat(selectedOption.dataset.price || 0);
        salePrice.value = (price * saleQuantity.value).toFixed(2);
    });

    salesForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const productId = saleProductId.value;
        const quantity = parseInt(saleQuantity.value);
        const amount = parseFloat(salePrice.value);

        if (!productId || quantity <= 0) {
            showToast('❌ Please select a valid product and quantity', 'error');
            return;
        }

        const product = inventory.getProductById(productId);
        if (!product) {
            showToast('❌ Product not found', 'error');
            return;
        }

        if (product.quantity < quantity) {
            showToast(`❌ Insufficient stock! Available: ${product.quantity}`, 'error');
            return;
        }

        if (inventory.recordSale(productId, quantity, amount)) {
            showToast('✅ Sale recorded successfully!');
            salesForm.reset();
            renderSales();
            updateDashboard();
            updateSalesForm();
        } else {
            showToast('❌ Error recording sale', 'error');
        }
    });

    function renderSales() {
        const salesTable = document.getElementById('salesTable');

        if (inventory.sales.length === 0) {
            salesTable.innerHTML = '<tr><td colspan="4" class="text-center">No sales recorded</td></tr>';
            return;
        }

        // Show last 10 sales
        const recentSales = inventory.sales.slice(-10).reverse();
        salesTable.innerHTML = recentSales.map(sale => `
            <tr>
                <td>${sale.date}</td>
                <td>${sale.productName}</td>
                <td>${sale.quantity}</td>
                <td>$${sale.amount.toFixed(2)}</td>
            </tr>
        `).join('');
    }

    // ==================== ANALYTICS ==================== */

    let salesChart = null;

    function initializeChart() {
        const monthlySales = inventory.getMonthlySales();
        const months = Object.keys(monthlySales);
        const amounts = Object.values(monthlySales);

        const ctx = document.getElementById('salesChart');
        if (ctx) {
            // Destroy existing chart if it exists
            if (salesChart) {
                salesChart.destroy();
            }

            salesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months.length > 0 ? months : ['No Data'],
                    datasets: [{
                        label: 'Monthly Sales ($)',
                        data: amounts.length > 0 ? amounts : [0],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                font: { size: 12 },
                                color: '#64748b'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // ==================== LOGOUT ==================== */

    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (showConfirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    });

    // ==================== INITIAL LOAD ==================== */

    updateDashboard();
    renderProducts();
    renderSales();
    updateSalesForm();
}
