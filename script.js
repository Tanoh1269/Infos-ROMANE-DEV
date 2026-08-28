// ==================== GLOBAL VARIABLES ====================
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let adminLoggedIn = false;

// ==================== DOM ELEMENTS ====================
const boutiquePage = document.getElementById('boutiquePage');
const adminPage = document.getElementById('adminPage');
const loginModal = document.getElementById('loginModal');
const cartModal = document.getElementById('cartModal');
const paymentModal = document.getElementById('paymentModal');
const productFormModal = document.getElementById('productFormModal');
const overlay = document.getElementById('overlay');
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const closeCart = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const closeLogin = document.getElementById('closeLogin');
const adminLogout = document.getElementById('adminLogout');
const closePayment = document.getElementById('closePayment');
const adminProductsTable = document.getElementById('adminProductsTable');
const productsGrid = document.getElementById('productsGrid');
const addProductAdminBtn = document.getElementById('addProductAdminBtn');
const cancelProductForm = document.getElementById('cancelProductForm');
const saveProductBtn = document.getElementById('saveProductBtn');
const productAdminForm = document.getElementById('productAdminForm');
const adminUsername = document.getElementById('adminUsername');
const adminPassword = document.getElementById('adminPassword');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Check if admin is already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPanel();
    }
    
    // Load products and initialize the app
    loadProducts();
    updateCartCount();
    setupEventListeners();
    
    // Initialize admin navigation
    initAdminNavigation();
});

// ==================== PRODUCTS MANAGEMENT ====================
function loadProducts() {
    // Sample products data
    products = [
        {
            id: 1,
            name: "Drone DJI Mavic 3",
            description: "Drone professionnel avec caméra 4K",
            price: 450000,
            stock: 5,
            category: "drone",
            image: "https://images.unsplash.com/photo-1524143986875-3b098d78b363?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            status: "active",
            reference: "DR001"
        },
        {
            id: 2,
            name: "Casque VR Oculus",
            description: "Casque de réalité virtuelle dernière génération",
            price: 250000,
            stock: 8,
            category: "electronique",
            image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            status: "active",
            reference: "VR002"
        },
        {
            id: 3,
            name: "Batterie Externe 30000mAh",
            description: "Batterie portable haute capacité",
            price: 35000,
            stock: 15,
            category: "accessoire",
            image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            status: "active",
            reference: "BAT003"
        },
        {
            id: 4,
            name: "Camera GoPro Hero 10",
            description: "Camera d'action étanche 4K",
            price: 300000,
            stock: 3,
            category: "electronique",
            image: "https://images.unsplash.com/photo-1553452118-621e1f860f43?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            status: "active",
            reference: "CAM004"
        }
    ];
    
    // Render products in boutique
    renderProducts();
    
    // Render products in admin panel
    renderAdminProducts();
}

function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        if (product.status === 'active') {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-price">${formatPrice(product.price)} FCFA</span>
                        <span class="product-stock">${product.stock} en stock</span>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Ajouter au panier
                    </button>
                </div>
            `;
            productsGrid.appendChild(productCard);
        }
    });
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.add-to-cart-btn').dataset.id);
            addToCart(productId);
        });
    });
}

function renderAdminProducts() {
    adminProductsTable.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    <span>${product.name}</span>
                </div>
            </td>
            <td>${product.reference}</td>
            <td>${product.category}</td>
            <td>${formatPrice(product.price)} FCFA</td>
            <td>${product.stock}</td>
            <td>
                <span class="status-${product.status}">
                    ${product.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" data-id="${product.id}">Modifier</button>
                    <button class="delete-btn" data-id="${product.id}">Supprimer</button>
                </div>
            </td>
        `;
        adminProductsTable.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            deleteProduct(productId);
        });
    });
}

// ==================== CART MANAGEMENT ====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    if (product.stock <= 0) {
        alert('Ce produit est en rupture de stock');
        return;
    }
    
    // Check if product is already in cart
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveCartToLocalStorage();
    
    // Show confirmation
    alert(`${product.name} a été ajouté au panier`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCartItems();
    saveCartToLocalStorage();
}

function updateCartQuantity(productId, newQuantity) {
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            cartItem.quantity = newQuantity;
            updateCartCount();
            renderCartItems();
            saveCartToLocalStorage();
        }
    }
}

