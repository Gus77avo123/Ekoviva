/* ============================================================
   SOBRE.JS — Versão Otimizada e Completa
   eKoviva © 2025
============================================================ */

/* ============================================================
   🔤 TRADUÇÕES (COMPLETAS)
============================================================ */
const translations = {
  // Navegação
  navProducts: { pt: 'Produtos', en: 'Products' },
  navAbout: { pt: 'Sobre', en: 'About' },
  navProductsMobile: { pt: 'Produtos', en: 'Products' },
  navAboutMobile: { pt: 'Sobre', en: 'About' },

  // Hero Section
  heroTitle: { 
    pt: 'Conectando tecnologia e um futuro verde.',
    en: 'Connecting technology and a green future.' 
  },
  heroSubtitle: {
    pt: 'O eKoviva é mais que um e-commerce — é um projeto que nasce da sala de aula para tornar o consumo mais consciente.',
    en: 'eKoviva is more than an e-commerce — it is a project born in the classroom to make consumption more conscious.'
  },
  heroButton: { pt: 'Ir para a Loja', en: 'Go to Store' },

  // Seção Porquê
  whyTitle: { pt: 'O Nosso Porquê', en: 'Our Why' },
  whyDesc1: { 
    pt: 'Vivemos um momento crítico. O consumo desenfreado e o descarte inadequado de produtos geram impacto em nossos ecossistemas.',
    en: 'We live in a critical moment. Unbridled consumption and improper disposal impact our ecosystems.' 
  },

  // Missão
  missionTitle: { pt: 'Nossa Missão', en: 'Our Mission' },
  missionSubtitle: { pt: 'Como estudantes de ADS, unimos tecnologia e propósito.', en: 'As ADS students, we unite technology and purpose.' },
  mission1Title: { pt: 'Educar', en: 'Educate' },
  mission1Desc: { pt: 'Plataforma que informa e incentiva práticas sustentáveis.', en: 'Platform that informs and encourages sustainable practices.' },
  mission2Title: { pt: 'Inovar', en: 'Innovate' },
  mission2Desc: { pt: 'Entrega de soluções reais com foco em impacto social.', en: 'Delivery of real solutions focused on social impact.' },
  mission3Title: { pt: 'Cuidar', en: 'Care' },
  mission3Desc: { pt: 'Fomentar comunidade consciente e engajada.', en: 'Foster a conscious and engaged community.' },

  // Equipe
  teamTitle: { pt: 'Quem Faz Acontecer', en: 'Who Makes It Happen' },
  teamSubtitle: { pt: 'Conheça os estudantes que deram vida ao projeto.', en: 'Meet the students who brought the project to life.' },
  role1: { pt: 'Front-end Dev', en: 'Front-end Dev' },
  role2: { pt: 'Back-end Dev', en: 'Back-end Dev' },
  role3: { pt: 'DB Admin', en: 'DB Admin' },
  role4: { pt: 'Designer', en: 'Designer' },

  // Tecnologias
  techTitle: { pt: 'Tecnologias Utilizadas', en: 'Technologies Used' },
  techSubtitle: { pt: 'Construído com tecnologias modernas e responsivas.', en: 'Built with modern and responsive technologies.' },

  // Rodapé
  footerDesc: { pt: 'Um projeto de estudantes de ADS para um mundo mais sustentável.', en: 'An ADS student project for a more sustainable world.' },
  footerNav: { pt: 'Navegação', en: 'Navigation' },
  footerAbout: { pt: 'Sobre o Projeto', en: 'About the Project' },
  footerProducts: { pt: 'Produtos', en: 'Products' },
  footerRegister: { pt: 'Cadastro', en: 'Register' },
  footerContact: { pt: 'Contato', en: 'Contact' },
  footerRights: { 
    pt: '© 2025 eKoviva. Todos os direitos reservados.',
    en: '© 2025 eKoviva. All rights reserved.' 
  }
};

let currentLang = localStorage.getItem('language') || 'pt';

