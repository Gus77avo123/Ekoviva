// --- SISTEMA DE TRADUÇÃO ---
const translations = {
    loginTitle: { pt: 'Acesse sua Conta', en: 'Access Your Account' },
    placeholderEmail: { pt: 'E-mail', en: 'E-mail' },
    placeholderPassword: { pt: 'Senha', en: 'Password' },
    loginButton: { pt: 'Entrar', en: 'Sign In' },
    loginButtonLoading: { pt: '<i class="bi bi-arrow-repeat"></i> Verificando...', en: '<i class="bi bi-arrow-repeat"></i> Verifying...' },
    noAccount: { pt: 'Não tem uma conta? <a href="cadastro.html">Cadastre-se</a>', en: 'Don\'t have an account? <a href="cadastro.html">Sign up</a>' },
    backToHome: { pt: 'Voltar à Página Inicial', en: 'Back to Homepage' },
    // Mensagens
    successWelcome: { pt: 'Bem-vindo, {name}! Redirecionando...', en: 'Welcome, {name}! Redirecting...' },
    errorWrongPass: { pt: 'Senha incorreta. Tente novamente.', en: 'Incorrect password. Please try again.' },
    errorUserNotFound: { pt: 'E-mail não cadastrado. <a href="cadastro.html">Cadastre-se aqui</a>.', en: 'E-mail not registered. <a href="cadastro.html">Sign up here</a>.' },
    // Rodapé
    footerDesc: { pt: 'Um projeto de estudantes de ADS para um mundo mais sustentável.', en: 'A project by Systems Analysis students for a more sustainable world.' },
    footerNav: { pt: 'Navegação', en: 'Navigation' },
    footerAbout: { pt: 'Sobre o Projeto', en: 'About the Project' },
    footerProducts: { pt: 'Produtos', en: 'Products' },
    footerRegister: { pt: 'Cadastro', en: 'Register' },
    footerSocial: { pt: 'Siga-nos', en: 'Follow Us' },
    footerRights: { pt: '© 2025 eKoviva - Projeto Integrador Acadêmico. Todos os direitos reservados.', en: '© 2025 eKoviva - Academic Capstone Project. All rights reserved.' },
};

const languageLinks = document.querySelectorAll('.lang-link');
let currentLang = localStorage.getItem('language') || 'pt';

const setLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    document.querySelectorAll('[data-lang-key]').forEach(elem => {
        const key = elem.getAttribute('data-lang-key');
        if (translations[key] && translations[key][lang]) {
            elem.innerHTML = translations[key][lang];
        }
    });

    document.querySelectorAll('[data-placeholder-key]').forEach(elem => {
        const key = elem.getAttribute('data-placeholder-key');
        if (translations[key] && translations[key][lang]) {
            elem.placeholder = translations[key][lang];
        }
    });

    languageLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active');
        }
    });
};

languageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedLang = link.getAttribute('data-lang');
        setLanguage(selectedLang);
    });
});

// --- FIM DO SISTEMA DE TRADUÇÃO ---

document.addEventListener('DOMContentLoaded', function() {
    setLanguage(currentLang); // Aplica o idioma na carga da página

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const messageEl = document.getElementById("message");
    const loginButton = document.getElementById("login-button");
    const togglePasswordIcon = document.getElementById("password-toggle-icon");

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = emailInput.value;
        const senha = senhaInput.value;
        messageEl.style.display = 'none';
        messageEl.className = 'message';
        loginButton.disabled = true;
        loginButton.innerHTML = translations.loginButtonLoading[currentLang];
        
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        const clientePorEmail = clientes.find(cliente => cliente.email === email);
        
        setTimeout(() => {
            if (clientePorEmail) {
                if (clientePorEmail.senha === senha) {
                    messageEl.classList.add("success");
                    messageEl.textContent = translations.successWelcome[currentLang].replace('{name}', clientePorEmail.nome);
                    localStorage.setItem("clienteLogado", JSON.stringify(clientePorEmail));
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1500);
                } else {
                    messageEl.classList.add("error");
                    messageEl.textContent = translations.errorWrongPass[currentLang];
                    loginButton.disabled = false;
                    loginButton.innerHTML = translations.loginButton[currentLang];
                }
            } else {
                messageEl.classList.add("error");
                messageEl.innerHTML = translations.errorUserNotFound[currentLang];
                loginButton.disabled = false;
                loginButton.innerHTML = translations.loginButton[currentLang];
            }
        }, 1000);
    });

    togglePasswordIcon.addEventListener('click', function() {
        const isPassword = senhaInput.type === 'password';
        senhaInput.type = isPassword ? 'text' : 'password';
        this.classList.toggle('bi-eye');
        this.classList.toggle('bi-eye-slash');
    });
});