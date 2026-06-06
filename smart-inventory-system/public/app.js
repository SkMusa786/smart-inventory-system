// Smart Inventory Management System
// Complete Application Logic

// ==================== STATE ====================
const appState = {
  currentUser: null,
  currentRole: null,
  products: [],
  sales: []
};

// ==================== UTILITIES ====================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
}

function getStatusClass(quantity) {
  if (quantity === 0) return 'out-of-stock';
  if (quantity < 10) return 'low-stock';
  return 'in-stock';
}

function getStatusText(quantity) {
  if (quantity === 0) return 'Out of Stock';
  if (quantity < 10) return 'Low Stock';
  return 'In Stock';
}

function saveToLocalStorage() {
  localStorage.setItem('products', JSON.stringify(appState.products));
  localStorage.setItem('sales', JSON.stringify(appState.sales));
}

function loadFromLocalStorage() {
  const products = localStorage.getItem('products');
  const sales = localStorage.getItem('sales');
  
  if (products) appState.products = JSON.parse(products);
  if (sales) appState.sales = JSON.parse(sales);
}

// ==================== AUTHENTICATION ====================
function handleLogin(e) {
  e.preventDefault()
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  
  let role = null
  
  if (username === 'cashier' && password === 'cashier123') {
    role = 'cashier'
  } else if (username === 'owner' && password === 'owner123') {
    role = 'owner'
  } else {
    showToast('Invalid credentials', 'error')
    return
  }
  
  appState.currentUser = username
  appState.currentRole = role
  
  localStorage.setItem('user', JSON.stringify({
    username: appState.currentUser,
    role: appState.currentRole
  }))
  
  showToast('Login successful!', 'success')
  loadFromLocalStorage()
  showDashboard()
  initializeDashboard()
}
window.handleLogin = handleLogin

function logout() {
  appState.currentUser = null
  appState.currentRole = null
  localStorage.removeItem('user')
  localStorage.removeItem('products')
  localStorage.removeItem('sales')
  showLoginPage()
}
window.logout = logout

function checkAuth() {
  const user = localStorage.getItem('user')
  
  if (user) {
    const userData = JSON.parse(user)
    appState.currentUser = userData.username
    appState.currentRole = userData.role
    loadFromLocalStorage()
    showDashboard()
    initializeDashboard()
  } else {
    showLoginPage()
  }
}
window.checkAuth = checkAuth
  
  appState.currentUser = username;
  appState.currentRole = role;
  
  localStorage.setItem('user', JSON.stringify({
    username: appState.currentUser,
    role: appState.currentRole
  }));
  
  showToast('Login successful!', 'success');
  loadFromLocalStorage();
  showDashboard();
  initializeDashboard();
}

function logout() {
  appState.currentUser = null;
  appState.currentRole = null;
  localStorage.removeItem('user');
  localStorage.removeItem('products');
  localStorage.removeItem('sales');
  showLoginPage();
}

function checkAuth() {
  const user = localStorage.getItem('user');
  
  if (user) {
    const userData = JSON.parse(user);
    appState.currentUser = userData.username;
    appState.currentRole = userData.role;
    loadFromLocalStorage();
    showDashboard();
    initializeDashboard();
  } else {
    showLoginPage();
  }
}

// ==================== UI DISPLAY ====================
function showLoginPage() {
  const loginPage = document.getElementById('login-page');
  const dashboard = document.getElementById('dashboard');
  
  if (loginPage) loginPage.style.display = 'flex';
  if (dashboard) dashboard.style.display = 'none';
  
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

function showDashboard() {
  const loginPage = document.getElementById('login-page');
  const dashboard = document.getElementById('dashboard');
  
  if (loginPage) loginPage.style.display = 'none';
  if (dashboard) dashboard.style.display = 'flex';
}

function initializeDashboard() {
  const userDisplay = document.getElementById('userDisplay');
  const roleDisplay = document.getElementById('roleDisplay');
  
  if (userDisplay) userDisplay.textContent = appState.currentUser || 'User';
  if (roleDisplay) roleDisplay.textContent = appState.currentRole ? `(${appState.currentRole})` : '';
  
  setupNavigation();
  setupModals();
  setupForms();
  renderOverview();
  
  // Hide/show navigation based on role
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (appState.currentRole === 'owner') {
      if (item.dataset.section === 'products' || item.dataset.section === 'sales') {
        item.style.display = 'none';
      }
    }
  });
}