function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartTotal.textContent = '0 FCFA';
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)} FCFA</div>
                </div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
            </div>
            <div>
                <button class="remove-item-btn" data-id="${item.id}">Supprimer</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners for quantity buttons
    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                updateCartQuantity(productId, cartItem.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                // Check stock availability
                const product = products.find(p => p.id === productId);
                if (product && cartItem.quantity < product.stock) {
                    updateCartQuantity(productId, cartItem.quantity + 1);
                } else {
                    alert('Stock insuffisant pour ce produit');
                }
            }
        });
    });
    
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            removeFromCart(productId);
        });
    });
    
    cartTotal.textContent = `${formatPrice(total)} FCFA`;
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ==================== MODAL MANAGEMENT ====================
function showModal(modal) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showCartModal() {
    renderCartItems();
    showModal(cartModal);
}

function showLoginModal() {
    showModal(loginModal);
}

function showPaymentModal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('paymentAmount').value = `${formatPrice(total)} FCFA`;
    showModal(paymentModal);
}

function showProductFormModal(product = null) {
    const formTitle = document.getElementById('productFormTitle');
    const form = document.getElementById('productAdminForm');
    
    if (product) {
        formTitle.textContent = 'Modifier le produit';
        document.getElementById('productNameAdmin').value = product.name;
        document.getElementById('productRefAdmin').value = product.reference;
        document.getElementById('productPriceAdmin').value = product.price;
        document.getElementById('productStockAdmin').value = product.stock;
        document.getElementById('productCategoryAdmin').value = product.category;
        document.getElementById('productStatusAdmin').value = product.status;
        document.getElementById('productDescriptionAdmin').value = product.description;
        document.getElementById('productImageAdmin').value = product.image;
        saveProductBtn.dataset.id = product.id;
    } else {
        formTitle.textContent = 'Ajouter un produit';
        form.reset();
        delete saveProductBtn.dataset.id;
    }
    
    showModal(productFormModal);
}

// ==================== ADMIN MANAGEMENT ====================
function showAdminPanel() {
    boutiquePage.style.display = 'none';
    adminPage.style.display = 'block';
    adminLoggedIn = true;
    localStorage.setItem('adminLoggedIn', 'true');
}

function hideAdminPanel() {
    boutiquePage.style.display = 'block';
    adminPage.style.display = 'none';
    adminLoggedIn = false;
    localStorage.setItem('adminLoggedIn', 'false');
}

function initAdminNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Show corresponding section
            const sectionId = link.dataset.section + 'Section';
            const sections = document.querySelectorAll('.admin-section');
            
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            document.getElementById(sectionId).style.display = 'block';
        });
    });
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showProductFormModal(product);
    }
}

function deleteProduct(productId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        products = products.filter(p => p.id !== productId);
        renderAdminProducts();
        renderProducts();
    }
}

function saveProduct(formData) {
    const productId = saveProductBtn.dataset.id;
    
    if (productId) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...formData,
                id: parseInt(productId)
            };
        }
    } else {
        // Add new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            ...formData,
            id: newId,
            status: 'active'
        });
    }
    
    renderAdminProducts();
    renderProducts();
    hideModal(productFormModal);
}

