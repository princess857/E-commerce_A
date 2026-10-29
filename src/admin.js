import './style.css';
import { supabase, supabaseConfigured } from './supabaseClient.js';
import { getProducts, addProduct, updateProduct, deleteProduct, checkIsAdmin } from './adminService.js';

const categories = [
  'accessories', 'bags', 'beauty', 'fashion', 'gadgets', 'hairs', 
  'home-appliances', 'home-decor', 'mens-apparel', 'sneakers', 'watches', 'women-apparel'
];

let currentUser = null;
let isAdmin = false;
let products = [];

const app = document.getElementById('app');

function renderLogin() {
  app.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f9fafb;">
      <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; width: 100%;">
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px; color: #111;">Admin Access</h1>
        <p style="color: #6b7280; margin-bottom: 32px;">Sign in or create admin account</p>
        <div style="display: flex; gap: 8px; margin-bottom: 24px;">
          <button id="tab-signin" style="flex: 1; padding: 10px; background: #ff7a00; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Sign In</button>
          <button id="tab-signup" style="flex: 1; padding: 10px; background: white; color: #374151; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; font-weight: 600;">Sign Up</button>
        </div>
        <div id="signin-form-container">
          <form id="login-form">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
            <input type="email" id="email" required style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Password</label>
            <input type="password" id="password" required style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 24px; font-size: 14px;">
            <button type="submit" style="width: 100%; padding: 12px; background: #ff7a00; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Sign In</button>
          </form>
        </div>
        <div id="signup-form-container" style="display: none;">
          <form id="signup-form">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Full Name</label>
            <input type="text" id="signup-name" required style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
            <input type="email" id="signup-email" required style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Password</label>
            <input type="password" id="signup-password" required minlength="6" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 24px; font-size: 14px;">
            <button type="submit" style="width: 100%; padding: 12px; background: #ff7a00; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Create Admin Account</button>
          </form>
        </div>
        <p id="login-error" style="color: #dc2626; margin-top: 16px; font-size: 14px;"></p>
        <p id="login-success" style="color: #059669; margin-top: 16px; font-size: 14px;"></p>
        <a href="/" style="display: inline-block; margin-top: 24px; color: #ff7a00; text-decoration: none;">← Back to Store</a>
      </div>
    </div>
  `;
  
  document.getElementById('tab-signin').addEventListener('click', () => {
    document.getElementById('tab-signin').style.background = '#ff7a00';
    document.getElementById('tab-signin').style.color = 'white';
    document.getElementById('tab-signin').style.border = 'none';
    document.getElementById('tab-signup').style.background = 'white';
    document.getElementById('tab-signup').style.color = '#374151';
    document.getElementById('tab-signup').style.border = '1px solid #d1d5db';
    document.getElementById('signin-form-container').style.display = 'block';
    document.getElementById('signup-form-container').style.display = 'none';
    document.getElementById('login-error').textContent = '';
    document.getElementById('login-success').textContent = '';
  });
  
  document.getElementById('tab-signup').addEventListener('click', () => {
    document.getElementById('tab-signup').style.background = '#ff7a00';
    document.getElementById('tab-signup').style.color = 'white';
    document.getElementById('tab-signup').style.border = 'none';
    document.getElementById('tab-signin').style.background = 'white';
    document.getElementById('tab-signin').style.color = '#374151';
    document.getElementById('tab-signin').style.border = '1px solid #d1d5db';
    document.getElementById('signin-form-container').style.display = 'none';
    document.getElementById('signup-form-container').style.display = 'block';
    document.getElementById('login-error').textContent = '';
    document.getElementById('login-success').textContent = '';
  });
  
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    const successEl = document.getElementById('login-success');
    successEl.textContent = '';
    errorEl.textContent = 'Signing in...';
    
    if (!supabase) {
      errorEl.textContent = 'Supabase not configured. Check .env.local';
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        errorEl.textContent = error.message;
        console.error('Auth error:', error);
        return;
      }
      
      currentUser = data.user;
      isAdmin = await checkIsAdmin(currentUser.id);
      if (!isAdmin) {
        errorEl.textContent = 'Access denied. Admin privileges required.';
        await supabase.auth.signOut();
        return;
      }
      
      loadDashboard();
    } catch (err) {
      errorEl.textContent = 'Network error: ' + err.message;
      console.error('Sign in error:', err);
    }
  });
  
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorEl = document.getElementById('login-error');
    const successEl = document.getElementById('login-success');
    errorEl.textContent = '';
    
    if (!supabase) {
      errorEl.textContent = 'Supabase not configured';
      return;
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    
    if (error) {
      errorEl.textContent = error.message;
      return;
    }
    
    successEl.textContent = 'Admin account created! Please check your email to confirm, then sign in.';
    document.getElementById('signup-form').reset();
  });
}

function renderDashboard() {
  app.innerHTML = `
    <div style="min-height: 100vh; background: #f9fafb;">
      <header style="background: white; border-bottom: 1px solid #e5e7eb; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="font-size: 24px; font-weight: 700; color: #111;">Achor Admin</h1>
          <p style="color: #6b7280; font-size: 14px;">Product Management</p>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span style="color: #6b7280;">${currentUser.email}</span>
          <button id="add-product-btn" style="padding: 10px 20px; background: #ff7a00; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">+ Add Product</button>
          <button id="logout-btn" style="padding: 10px 20px; background: white; color: #374151; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer;">Logout</button>
          <a href="/" style="padding: 10px 20px; color: #ff7a00; text-decoration: none;">View Store</a>
        </div>
      </header>
      
      <main style="padding: 40px; max-width: 1400px; margin: 0 auto;">
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
              <tr>
                <th style="text-align: left; padding: 16px; font-weight: 600; color: #374151;">Product</th>
                <th style="text-align: left; padding: 16px; font-weight: 600; color: #374151;">Category</th>
                <th style="text-align: left; padding: 16px; font-weight: 600; color: #374151;">Price</th>
                <th style="text-align: left; padding: 16px; font-weight: 600; color: #374151;">Actions</th>
              </tr>
            </thead>
            <tbody id="products-table">
            </tbody>
          </table>
        </div>
      </main>
    </div>
    
    <div id="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000;">
      <div style="background: white; border-radius: 12px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 id="modal-title" style="font-size: 24px; font-weight: 700;">Add Product</h2>
          <button id="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
        </div>
        <form id="product-form">
          <input type="hidden" id="product-id">
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Name</label>
            <input type="text" id="product-name" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px;">
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Description</label>
            <textarea id="product-description" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; resize: vertical;" rows="3"></textarea>
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Long Description</label>
            <textarea id="product-long-description" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; resize: vertical;" rows="4"></textarea>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Price (₦)</label>
              <input type="number" id="product-price" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Category</label>
              <select id="product-category" required style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px;">
                ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Image Path</label>
            <input type="text" id="product-image" required placeholder="/images/category/1.jpg" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px;">
          </div>
          <button type="submit" style="width: 100%; padding: 12px; background: #ff7a00; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Save Product</button>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.reload();
  });
  
  document.getElementById('add-product-btn').addEventListener('click', () => {
    document.getElementById('modal-title').textContent = 'Add Product';
    document.getElementById('product-id').value = '';
    document.getElementById('product-form').reset();
    document.getElementById('modal').style.display = 'flex';
  });
  
  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
  });
  
  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const product = {
      name: document.getElementById('product-name').value,
      description: document.getElementById('product-description').value,
      long_description: document.getElementById('product-long-description').value,
      price: parseInt(document.getElementById('product-price').value),
      category: document.getElementById('product-category').value,
      image: document.getElementById('product-image').value,
      old_price: Math.round(parseInt(document.getElementById('product-price').value) * 1.2),
      discount: 17,
      colors: ['Black', 'Brown', 'Beige'],
      sizes: [],
      rating: 4.5,
      review_count: 0
    };
    
    try {
      if (id) {
        await updateProduct(id, product);
      } else {
        await addProduct(product);
      }
      document.getElementById('modal').style.display = 'none';
      loadProducts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
  
  loadProducts();
}