function showSection(sectionName) {
  const sections = document.querySelectorAll('.section')
  sections.forEach(s => s.classList.remove('active'))
  
  const section = document.getElementById(`${sectionName}-section`)
  if (section) section.classList.add('active')
  
  const pageTitle = document.getElementById('pageTitle')
  if (pageTitle) {
    pageTitle.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1)
  }
  
  if (sectionName === 'overview') renderOverview()
  else if (sectionName === 'products') renderProducts()
  else if (sectionName === 'sales') renderSales()
  else if (sectionName === 'analytics') renderAnalytics()
  
  const navItems = document.querySelectorAll('.nav-item')
  navItems.forEach(item => item.classList.remove('active'))
  const activeNav = document.querySelector(`[data-section="${sectionName}"]`)
  if (activeNav) activeNav.classList.add('active')
}
window.showSection = showSection
  
  if (sectionName === 'overview') renderOverview();
  else if (sectionName === 'products') renderProducts();
  else if (sectionName === 'sales') renderSales();
  else if (sectionName === 'analytics') renderAnalytics();
  
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
  if (activeNav) activeNav.classList.add('active');
}

// ==================== PRODUCTS ====================
function addProduct(product) {
  const existingIndex = appState.products.findIndex(p => p.id === product.id)
  
  if (existingIndex !== -1) {
    appState.products[existingIndex] = product
  } else {
    appState.products.push(product)
  }
  
  saveToLocalStorage()
  showToast('Product saved successfully!', 'success')
}
window.addProduct = addProduct

function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    appState.products = appState.products.filter(p => p.id !== productId)
    saveToLocalStorage()
    renderProducts()
    renderOverview()
    showToast('Product deleted', 'success')
  }
}
window.deleteProduct = deleteProduct

function editProduct(productId) {
  const product = appState.products.find(p => p.id === productId)
  if (!product) return
  
  document.getElementById('productId').value = product.id
  document.getElementById('productName').value = product.name
  document.getElementById('productCategory').value = product.category
  document.getElementById('productPrice').value = product.price
  document.getElementById('productQuantity').value = product.quantity
  
  openProductModal()
}
window.editProduct = editProduct