// ==================== EVENT LISTENERS SETUP ====================
function setupEventListeners() {
    // Cart icon click
    cartIcon.addEventListener('click', showCartModal);
    
    // Close cart modal
    closeCart.addEventListener('click', () => hideModal(cartModal));
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Votre panier est vide');
            return;
        }
        hideModal(cartModal);
        showPaymentModal();
    });
    
    // Admin login button
    adminLoginBtn.addEventListener('click', showLoginModal);
    
    // Close login modal
    closeLogin.addEventListener('click', () => hideModal(loginModal));
    
    // Admin logout
    adminLogout.addEventListener('click', () => {
        hideAdminPanel();
        hideModal(loginModal);
    });
    
    // Close payment modal
    closePayment.addEventListener('click', () => hideModal(paymentModal));
    
    // Add product admin button
    addProductAdminBtn.addEventListener('click', () => showProductFormModal());
    
    // Cancel product form
    cancelProductForm.addEventListener('click', () => hideModal(productFormModal));
    
    // Save product form
    productAdminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('productNameAdmin').value,
            reference: document.getElementById('productRefAdmin').value,
            price: parseInt(document.getElementById('productPriceAdmin').value),
            stock: parseInt(document.getElementById('productStockAdmin').value),
            category: document.getElementById('productCategoryAdmin').value,
            status: document.getElementById('productStatusAdmin').value,
            description: document.getElementById('productDescriptionAdmin').value,
            image: document.getElementById('productImageAdmin').value || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        };
        
        saveProduct(formData);
    });
    
    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = adminUsername.value;
        const password = adminPassword.value;
        
        // Check credentials (in a real app, this would be server-side)
        if (username === 'Romane' && password === 'Romane@12') {
            hideModal(loginModal);
            showAdminPanel();
            loginError.style.display = 'none';
        } else {
            loginError.style.display = 'block';
        }
    });
    
    // Overlay click to close modals
    overlay.addEventListener('click', () => {
        hideModal(loginModal);
        hideModal(cartModal);
        hideModal(paymentModal);
        hideModal(productFormModal);
    });
    
    // Payment method selection
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            document.querySelectorAll('.payment-option').forEach(o => {
                o.classList.remove('active');
            });
            
            // Add active class to selected option
            option.classList.add('active');
            
            // Show payment form
            document.getElementById('paymentForm').style.display = 'block';
        });
    });
    
    // Confirm payment
    document.getElementById('confirmPayment').addEventListener('click', () => {
        const phoneNumber = document.getElementById('phoneNumber').value;
        
        if (!phoneNumber) {
            alert('Veuillez entrer votre numéro de téléphone');
            return;
        }
        
        // In a real app, you would process the payment here
        alert(`Paiement en cours... Un SMS de confirmation sera envoyé au ${phoneNumber}`);
        
        // Clear cart after successful payment
        cart = [];
        updateCartCount();
        saveCartToLocalStorage();
        
        // Close payment modal
        hideModal(paymentModal);
        
        // Show success message
        alert('Commande confirmée ! Vous recevrez un SMS de confirmation.');
    });
}

// ==================== UTILITY FUNCTIONS ====================
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Handle image upload for product form
document.getElementById('produitPhoto')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // In a real app, you would upload the file to a server
        // For demo purposes, we'll just show a message
        alert(`Image "${file.name}" sélectionnée. Dans une application réelle, cette image serait téléchargée sur le serveur.`);
        
        // For demo, we could create a local URL and display it
        const reader = new FileReader();
        reader.onload = function(event) {
            // This would be the image URL if uploaded to server
            // For now, we'll just use a placeholder
            document.getElementById('productImageAdmin').value = 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
        };
        reader.readAsDataURL(file);
    }
});

// ==================== SAMPLE ORDERS DATA ====================
const sampleOrders = [
    { id: 1001, customer: 'Jean Dupont', date: '2024-03-15', amount: 125000, status: 'Livré' },
    { id: 1002, customer: 'Marie Curie', date: '2024-03-14', amount: 85000, status: 'En cours' },
    { id: 1003, customer: 'Paul Martin', date: '2024-03-13', amount: 210000, status: 'Livré' },
    { id: 1004, customer: 'Sophie Lambert', date: '2024-03-12', amount: 75000, status: 'Annulé' },
    { id: 1005, customer: 'Lucie Bernard', date: '2024-03-11', amount: 150000, status: 'En cours' }
];

// Render sample orders in admin dashboard
function renderAdminOrders() {
    const ordersTable = document.getElementById('adminOrdersTable');
    if (ordersTable) {
        ordersTable.innerHTML = '';
        
        sampleOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${formatPrice(order.amount)} FCFA</td>
                <td>
                    <span style="
                        padding: 5px 10px;
                        border-radius: 15px;
                        font-size: 12px;
                        font-weight: 500;
                        background-color: ${getStatusColor(order.status)};
                        color: white;
                    ">
                        ${order.status}
                    </span>
                </td>
            `;
            ordersTable.appendChild(row);
        });
    }
}

function getStatusColor(status) {
    switch(status.toLowerCase()) {
        case 'livré': return '#27ae60';
        case 'en cours': return '#3498db';
        case 'annulé': return '#e74c3c';
        default: return '#7f8c8d';
    }
}

// Initialize orders on page load
document.addEventListener('DOMContentLoaded', renderAdminOrders);