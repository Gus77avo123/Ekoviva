document.addEventListener('DOMContentLoaded', function() {
    // --- SISTEMA DE TRADUÇÃO ---
    const translations = {
        navProducts: { pt: 'Produtos', en: 'Products' },
        navAbout: { pt: 'Sobre', en: 'About' },
        navProductsMobile: { pt: 'Produtos', en: 'Products' },
        navAboutMobile: { pt: 'Sobre', en: 'About' },
        loginButton: { pt: 'Login / Cadastrar', en: 'Login / Register' },
        heroTitle: { pt: 'Pequenas Escolhas, Grande Impacto.', en: 'Small Choices, Big Impact.' },
        heroSubtitle: { pt: 'Descubra produtos que cuidam de você e do planeta. Junte-se a nós na jornada por um futuro mais sustentável.', en: 'Discover products that care for you and the planet. Join us on the journey towards a more sustainable future.' },
        heroButton: { pt: 'Ver Produtos', en: 'View Products' },
        commitmentsTitle: { pt: 'Nossos Compromissos', en: 'Our Commitments' },
        commitmentsSubtitle: { pt: 'O eKoviva é um projeto acadêmico guiado por princípios que unem tecnologia, educação e sustentabilidade.', en: 'eKoviva is an academic project guided by principles that unite technology, education, and sustainability.' },
        commitment1Title: { pt: '100% Sustentável', en: '100% Sustainable' },
        commitment1Desc: { pt: 'Selecionamos produtos de fontes responsáveis, com materiais reciclados ou biodegradáveis.', en: 'We select products from responsible sources, with recycled or biodegradable materials.' },
        commitment2Title: { pt: 'Apoio Local', en: 'Local Support' },
        commitment2Desc: { pt: 'Valorizamos e apoiamos pequenos produtores e artesãos que compartilham da nossa visão.', en: 'We value and support small producers and artisans who share our vision.' },
        commitment3Title: { pt: 'Propósito Educacional', en: 'Educational Purpose' },
        commitment3Desc: { pt: 'Aplicamos nosso conhecimento de ADS para criar uma plataforma que inspira a mudança.', en: 'We apply our knowledge in Systems Analysis to create a platform that inspires change.' },
        featuredTitle: { pt: 'Destaques do Mês', en: 'Featured This Month' },
        featuredSubtitle: { pt: 'Nossos produtos mais amados, escolhidos para inspirar sua jornada.', en: 'Our most loved products, chosen to inspire your journey.' },
        featuredProd1Title: { pt: 'Sacola de Algodão Orgânico', en: 'Organic Cotton Bag' },
        featuredProd1Desc: { pt: 'Prática e resistente, ideal para substituir as sacolas plásticas no seu dia a dia.', en: 'Practical and durable, ideal for replacing plastic bags in your daily life.' },
        featuredProd2Title: { pt: 'Copo de Vidro Reutilizável', en: 'Reusable Glass Cup' },
        featuredProd2Desc: { pt: 'Com tampa e canudo, uma alternativa charmosa e durável aos copos descartáveis.', en: 'With a lid and straw, a charming and durable alternative to disposable cups.' },
        featuredProd3Title: { pt: 'Shampoo Sólido Natural', en: 'Natural Solid Shampoo' },
        featuredProd3Desc: { pt: 'Menos embalagem, mais benefícios. Cabelos saudáveis e um planeta mais limpo.', en: 'Less packaging, more benefits. Healthy hair and a cleaner planet.' },
        featuredProd4Title: { pt: 'Bolsa de Juta Sustentável', en: 'Sustainable Jute Bag' },
        featuredProd4Desc: { pt: 'Robusta, espaçosa e feita de material natural, perfeita para feiras e compras.', en: 'Sturdy, spacious, and made of natural material, perfect for markets and shopping.' },
        featuredProdBtn: { pt: 'Ver na Loja', en: 'View in Store' },
        productsTitle: { pt: 'Nossa Seleção Sustentável', en: 'Our Sustainable Selection' },
        productsSubtitle: { pt: 'Produtos pensados para facilitar sua rotina e diminuir sua pegada ecológica.', en: 'Products designed to ease your routine and reduce your ecological footprint.' },
        addToCart: { pt: 'Adicionar ao Carrinho', en: 'Add to Cart' },
        addedToCart: { pt: 'Adicionado!', en: 'Added!' },
        ctaTitle: { pt: 'Faça Parte da Mudança', en: 'Be Part of the Change' },
        ctaSubtitle: { pt: 'Crie sua conta para acompanhar seus pedidos e fazer parte de uma comunidade que se importa.', en: 'Create your account to track your orders and join a community that cares.' },
        ctaButton: { pt: 'Cadastre-se Agora', en: 'Sign Up Now' },
        footerDesc: { pt: 'Um projeto de estudantes de ADS para um mundo mais sustentável.', en: 'A project by Systems Analysis students for a more sustainable world.' },
        footerNav: { pt: 'Navegação', en: 'Navigation' },
        footerAbout: { pt: 'Sobre o Projeto', en: 'About the Project' },
        footerProducts: { pt: 'Produtos', en: 'Products' },
        footerRegister: { pt: 'Cadastro', en: 'Register' },
        footerContact: { pt: 'Contato', en: 'Contact' },
        footerSocial: { pt: 'Siga-nos', en: 'Follow Us' },
        footerRights: { pt: '© 2025 eKoviva - Projeto Integrador Acadêmico. Todos os direitos reservados.', en: '© 2025 eKoviva - Academic Integration Project. All rights reserved.' },
        footerLgpd: { pt: 'Este site respeita a sua privacidade. Estamos em conformidade com a Lei Geral de Proteção de Dados (LGPD). Para saber mais, acesse nossa <a href="politica-privacidade.html" target="_blank" style="color: #ccc; text-decoration: underline;">Política de Privacidade</a>.', en: 'This site respects your privacy. We are in compliance with data protection laws. To learn more, access our <a href="politica-privacidade.html" target="_blank" style="color: #ccc; text-decoration: underline;">Privacy Policy</a>.' },
        footerAdmin: { pt: 'Gerenciar Dados', en: 'Manage Data' },
        alertLogin: { pt: "Por favor, faça login para adicionar itens ao carrinho!", en: "Please log in to add items to the cart!"},
        confirmLogout: { pt: "Tem certeza que deseja sair?", en: "Are you sure you want to log out?"},
        profileLink: { pt: "Meu Perfil", en: "My Profile" },
        logoutLink: { pt: "Sair", en: "Logout" }
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

        languageLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-lang') === lang) {
                link.classList.add('active');
            }
        });
        
        renderAuthMenu();
        populateProducts(); 
        populateFeaturedProducts();
    };

    languageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = link.getAttribute('data-lang');
            setLanguage(selectedLang);
        });
    });
    
    // --- PRODUTOS ---
    const featuredProductList = [
        { image: './imagem/sacola.png', alt: 'Sacola de Algodão Orgânico', titleKey: 'featuredProd1Title', descKey: 'featuredProd1Desc' },
        { image: './imagem/Copo de Vidro Reutilizável.png', alt: 'Copo de Vidro Reutilizável', titleKey: 'featuredProd2Title', descKey: 'featuredProd2Desc' },
        { image: './imagem/Shampoo Sólido Natural.jpg', alt: 'Shampoo Sólido Natural', titleKey: 'featuredProd3Title', descKey: 'featuredProd3Desc' },
        { image: './imagem/Bolsa de Juta Sustentável.jpg', alt: 'Bolsa de Juta Sustentável', titleKey: 'featuredProd4Title', descKey: 'featuredProd4Desc' }
    ];

    const productContainer = document.querySelector('.product-list');
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    async function populateProducts() {
        if (!productContainer) return;
        productContainer.innerHTML = '';
        try {
            const response = await fetch('http://localhost:3000/produtos');
            if (!response.ok) throw new Error('Erro ao buscar produtos');
            const products = await response.json();
            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.setAttribute('data-aos', 'fade-up');
                
                const name = currentLang === 'pt' ? product.nome : product.nome; 
                const imageUrl = product.imagem ? `http://localhost:3000/uploads/${product.imagem}` : './imagem/default.png';
                
                productItem.innerHTML = `
                    <img src="${imageUrl}" alt="${name}" />
                    <div class="product-content">
                        <div>
                            <h3>${name}</h3>
                            <p class="product-description">${product.descricao}</p>
                            <p class="product-price">R$ ${product.preco.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <button onclick="addToCart(this, ${product.id}, ${product.preco})">${translations.addToCart[currentLang]}</button>
                    </div>
                `;
                productContainer.appendChild(productItem);
            });
        } catch (err) {
            console.error('Erro ao popular produtos:', err);
        }
    }
    
    function populateFeaturedProducts() {
        if (!swiperWrapper) return;
        swiperWrapper.innerHTML = '';
        featuredProductList.forEach(product => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="featured-card">
                    <img src="${product.image}" alt="${product.alt}">
                    <div class="featured-card-details">
                        <h3 data-lang-key="${product.titleKey}">${translations[product.titleKey][currentLang]}</h3>
                        <p data-lang-key="${product.descKey}">${translations[product.descKey][currentLang]}</p>
                        <a href="#products" class="btn-primary" data-lang-key="featuredProdBtn">${translations.featuredProdBtn[currentLang]}</a>
                    </div>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });
        if (typeof swiper !== 'undefined' && swiper.update) swiper.update();
    }

    AOS.init({ duration: 800, once: true, offset: 50 });

    const swiper = new Swiper('.swiper', {
        spaceBetween: 30,
        loop: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: {
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 40 }
        }
    });

    const btnMenuAbrir = document.getElementById('btn-menu-abrir');
    const btnMenuFechar = document.getElementById('btn-menu-fechar');
    const menuMovel = document.getElementById('menu-movel');
    const overlayMenu = document.getElementById('overlay-menu');

    function toggleMenu() {
        menuMovel.classList.toggle('abrir-menu');
        overlayMenu.classList.toggle('ativo');
    }

    btnMenuAbrir.addEventListener('click', toggleMenu);
    btnMenuFechar.addEventListener('click', toggleMenu);
    overlayMenu.addEventListener('click', toggleMenu);
    
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    
    async function updateCartIconCount() {
        if (!clienteLogado || !clienteLogado.id) return;
        try {
            const response = await fetch(`http://localhost:3000/carrinho/${clienteLogado.id}`);
            if (!response.ok) throw new Error('Erro ao buscar carrinho');
            const cartItems = await response.json();
            const itemCount = cartItems.reduce((sum, item) => sum + item.quantidade, 0);
            const cartBadge = document.getElementById("cart-item-count");
            if (cartBadge) {
                cartBadge.textContent = itemCount;
                cartBadge.style.display = itemCount > 0 ? 'inline-block' : 'none';
            }
        } catch (err) {
            console.error('Erro ao atualizar contagem do carrinho:', err);
        }
    }

    function renderAuthMenu() {
        const authMenuContainer = document.getElementById("auth-menu-container");
        const authMenuContainerMovel = document.getElementById("auth-menu-container-movel");
        if (!authMenuContainer || !authMenuContainerMovel) return;

        if (clienteLogado) {
            const greeting = (currentLang === 'en' ? 'Hello, ' : 'Olá, ') + clienteLogado.nome.split(' ')[0];
            const loggedInHTMLDesktop = `
                <a href="#">${greeting} <i class="bi bi-chevron-down"></i></a>
                <div class="drop">
                    <a href="perfil.html" target="_blank">${translations.profileLink[currentLang]}</a>
                    <a href="#" class="logout-link">${translations.logoutLink[currentLang]}</a>
                </div>
            `;
            const loggedInHTMLMovel = `
                <a href="perfil.html" target="_blank">${translations.profileLink[currentLang]}</a>
                <a href="#" class="logout-link">${translations.logoutLink[currentLang]}</a>
            `;
            
            authMenuContainer.classList.add("droop-hover");
            authMenuContainer.innerHTML = loggedInHTMLDesktop;
            authMenuContainerMovel.innerHTML = loggedInHTMLMovel;

        } else {
            const loggedOutHTMLDesktop = `<a href="entrar.html" class="btn-login">${translations.loginButton[currentLang]}</a>`;
            const loggedOutHTMLMovel = `<a href="entrar.html">${translations.loginButton[currentLang]}</a>`;

            authMenuContainer.classList.remove("droop-hover");
            authMenuContainer.innerHTML = loggedOutHTMLDesktop;
            authMenuContainerMovel.innerHTML = loggedOutHTMLMovel;
        }
        
        document.querySelectorAll('.logout-link').forEach(link => {
            link.addEventListener('click', logout);
        });
    }

    function logout(event) {
        if(event) event.preventDefault();
        if (confirm(translations.confirmLogout[currentLang])) {
            localStorage.removeItem("clienteLogado");
            window.location.href = "index.html";
        }
    }

    window.addToCart = async function(buttonElement, productId, price) {
        if (!clienteLogado || !clienteLogado.id) {
            alert(translations.alertLogin[currentLang]);
            window.location.href = "entrar.html";
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/carrinho', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id: clienteLogado.id,
                    produto_id: productId,
                    quantidade: 1
                })
            });
            if (!response.ok) throw new Error('Erro ao adicionar ao carrinho');
            buttonElement.innerText = translations.addedToCart[currentLang];
            buttonElement.style.backgroundColor = '#1a7d3c';
            setTimeout(() => {
                buttonElement.innerText = translations.addToCart[currentLang];
                buttonElement.style.backgroundColor = 'var(--cor-primaria)';
            }, 1500);
            updateCartIconCount();
        } catch (err) {
            console.error('Erro ao adicionar ao carrinho:', err);
            alert('Erro ao adicionar ao carrinho');
        }
    }
    
    // CHAMADA INICIAL
    setLanguage(currentLang);
    updateCartIconCount();
});