function renderProducts() {
  const tbody = document.getElementById('productsTable')
  if (!tbody) return
  
  if (appState.products.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7" style="text-align: center;">No products</td></tr>'
    return
  }
  
  tbody.innerHTML = appState.products.map(product => `
    <tr>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${parseFloat(product.price).toFixed(2)}</td>
      <td>${product.quantity}</td>
      <td>
        <span class="status-badge ${getStatusClass(product.quantity)}">
          ${getStatusText(product.quantity)}
        </span>
      </td>
      <td>
        <div class="action-btns">
          <button class="btn-sm" onclick="editProduct('${product.id}')">Edit</button>
          <button class="btn-sm danger" onclick="deleteProduct('${product.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('')
}
  
  saveToLocalStorage();
  showToast('Product saved successfully!', 'success');
}

function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    appState.products = appState.products.filter(p => p.id !== productId);
    saveToLocalStorage();
    renderProducts();
    renderOverview();
    showToast('Product deleted', 'success');
  }
}

function editProduct(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;
  
  document.getElementById('productId').value = product.id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productQuantity').value = product.quantity;
  
  openProductModal();
}

function renderProducts() {
  const tbody = document.getElementById('productsTable');
  if (!tbody) return;
  
  if (appState.products.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7" style="text-align: center;">No products</td></tr>';
    return;
  }
  
  tbody.innerHTML = appState.products.map(product => `
    <tr>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${parseFloat(product.price).toFixed(2)}</td>
      <td>${product.quantity}</td>
      <td>
        <span class="status-badge ${getStatusClass(product.quantity)}">
          ${getStatusText(product.quantity)}
        </span>
      </td>
      <td>
        <div class="action-btns">
          <button class="btn-sm" onclick="editProduct('${product.id}')">Edit</button>
          <button class="btn-sm danger" onclick="deleteProduct('${product.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ==================== SALES ====================
function recordSale(productId, quantity) {
  const product = appState.products.find(p => p.id === productId)
  if (!product) {
    showToast('Product not found', 'error')
    return
  }
  
  const qty = parseInt(quantity)
  if (qty > product.quantity) {
    showToast('Insufficient stock', 'error')
    return
  }
  
  const sale = {
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toLocaleDateString(),
    productId: productId,
    productName: product.name,
    quantity: qty,
    price: parseFloat(product.price),
    total: parseFloat(product.price) * qty
  }
  
  appState.sales.push(sale)
  product.quantity -= qty
  
  saveToLocalStorage()
  showToast('Sale recorded successfully!', 'success')
  renderSales()
  renderOverview()
}
window.recordSale = recordSale

function renderSales() {
  const tbody = document.getElementById('salesTable')
  if (!tbody) return
  
  if (appState.sales.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5" style="text-align: center;">No sales</td></tr>'
    return
  }
  
  tbody.innerHTML = appState.sales.map(sale => `
    <tr>
      <td>${sale.date}</td>
      <td>${sale.productName}</td>
      <td>${sale.quantity}</td>
      <td>$${sale.price.toFixed(2)}</td>
      <td>$${sale.total.toFixed(2)}</td>
    </tr>
  `).join('')
}
  
  const qty = parseInt(quantity);
  if (qty > product.quantity) {
    showToast('Insufficient stock', 'error');
    return;
  }
  
  const sale = {
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toLocaleDateString(),
    productId: productId,
    productName: product.name,
    quantity: qty,
    price: parseFloat(product.price),
    total: parseFloat(product.price) * qty
  };
  
  appState.sales.push(sale);
  product.quantity -= qty;
  
  saveToLocalStorage();
  showToast('Sale recorded successfully!', 'success');
  renderSales();
  renderOverview();
}

function renderSales() {
  const tbody = document.getElementById('salesTable');
  if (!tbody) return;
  
  if (appState.sales.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5" style="text-align: center;">No sales</td></tr>';
    return;
  }
  
  tbody.innerHTML = appState.sales.map(sale => `
    <tr>
      <td>${sale.date}</td>
      <td>${sale.productName}</td>
      <td>${sale.quantity}</td>
      <td>$${sale.price.toFixed(2)}</td>
      <td>$${sale.total.toFixed(2)}</td>
    </tr>
  `).join('');
}

// ==================== OVERVIEW ====================
function renderOverview() {
  const totalProducts = appState.products.length;
  const totalStock = appState.products.reduce((sum, p) => sum + parseInt(p.quantity), 0);
  const totalRevenue = appState.sales.reduce((sum, s) => sum + s.total, 0);
  const lowStock = appState.products.filter(p => p.quantity < 10 && p.quantity > 0).length;
  
  const el = (id) => document.getElementById(id);
  if (el('totalProducts')) el('totalProducts').textContent = totalProducts;
  if (el('totalStock')) el('totalStock').textContent = totalStock;
  if (el('totalRevenue')) el('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
  if (el('lowStock')) el('lowStock').textContent = lowStock;
  
  renderProducts();
}

// ==================== ANALYTICS ====================
function renderAnalytics() {
  renderMonthlySalesChart();
  renderTopProducts();
}

function renderMonthlySalesChart() {
  const chartContainer = document.getElementById('chartContainer');
  if (!chartContainer) return;
  
  const monthlySales = {};
  appState.sales.forEach(sale => {
    const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
    monthlySales[month] = (monthlySales[month] || 0) + sale.total;
  });
  
  const months = Object.keys(monthlySales);
  const sales = Object.values(monthlySales);
  
  if (months.length === 0) {
    chartContainer.innerHTML = '<p style="text-align: center; padding: 20px;">No sales data available</p>';
    return;
  }
  
  let maxSale = Math.max(...sales);
  let html = '<div class="analytics-chart"><h3>Monthly Sales</h3>';
  html += '<div style="display: flex; align-items: flex-end; gap: 10px; height: 200px; padding: 20px;">';
  
  months.forEach((month, i) => {
    const height = (sales[i] / maxSale) * 150;
    html += `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="background: #3b82f6; width: 30px; height: ${height}px; border-radius: 4px;"></div>
        <small style="margin-top: 5px;">${month}</small>
        <small style="font-size: 10px;">$${sales[i].toFixed(0)}</small>
      </div>
    `;
  });
  
  html += '</div></div>';
  chartContainer.innerHTML = html;
}

function renderTopProducts() {
  const topProductsContainer = document.getElementById('topProducts');
  if (!topProductsContainer) return;
  
  if (appState.sales.length === 0) {
    topProductsContainer.innerHTML = '<p>No sales data</p>';
    return;
  }
  
  const productStats = {};
  appState.sales.forEach(sale => {
    if (!productStats[sale.productId]) {
      productStats[sale.productId] = { name: sale.productName, qty: 0, revenue: 0 };
    }
    productStats[sale.productId].qty += sale.quantity;
    productStats[sale.productId].revenue += sale.total;
  });
  
  const sorted = Object.values(productStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  
  topProductsContainer.innerHTML = sorted.map(p => `
    <div class="top-product-item">
      <span>${p.name}</span>
      <span>Qty: ${p.qty} • Revenue: $${p.revenue.toFixed(2)}</span>
    </div>
  `).join('');
}

// ==================== MODALS ====================
function openProductModal() {
  const modal = document.getElementById('productModal')
  if (modal) modal.style.display = 'flex'
}
window.openProductModal = openProductModal

function closeProductModal() {
  const modal = document.getElementById('productModal')
  if (modal) modal.style.display = 'none'
  document.getElementById('productForm').reset()
}
window.closeProductModal = closeProductModal

function openSaleModal() {
  const modal = document.getElementById('saleModal')
  if (modal) {
    modal.style.display = 'flex'
    const select = document.getElementById('saleProduct')
    if (select) {
      select.innerHTML = appState.products
        .filter(p => p.quantity > 0)
        .map(p => `<option value="${p.id}">${p.name} (${p.quantity} available)</option>`)
        .join('')
    }
  }
}
window.openSaleModal = openSaleModal

function closeSaleModal() {
  const modal = document.getElementById('saleModal')
  if (modal) modal.style.display = 'none'
  document.getElementById('saleForm').reset()
}
window.closeSaleModal = closeSaleModal

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.style.display = 'none';
  document.getElementById('productForm').reset();
}

function openSaleModal() {
  const modal = document.getElementById('saleModal');
  if (modal) {
    modal.style.display = 'flex';
    const select = document.getElementById('saleProduct');
    if (select) {
      select.innerHTML = appState.products
        .filter(p => p.quantity > 0)
        .map(p => `<option value="${p.id}">${p.name} (${p.quantity} available)</option>`)
        .join('');
    }
  }
}

function closeSaleModal() {
  const modal = document.getElementById('saleModal');
  if (modal) modal.style.display = 'none';
  document.getElementById('saleForm').reset();
}

// ==================== NAVIGATION ====================
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;
      if (section) showSection(section);
    });
  });
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

