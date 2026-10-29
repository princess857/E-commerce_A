import './style.css';
import { supabase, supabaseConfigured } from './supabaseClient.js';
import { products } from './products.js';

const homepageProducts = products.slice(0, 20);
const isShopPage = window.location.pathname === '/shop' || window.location.pathname.startsWith('/shop/');
const productsPerPage = 20;

const categories = [
  { id: 'all', label: 'All', icon: '✦' },
  { id: 'accessories', label: 'accessories', icon: '◇', description: 'Complete your look with thoughtfully designed accessories that add a polished touch to any outfit.' },
  { id: 'bags', label: 'bags', icon: '▱', description: 'Carry your daily essentials in a beautifully finished bag with useful pockets and comfortable straps.' },
  { id: 'beauties', label: 'beauties', icon: '✧', description: 'Refresh your beauty routine with skin-loving essentials for a naturally radiant complexion.' },
  { id: 'hairs', label: 'hairs', icon: '〰', description: 'Style your look with soft, natural-looking hair that feels comfortable and holds beautiful movement.' },
  { id: 'home-appliances', label: 'home-appliances', icon: '⌂', description: 'Bring convenience to your home with dependable everyday appliances.' },
  { id: 'fashion1', label: 'fashion1', icon: '✳', description: 'Refresh your wardrobe with comfortable, versatile clothing made for effortless everyday outfits.', sizes: true },
  { id: 'watches', label: 'watches', icon: '◷', description: 'Keep every day on time with a dependable wristwatch, easy-to-read dial and comfortable finish.' },
  { id: 'sneakers', label: 'sneakers', icon: '◒', description: 'Step into all-day comfort with supportive cushioning, durable soles and a versatile everyday sneaker style.' },
  { id: 'gadgets1', label: 'gadgets1', icon: '⌘', description: 'Make everyday tasks easier with useful technology and thoughtful features.' },
  { id: 'home-decor', label: 'home-decor', icon: '❋', description: 'Add warmth and thoughtful detail to your living space with a timeless home styling accent.' },
];

const allCategories = categories;

const reviewTexts = {
  beauty: [
    "This seriously transformed my skin. I see a difference after just one week!",
    "Love the lightweight feel. No greasy residue and my skin is so hydrated.",
    "Amazing value for the quality. Will definitely buy again.",
    "My skin feels so soft and smooth. Highly recommend to anyone with dry skin.",
    "The scent is lovely and it absorbs quickly. 10/10 would repurchase.",
  ],
  bags: [
    "Perfect size and the quality is amazing. Fits all my essentials with room to spare.",
    "Beautiful color and the material feels really premium. Very happy with this purchase.",
    "The straps are super comfortable and the compartments keep everything organized.",
    "Exactly as pictured. Sturdy construction and I get compliments every time I use it.",
    "Best bag I've bought in a long time. The hardware is solid and the stitching is impeccable.",
  ],
  accessories: [
    "So pretty and well-made. Gets compliments every time I wear it.",
    "Perfect weight and finish. Adds the perfect touch to any outfit.",
    "Beautiful packaging and the quality is excellent for the price.",
    "Exactly what I expected. The details are perfect and it arrived quickly.",
    "Love this! Great quality and it looks even better in person.",
  ],
  watches: [
    "Keeps perfect time and looks great with everything. Super comfortable too.",
    "Love the design and the band is very comfortable. Highly recommend.",
    "Great quality for the price. The face is easy to read and it's not too bulky.",
    "Perfect everyday watch. Stylish without being flashy.",
    "My boyfriend loved this. He's been wearing it every day since.",
  ],
  hairs: [
    "So natural-looking and super comfortable. Can't even tell it's not my real hair.",
    "The quality is amazing. It's soft, holds style well, and blends perfectly.",
    "Exactly as described. Fast shipping and the color matches perfectly.",
    "I'm obsessed with this! The hair is so soft and looks completely natural.",
    "Amazing quality and customer service. Will definitely order again!",
  ],
  gadgets: [
    "Works flawlessly and the battery life is incredible. Worth every penny.",
    "Exactly what I needed. Easy to set up and connects instantly. 5 stars!",
    "Great sound quality and it pairs quickly with my phone. Super impressed.",
    "Perfect size and portability. Charges fast and holds a long charge.",
    "Excellent build quality and intuitive controls. Works right out of the box.",
  ],
  'home-appliances': [
    "This has made my morning routine so much easier. Perfect performance.",
    "Easy to clean and cooks evenly. Exactly what I needed for my small kitchen.",
    "Great value. It's quiet, efficient, and the results are always perfect.",
    "Love this! It heats up quickly and the temperature control is precise.",
    "Works perfectly and takes up minimal counter space. Very happy with it.",
  ],
  fashion: [
    "Perfect fit and the fabric is so comfortable. Already ordered another color.",
    "Love this! The material is soft and it looks great with everything I own.",
    "Exactly as pictured. The cut is flattering and the quality is excellent.",
    "Comfortable all day and didn't wrinkle during travel. Highly recommend!",
    "Beautiful piece and true to size. The material feels premium for the price.",
  ],
  sneakers: [
    "Super comfortable and look great. Been wearing them non-stop since they arrived.",
    "Exactly what I wanted. Lightweight, supportive, and the perfect fit.",
    "Love these! So comfortable right out of the box and they look stylish too.",
    "Best sneakers I've owned. The cushioning is incredible and they're true to size.",
    "Perfect for daily wear. Comfortable, stylish, and arrived quickly. 5 stars!",
  ],
  'home-decor': [
    "Adds such a nice touch to my living room. The quality is excellent.",
    "Exactly as pictured. Perfect size and the colors complement my decor beautifully.",
    "Love this! Makes my space feel so cozy and put-together.",
    "Great quality and unique design. Gets compliments from every guest.",
    "Perfect accent piece. Looks even better in person than in the photos.",
  ],
  'women-apparel': [
    "Love the fit and the fabric is so soft. Already planning to buy another color.",
    "So comfortable and flattering. Perfect for both casual and dressy occasions.",
    "Exactly as described. The material is high quality and the cut is perfect.",
    "Beautiful piece and true to size. The material feels premium for the price.",
    "My new favorite go-to! Comfortable all day and looks great.",
  ],
  'mens-apparel': [
    "Perfect fit and great quality. My husband loves this shirt.",
    "Looks sharp and feels comfortable. The material is soft and well-made.",
    "Exactly what I wanted. True to size and the fabric is nice and breathable.",
    "Great value for the quality. I've been wearing it weekly since I bought it.",
    "Comfortable and stylish. Perfect for both office wear and weekend casual.",
  ],
};