// --- Lógica de Exibição do Admin para Desktop e Mobile ---
document.addEventListener("DOMContentLoaded", () => {
    // Pega os elementos do Desktop e do Mobile
    const adminLinkDesktop = document.getElementById("admin-link");
    const adminLinkMobile = document.getElementById("admin-link-mobile");
    
    const user = JSON.parse(localStorage.getItem("clienteLogado"));

    // Função para esconder ambos
    function hideAdmin() {
        if (adminLinkDesktop) adminLinkDesktop.style.display = "none";
        if (adminLinkMobile) adminLinkMobile.style.display = "none";
    }

    // Função para mostrar ambos
    function showAdmin() {
        if (adminLinkDesktop) adminLinkDesktop.style.display = "inline-block"; 
        if (adminLinkMobile) adminLinkMobile.style.display = "block"; 
    }

    // Lógica de verificação
    if (!user) {
        hideAdmin();
        return;
    }

    // 0 = Admin, 1 = Cliente
    if (user.tipoUsuario === 0) {
        showAdmin();
    } else {
        hideAdmin();
    }
});

/* =========================================
   EFEITO DE NATAL (Neve + Cartão Minimizado)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. EFEITO DE NEVE
    const snowContainer = document.getElementById('snow-container');

    function createSnowflake() {
        if (!snowContainer) return; // Segurança caso o elemento não exista

        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Tamanho aleatório (entre 2px e 5px)
        const size = Math.random() * 5 + 2 + 'px';
        snowflake.style.width = size;
        snowflake.style.height = size;
        
        // Posição horizontal aleatória
        snowflake.style.left = Math.random() * 100 + 'vw';
        
        // Duração da queda aleatória (entre 3s e 8s)
        const duration = Math.random() * 5 + 3 + 's';
        snowflake.style.animationDuration = duration;
        
        // Opacidade aleatória
        snowflake.style.opacity = Math.random();

        snowContainer.appendChild(snowflake);

        // Remove o floco do DOM depois que a animação termina
        setTimeout(() => {
            snowflake.remove();
        }, 8000); 
    }

    // Cria um floco a cada 200ms
    setInterval(createSnowflake, 200);

    // 2. COMPORTAMENTO DO CARTÃO DE NATAL
    const christmasCard = document.querySelector('.christmas-message');

    if (christmasCard) {
        // Aguarda 5 segundos e minimiza (efeito fantasma no canto)
        setTimeout(() => {
            christmasCard.classList.add('minimized');
        }, 5000); 

        // Se clicar quando estiver minimizado, fecha totalmente (opcional)
        christmasCard.addEventListener('click', () => {
            if (christmasCard.classList.contains('minimized')) {
                christmasCard.style.display = 'none';
            }
        });
    }
});