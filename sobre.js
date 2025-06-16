// --- SISTEMA DE TRADUÇÃO ---
const translations = {
    heroTitle: { pt: 'Conectando tecnologia e sustentabilidade.', en: 'Connecting technology and sustainability.' },
    heroSubtitle: { pt: 'O eKoviva é mais que um e-commerce. É um projeto nascido em sala de aula, com o propósito de usar o conhecimento digital para promover um futuro mais verde e consciente.', en: 'eKoviva is more than an e-commerce. It is a project born in the classroom, with the purpose of using digital knowledge to promote a greener and more conscious future.' },
    heroButton: { pt: '<i class="bi bi-shop"></i>Ir para a Loja', en: '<i class="bi bi-shop"></i>Go to Store' },
    whyTitle: { pt: 'O Nosso Porquê: A Urgência da Mudança', en: 'Our Why: The Urgency for Change' },
    whyDesc1: { pt: 'Vivemos um momento crítico. O consumo desenfreado e o descarte inadequado de produtos, especialmente os de plástico, geram um impacto devastador em nossos ecossistemas.', en: 'We live in a critical moment. Uncontrolled consumption and improper disposal of products, especially plastics, have a devastating impact on our ecosystems.' },
    whyPoint1: { pt: '<strong>Poluição Plástica:</strong> Milhões de toneladas de plástico chegam aos oceanos anualmente, ameaçando a vida marinha.', en: '<strong>Plastic Pollution:</strong> Millions of tons of plastic enter the oceans annually, threatening marine life.' },
    whyPoint2: { pt: '<strong>Emissões de Carbono:</strong> A produção em massa de itens descartáveis consome uma enorme quantidade de energia e recursos naturais.', en: '<strong>Carbon Emissions:</strong> Mass production of disposable items consumes a huge amount of energy and natural resources.' },
    whyDesc2: { pt: 'Acreditamos que a mudança começa com pequenas escolhas. Ao optar por produtos ecológicos, você se torna parte da solução.', en: 'We believe that change begins with small choices. By opting for eco-friendly products, you become part of the solution.' },
    missionTitle: { pt: 'Nossa Missão como Projeto', en: 'Our Mission as a Project' },
    missionSubtitle: { pt: 'Como estudantes de Análise e Desenvolvimento de Sistemas, nossa missão é threefold:', en: 'As Systems Analysis and Development students, our mission is threefold:' },
    mission1Title: { pt: 'Educar e Inspirar', en: 'Educate and Inspire' },
    mission1Desc: { pt: 'Criar uma plataforma que não apenas vende, mas também informa sobre os benefícios e a importância de um estilo de vida sustentável.', en: 'Create a platform that not only sells but also informs about the benefits and importance of a sustainable lifestyle.' },
    mission2Title: { pt: 'Aplicar o Conhecimento', en: 'Apply Knowledge' },
    mission2Desc: { pt: 'Utilizar as habilidades de desenvolvimento web e gestão de projetos aprendidas em nosso curso para criar uma solução funcional e relevante.', en: 'Use the web development and project management skills learned in our course to create a functional and relevant solution.' },
    mission3Title: { pt: 'Promover o Bem', en: 'Promote Good' },
    mission3Desc: { pt: 'Fomentar uma comunidade engajada, conectando consumidores conscientes a produtos que fazem a diferença para o planeta.', en: 'Foster an engaged community, connecting conscious consumers with products that make a difference for the planet.' },
    projectTitle: { pt: 'O Projeto Integrador', en: 'The Capstone Project' },
    projectDesc1: { pt: 'O eKoviva é o nosso Projeto Integrador do curso de ADS. Ele representa a culminação de nosso aprendizado, unindo teoria e prática para resolver um problema do mundo real.', en: 'eKoviva is our Capstone Project for the Systems Analysis course. It represents the culmination of our learning, uniting theory and practice to solve a real-world problem.' },
    projectDesc2: { pt: 'Neste projeto, somos responsáveis por todas as etapas: desde o planejamento e design da interface (UI/UX), passando pelo desenvolvimento front-end e back-end, até a gestão da base de dados e a implementação final. É a nossa oportunidade de mostrar como a tecnologia pode ser uma poderosa ferramenta para a transformação social e ambiental.', en: 'In this project, we are responsible for all stages: from planning and interface design (UI/UX), through front-end and back-end development, to database management and final implementation. It is our opportunity to show how technology can be a powerful tool for social and environmental transformation.' },
    teamTitle: { pt: 'A Equipe por Trás do Código', en: 'The Team Behind the Code' },
    teamSubtitle: { pt: 'Conheça os estudantes que deram vida a este projeto.', en: 'Meet the students who brought this project to life.' },
    role1: { pt: 'Desenvolvedor Front-end', en: 'Front-end Developer' },
    role2: { pt: 'Desenvolvedor Back-end', en: 'Back-end Developer' },
    role3: { pt: 'Gerente de Projeto & DB Admin', en: 'Project Manager & DB Admin' },
    role4: { pt: 'UI/UX Designer & QA', en: 'UI/UX Designer & QA' },
    techTitle: { pt: 'Tecnologias Utilizadas', en: 'Technologies Used' },
    techSubtitle: { pt: 'Este projeto foi construído com as mais modernas e eficientes tecnologias web.', en: 'This project was built with the most modern and efficient web technologies.' },
    techBadgeResponsive: { pt: 'Design Responsivo', en: 'Responsive Design' },
    footerDesc: { pt: 'Um projeto de estudantes de ADS para um mundo mais sustentável.', en: 'A project by Systems Analysis students for a more sustainable world.' },
    footerLinks: { pt: 'Links Úteis', en: 'Useful Links' },
    footerHome: { pt: 'Início', en: 'Home' },
    footerContact: { pt: 'Contato', en: 'Contact' },
    footerRegister: { pt: 'Cadastre-se', en: 'Sign Up' },
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

// Inicializa animações e idioma na carga da página
AOS.init({
    duration: 800,
    once: true,
    offset: 50
});

setLanguage(currentLang);