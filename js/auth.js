// Autenticação simples (não usar em produção)
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se já está na página de login
    if (window.location.pathname.includes('login.html')) {
        // Se já estiver logado, redireciona para o painel
        if (localStorage.getItem('isAdminLoggedIn')) {
            window.location.href = 'admin.html';
        }
        
        // Configura o formulário de login
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Credenciais simples (em produção, usar sistema seguro)
            if (username === 'admin' && password === 'doce123') {
                localStorage.setItem('isAdminLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                document.getElementById('loginError').textContent = 'Usuário ou senha incorretos';
            }
        });
    }
    
    // Se estiver no painel e não logado, redireciona para login
    if (window.location.pathname.includes('admin.html') && !localStorage.getItem('isAdminLoggedIn')) {
        window.location.href = 'login.html';
    }
});