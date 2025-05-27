// Carrega os produtos e inicializa a loja
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se há produtos no localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Se não houver produtos, carrega os padrões
    if (products.length === 0) {
        products = [
            {
                id: 1,
                name: 'Brownie Tradicional',
                description: 'O clássico brownie no pote, feito com chocolate meio amargo e nozes.',
                price: 12.90,
                image: 'images/products/brownie1.jpg'
            },
            {
                id: 2,
                name: 'Brownie de Ninho',
                description: 'Brownie de chocolate branco com recheio cremoso de leite ninho.',
                price: 14.90,
                image: 'images/products/brownie2.jpg'
            },
            {
                id: 3,
                name: 'Brownie de Nutella',
                description: 'Brownie de chocolate com camadas generosas de Nutella.',
                price: 15.90,
                image: 'images/products/brownie3.jpg'
            },
            {
                id: 4,
                name: 'Brownie de Oreo',
                description: 'Brownie com pedaços de biscoito Oreo e cobertura de chocolate.',
                price: 14.90,
                image: 'images/products/brownie4.jpg'
            },
            {
                id: 5,
                name: 'Brownie de Doce de Leite',
                description: 'Brownie com camadas de doce de leite caseiro e chocolate.',
                price: 14.90,
                image: 'images/products/brownie5.jpg'
            },
            {
                id: 6,
                name: 'Brownie de Morango',
                description: 'Brownie com recheio de morangos frescos e chocolate branco.',
                price: 16.90,
                image: 'images/products/brownie6.jpg'
            }
        ];
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Carrega os produtos na página
    loadProducts(products);
    
    // Inicializa o carrinho
    initCart();
    
    // Configura o dark mode
    setupDarkMode();
    
    // Configura animações ao rolar
    setupScrollAnimations();
    
    // Configura o menu mobile
    setupMobileMenu();
});

// Carrega os produtos na galeria
function loadProducts(products) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-anime', 'top');
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <button class="btn add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Adiciona eventos aos botões
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Configura o carrinho
function initCart() {
    const cartButton = document.getElementById('cartButton');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.querySelector('.close-cart');
    
    // Abre o carrinho
    cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        updateCartDisplay();
    });
    
    // Fecha o carrinho
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    cartOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    // Botão de finalizar pedido
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
}

// Adiciona produto ao carrinho
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Verifica se o produto já está no carrinho
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const products = JSON.parse(localStorage.getItem('products'));
        const productToAdd = products.find(product => product.id === productId);
        
        if (productToAdd) {
            cart.push({
                id: productToAdd.id,
                name: productToAdd.name,
                price: productToAdd.price,
                image: productToAdd.image,
                quantity: 1
            });
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddedToCartMessage();
}

// Atualiza a exibição do carrinho
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                <button class="cart-item-remove" data-id="${item.id}">Remover</button>
            </div>
        `;
        
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });
    
    // Adiciona eventos aos botões de remover
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
    
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// Remove item do carrinho
function removeFromCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartDisplay();
    updateCartCount();
}

// Atualiza o contador do carrinho
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelector('.cart-count').textContent = totalItems;
}

// Mostra mensagem de produto adicionado
function showAddedToCartMessage() {
    const message = document.createElement('div');
    message.className = 'notification';
    message.textContent = 'Produto adicionado ao carrinho!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);
}

// Finaliza o pedido via WhatsApp
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    let message = 'Olá, gostaria de fazer um pedido:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        message += `${item.name} - ${item.quantity} x R$ ${item.price.toFixed(2)}\n`;
        total += item.price * item.quantity;
    });
    
    message += `\nTotal: R$ ${total.toFixed(2)}`;
    message += '\n\nObrigado!';
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5581992749139?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Configura o dark mode
function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeStyle = document.getElementById('dark-mode-style');
    
    // Verifica preferências
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedMode = localStorage.getItem('darkMode');
    
    // Aplica o modo salvo ou do sistema
    if (savedMode === 'enabled' || (savedMode !== 'disabled' && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    // Alternância manual
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// Configura animações ao rolar
function setupScrollAnimations() {
    const animeElements = document.querySelectorAll('[data-anime]');
    const animationClass = 'animate';
    
    function animeScroll() {
        const windowTop = window.pageYOffset + (window.innerHeight * 0.85);
        
        animeElements.forEach(element => {
            if (windowTop > element.offsetTop) {
                element.classList.add(animationClass);
            }
        });
    }
    
    animeScroll();
    window.addEventListener('scroll', animeScroll);
}

// Configura menu mobile
function setupMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.nav ul');
    
    mobileMenu.addEventListener('click', function() {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // Fecha o menu ao clicar em um link
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.style.display = 'none';
            }
        });
    });
    
    // Ajusta o menu ao redimensionar a tela
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.style.display = 'flex';
        } else {
            nav.style.display = 'none';
        }
    });
}