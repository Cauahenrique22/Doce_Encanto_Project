// Painel administrativo
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário está logado
    if (!localStorage.getItem('isAdminLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Carrega os produtos na tabela
    loadProductsTable();
    
    // Configura o botão de logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Configura o modal de produtos
    setupProductModal();
});

// Carrega os produtos na tabela administrativa
function loadProductsTable() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tableBody = document.querySelector('#productsTable tbody');
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Adiciona eventos aos botões
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', editProduct);
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteProduct);
    });
    
    // Botão para adicionar novo produto
    document.getElementById('addProductBtn').addEventListener('click', function() {
        document.getElementById('modalTitle').textContent = 'Adicionar Novo Produto';
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.querySelector('.modal').classList.add('active');
    });
}

// Configura o modal de produtos
function setupProductModal() {
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Fecha o modal
    closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Fecha ao clicar fora do modal
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Submissão do formulário
    document.getElementById('productForm').addEventListener('submit', saveProduct);
}

// Edita um produto
function editProduct(e) {
    const productId = parseInt(e.currentTarget.getAttribute('data-id'));
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('modalTitle').textContent = 'Editar Produto';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImage').value = product.image;
        
        document.querySelector('.modal').classList.add('active');
    }
}

// Exclui um produto
function deleteProduct(e) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }
    
    const productId = parseInt(e.currentTarget.getAttribute('data-id'));
    let products = JSON.parse(localStorage.getItem('products'));
    
    products = products.filter(product => product.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
    
    loadProductsTable();
}

// Salva um produto (novo ou editado)
function saveProduct(e) {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value;
    
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (productId) {
        // Edita produto existente
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = {
                id: parseInt(productId),
                name,
                description,
                price,
                image
            };
        }
    } else {
        // Adiciona novo produto
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            name,
            description,
            price,
            image
        });
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    document.querySelector('.modal').classList.remove('active');
    loadProductsTable();
}

// Faz logout
function logout() {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'login.html';
}