document.addEventListener('DOMContentLoaded', function() {
    // --- SISTEMA DE TRADUÇÃO ---
    const translations = {
        // ... (traduções inalteradas) ...
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
    const productList = [
        { id: 'garrafa_agua', price: 45.00, image: './imagem/garrafa.jpg', name: { pt: 'Garrafa de Água Reutilizável', en: 'Reusable Water Bottle' } },
        { id: 'escova_dente', price: 15.00, image: './imagem/Escova.png', name: { pt: 'Escova de Dente de Bambu', en: 'Bamboo Toothbrush' } },
        { id: 'kit_talheres', price: 25.00, image: './imagem/Kit de Talheres de Bambu.jpg', name: { pt: 'Kit de Talheres de Bambu', en: 'Bamboo Cutlery Set' } },
        { id: 'sabonete_natural', price: 12.00, image: './imagem/Sabonete Natural Artesanal.png', name: { pt: 'Sabonete Natural Artesanal', en: 'Handmade Natural Soap' } },
        { id: 'copo_vidro', price: 35.00, image: './imagem/Copo de Vidro Reutilizável.png', name: { pt: 'Copo de Vidro Reutilizável', en: 'Reusable Glass Cup' } },
        { id: 'bolsa_juta', price: 48.00, image: './imagem/Bolsa de Juta Sustentável.jpg', name: { pt: 'Bolsa de Juta Sustentável', en: 'Sustainable Jute Bag' } },
        { id: 'shampoo_solido', price: 30.00, image: './imagem/Shampoo Sólido Natural.jpg', name: { pt: 'Shampoo Sólido Natural', en: 'Natural Solid Shampoo' } },
        { id: 'prato_bambu', price: 18.00, image: './imagem/Prato de Bambu Biodegradável.jpg', name: { pt: 'Prato de Bambu Biodegradável', en: 'Biodegradable Bamboo Plate' } },
        { id: 'pote_vidro', price: 22.00, image: './imagem/Pote de Vidro Reutilizavel.jpeg', name: { pt: 'Pote de Vidro Reutilizável', en: 'Reusable Glass Jar' } },
        { id: 'guardanapo_pano', price: 38.00, image: './imagem/Guardanapo de Pano Reutilizável.jpg', name: { pt: 'Guardanapo de Pano (Kit)', en: 'Cloth Napkin (Set)' } },
        { id: 'escova_cabelo', price: 28.00, image: './imagem/Escova de Cabelo de Bambu.png', name: { pt: 'Escova de Cabelo de Bambu', en: 'Bamboo Hairbrush' } },
    ];
    
    // ... (o resto do seu código continua igual)
    
    const featuredProductList = [
        { image: './imagem/sacola.png', alt: 'Sacola de Algodão Orgânico', titleKey: 'featuredProd1Title', descKey: 'featuredProd1Desc' },
        { image: './imagem/Copo de Vidro Reutilizável.png', alt: 'Copo de Vidro Reutilizável', titleKey: 'featuredProd2Title', descKey: 'featuredProd2Desc' },
        { image: './imagem/Shampoo Sólido Natural.jpg', alt: 'Shampoo Sólido Natural', titleKey: 'featuredProd3Title', descKey: 'featuredProd3Desc' },
        { image: './imagem/Bolsa de Juta Sustentável.jpg', alt: 'Bolsa de Juta Sustentável', titleKey: 'featuredProd4Title', descKey: 'featuredProd4Desc' }
    ];

    const productContainer = document.querySelector('.product-list');
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    function populateProducts() {
        if (!productContainer) return;
        productContainer.innerHTML = '';
        productList.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.setAttribute('data-aos', 'fade-up');
            
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name[currentLang]}" />
                <div class="product-content">
                    <div>
                        <h3>${product.name[currentLang]}</h3>
                        <p>R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button onclick="addToCart(this, '${product.id}', ${product.price})">${translations.addToCart[currentLang]}</button>
                </div>
            `;
            productContainer.appendChild(productItem);
        });
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
    
    function updateCartIconCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        let itemCount = 0;
        if (clienteLogado && clienteLogado.email) {
            const userCartItems = cart.filter(item => item.cliente === clienteLogado.email);
            itemCount = userCartItems.reduce((sum, item) => sum + item.quantity, 0);
        }
        const cartBadge = document.getElementById("cart-item-count");
        if (cartBadge) {
            cartBadge.textContent = itemCount;
            cartBadge.style.display = itemCount > 0 ? 'inline-block' : 'none';
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

    window.addToCart = function(buttonElement, productId, price) {
        if (!clienteLogado) {
            alert(translations.alertLogin[currentLang]);
            window.location.href = "entrar.html";
            return;
        }
        const product = productList.find(p => p.id === productId);
        if (!product) return;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let productIndex = cart.findIndex(item => item.id === productId && item.cliente === clienteLogado.email);
        
        if (productIndex !== -1) {
            cart[productIndex].quantity++;
        } else {
            cart.push({ 
                id: productId, 
                name: product.name,
                price: parseFloat(price), 
                quantity: 1, 
                image: product.image, 
                cliente: clienteLogado.email 
            });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        buttonElement.innerText = translations.addedToCart[currentLang];
        buttonElement.style.backgroundColor = '#1a7d3c';
        setTimeout(() => {
            buttonElement.innerText = translations.addToCart[currentLang];
            buttonElement.style.backgroundColor = 'var(--cor-primaria)';
        }, 1500);
        updateCartIconCount();
    }
    
    // CHAMADA INICIAL
    setLanguage(currentLang);
    updateCartIconCount();
});