/* ============================================================
   🌍 FUNÇÃO DE IDIOMA
============================================================ */
function setLanguage(lang) {
  localStorage.setItem('language', lang);

  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    if (translations[key]) {
      el.textContent = translations[key][lang];
    }
  });

  document.querySelectorAll('.lang-link').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  document.title = lang === 'pt' ? "Sobre • eKoviva" : "About • eKoviva";
}

/* ============================================================
   📱 MENU MOBILE
============================================================ */
function setupMenu() {
  const btnOpen = document.getElementById('btn-menu-abrir');
  const btnClose = document.getElementById('btn-menu-fechar');
  const menu = document.getElementById('menu-movel');
  const overlay = document.getElementById('overlay-menu');

  if(btnOpen) {
      btnOpen.addEventListener('click', () => {
        menu.classList.add('abrir-menu');
        overlay.classList.add('ativo');
      });
  }

  if(btnClose) {
      btnClose.addEventListener('click', () => {
        menu.classList.remove('abrir-menu');
        overlay.classList.remove('ativo');
      });
  }

  if(overlay) {
      overlay.addEventListener('click', () => {
        menu.classList.remove('abrir-menu');
        overlay.classList.remove('ativo');
      });
  }
}

/* ============================================================
   🚀 INICIALIZAÇÃO
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);

  document.querySelectorAll('.lang-link').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  setupMenu();
  initChatbot();

  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true });
  }
});

/* ============================================================
   🤖 CHATBOT (EcoBot)
============================================================ */

const botData = {
  recipes: [
    {
      id: 'sabao',
      title: '🫧 Sabão Líquido Caseiro',
      text: 'Rale 1 barra de sabão de coco e dissolva em 3L de água quente. Adicione 3 colheres de bicarbonato e 50ml de álcool. Aguarde 24h.'
    },
    {
      id: 'esfoliante',
      title: '🍯 Esfoliante de Café',
      text: 'Misture 2 colheres de borra de café com 1 colher de óleo de coco. Use durante o banho para pele macia.'
    },
    {
      id: 'amaciante',
      title: '🌸 Amaciante Natural',
      text: 'Misture 2 xícaras de água morna, 1 xícara de vinagre branco e 20 gotas de essência natural. Use 100ml por lavagem.'
    },
    {
      id: 'desinfetante',
      title: '🌿 Desinfetante Natural',
      text: 'Infusione folhas de eucalipto em 1 litro de álcool por 3 dias. Misture com 1 litro de água e 1 colher de detergente neutro.'
    },
    {
      id: 'spray-ar',
      title: '🍃 Spray Aromático Natural',
      text: 'Misture 200ml de água, 1 colher de álcool e 15 gotas de óleo essencial. Use como aromatizador.'
    }
  ],

  tips: [
    "🌱 Troque a escova de plástico por uma de bambu.",
    "🛍️ Use sempre ecobags ao fazer compras.",
    "💡 Substitua lâmpadas halógenas por LEDs.",
    "🚲 Sempre que possível, escolha caminhar ou pedalar.",
    "🔄 Reutilize potes de vidro para armazenamento.",
    "🥤 Evite descartáveis — leve sua garrafa reutilizável.",
    "🌿 Compre produtos de produtores locais.",
    "♻️ Separe corretamente seu lixo reciclável."
  ]
};

