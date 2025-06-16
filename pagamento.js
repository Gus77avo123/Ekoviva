// --- SISTEMA DE TRADUÇÃO ---
const translations = {
    title: { pt: 'Finalizar Pagamento', en: 'Finalize Payment' },
    methodPix: { pt: 'Pix', en: 'Pix' },
    methodCard: { pt: 'Cartão de Crédito', en: 'Credit Card' },
    pixTitle: { pt: 'Pagamento com Pix', en: 'Payment with Pix' },
    pixStep1: { pt: '1. Abra o aplicativo do seu banco e escolha a opção de pagar com Pix.', en: '1. Open your bank app and choose the option to pay with Pix.' },
    pixStep2: { pt: '2. Escaneie o QR Code abaixo ou use o "Pix Copia e Cola".', en: '2. Scan the QR Code below or use the "Pix Copy & Paste".' },
    pixCopyBtn: { pt: 'Copiar', en: 'Copy' },
    pixCopiedBtn: { pt: 'Copiado!', en: 'Copied!' },
    pixReceiptLabel: { pt: '3. Anexe o comprovante para agilizar a confirmação', en: '3. Attach the receipt to speed up confirmation' },
    pixButton: { pt: 'Finalizar Pedido', en: 'Finalize Order' },
    cardTitle: { pt: 'Pagamento com Cartão', en: 'Payment with Card' },
    cardNumLabel: { pt: 'Número do Cartão', en: 'Card Number' },
    cardNumPlaceholder: { pt: '0000 0000 0000 0000', en: '0000 0000 0000 0000' },
    cardNameLabel: { pt: 'Nome no Cartão', en: 'Name on Card' },
    cardNamePlaceholder: { pt: 'Nome Completo', en: 'Full Name' },
    cardExpLabel: { pt: 'Validade (MM/AA)', en: 'Expiry (MM/YY)' },
    cardExpPlaceholder: { pt: '12/28', en: '12/28' },
    cardCvvPlaceholder: { pt: '123', en: '123' },
    cardButton: { pt: 'Pagar com Cartão', en: 'Pay with Card' },
    summaryTitle: { pt: 'Resumo do Pedido', en: 'Order Summary' },
    couponLabel: { pt: 'Cupom de Desconto', en: 'Discount Coupon' },
    couponPlaceholder: { pt: 'Digite seu cupom', en: 'Enter your coupon' },
    couponBtn: { pt: 'Aplicar', en: 'Apply' },
    summarySubtotal: { pt: 'Subtotal', en: 'Subtotal' },
    summaryDiscount: { pt: 'Desconto', en: 'Discount' },
    summaryShipping: { pt: 'Frete', en: 'Shipping' },
    summaryTotal: { pt: 'Total', en: 'Total' },
    alertLogin: { pt: "Você precisa estar logado para fazer o pagamento.", en: "You must be logged in to proceed to payment." },
    alertEmptyCart: { pt: "Seu carrinho está vazio.", en: "Your cart is empty." },
    alertSuccess: { pt: "Pagamento confirmado com sucesso!\nObrigado por comprar na eKoviva!", en: "Payment confirmed successfully!\nThank you for shopping at eKoviva!" },
    couponSuccess: { pt: 'Cupom de primeira compra aplicado com sucesso!', en: 'First purchase coupon applied successfully!' },
    couponError: { pt: 'Cupom inválido ou expirado.', en: 'Invalid or expired coupon.' },
    couponNotFirstPurchase: { pt: 'Este cupom é válido apenas para a primeira compra.', en: 'This coupon is valid for the first purchase only.' } // MENSAGEM NOVA
};

let currentLang = localStorage.getItem('language') || 'pt';
let discount = 0; // Variável para armazenar o desconto

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
        if (link.getAttribute('data-lang') === lang) link.classList.add('active');
    });
    renderSummary();
};

const languageLinks = document.querySelectorAll('.lang-link');
languageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage(link.getAttribute('data-lang'));
    });
});

const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const userCart = clienteLogado ? cart.filter(item => item.cliente === clienteLogado.email) : [];

function formatCurrency(amount) {
    const locale = currentLang === 'pt' ? 'pt-BR' : 'en-US';
    return amount.toLocaleString(locale, { style: 'currency', currency: 'BRL' });
}