function setupForms() {
  const productForm = document.getElementById('productForm');
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addProduct({
        id: document.getElementById('productId').value,
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        quantity: parseInt(document.getElementById('productQuantity').value)
      });
      closeProductModal();
      renderProducts();
      renderOverview();
    });
  }
  
  const saleForm = document.getElementById('saleForm');
  if (saleForm) {
    saleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      recordSale(
        document.getElementById('saleProduct').value,
        parseInt(document.getElementById('saleQuantity').value)
      );
      closeSaleModal();
      renderSales();
    });
  }
}

function setupModals() {
  const addProductBtn = document.getElementById('addProductBtn');
  if (addProductBtn) addProductBtn.addEventListener('click', openProductModal);
  
  const newProductBtn = document.getElementById('newProductBtn');
  if (newProductBtn) newProductBtn.addEventListener('click', openProductModal);
  
  const newSaleBtn = document.getElementById('newSaleBtn');
  if (newSaleBtn) newSaleBtn.addEventListener('click', openSaleModal);
  
  document.querySelectorAll('.btn-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = btn.closest('.modal');
      if (modal?.id === 'productModal') closeProductModal();
      if (modal?.id === 'saleModal') closeSaleModal();
    });
  });
  
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (modal.id === 'productModal') closeProductModal();
        if (modal.id === 'saleModal') closeSaleModal();
      }
    });
  });
  
  const searchInput = document.getElementById('searchProducts');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = appState.products.filter(p =>
        p.id.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
      
      const tbody = document.getElementById('productsTable');
      if (filtered.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="7" style="text-align: center;">No products found</td></tr>';
        return;
      }
      
      tbody.innerHTML = filtered.map(product => `
        <tr>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>$${parseFloat(product.price).toFixed(2)}</td>
          <td>${product.quantity}</td>
          <td>
            <span class="status-badge ${getStatusClass(product.quantity)}">
              ${getStatusText(product.quantity)}
            </span>
          </td>
          <td>
            <div class="action-btns">
              <button class="btn-sm" onclick="editProduct('${product.id}')">Edit</button>
              <button class="btn-sm danger" onclick="deleteProduct('${product.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');
    });
  }
}

// ==================== INITIALIZATION ====================
if (typeof document !== 'undefined') {
  // Try immediate run
  setTimeout(() => {
    const loginForm = document.getElementById('loginForm')
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin)
      console.log('[v0] Login form event listener attached')
    } else {
      console.log('[v0] loginForm not found yet')
    }
    
    // Check for existing user
    setTimeout(() => {
      checkAuth()
      console.log('[v0] checkAuth called')
    }, 100)
  }, 100)
  
  // Also listen for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const loginForm = document.getElementById('loginForm')
      if (loginForm) {
        loginForm.addEventListener('submit', handleLogin)
        console.log('[v0] Login form attached on DOMContentLoaded')
      }
      checkAuth()
    })
  } else {
    // DOM is already ready
    const loginForm = document.getElementById('loginForm')
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin)
      console.log('[v0] Login form attached on page load')
    }
    checkAuth()
  }
}

    
    setTimeout(() => {
      checkAuth();
    }, 100);
  });
}


// =============== DATA MANAGEMENT ===============

function loadData() {
    const products = localStorage.getItem('products');
    const sales = localStorage.getItem('sales');
    
    appState.products = products ? JSON.parse(products) : [];
    appState.sales = sales ? JSON.parse(sales) : [];
}

function saveData() {
    localStorage.setItem('products', JSON.stringify(appState.products));
    localStorage.setItem('sales', JSON.stringify(appState.sales));
}

function addProduct(productData) {
    const newProduct = {
        id: productData.id,
        name: productData.name,
        category: productData.category,
        price: parseFloat(productData.price),
        quantity: parseInt(productData.quantity),
        createdAt: new Date().toISOString(),
    };

    if (appState.currentEditingProduct) {
        const index = appState.products.findIndex(p => p.id === appState.currentEditingProduct.id);
        if (index !== -1) {
            appState.products[index] = { ...appState.products[index], ...newProduct };
        }
        appState.currentEditingProduct = null;
    } else {
        appState.products.push(newProduct);
    }

    saveData();
    showToast('Product saved successfully', 'success');
}

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    appState.products = appState.products.filter(p => p.id !== productId);
    saveData();
    showToast('Product deleted successfully', 'success');
    renderProducts();
}

function recordSale(productId, quantity) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }

    if (product.quantity < quantity) {
        showToast('Insufficient stock', 'error');
        return;
    }

    const sale = {
        id: 'SAL' + Date.now(),
        productId: productId,
        productName: product.name,
        quantity: parseInt(quantity),
        price: product.price,
        total: product.price * quantity,
        date: new Date().toISOString(),
    };

    product.quantity -= quantity;
    appState.sales.push(sale);
    saveData();
    
    showToast('Sale recorded successfully', 'success');
    renderSales();
    updateStats();
}

// =============== STATISTICS ===============

function getStats() {
    const stats = {
        totalProducts: appState.products.length,
        totalStock: appState.products.reduce((sum, p) => sum + p.quantity, 0),
        totalRevenue: appState.sales.reduce((sum, s) => sum + s.total, 0),
        lowStock: appState.products.filter(p => p.quantity > 0 && p.quantity < 10).length,
        outOfStock: appState.products.filter(p => p.quantity === 0).length,
    };
    return stats;
}

function updateStats() {
    const stats = getStats();
    document.getElementById('totalProducts').textContent = stats.totalProducts;
    document.getElementById('totalStock').textContent = stats.totalStock;
    document.getElementById('totalRevenue').textContent = '$' + stats.totalRevenue.toFixed(2);
    document.getElementById('lowStock').textContent = stats.lowStock + stats.outOfStock;
}

// =============== RENDERING ===============

function renderOverview() {
    updateStats();
    
    const tbody = document.getElementById('overviewProductsTable');
    if (appState.products.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="6" class="text-center">No products yet</td></tr>';
        return;
    }

    tbody.innerHTML = appState.products.slice(0, 5).map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>
                <span class="status-badge ${getStatusClass(product.quantity)}">
                    ${getStatusText(product.quantity)}
                </span>
            </td>
        </tr>
    `).join('');
}