function initChatbot() {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const windowChat = document.getElementById('chatbot-window');
  const msgContainer = document.getElementById('chat-messages');
  const optionsContainer = document.getElementById('chat-options');
  const notificationDot = document.querySelector('.notification-dot');

  if (!toggleBtn || !windowChat) return;

  let isChatOpen = false;
  let hideTimeout = null;

  /* --- Abrir / Fechar Chat --- */
  function openChat() {
    isChatOpen = true;
    windowChat.classList.remove('chat-hidden');
    if(notificationDot) notificationDot.style.display = 'none';

    if (msgContainer.children.length === 0) {
      setTimeout(() => addBotMessage("Olá! Sou o <b>EcoBot</b> 🌿. Pronto para te ajudar!"), 500);
      setTimeout(showMainMenu, 800);
    }
  }

  function closeChat() {
    isChatOpen = false;
    windowChat.classList.add('chat-hidden');
  }

  /* --- Auto-recolher ao mover o mouse --- */
  windowChat.addEventListener('mouseleave', () => {
    // Só agenda o fechamento se não estiver clicando dentro
    hideTimeout = setTimeout(() => {
      closeChat();
    }, 2000); // Aumentei para 2s para dar tempo ao usuário
  });

  windowChat.addEventListener('mouseenter', () => {
    if (hideTimeout) clearTimeout(hideTimeout);
  });

  toggleBtn.addEventListener('click', () => {
    isChatOpen ? closeChat() : openChat();
  });

  if(closeBtn) closeBtn.addEventListener('click', closeChat);

  /* --- Funções de Mensagem --- */
  function scrollToBottom() {
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function addBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'bot-msg';
    div.innerHTML = text;
    msgContainer.appendChild(div);
    scrollToBottom();
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'user-msg';
    div.innerText = text;
    msgContainer.appendChild(div);
    scrollToBottom();
  }

  /* --- Menus e Opções --- */
  function createOptionButton(label, value) {
      const btn = document.createElement('button');
      btn.className = 'option-btn'; // Classe CSS definida no sobre.css
      btn.innerText = label;
      btn.dataset.opt = value;
      return btn;
  }

  function showMainMenu() {
    optionsContainer.innerHTML = '';
    optionsContainer.appendChild(createOptionButton("🥣 Ver Receitas", "receitas"));
    optionsContainer.appendChild(createOptionButton("💡 Dica Rápida", "dicas"));
    optionsContainer.appendChild(createOptionButton("🛒 Sobre Produtos", "produtos"));
  }

  function showRecipesMenu() {
      optionsContainer.innerHTML = '';
      botData.recipes.forEach(recipe => {
          // Usamos dataset para guardar o ID da receita
          const btn = createOptionButton(recipe.title, `recipe-${recipe.id}`);
          optionsContainer.appendChild(btn);
      });
      optionsContainer.appendChild(createOptionButton("⬅️ Voltar", "voltar"));
  }

  /* --- Manipulação de Cliques nas Opções --- */
  optionsContainer.addEventListener('click', e => {
    if (!e.target.classList.contains('option-btn')) return;

    const opt = e.target.dataset.opt;

    if (opt === "receitas") {
      addUserMessage("Quero ver receitas sustentáveis.");
      setTimeout(() => {
          addBotMessage("Ótima escolha! Qual receita você gostaria de aprender?");
          showRecipesMenu();
      }, 500);
    } 
    
    else if (opt.startsWith("recipe-")) {
        const recipeId = opt.replace("recipe-", "");
        const recipe = botData.recipes.find(r => r.id === recipeId);
        
        if (recipe) {
            addUserMessage(recipe.title);
            setTimeout(() => {
                addBotMessage(`<b>${recipe.title}</b><br><br>${recipe.text}`);
                // Volta ao menu de receitas após mostrar o detalhe
                setTimeout(showRecipesMenu, 3000); 
            }, 500);
        }
    }

    else if (opt === "dicas") {
      addUserMessage("Me dê uma dica rápida!");
      const randomTip = botData.tips[Math.floor(Math.random() * botData.tips.length)];
      setTimeout(() => {
        addBotMessage(`💡 <b>Dica Eco:</b> ${randomTip}`);
        setTimeout(showMainMenu, 2000);
      }, 500);
    } 
    
    else if (opt === "produtos") {
        addUserMessage("Quero saber sobre os produtos.");
        setTimeout(() => {
            addBotMessage("Nossos produtos são 100% ecológicos! Você pode vê-los na aba <a href='index.html#products' style='color:#28a745; font-weight:bold;'>Produtos</a>.");
            setTimeout(showMainMenu, 3000);
        }, 500);
    }

    else if (opt === "voltar") {
      addUserMessage("Voltar ao menu principal.");
      setTimeout(() => {
          addBotMessage("Como posso te ajudar agora? 🌿");
          showMainMenu();
      }, 500);
    }
  });
}