const reviewerFirstNames = ['Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'James', 'Ava', 'William', 'Sophia', 'Alex', 'Isabella', 'Ethan', 'Mia', 'Noah', 'Luna', 'Liam', 'Grace', 'Mason', 'Zoe', 'Lucas'];
const reviewerLastNames = ['Adewale', 'Okafor', 'Chen', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez'];

const currency = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });
const categoryById = new Map(categories.filter((category) => category.id !== 'all').map((category) => [category.id, category]));
const imageCategoryByProductCategory = {
  accessories: 'accessories',
  bags: 'bags',
  beauties: 'beauty',
  hairs: 'hairs',
  'home-appliances': 'home-appliances',
  fashion1: 'fashion',
  watches: 'watches',
  sneakers: 'sneakers',
  gadgets1: 'gadgets',
  'home-decor': 'home-decor',
};
const imagePathsByCategory = new Map();

function stableNumber(text, min, max) {
  let hash = 2166136261;
  for (const character of text) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return min + (hash >>> 0) % (max - min + 1);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function formatReviews(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

function renderStars(rating, showCount = false, count = 0) {
  const ratingNum = parseFloat(rating);
  const fullStars = Math.floor(ratingNum);
  const hasHalf = ratingNum - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="text-yellow-400 text-sm">★</span>';
  }
  if (hasHalf) {
    stars += '<span class="text-yellow-400 text-sm">★</span>';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<span class="text-yellow-400 text-sm">☆</span>';
  }
  if (showCount) {
    return `<div class="flex flex-row items-center gap-0.5"><div class="flex flex-row">${stars}</div><span class="text-xs text-gray-500 ml-1">(${formatReviews(count)})</span></div>`;
  } else {
    return stars;
  }
}

function buildLongDescription(description, category) {
  const label = (categoryById.get(category)?.label || category).toLowerCase();
  return `${description} A considered ${label} pick, chosen for dependable quality and thoughtful detailing that holds up to everyday use.`;
}

function getImageFilename(product) {
  if (product.category === 'accessories' || product.category === 'bags') return product.old;
  const match = product.old.match(/_(\d+)$/);
  if (!match) throw new Error(`Unable to resolve image filename from "${product.old}".`);
  return match[1];
}

function getImageUrl(product) {
  const imageCategory = imageCategoryByProductCategory[product.category];
  const filename = getImageFilename(product);
  const imagePath = imagePathsByCategory.get(imageCategory)?.get(filename);
  if (imagePath) {
    const extension = imagePath.match(/\.(jpe?g|png|webp)$/i)?.[0] || '';
    return `/images/${imageCategory}/${encodeURIComponent(filename)}${extension}`;
  }
  return `/images/${imageCategory}/${encodeURIComponent(filename)}.jpg`;
}

function getImageCandidates(product) {
  const imageCategory = imageCategoryByProductCategory[product.category];
  const filename = getImageFilename(product);
  const extensions = ['jpg', 'jpeg', 'png', 'webp', ''];
  const candidates = extensions.map((extension) =>
    `/images/${imageCategory}/${encodeURIComponent(filename)}${extension ? `.${extension}` : ''}`
  );
  candidates.push(...extensions.map((extension) =>
    `/images/${encodeURIComponent(product.old)}${extension ? `.${extension}` : ''}`
  ));
  return [...new Set([product.image, ...candidates])];
}

function generateReviews(productId, avgRating, totalReviews) {
  const reviews = [];
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  const basePercent = avgRating / 5;
  const fiveStarCount = Math.round((totalReviews * basePercent * 0.7));
  const fourStarCount = Math.round(totalReviews * 0.2);
  const threeStarCount = Math.round(totalReviews * 0.08);
  const twoStarCount = Math.round(totalReviews * 0.015);
  const oneStarCount = totalReviews - fiveStarCount - fourStarCount - threeStarCount - twoStarCount;

  breakdown[5] = Math.max(0, fiveStarCount);
  breakdown[4] = Math.max(0, fourStarCount);
  breakdown[3] = Math.max(0, threeStarCount);
  breakdown[2] = Math.max(0, twoStarCount);
  breakdown[1] = Math.max(0, oneStarCount);

  const avatars = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#84CC16'];

  for (let i = 0; i < 3; i++) {
    const seed = `${productId}-review-${i}`;
    const firstName = reviewerFirstNames[stableNumber(`${seed}-first`, 0, reviewerFirstNames.length - 1)];
    const lastName = reviewerLastNames[stableNumber(`${seed}-last`, 0, reviewerLastNames.length - 1)];
    const starRating = stableNumber(`${seed}-stars`, 4, 5);
    const avatarColor = avatars[stableNumber(`${seed}-avatar`, 0, avatars.length - 1)];
    const daysAgo = stableNumber(`${seed}-days`, 1, 30);
    const reviewTextsForCategory = reviewTexts[productId.split('-')[0]] || reviewTexts.beauty;
    const reviewText = reviewTextsForCategory[stableNumber(`${seed}-text`, 0, reviewTextsForCategory.length - 1)];

    reviews.push({
      id: `${productId}-rev-${i}`,
      author: `${firstName} ${lastName}`,
      avatar: avatarColor,
      stars: starRating,
      date: `${daysAgo} days ago`,
      text: reviewText,
    });
  }

  return { breakdown, reviews };
}

function createProducts(records, imageMap) {
  imagePathsByCategory.clear();
  for (const [imageCategory, paths] of Object.entries(imageMap)) {
    if (!Array.isArray(paths)) continue;
    imagePathsByCategory.set(imageCategory, new Map(paths.map((path) => {
      const filename = decodeURIComponent(path.split('/').pop()).replace(/\.(jpe?g|png|webp)$/i, '');
      return [filename, path];
    })));
  }
  return records.map((record) => {
    const id = record.old;
    const price = record.price;
    const oldPrice = Math.round((price * 1.2) / 100) * 100;
    const discount = Math.round(((oldPrice - price) / oldPrice) * 100);
    const category = categoryById.get(record.category);
    return {
      ...record,
      id,
      name: record.title,
      description: record.desc,
      longDescription: buildLongDescription(record.desc, record.category),
      oldPrice,
      discount,
      image: getImageUrl(record),
      colors: ['Black', 'Brown', 'Beige'],
      sizes: category?.sizes ? ['S', 'M', 'L', 'XL'] : [],
      rating: (4.2 + stableNumber(`${id}-rating`, 0, 8) / 10).toFixed(1),
      reviewCount: stableNumber(`${id}-reviews`, 200, 15000),
    };
  });
}

const storedCart = readStorage('achor-cart', (value) => value && typeof value === 'object' && !Array.isArray(value));
const storedWishlist = readStorage('achor-wishlist', Array.isArray);
let cart = storedCart ?? {};
let wishlist = new Set(storedWishlist ?? []);
let activeCategory = 'all';
let searchQuery = '';
let selectedProduct = null;
let detailQuantity = 1;
let selectedColor = 'Black';
let selectedSize = '';
let toastTimer;
let currentUser = null;
let authMode = 'signin';
let catalogProducts = [];
let productsByOldName = new Map();
let currentPage = 1;
let catalogReady = false;

const elements = {
  pills: document.querySelector('#category-pills'),
  sidebarCategories: document.querySelector('#sidebar-categories'),
  grid: document.querySelector('#product-grid'),
  pagination: document.querySelector('#product-pagination'),
  detail: document.querySelector('#product-detail'),
  catalog: document.querySelector('.catalog'),
  title: document.querySelector('#catalog-title'),
  count: document.querySelector('#result-count'),
  empty: document.querySelector('#empty-state'),
  cartCount: document.querySelector('#cart-count'),
  cartTitleCount: document.querySelector('#cart-title-count'),
  cartItems: document.querySelector('#cart-items'),
  cartTotal: document.querySelector('#cart-total'),
  cartEmpty: document.querySelector('#cart-empty'),
  cartFooter: document.querySelector('#cart-footer'),
  cartSidebar: document.querySelector('#cart-sidebar'),
  cartOverlay: document.querySelector('#cart-overlay'),
  sidebar: document.querySelector('#category-sidebar'),
  categoryScrim: document.querySelector('#category-scrim'),
  toast: document.querySelector('#toast'),
  authDialog: document.querySelector('#auth-dialog'),
  authForm: document.querySelector('#auth-form'),
  authNameField: document.querySelector('#auth-name-field'),
  authName: document.querySelector('#auth-name'),
  authEmail: document.querySelector('#auth-email'),
  authPassword: document.querySelector('#auth-password'),
  authMessage: document.querySelector('#auth-message'),
  authTitle: document.querySelector('#auth-title'),
  authSubmit: document.querySelector('#auth-submit'),
  authModeToggle: document.querySelector('#auth-mode-toggle'),
  authUserPanel: document.querySelector('#auth-user-panel'),
  authUserName: document.querySelector('#auth-user-name'),
  authUserEmail: document.querySelector('#auth-user-email'),
};

function readStorage(key, isValid) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return isValid(value) ? value : null;
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error);
    return null;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save ${key} to local storage.`, error);
    showToast('Your changes could not be saved on this device.');
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove('show'), 2300);
}

function setAuthMessage(message, type = '') {
  elements.authMessage.textContent = message;
  elements.authMessage.className = `auth-message${type ? ` ${type}` : ''}`;
}

function renderAuthUser() {
  const label = document.querySelector('#account-label');
  const fullName = currentUser?.user_metadata?.full_name?.trim();
  label.textContent = currentUser ? (fullName || currentUser.email || 'Account') : 'Account';
  elements.authUserPanel.hidden = !currentUser;
  elements.authForm.hidden = Boolean(currentUser);
  if (currentUser) {
    elements.authUserName.textContent = fullName || 'Achor shopper';
    elements.authUserEmail.textContent = currentUser.email || '';
    elements.authTitle.textContent = 'Your account';
  } else {
    elements.authTitle.textContent = authMode === 'signup' ? 'Create your account' : 'Welcome back';
  }
}

function setAuthMode(mode) {
  authMode = mode;
  const signingUp = authMode === 'signup';
  elements.authNameField.hidden = !signingUp;
  elements.authName.required = signingUp;
  elements.authPassword.autocomplete = signingUp ? 'new-password' : 'current-password';
  elements.authSubmit.textContent = signingUp ? 'Create account' : 'Sign in';
  elements.authModeToggle.textContent = signingUp ? 'Already have an account? Sign in' : 'Create an account';
  renderAuthUser();
  setAuthMessage(supabaseConfigured
    ? ''
    : "Don't have an account? Click 'Create an account' below to sign up.", 'error');
}

function openAuthDialog() {
  renderAuthUser();
  setAuthMode(currentUser ? authMode : 'signin');
  elements.authDialog.showModal();
  if (currentUser) document.querySelector('#sign-out-button').focus();
  else elements.authEmail.focus();
}

async function initializeAuth() {
  renderAuthUser();
  if (!supabase) return;

  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    renderAuthUser();
  });

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    currentUser = data.session?.user ?? null;
    renderAuthUser();
  } catch (error) {
    console.error('Unable to restore the Supabase session.', error);
    setAuthMessage(error.message || 'Unable to restore your account session.', 'error');
  }
}

function renderCategories() {
  const categoriesForPills = categories.filter((c) => c.id !== 'women-apparel' && c.id !== 'mens-apparel');
  const categoriesForSidebar = categories.filter((c) => c.id !== 'women-apparel' && c.id !== 'mens-apparel');
  const pillHtml = categoriesForPills.map((category) => {
    const active = activeCategory === category.id;
    return `<button class="category-pill${active ? ' active' : ''}" data-category="${category.id}" aria-pressed="${active}">${category.label}</button>`;
  }).join('');
  elements.pills.innerHTML = pillHtml;

  const sidebarHtml = categoriesForSidebar.map((category) => {
    const active = activeCategory === category.id;
    return `<button class="sidebar-category${active ? ' active' : ''}" data-category="${category.id}" aria-pressed="${active}"><span class="category-symbol">${category.icon}</span><span>${category.label}</span></button>`;
  }).join('');
  elements.sidebarCategories.innerHTML = sidebarHtml;
}

function renderCardImage(product) {
  return `<img class="product-image" src="${escapeHtml(product.image)}" data-image-old="${escapeHtml(product.old)}" alt="${escapeHtml(product.title)}" loading="lazy" />`;
}

function renderProducts() {
  if (selectedProduct) return;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const pageProducts = isShopPage
    ? catalogProducts
    : homepageProducts.map((product) => productsByOldName.get(product.old)).filter(Boolean);
  const allVisibleProducts = pageProducts.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = !normalizedQuery || product.title.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(allVisibleProducts.length / productsPerPage));
  currentPage = Math.min(currentPage, totalPages);
  const visibleProducts = isShopPage
    ? allVisibleProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
    : allVisibleProducts;

  const category = categoryById.get(activeCategory);
  elements.title.textContent = normalizedQuery
    ? 'Search results'
    : activeCategory === 'all'
      ? isShopPage ? 'All products' : 'Featured products'
      : category.label;
  elements.count.textContent = isShopPage
    ? `${allVisibleProducts.length} ${allVisibleProducts.length === 1 ? 'item' : 'items'}`
    : `${visibleProducts.length} featured items`;
  elements.empty.hidden = allVisibleProducts.length > 0;
  elements.grid.hidden = allVisibleProducts.length === 0;
  elements.pagination.hidden = !isShopPage || allVisibleProducts.length === 0;
  elements.pagination.innerHTML = isShopPage && totalPages > 1
    ? `<button class="button button-dark" type="button" data-page-change="-1"${currentPage === 1 ? ' disabled' : ''}>Previous</button><span aria-live="polite">Page ${currentPage} of ${totalPages}</span><button class="button button-dark" type="button" data-page-change="1"${currentPage === totalPages ? ' disabled' : ''}>Next</button>`
    : '';
  document.querySelector('#view-all-products').hidden = isShopPage;

  const gridHtml = visibleProducts.map((product, index) => `
    <article class="product-card stagger-fade-in" style="animation-delay: ${Math.min(index, 9) * 40}ms">
      <div class="product-image-wrap" data-open-product="${product.id}" role="button" tabindex="0" aria-label="View ${escapeHtml(product.name)}">
        ${renderCardImage(product)}
      </div>
      <button class="wishlist-button${wishlist.has(product.id) ? ' active' : ''}" data-wishlist="${product.id}" aria-label="${wishlist.has(product.id) ? 'Remove from' : 'Add to'} wishlist" aria-pressed="${wishlist.has(product.id)}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.1-8.8 10.1-8.8 10.1S3.2 13.8 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" /></svg>
      </button>
      <div class="product-info">
        <h3 class="product-name" title="${escapeHtml(product.title)}">${escapeHtml(product.title)}</h3>
        <p class="product-description">${escapeHtml(product.desc)}</p>
        <span class="product-category-badge">${escapeHtml(product.category)}</span>
        <div class="price-row">
          <strong class="price-current">${currency.format(product.price)}</strong>
          <button class="add-cart-button" type="button" data-add-cart="${product.id}" aria-label="Add ${escapeHtml(product.name)} to cart">
            Add to Cart
          </button>
        </div>
      </div>
    </article>`).join('');
  elements.grid.innerHTML = gridHtml;
}

function renderDetail() {
  if (!selectedProduct) return;
  const product = selectedProduct;
  const colors = { Black: '#222', Brown: '#8d5d3b', Beige: '#d9c5a4' };
  elements.catalog.hidden = true;
  elements.detail.hidden = false;

  const { breakdown, reviews } = generateReviews(product.id, parseFloat(product.rating), product.reviewCount);
  const totalForBreakdown = product.reviewCount;

  const breakdownHtml = Object.entries(breakdown).reverse().map(([stars, count]) => {
    const percentage = Math.round((count / totalForBreakdown) * 100);
    const barColor = stars >= 4 ? '#f59e0b' : stars >= 2 ? '#f59e0b' : '#ef4f4f';
    return `
      <div class="breakdown-row">
        <span class="breakdown-label">${stars}★</span>
        <div class="breakdown-track">
          <div class="breakdown-fill rating-bar-fill bg-orange-400" style="width: ${percentage}%; background-color: ${stars >= 4 ? '#f59e0b' : stars >= 2 ? '#f59e0b' : '#ef4f4f'};"></div>
        </div>
        <span class="breakdown-percent">${percentage}%</span>
      </div>`;
  }).join('');

  const reviewsHtml = reviews.map((review) => `
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar" style="background-color: ${review.avatar};">${review.author.charAt(0)}</div>
        <div>
          <strong class="review-author">${escapeHtml(review.author)}</strong>
           <div class="review-stars">${renderStars(review.stars, false)}</div>
        </div>
        <span class="review-date">${review.date}</span>
      </div>
      <p class="review-text">${escapeHtml(review.text)}</p>
    </div>`).join('');

  const reviewFormHtml = currentUser
    ? `<div class="review-form">
        <h4>Add your review</h4>
        <form id="submit-review-form">
          <div class="rating-input" id="review-rating-input">
            ${Array.from({ length: 5 }, (_, i) => `<button type="button" data-star="${i + 1}" aria-label="${i + 1} stars">★</button>`).join('')}
          </div>
          <textarea id="review-text" name="review-text" placeholder="Tell us about your experience with this product..." rows="3" required></textarea>
          <div class="subtotal" style="margin-top: 12px;">
            <button type="submit" class="button button-primary" style="width: 100%;">Submit review</button>
          </div>
        </form>
      </div>`
    : `<div class="add-review-prompt">
        <span class="signin-link" id="signin-for-review" style="color: var(--accent); font-weight: 700; cursor: pointer;">Sign in</span> 
        to share your review of this product.
      </div>`;

  elements.detail.innerHTML = `
    <button class="back-button" id="back-to-products"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6M9 12h11" /></svg>Back to shopping</button>
    <div class="detail-layout">
      <div class="detail-image-wrap"><img class="detail-image" src="${escapeHtml(product.image)}" data-image-old="${escapeHtml(product.old)}" alt="${escapeHtml(product.name)}" /></div>
      <div class="detail-copy">
        <span class="detail-category">${escapeHtml(categoryById.get(product.category).label)}</span>
        <h1>${escapeHtml(product.name)}</h1>
        <div class="rating detail-rating">
          <div class="flex flex-row items-center gap-0.5">
            <div class="flex flex-row">${renderStars(product.rating, false)}</div>
               <span class="text-xs text-gray-500 ml-1">(${formatReviews(product.reviewCount)})</span>
          </div>
          <span class="rating-subtext">${product.rating} out of 5</span>
        </div>
        <div class="detail-price"><strong class="price-current">${currency.format(product.price)}</strong><span class="price-old">${currency.format(product.oldPrice)}</span><span class="discount-badge">-${product.discount}%</span></div>
        <p class="detail-description">${escapeHtml(product.longDescription)}</p>
        <span class="option-label">Colour: <span id="selected-color">${selectedColor}</span></span>
        <div class="color-options">${product.colors.map((color) => `<button class="color-choice${selectedColor === color ? ' active' : ''}" data-color="${color}" aria-label="${color}" aria-pressed="${selectedColor === color}"><span style="background:${colors[color]}"></span></button>`).join('')}</div>
        ${product.sizes.length ? `<span class="option-label">Size: <span id="selected-size">${selectedSize || 'Choose a size'}</span></span><div class="size-options">${product.sizes.map((size) => `<button class="size-choice${selectedSize === size ? ' active' : ''}" data-size="${size}" aria-pressed="${selectedSize === size}">${size}</button>`).join('')}</div>` : ''}
        <span class="option-label">Quantity</span>
        <div class="quantity-control"><button data-detail-quantity="-1" aria-label="Decrease quantity">−</button><span>${detailQuantity}</span><button data-detail-quantity="1" aria-label="Increase quantity">+</button></div>
        <div class="detail-actions"><button class="button button-primary cart-add-pop" id="detail-add-cart">Add to cart</button><button class="button button-dark" id="detail-buy-now">Buy now</button></div>

        <div class="reviews-section">
          <div class="reviews-header">
            <h3>Customer Reviews (${formatReviews(product.reviewCount)} reviews)</h3>
          </div>
          <div class="rating-summary">
            <div class="rating-avg">${product.rating}</div>
            <div class="flex flex-row items-center gap-0.5 star-twinkle">
              <div class="flex flex-row">${renderStars(product.rating, false)}</div>
              <span class="text-xs text-gray-500 ml-1">(${formatReviews(product.reviewCount)})</span>
            </div>
          </div>
          <div class="rating-breakdown">
            ${breakdownHtml}
          </div>
          <div class="review-list">
            ${reviewsHtml}
          </div>
          ${reviewFormHtml}
        </div>
      </div>
    </div>`;
}

function openProduct(id) {
  selectedProduct = catalogProducts.find((product) => product.id === id);
  if (!selectedProduct) return;
  detailQuantity = 1;
  selectedColor = 'Black';
  selectedSize = '';
  renderDetail();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeProduct() {
  selectedProduct = null;
  elements.detail.hidden = true;
  elements.catalog.hidden = false;
  renderProducts();
}

function getProductById(id) {
  return catalogProducts.find((product) => product.id === id) ?? null;
}

function buildCartKey(productId, color = '', size = '') {
  return `${productId}::${color || '-'}::${size || '-'}`;
}

function normalizeCartItem(raw, fallbackProductId = '') {
  if (!raw || typeof raw !== 'object') return null;
  const quantity = Math.floor(Number(raw.quantity));
  if (!Number.isFinite(quantity) || quantity <= 0) return null;
  const productId = typeof raw.productId === 'string' && raw.productId ? raw.productId : fallbackProductId;
  if (!productId) return null;
  return {
    productId,
    quantity,
    color: typeof raw.color === 'string' ? raw.color : '',
    size: typeof raw.size === 'string' ? raw.size : '',
  };
}

function renderCartLine(key, item, product) {
  const lineTotal = product.price * item.quantity;
  const options = [item.color, item.size ? `Size ${item.size}` : ''].filter(Boolean).join(' · ');
  return `<div class="cart-line" data-cart-line="${escapeHtml(key)}">
    <img class="cart-line-image" src="${escapeHtml(product.image)}" data-image-old="${escapeHtml(product.old)}" alt="${escapeHtml(product.name)}" loading="lazy" />
    <div class="cart-line-body">
      <h3 class="cart-line-name" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h3>
      ${options ? `<span class="cart-line-option">${escapeHtml(options)}</span>` : ''}
      <div class="cart-line-price">
        <span class="cart-line-unit">${currency.format(product.price)} each</span>
        <strong class="cart-line-total">${currency.format(lineTotal)}</strong>
      </div>
      <div class="quantity-control">
        <button type="button" data-cart-quantity="-1" aria-label="Decrease quantity of ${escapeHtml(product.name)}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-cart-quantity="1" aria-label="Increase quantity of ${escapeHtml(product.name)}">+</button>
      </div>
    </div>
    <button class="cart-line-remove" type="button" data-remove-item aria-label="Remove ${escapeHtml(product.name)} from cart">×</button>
  </div>`;
}

function updateCart() {
  const entries = Object.entries(cart)
    .map(([key, item]) => [key, normalizeCartItem(item, key.split('::')[0])])
    .filter(([, item]) => item !== null);

  if (entries.length !== Object.keys(cart).length) {
    cart = Object.fromEntries(entries.map(([key, item]) => [key, item]));
  }

  saveStorage('achor-cart', cart);

  const resolved = entries
    .map(([key, item]) => [key, item, getProductById(item.productId)])
    .filter(([, , product]) => product !== null);

  const totalItems = resolved.reduce((sum, [, item]) => sum + item.quantity, 0);
  const total = resolved.reduce((sum, [, item, product]) => sum + product.price * item.quantity, 0);

  elements.cartCount.textContent = String(totalItems);
  elements.cartCount.setAttribute('aria-label', `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in cart`);
  elements.cartTitleCount.textContent = `(${totalItems})`;
  elements.cartTotal.textContent = currency.format(total);
  elements.cartEmpty.hidden = resolved.length > 0;
  elements.cartFooter.hidden = resolved.length === 0;

  const waitingForCatalog = resolved.length === 0 && entries.length > 0 && !catalogReady;
  elements.cartItems.hidden = resolved.length === 0 && !waitingForCatalog;

  const scrollTop = elements.cartItems.scrollTop;
  elements.cartItems.innerHTML = waitingForCatalog
    ? '<p class="cart-loading">Loading your cart…</p>'
    : resolved.map(([key, item, product]) => renderCartLine(key, item, product)).join('');
  elements.cartItems.scrollTop = scrollTop;
}

function addToCart(id, quantity = 1, color = 'Black', size = '') {
  const product = getProductById(id);
  if (!product) {
    showToast('That product is not available right now.');
    return false;
  }
  const amount = Math.max(1, Math.floor(Number(quantity) || 1));
  const key = buildCartKey(product.id, color, size);
  const existing = normalizeCartItem(cart[key], product.id);
  cart[key] = existing
    ? { ...existing, quantity: existing.quantity + amount }
    : { productId: product.id, quantity: amount, color: color || '', size: size || '' };
  updateCart();
  pulseCartBadge();
  showToast(`${product.name} added to your cart`);
  openCart();
  return true;
}

function setWishlist(id) {
  const productId = id;
  if (wishlist.has(productId)) {
    wishlist.delete(productId);
    showToast('Removed from your wishlist');
  } else {
    wishlist.add(productId);
    showToast('Added to your wishlist');
  }
  saveStorage('achor-wishlist', [...wishlist]);
  renderProducts();
}

const drawerLayout = window.matchMedia('(max-width: 1024px)');

function isDrawerLayout() {
  return drawerLayout.matches;
}

function syncBodyScrollLock() {
  const drawerOpen = isDrawerLayout() && elements.sidebar.classList.contains('open');
  const cartOpen = elements.cartSidebar.classList.contains('open');
  document.body.style.overflow = drawerOpen || cartOpen ? 'hidden' : '';
}

function pulseCartBadge() {
  elements.cartCount.classList.remove('cart-badge-pop');
  void elements.cartCount.offsetWidth;
  elements.cartCount.classList.add('cart-badge-pop');
}

function focusCartControl(key, delta) {
  requestAnimationFrame(() => {
    const line = elements.cartItems.querySelector(`[data-cart-line="${CSS.escape(key)}"]`);
    if (!line) {
      document.querySelector('#close-cart')?.focus();
      return;
    }
    const selector = delta > 0 ? '[data-cart-quantity="1"]' : '[data-cart-quantity="-1"]';
    line.querySelector(selector)?.focus();
  });
}

function openCart() {
  if (elements.cartSidebar.classList.contains('open')) return;
  elements.cartOverlay.hidden = false;
  void elements.cartOverlay.offsetWidth;
  elements.cartOverlay.classList.add('open');
  elements.cartSidebar.classList.add('open');
  elements.cartSidebar.setAttribute('aria-hidden', 'false');
  document.querySelector('#open-cart').setAttribute('aria-expanded', 'true');
  syncBodyScrollLock();
  requestAnimationFrame(() => document.querySelector('#close-cart')?.focus());
}

function closeCart() {
  const hadFocus = elements.cartSidebar.contains(document.activeElement);
  elements.cartOverlay.classList.remove('open');
  elements.cartSidebar.classList.remove('open');
  elements.cartSidebar.setAttribute('aria-hidden', 'true');
  document.querySelector('#open-cart').setAttribute('aria-expanded', 'false');
  syncBodyScrollLock();
  window.setTimeout(() => {
    if (!elements.cartOverlay.classList.contains('open')) elements.cartOverlay.hidden = true;
  }, 300);
  if (hadFocus) document.querySelector('#open-cart').focus();
}

function setCategory(category) {
  activeCategory = category;
  currentPage = 1;
  renderCategories();
  renderProducts();
  if (elements.sidebar.classList.contains('open')) closeCategories();
}

function openCategories() {
  elements.sidebar.classList.add('open');
  elements.categoryScrim.classList.add('open');
  document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'true');
  syncBodyScrollLock();
  if (isDrawerLayout()) requestAnimationFrame(() => document.querySelector('#close-categories')?.focus());
}

function closeCategories() {
  elements.sidebar.classList.remove('open');
  elements.categoryScrim.classList.remove('open');
  document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false');
  syncBodyScrollLock();
}

function setSearch(value) {
  searchQuery = value;
  currentPage = 1;
  document.querySelector('#search-input').value = value;
  document.querySelector('#mobile-search-input').value = value;
  renderProducts();
}

async function submitAuthForm(event) {
  event.preventDefault();
  setAuthMessage('');
  if (!supabase) {
    setAuthMessage("Don't have an account? Click 'Create an account' below to sign up.", 'error');
    return;
  }

  const email = elements.authEmail.value.trim();
  const password = elements.authPassword.value;
  try {
    if (authMode === 'signup') {
      const fullName = elements.authName.value.trim();
      if (!fullName) {
        setAuthMessage('Enter your name to create an account.', 'error');
        elements.authName.focus();
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      if (data.session) {
        currentUser = data.user;
        renderAuthUser();
        elements.authDialog.close();
        showToast('Your account has been created and you are signed in.');
      } else {
        setAuthMessage('Check your email for a confirmation link to complete your registration.', 'success');
      }
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    currentUser = data.user;
    renderAuthUser();
    elements.authDialog.close();
    showToast('Welcome back! You are signed in.');
  } catch (error) {
    setAuthMessage(error.message || 'Invalid email or password. Please check your details and try again.', 'error');
  }
}

async function initializeCatalog() {
  try {
    const response = await fetch('/image-map.json');
    if (!response.ok) throw new Error(`Image map request failed with status ${response.status}`);
    const imageMap = await response.json();
    if (!imageMap || typeof imageMap !== 'object' || Array.isArray(imageMap)) {
      throw new Error('Image map must be an object of category filenames.');
    }
    for (const imageCategory of Object.values(imageCategoryByProductCategory)) {
      if (!Array.isArray(imageMap[imageCategory])) {
        throw new Error(`Image map is missing the "${imageCategory}" category.`);
      }
    }

    catalogProducts = createProducts(products, imageMap);
    productsByOldName = new Map(catalogProducts.map((product) => [product.old, product]));
    homepageProducts.forEach((product) => console.log(`${product.old} -> ${product.title}`));
    const validProductIds = new Set(catalogProducts.map((product) => product.id));
    cart = Object.fromEntries(
      Object.entries(cart).flatMap(([key, raw]) => {
        const item = normalizeCartItem(raw, key.split('::')[0]);
        if (!item || !validProductIds.has(item.productId)) return [];
        return [[buildCartKey(item.productId, item.color, item.size), item]];
      })
    );
    wishlist = new Set([...wishlist].filter((id) => validProductIds.has(id)));
    catalogReady = true;
    renderCategories();
    renderProducts();
    updateCart();
    if (catalogProducts.length === 0) {
      elements.title.textContent = 'No products available';
      elements.empty.hidden = false;
      elements.grid.hidden = true;
      elements.empty.querySelector('h3').textContent = 'No products found';
      elements.empty.querySelector('p').textContent = 'No products are available in the product catalog.';
      elements.empty.querySelector('#clear-filters').hidden = true;
    }
  } catch (error) {
    console.error('Unable to load the product catalog and its image paths.', error);
    elements.title.textContent = 'Products unavailable';
    elements.count.textContent = '';
    elements.grid.hidden = true;
    elements.empty.hidden = false;
    elements.empty.querySelector('h3').textContent = 'Products unavailable';
    elements.empty.querySelector('p').textContent = 'The product catalog or image paths could not be loaded. Check the console for details.';
    elements.empty.querySelector('#clear-filters').hidden = true;
  }
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initFooterFadeIn() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  observer.observe(footer);
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const category = event.target.closest('[data-category]');
  if (category) {
    setCategory(category.dataset.category);
    return;
  }
  const pageButton = event.target.closest('[data-page-change]');
  if (pageButton) {
    currentPage += Number(pageButton.dataset.pageChange);
    renderProducts();
    elements.catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const addButton = event.target.closest('[data-add-cart]');
  if (addButton) {
    addToCart(addButton.dataset.addCart);
    addButton.classList.add('cart-add-pop');
    setTimeout(() => addButton.classList.remove('cart-add-pop'), 450);
    return;
  }
  const wishlistButton = event.target.closest('[data-wishlist]');
  if (wishlistButton) {
    setWishlist(wishlistButton.dataset.wishlist);
    if (wishlistButton.classList.contains('active')) {
      wishlistButton.style.animation = 'pulseHeart .34s ease';
      setTimeout(() => wishlistButton.style.animation = '', 340);
    }
    return;
  }
  const productImage = event.target.closest('[data-open-product]');
  if (productImage) {
    openProduct(productImage.dataset.openProduct);
    return;
  }
  if (event.target.closest('#open-cart')) openCart();
  if (event.target.closest('#close-cart') || event.target === elements.cartOverlay) closeCart();
  if (event.target.closest('#menu-toggle') || event.target.closest('#open-categories')) openCategories();
  if (event.target.closest('#close-categories') || event.target === elements.categoryScrim) closeCategories();
  if (event.target.closest('#back-to-products')) closeProduct();
  if (event.target.closest('#clear-filters')) {
    activeCategory = 'all';
    setSearch('');
    renderCategories();
  }
  if (event.target.closest('#account-button')) openAuthDialog();
  if (event.target.closest('#close-auth')) elements.authDialog.close();
  if (event.target.closest('#auth-mode-toggle')) setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  if (event.target.closest('#sign-out-button') && supabase) {
    supabase.auth.signOut().then(({ error }) => {
      if (error) throw error;
      currentUser = null;
      renderAuthUser();
      setAuthMode('signin');
      showToast('You have signed out.');
    }).catch((error) => {
      setAuthMessage(error.message || 'Unable to sign out. Please try again.', 'error');
    });
  }
  if (event.target.closest('#checkout-button')) showToast('Checkout is coming soon. Your cart is saved.');
  if (event.target.closest('#detail-add-cart') && selectedProduct) {
    if (selectedProduct.sizes.length && !selectedSize) {
      showToast('Please choose a size first.');
      return;
    }
    addToCart(selectedProduct.id, detailQuantity, selectedColor, selectedSize);
    const btn = event.target.closest('#detail-add-cart');
    btn.classList.add('cart-add-pop');
    setTimeout(() => btn.classList.remove('cart-add-pop'), 450);
  }
  if (event.target.closest('#detail-buy-now') && selectedProduct) {
    if (selectedProduct.sizes.length && !selectedSize) {
      showToast('Please choose a size first.');
      return;
    }
    addToCart(selectedProduct.id, detailQuantity, selectedColor, selectedSize);
    openCart();
  }
  const color = event.target.closest('[data-color]');
  if (color && selectedProduct) {
    selectedColor = color.dataset.color;
    renderDetail();
  }
  const size = event.target.closest('[data-size]');
  if (size && selectedProduct) {
    selectedSize = size.dataset.size;
    renderDetail();
  }
  const detailQuantityButton = event.target.closest('[data-detail-quantity]');
  if (detailQuantityButton && selectedProduct) {
    detailQuantity = Math.max(1, detailQuantity + Number(detailQuantityButton.dataset.detailQuantity));
    renderDetail();
  }
  const cartQuantityButton = event.target.closest('[data-cart-quantity]');
  if (cartQuantityButton) {
    const key = cartQuantityButton.closest('[data-cart-line]')?.dataset.cartLine;
    const item = key ? cart[key] : null;
    if (item) {
      const delta = Number(cartQuantityButton.dataset.cartQuantity) || 0;
      const quantity = item.quantity + delta;
      if (quantity <= 0) delete cart[key];
      else cart[key] = { ...item, quantity };
      updateCart();
      focusCartControl(key, delta);
    }
    return;
  }
  const removeButton = event.target.closest('[data-remove-item]');
  if (removeButton) {
    const key = removeButton.closest('[data-cart-line]')?.dataset.cartLine;
    if (key) {
      const product = getProductById(cart[key]?.productId);
      delete cart[key];
      updateCart();
      if (product) showToast(`${product.name} removed from your cart`);
    }
    return;
  }
  if (event.target.closest('#signin-for-review')) openAuthDialog();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeCart();
    closeCategories();
  }
  if (event.key === 'Enter' && event.target instanceof HTMLElement && event.target.matches('[data-open-product]')) {
    openProduct(event.target.dataset.openProduct);
  }
});

document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  setSearch(document.querySelector('#search-input').value);
});
document.querySelector('#search-input').addEventListener('input', (event) => setSearch(event.target.value));
document.querySelector('#mobile-search-form').addEventListener('submit', (event) => event.preventDefault());
document.querySelector('#mobile-search-input').addEventListener('input', (event) => setSearch(event.target.value));
elements.authForm.addEventListener('submit', submitAuthForm);
elements.authDialog.addEventListener('click', (event) => {
  if (event.target === elements.authDialog) elements.authDialog.close();
});

document.querySelector('#mobile-search-toggle').addEventListener('click', () => {
  const row = document.querySelector('#mobile-search-row');
  row.classList.toggle('open');
  document.querySelector('#mobile-search-toggle').setAttribute('aria-expanded', String(row.classList.contains('open')));
  if (row.classList.contains('open')) document.querySelector('#mobile-search-input').focus();
});

drawerLayout.addEventListener('change', () => {
  if (!isDrawerLayout()) {
    elements.sidebar.classList.remove('open');
    elements.categoryScrim.classList.remove('open');
    document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false');
  }
  syncBodyScrollLock();
});

function attachImageFallback(root) {
  root.addEventListener('error', (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) return;
    const oldName = image.dataset.imageOld;
    if (oldName) {
      const product = productsByOldName.get(oldName);
      if (!product) {
        console.error(`Product image failed to load for old name "${oldName}".`);
      } else {
        const candidates = getImageCandidates(product);
        const nextAttempt = Number(image.dataset.imageAttempt || 0) + 1;
        if (nextAttempt < candidates.length) {
          image.dataset.imageAttempt = String(nextAttempt);
          image.src = candidates[nextAttempt];
          return;
        }
        console.error(`Product image failed to load for old name "${oldName}".`);
      }
    }
    const fallback = document.createElement('div');
    fallback.className = 'image-fallback';
    fallback.setAttribute('role', 'img');
    fallback.setAttribute('aria-label', image.getAttribute('alt') || 'Achor');
    fallback.textContent = 'Achor';
    image.replaceWith(fallback);
  }, true);
}

attachImageFallback(elements.grid);
attachImageFallback(elements.cartItems);
attachImageFallback(elements.detail);

renderCategories();
updateCart();
document.querySelector('#year').textContent = String(new Date().getFullYear());
initHeaderScroll();
initFooterFadeIn();
initializeCatalog();
initializeAuth();