function renderProducts() {
    const tbody = document.getElementById('productsTable');
    if (appState.products.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="7" class="text-center">No products found</td></tr>';
        return;
    }

    tbody.innerHTML = appState.products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>
                <span class="status-badge ${getStatusClass(product.quantity)}">
                    ${getStatusText(product.quantity)}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn-sm" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn-sm danger" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderSales() {
    const tbody = document.getElementById('salesTable');
    if (appState.sales.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="5" class="text-center">No sales recorded</td></tr>';
        return;
    }

    tbody.innerHTML = appState.sales.slice().reverse().map(sale => `
        <tr>
            <td>${new Date(sale.date).toLocaleDateString()}</td>
            <td>${sale.productName}</td>
            <td>${sale.quantity}</td>
            <td>$${sale.price.toFixed(2)}</td>
            <td>$${sale.total.toFixed(2)}</td>
        </tr>
    `).join('');
}

function renderAnalytics() {
    renderTopProducts();
    renderChart();
}

function renderTopProducts() {
    const container = document.getElementById('topProducts');
    const salesByProduct = {};

    appState.sales.forEach(sale => {
        if (!salesByProduct[sale.productName]) {
            salesByProduct[sale.productName] = { qty: 0, revenue: 0 };
        }
        salesByProduct[sale.productName].qty += sale.quantity;
        salesByProduct[sale.productName].revenue += sale.total;
    });

    const topProducts = Object.entries(salesByProduct)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 5);

    if (topProducts.length === 0) {
        container.innerHTML = '<p class="empty-message">No sales data yet</p>';
        return;
    }

    container.innerHTML = topProducts.map(([name, data]) => `
        <div class="product-item">
            <div class="product-item-name">${name}</div>
            <div class="product-item-stat">
                <span>Qty: ${data.qty}</span> • 
                <span>Revenue: $${data.revenue.toFixed(2)}</span>
            </div>
        </div>
    `).join('');
}

function renderChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    const monthlySales = {};
    appState.sales.forEach(sale => {
        const month = new Date(sale.date).toLocaleDateString('en-US', { month: 'short' });
        monthlySales[month] = (monthlySales[month] || 0) + sale.total;
    });

    const months = Object.keys(monthlySales);
    const sales = Object.values(monthlySales);

    if (window.salesChartInstance) {
        window.salesChartInstance.destroy();
    }

    window.salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Sales Revenue',
                data: sales,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#3b82f6',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#b0b3b8',
                        callback: (value) => '$' + value.toFixed(0),
                    },
                    grid: {
                        color: 'rgba(63, 71, 87, 0.3)',
                    }
                },
                x: {
                    ticks: {
                        color: '#b0b3b8',
                    },
                    grid: {
                        display: false,
                    }
                }
            }
        }
    });
}

// =============== MODALS ===============

function openProductModal(product = null) {
    appState.currentEditingProduct = product;
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('modalTitle');

    if (product) {
        title.textContent = 'Edit Product';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productId').disabled = true;
    } else {
        title.textContent = 'Add Product';
        form.reset();
        document.getElementById('productId').disabled = false;
    }

    modal.style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    appState.currentEditingProduct = null;
}

function openSaleModal() {
    const modal = document.getElementById('saleModal');
    const select = document.getElementById('saleProduct');
    
    select.innerHTML = '<option value="">Select a product...</option>' +
        appState.products.filter(p => p.quantity > 0).map(p => 
            `<option value="${p.id}">${p.name} (Stock: ${p.quantity})</option>`
        ).join('');
    
    document.getElementById('saleForm').reset();
    modal.style.display = 'flex';
}