function renderSummary() {
    const summaryItemsEl = document.getElementById('summary-items');
    summaryItemsEl.innerHTML = '';
    let subtotal = userCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const discountValue = subtotal * discount;
    const subtotalWithDiscount = subtotal - discountValue;
    const freight = subtotalWithDiscount * 0.05;
    const total = subtotalWithDiscount + freight;

    userCart.forEach(item => {
        const productName = (item.name && item.name[currentLang]) ? item.name[currentLang] : item.name;
        summaryItemsEl.innerHTML += `<div class="summary-item"><p>${item.quantity}x ${productName}</p><p>${formatCurrency(item.price * item.quantity)}</p></div>`;
    });

    document.getElementById('summary-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('summary-freight').textContent = formatCurrency(freight);
    document.getElementById('summary-total').textContent = formatCurrency(total);

    const discountLine = document.getElementById('discount-line');
    if (discount > 0) {
        document.getElementById('summary-discount').textContent = `- ${formatCurrency(discountValue)}`;
        discountLine.style.display = 'flex';
    } else {
        discountLine.style.display = 'none';
    }
}

// --- LÓGICA DO CUPOM ATUALIZADA ---
function applyCoupon() {
    const couponInput = document.getElementById('coupon-code');
    const couponMessage = document.getElementById('coupon-message');
    const validCouponCode = "EKOVIVA"; // Novo código do cupom

    // 1. Verifica se o código digitado é "EKOVIVA"
    if (couponInput.value.toUpperCase() !== validCouponCode) {
        couponMessage.textContent = translations.couponError[currentLang];
        couponMessage.className = 'error';
        return; // Para a execução se o código estiver errado
    }

    // 2. Verifica se é a primeira compra do cliente
    const historicoCompras = JSON.parse(localStorage.getItem("historicoCompras")) || [];
    // O método '.some' verifica se existe ALGUM item no histórico que pertence ao cliente logado
    const userHasHistory = historicoCompras.some(item => item.cliente === clienteLogado.email);

    if (userHasHistory) {
        // Se o cliente já tem compras, exibe a mensagem de erro específica
        couponMessage.textContent = translations.couponNotFirstPurchase[currentLang];
        couponMessage.className = 'error';
    } else {
        // Se o código está certo E o cliente não tem histórico, aplica o desconto
        discount = 0.10; // 10%
        couponMessage.textContent = translations.couponSuccess[currentLang];
        couponMessage.className = 'success';
        couponInput.disabled = true;
        document.getElementById('apply-coupon-btn').disabled = true;
        renderSummary(); // Atualiza o resumo para mostrar o desconto
    }
}


// --- LÓGICA DO PIX 'COPIA E COLA' ---
function copyPixCode() {
    const pixCodeInput = document.getElementById('pix-code');
    const copyBtn = document.getElementById('copy-pix-btn');
    navigator.clipboard.writeText(pixCodeInput.value).then(() => {
        copyBtn.innerHTML = `<i class="bi bi-check-lg"></i> <span>${translations.pixCopiedBtn[currentLang]}</span>`;
        setTimeout(() => {
            copyBtn.innerHTML = `<i class="bi bi-clipboard"></i> <span>${translations.pixCopyBtn[currentLang]}</span>`;
        }, 2000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (!clienteLogado) {
        alert(translations.alertLogin[currentLang]);
        window.location.href = "entrar.html";
        return;
    }
    if (userCart.length === 0) {
        alert(translations.alertEmptyCart[currentLang]);
        window.location.href = "carrinho.html";
        return;
    }
    
    setLanguage(currentLang);

    const methodButtons = document.querySelectorAll('.method-btn');
    const paymentForms = document.querySelectorAll('.payment-form');
    methodButtons.forEach(button => {
        button.addEventListener('click', () => {
            methodButtons.forEach(btn => btn.classList.remove('active'));
            paymentForms.forEach(form => form.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(button.dataset.method).classList.add('active');
        });
    });

    document.getElementById('apply-coupon-btn').addEventListener('click', applyCoupon);
    document.getElementById('copy-pix-btn').addEventListener('click', copyPixCode);

    paymentForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let historicoCompras = JSON.parse(localStorage.getItem("historicoCompras")) || [];
            
            // Calcula o subtotal e o desconto antes de salvar
            const subtotal = userCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const discountValue = subtotal * discount;
            
            const novosItensComprados = userCart.map(item => ({
                ...item,
                dataCompra: new Date().toLocaleDateString(currentLang === 'pt' ? 'pt-BR' : 'en-CA'),
                status: 'Pagamento Aprovado',
                codigoRastreio: 'EKV' + Date.now() + Math.floor(Math.random() * 100),
                descontoAplicado: discountValue > 0 ? discountValue : 0 // Salva o valor do desconto no histórico
            }));
            
            historicoCompras = historicoCompras.concat(novosItensComprados);
            localStorage.setItem("historicoCompras", JSON.stringify(historicoCompras));

            const otherUsersCart = cart.filter(item => item.cliente !== clienteLogado.email);
            localStorage.setItem("cart", JSON.stringify(otherUsersCart));

            alert(translations.alertSuccess[currentLang]);
            window.location.href = "perfil.html";
        });
    });
});