async function loadProducts() {
  products = await getProducts();
  const tbody = document.getElementById('products-table');
  tbody.innerHTML = products.map(p => `
    <tr style="border-bottom: 1px solid #f3f4f6;">
      <td style="padding: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${p.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://via.placeholder.com/60'">
          <div>
            <div style="font-weight: 600; color: #111;">${p.name}</div>
            <div style="font-size: 12px; color: #6b7280; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.description}</div>
          </div>
        </div>
      </td>
      <td style="padding: 16px; color: #374151;">${p.category}</td>
      <td style="padding: 16px; font-weight: 600; color: #111;">₦${p.price.toLocaleString()}</td>
      <td style="padding: 16px;">
        <button onclick="editProduct('${p.id}')" style="padding: 6px 12px; background: white; color: #374151; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; margin-right: 8px;">Edit</button>
        <button onclick="deleteProductBtn('${p.id}')" style="padding: 6px 12px; background: white; color: #dc2626; border: 1px solid #fecaca; border-radius: 6px; cursor: pointer;">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.editProduct = (id) => {
  const product = products.find(p => p.id === id);
  if (!product) return;
  document.getElementById('modal-title').textContent = 'Edit Product';
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-long-description').value = product.long_description || '';
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-image').value = product.image;
  document.getElementById('modal').style.display = 'flex';
};

window.deleteProductBtn = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    await deleteProduct(id);
    loadProducts();
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

async function loadDashboard() {
  renderDashboard();
}

async function init() {
  if (!supabaseConfigured) {
    app.innerHTML = '<div style="padding: 40px;">Supabase not configured</div>';
    return;
  }
  
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    isAdmin = await checkIsAdmin(currentUser.id);
    if (isAdmin) {
      loadDashboard();
      return;
    }
  }
  renderLogin();
}

init();