function closeSaleModal() {
    document.getElementById('saleModal').style.display = 'none';
}

// =============== EDIT PRODUCT ===============

function editProduct(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (product) {
        openProductModal(product);
    }
}

// =============== SEARCH ===============

function setupSearch() {
    const searchInput = document.getElementById('searchProducts');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredProducts = appState.products.filter(p =>
            p.id.toLowerCase().includes(query) ||
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );

        const tbody = document.getElementById('productsTable');
        if (filteredProducts.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="7" class="text-center">No products found</td></tr>';
            return;
        }

        tbody.innerHTML = filteredProducts.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td>
                    <span class="status-badge ${getStatusClass(product.quantity)}">
                        ${getStatusText(product.quantity)}
                    </span>
                </td>
                <td>
                    <div class="action-btns">
                        <button class="btn-sm" onclick="editProduct('${product.id}')">Edit</button>
                        <button class="btn-sm danger" onclick="deleteProduct('${product.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    });
}

// =============== UTILITIES ===============

function getStatusClass(quantity) {
    if (quantity === 0) return 'status-out';
    if (quantity < 10) return 'status-low';
    return 'status-in-stock';
}

function getStatusText(quantity) {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 10) return 'Low Stock';
    return 'In Stock';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// =============== INITIALIZATION ===============

function initializeDashboard() {
    // Update user display
    const userDisplay = document.getElementById('userDisplay');
    const roleDisplay = document.getElementById('roleDisplay');
    if (userDisplay) userDisplay.textContent = appState.currentUser;
    if (roleDisplay) roleDisplay.textContent = appState.currentRole.charAt(0).toUpperCase() + appState.currentRole.slice(1);

    // Show/hide role-specific features
    const productsBtn = document.getElementById('productsBtn');
    const salesBtn = document.getElementById('salesBtn');
    const addProductBtn = document.getElementById('addProductBtn');
    const newProductBtn = document.getElementById('newProductBtn');
    const newSaleBtn = document.getElementById('newSaleBtn');

    if (appState.currentRole === 'cashier') {
        if (productsBtn) productsBtn.style.display = 'flex';
        if (salesBtn) salesBtn.style.display = 'flex';
        if (addProductBtn) addProductBtn.style.display = 'inline-block';
        if (newProductBtn) newProductBtn.style.display = 'inline-block';
        if (newSaleBtn) newSaleBtn.style.display = 'inline-block';
    }

    // Navigation
    setupNavigation();
    setupSearch();
    setupForms();
    setupModals();

    // Initial render
    showSection('overview');
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            showSection(item.dataset.section);
        });
    });
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => s.classList.remove('active'));
    
    const section = document.getElementById(sectionName);
    if (section) {
        section.classList.add('active');
        document.getElementById('sectionTitle').textContent = 
            sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
    }

    // Render section content
    if (sectionName === 'overview') renderOverview();
    if (sectionName === 'products') renderProducts();
    if (sectionName === 'sales') renderSales();
    if (sectionName === 'analytics') renderAnalytics();
}

