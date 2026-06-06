'use client'

import { useEffect, useState, useRef } from 'react'

export default function Page() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [currentSection, setCurrentSection] = useState('overview')
  const [showProductModal, setShowProductModal] = useState(false)
  const [showSaleModal, setShowSaleModal] = useState(false)
  const formRef = useRef(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedProducts = localStorage.getItem('products')
    const savedSales = localStorage.getItem('sales')
    
    if (savedUser) setUser(JSON.parse(savedUser))
    if (savedProducts) setProducts(JSON.parse(savedProducts))
    if (savedSales) setSales(JSON.parse(savedSales))
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const username = formData.get('username')
    const password = formData.get('password')

    if ((username === 'cashier' && password === 'cashier123') || 
        (username === 'owner' && password === 'owner123')) {
      const userData = { username, role: username === 'cashier' ? 'cashier' : 'owner' }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      alert('Invalid credentials')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('products')
    localStorage.removeItem('sales')
    setProducts([])
    setSales([])
  }

  const addProduct = (formData) => {
    const newProduct = {
      id: formData.get('productId'),
      name: formData.get('productName'),
      category: formData.get('productCategory'),
      price: parseFloat(formData.get('productPrice')),
      quantity: parseInt(formData.get('productQuantity'))
    }
    
    const updated = [...products]
    const idx = updated.findIndex(p => p.id === newProduct.id)
    if (idx >= 0) updated[idx] = newProduct
    else updated.push(newProduct)
    
    setProducts(updated)
    localStorage.setItem('products', JSON.stringify(updated))
    setShowProductModal(false)
  }

  const deleteProduct = (id) => {
    if (!confirm('Delete this product?')) return
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    localStorage.setItem('products', JSON.stringify(updated))
  }

  const recordSale = (formData) => {
    const productId = formData.get('saleProduct')
    const quantity = parseInt(formData.get('saleQuantity'))
    
    const product = products.find(p => p.id === productId)
    if (!product || quantity > product.quantity) {
      alert('Invalid sale')
      return
    }

    const newSale = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      productName: product.name,
      quantity,
      price: product.price,
      total: product.price * quantity
    }
    
    const updatedProducts = products.map(p => 
      p.id === productId ? {...p, quantity: p.quantity - quantity} : p
    )
    const updatedSales = [...sales, newSale]
    
    setProducts(updatedProducts)
    setSales(updatedSales)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    localStorage.setItem('sales', JSON.stringify(updatedSales))
    setShowSaleModal(false)
  }

  const stats = {
    totalProducts: products.length,
    totalStock: products.reduce((sum, p) => sum + p.quantity, 0),
    totalRevenue: sales.reduce((sum, s) => sum + s.total, 0),
    lowStock: products.filter(p => p.quantity < 10 && p.quantity > 0).length
  }

  if (!user) {
    return (
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{background: '#1a1f2e', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)', border: '1px solid #252d3d'}}>
          <h1 style={{fontSize: '28px', fontWeight: 700, color: '#3b82f6', marginBottom: '8px', textAlign: 'center'}}>Smart Inventory</h1>
          <p style={{fontSize: '14px', color: '#9ca3af', textAlign: 'center', marginBottom: '30px'}}>Professional Inventory Management</p>
          
          <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px'}}>
            <div>
              <label style={{fontSize: '14px', fontWeight: 500, color: '#d1d5db', display: 'block', marginBottom: '8px'}}>Username</label>
              <input name="username" type="text" placeholder="Enter username" required style={{padding: '12px', background: '#0f1419', border: '1px solid #252d3d', borderRadius: '6px', color: '#e5e7eb', fontSize: '14px', width: '100%'}} />
            </div>
            <div>
              <label style={{fontSize: '14px', fontWeight: 500, color: '#d1d5db', display: 'block', marginBottom: '8px'}}>Password</label>
              <input name="password" type="password" placeholder="Enter password" required style={{padding: '12px', background: '#0f1419', border: '1px solid #252d3d', borderRadius: '6px', color: '#e5e7eb', fontSize: '14px', width: '100%'}} />
            </div>
            <button type="submit" style={{padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px'}}>Sign In</button>
          </form>

          <div style={{textAlign: 'center', color: '#6b7280', fontSize: '12px', margin: '24px 0'}}>Demo Credentials</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: '#0f1419', borderRadius: '6px', border: '1px solid #252d3d'}}>
            <div>
              <strong style={{fontSize: '13px', color: '#e5e7eb'}}>Cashier</strong>
              <small style={{fontSize: '12px', color: '#9ca3af', display: 'block', fontFamily: 'monospace'}}>cashier / cashier123</small>
            </div>
            <div>
              <strong style={{fontSize: '13px', color: '#e5e7eb'}}>Owner</strong>
              <small style={{fontSize: '12px', color: '#9ca3af', display: 'block', fontFamily: 'monospace'}}>owner / owner123</small>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{display: 'flex', minHeight: '100vh', background: '#0f1419', fontFamily: 'system-ui'}}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0f1419; color: #e5e7eb; }
        button { cursor: pointer; }
        input, select { font-family: inherit; }
        table { border-collapse: collapse; width: 100%; background: #1a1f2e; border-radius: 8px; border: 1px solid #252d3d; overflow: hidden; }
        th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; background: #0f1419; border-bottom: 1px solid #252d3d; }
        td { padding: 12px 16px; border-bottom: 1px solid #252d3d; font-size: 14px; color: #e5e7eb; }
        tr:last-child td { border-bottom: none; }
        .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { background: #1a1f2e; border-radius: 8px; padding: 24px; max-width: 500px; width: 90%; border: 1px solid #252d3d; }
      `}</style>
      
      <div style={{width: '240px', background: '#1a1f2e', borderRight: '1px solid #252d3d', padding: '20px', display: 'flex', flexDirection: 'column', gap: '30px', position: 'fixed', height: '100vh', overflowY: 'auto'}}>
        <div><h2 style={{color: '#3b82f6', fontSize: '20px', fontWeight: 700}}>📦 Inventory</h2></div>
        <nav style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          {['overview', 'products', 'sales', 'analytics'].map(section => (
            <button key={section} onClick={() => setCurrentSection(section)} style={{padding: '12px 16px', background: currentSection === section ? '#252d3d' : 'transparent', color: currentSection === section ? '#3b82f6' : '#9ca3af', border: 'none', borderRadius: '6px', cursor: 'pointer', textDecoration: 'none', display: 'block', transition: 'all 0.2s', borderLeft: currentSection === section ? '3px solid #3b82f6' : '3px solid transparent', fontSize: '14px', textTransform: 'capitalize'}}>{section}</button>
          ))}
        </nav>
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #252d3d'}}>
          <span style={{fontSize: '13px', color: '#9ca3af'}}>{user.username}</span>
          <span style={{fontSize: '13px', color: '#9ca3af'}}>({user.role})</span>
          <button onClick={logout} style={{padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600}}>Logout</button>
        </div>
      </div>

      <div style={{flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', background: '#0f1419'}}>
        <div style={{padding: '20px 30px', background: '#1a1f2e', borderBottom: '1px solid #252d3d'}}><h1 style={{fontSize: '24px', color: '#e5e7eb', textTransform: 'capitalize'}}>{currentSection}</h1></div>

        <div style={{flex: 1, padding: '30px', display: currentSection === 'overview' ? 'block' : 'none'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'}}>
            {[{label: 'Total Products', value: stats.totalProducts}, {label: 'Total Stock', value: stats.totalStock}, {label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`}, {label: 'Low Stock', value: stats.lowStock}].map(stat => (
              <div key={stat.label} style={{background: '#1a1f2e', padding: '20px', borderRadius: '8px', border: '1px solid #252d3d'}}>
                <h3 style={{fontSize: '13px', color: '#9ca3af', marginBottom: '12px'}}>{stat.label}</h3>
                <p style={{fontSize: '28px', fontWeight: 700, color: '#3b82f6'}}>{stat.value}</p>
              </div>
            ))}
          </div>
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Qty</th></tr></thead>
            <tbody>{products.map(p => <tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.category}</td><td>${p.price.toFixed(2)}</td><td>{p.quantity}</td></tr>)}</tbody>
          </table>
        </div>

        <div style={{flex: 1, padding: '30px', display: currentSection === 'products' ? 'block' : 'none'}}>
          <button onClick={() => setShowProductModal(true)} style={{padding: '10px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', marginBottom: '20px'}}>+ Add Product</button>
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Qty</th><th>Actions</th></tr></thead>
            <tbody>{products.map(p => <tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.category}</td><td>${p.price.toFixed(2)}</td><td>{p.quantity}</td><td><button onClick={() => deleteProduct(p.id)} style={{padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'}}>Delete</button></td></tr>)}</tbody>
          </table>
        </div>

        <div style={{flex: 1, padding: '30px', display: currentSection === 'sales' ? 'block' : 'none'}}>
          <button onClick={() => setShowSaleModal(true)} style={{padding: '10px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', marginBottom: '20px'}}>+ New Sale</button>
          <table>
            <thead><tr><th>Date</th><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>{sales.map(s => <tr key={s.id}><td>{s.date}</td><td>{s.productName}</td><td>{s.quantity}</td><td>${s.price.toFixed(2)}</td><td>${s.total.toFixed(2)}</td></tr>)}</tbody>
          </table>
        </div>

        <div style={{flex: 1, padding: '30px', display: currentSection === 'analytics' ? 'block' : 'none'}}>
          <h3 style={{color: '#e5e7eb', marginBottom: '20px'}}>Sales Analytics</h3>
          {sales.length === 0 ? <p style={{color: '#9ca3af'}}>No sales data</p> : <p style={{color: '#9ca3af'}}>Total Sales: {sales.length}</p>}
        </div>
      </div>

      {showProductModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 style={{color: '#e5e7eb', marginBottom: '20px', fontSize: '18px'}}>Add Product</h2>
            <form onSubmit={(e) => { e.preventDefault(); addProduct(new FormData(e.target)); }} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <input name="productId" placeholder="Product ID" required style={{padding: '12px', background: '#0f1419', border: '1px solid #252d3d', borderRadius: '6px', color: '#e5e7eb'}} />
              <input name="productName" placeholder="Product Name" required style={{padding: '12px', background: '#0f1419', border: '1px solid #252d3d', borderRadius: '6px', color: '#e5e7eb'}} />
              <input name="productCategory" placeholder="Category" required style={{padding: '12px', background: '#0f1419', border: '1px solid #252d3d', borderRadius: '6px', color: '#e5e7eb'}} />
              <input name="productPrice" type="number" placeholder="Price" step="0.01" required style={{padding: '12px', background: '#0f1419', border: '1px solid #252d3d', borderRadius: '6px', color: '#e5e7eb'}} />
              <input name="productQuantity" type="number" placeholder="Quantity" required style={{padding: '12px', background: '#0f1419', border: '1px solid #252d3d', borderRadius: '6px', color: '#e5e7eb'}} />
              <div style={{display: 'flex', gap: '12px', marginTop: '12px'}}>
                <button type="submit" style={{flex: 1, padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600}}>Save</button>
                <button type="button" onClick={() => setShowProductModal(false)} style={{flex: 1, padding: '10px', background: '#252d3d', color: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSaleModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 style={{color: '#e5e7eb', marginBottom: '20px', fontSize: '18px'}}>Record Sale</h2>
            <form onSubmit={(e) => { e.preventDefault(); recordSale(new FormData(e.target)); }} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <select name="saleProduct" required style={{padding: '12px', background: '#0f1419', border: '1px solid #252d3d', borderRadius: '6px', color: '#e5e7eb'}}>
                <option value="">Select Product</option>
                {products.filter(p => p.quantity > 0).map(p => <option key={p.id} value={p.id}>{p.name} ({p.quantity} available)</option>)}
              </select>
              <input name="saleQuantity" type="number" placeholder="Quantity" min="1" required style={{padding: '12px', background: '#0f1419', border: '1px solid #252d3d', borderRadius: '6px', color: '#e5e7eb'}} />
              <div style={{display: 'flex', gap: '12px', marginTop: '12px'}}>
                <button type="submit" style={{flex: 1, padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600}}>Record</button>
                <button type="button" onClick={() => setShowSaleModal(false)} style={{flex: 1, padding: '10px', background: '#252d3d', color: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