function setupForms() {
    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addProduct({
                id: document.getElementById('productId').value,
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                price: document.getElementById('productPrice').value,
                quantity: document.getElementById('productQuantity').value,
            });
            closeProductModal();
            renderProducts();
            renderOverview();
        });
    }

    // Sale form
    const saleForm = document.getElementById('saleForm');
    if (saleForm) {
        saleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            recordSale(
                document.getElementById('saleProduct').value,
                document.getElementById('saleQuantity').value
            );
            closeSaleModal();
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function setupModals() {
    // Add Product buttons
    const addProductBtn = document.getElementById('addProductBtn');
    const newProductBtn = document.getElementById('newProductBtn');
    if (addProductBtn) addProductBtn.addEventListener('click', () => openProductModal());
    if (newProductBtn) newProductBtn.addEventListener('click', () => openProductModal());

    // New Sale button
    const newSaleBtn = document.getElementById('newSaleBtn');
    if (newSaleBtn) newSaleBtn.addEventListener('click', openSaleModal);

    // Modal close buttons
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = btn.closest('.modal');
            if (modal.id === 'productModal') closeProductModal();
            if (modal.id === 'saleModal') closeSaleModal();
        });
    });

    // Modal backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modal.id === 'productModal') closeProductModal();
                if (modal.id === 'saleModal') closeSaleModal();
            }
        });
    });
}

// =============== LOGIN PAGE ===============

if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// =============== CHECK AUTHENTICATION ===============

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Ensure modals and buttons are ready after DOM loads
    setTimeout(() => {
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                addProduct({
                    id: document.getElementById('productId').value,
                    name: document.getElementById('productName').value,
                    category: document.getElementById('productCategory').value,
                    price: document.getElementById('productPrice').value,
                    quantity: document.getElementById('productQuantity').value,
                });
                closeProductModal();
                renderProducts();
                renderOverview();
            });
        }

        const saleForm = document.getElementById('saleForm');
        if (saleForm) {
            saleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                recordSale(
                    document.getElementById('saleProduct').value,
                    document.getElementById('saleQuantity').value
                );
                closeSaleModal();
            });
        }

        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) addProductBtn.addEventListener('click', () => openProductModal());
        
        const newProductBtn = document.getElementById('newProductBtn');
        if (newProductBtn) newProductBtn.addEventListener('click', () => openProductModal());

        const newSaleBtn = document.getElementById('newSaleBtn');
        if (newSaleBtn) newSaleBtn.addEventListener('click', openSaleModal);

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);

        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                showSection(item.dataset.section);
            });
        });

        // Search
        const searchInput = document.getElementById('searchProducts');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = appState.products.filter(p =>
                    p.id.toLowerCase().includes(query) ||
                    p.name.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query)
                );
                
                const tbody = document.getElementById('productsTable');
                if (filtered.length === 0) {
                    tbody.innerHTML = '<tr class="empty-row"><td colspan="7" class="text-center">No products found</td></tr>';
                    return;
                }

                tbody.innerHTML = filtered.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>$${product.price.toFixed(2)}</td>
                        <td>${product.quantity}</td>
                        <td>
                            <span class="status-badge ${getStatusClass(product.quantity)}">
                                ${getStatusText(product.quantity)}
                            </span>
                        </td>
                        <td>
                            <div class="action-btns">
                                <button class="btn-sm" onclick="editProduct('${product.id}')">Edit</button>
                                <button class="btn-sm danger" onclick="deleteProduct('${product.id}')">Delete</button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            });
        }

        // Modal close buttons
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = btn.closest('.modal');
                if (modal.id === 'productModal') closeProductModal();
                if (modal.id === 'saleModal') closeSaleModal();
            });
        });

        // Modal backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if (modal.id === 'productModal') closeProductModal();
                    if (modal.id === 'saleModal') closeSaleModal();
                }
            });
        });
    }, 100);
});
