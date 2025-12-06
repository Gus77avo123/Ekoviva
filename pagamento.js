// --- SISTEMA DE TRADUÇÃO ---
const translations = {
    headerTitle: { pt: 'Pagamento', en: 'Payment' },
    title: { pt: 'Finalizar Pagamento', en: 'Checkout' },
    
    // Métodos
    methodPix: { pt: 'Pix', en: 'Pix' },
    methodCard: { pt: 'Cartão de Crédito', en: 'Credit Card' },
    
    // Pix
    pixTitle: { pt: 'Pagamento com Pix', en: 'Pay with Pix' },
    pixStep1: { pt: '1. Abra o app do banco e escolha Pix.', en: '1. Open bank app and choose Pix.' },
    pixStep2: { pt: '2. Escaneie ou use o "Pix Copia e Cola".', en: '2. Scan or use copy-paste.' },
    pixCopyBtn: { pt: 'Copiar', en: 'Copy' },
    pixCopiedBtn: { pt: 'Copiado!', en: 'Copied!' },
    pixReceiptLabel: { pt: '3. Anexe o comprovante (obrigatório)', en: '3. Attach receipt (required)' },
    pixButton: { pt: 'Confirmar Pedido (Pix)', en: 'Confirm Order (Pix)' },
    
    // Cartão
    cardTitle: { pt: 'Pagamento com Cartão', en: 'Pay with Card' },
    cardNumLabel: { pt: 'Número do Cartão', en: 'Card Number' },
    cardNumPlaceholder: { pt: '0000 0000 0000 0000', en: '0000 0000 0000 0000' },
    cardNameLabel: { pt: 'Nome no Cartão', en: 'Name on Card' },
    cardNamePlaceholder: { pt: 'Como impresso no cartão', en: 'As printed on card' },
    cardExpLabel: { pt: 'Validade', en: 'Expiry' },
    cardButton: { pt: 'Pagar com Cartão', en: 'Pay with Card' },
    
    // Resumo
    summaryTitle: { pt: 'Resumo', en: 'Summary' },
    couponLabel: { pt: 'Cupom de Desconto', en: 'Discount Coupon' },
    couponPlaceholder: { pt: 'Código', en: 'Code' },
    couponBtn: { pt: 'Aplicar', en: 'Apply' },
    summarySubtotal: { pt: 'Subtotal', en: 'Subtotal' },
    summaryDiscount: { pt: 'Desconto', en: 'Discount' },
    summaryShipping: { pt: 'Frete', en: 'Shipping' },
    summaryTotal: { pt: 'Total', en: 'Total' },
    
    // Mensagens
    alertLogin: { pt: "Faça login para continuar.", en: "Please log in." },
    alertEmptyCart: { pt: "Carrinho vazio.", en: "Cart is empty." },
    alertSuccess: { pt: "Pedido realizado com sucesso!", en: "Order placed successfully!" },
    alertProcessing: { pt: 'Processando...', en: 'Processing...' },
    couponSuccess: { pt: 'Cupom aplicado!', en: 'Coupon applied!' },
    couponError: { pt: 'Cupom inválido.', en: 'Invalid coupon.' },
    couponNotFirst: { pt: 'Válido apenas na 1ª compra.', en: 'Valid for 1st purchase only.' },
    fillCard: { pt: 'Preencha os dados do cartão.', en: 'Fill in card details.' },
    fillReceipt: { pt: 'Anexe o comprovante Pix.', en: 'Attach Pix receipt.' },
    
    // Footer
    footerNav: { pt: 'Navegação', en: 'Navigation' },
    footerAbout: { pt: 'Sobre o Projeto', en: 'About the Project' },
    footerProducts: { pt: 'Produtos', en: 'Products' },
    footerRegister: { pt: 'Cadastro', en: 'Register' },
    footerContact: { pt: 'Contato', en: 'Contact' },
    footerSocial: { pt: 'Siga-nos', en: 'Follow us' },
    footerRights: { pt: '© 2025 eKoviva.', en: '© 2025 eKoviva.' },
    footerPrivacy: { pt: 'Privacidade e LGPD.', en: 'Privacy & GDPR.' },
    footerAdmin: { pt: 'Gerenciar Dados', en: 'Manage Data' },
    footerDesc: { pt: 'Um projeto de estudantes de ADS.', en: 'An ADS student project.' }
};

let currentLang = localStorage.getItem('language') || 'pt';
let discount = 0;

// --- TOASTS ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = type === 'success' ? `<i class="bi bi-check-circle-fill"></i> ${message}` : `<i class="bi bi-exclamation-circle-fill"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

const setLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.querySelectorAll('[data-lang-key]').forEach(elem => {
        const key = elem.getAttribute('data-lang-key');
        if (translations[key] && translations[key][lang]) elem.innerText = translations[key][lang];
    });
    document.querySelectorAll('[data-placeholder-key]').forEach(elem => {
        const key = elem.getAttribute('data-placeholder-key');
        if (translations[key]) elem.placeholder = translations[key][lang];
    });
    document.querySelectorAll('.lang-link').forEach(l => l.classList.toggle('active', l.getAttribute('data-lang') === lang));
    loadOrderSummary();
};

document.querySelectorAll('.lang-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage(link.getAttribute('data-lang'));
    });
});

const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));

function formatCurrency(amount) {
    return Number(amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- MÁSCARAS DE INPUT (MELHORIA VISUAL) ---
function setupMasks() {
    const cardNum = document.getElementById('card-number');
    const cardExp = document.getElementById('card-expiry');
    const cardCvv = document.getElementById('card-cvv');

    if (cardNum) {
        cardNum.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '');
            v = v.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = v.substring(0, 19);
        });
    }
    if (cardExp) {
        cardExp.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
            e.target.value = v.substring(0, 5);
        });
    }
    if (cardCvv) {
        cardCvv.addEventListener('input', e => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
}

async function loadOrderSummary() {
    const summaryItemsEl = document.getElementById('summary-items');
    if (!clienteLogado) return;

    try {
        const response = await fetch(`http://localhost:3000/carrinho/${clienteLogado.id}`);
        const userCart = await response.json();

        summaryItemsEl.innerHTML = '';
        let subtotal = 0;

        userCart.forEach(item => {
            if(item.Produto) {
                subtotal += item.Produto.preco * item.quantidade;
                const div = document.createElement('div');
                div.className = 'summary-item';
                div.style.fontSize = '0.9em';
                div.innerHTML = `<p>${item.quantidade}x ${item.Produto.nome}</p><p>${formatCurrency(item.Produto.preco * item.quantidade)}</p>`;
                summaryItemsEl.appendChild(div);
            }
        });

        const discountValue = subtotal * discount;
        const subtotalWithDiscount = subtotal - discountValue;
        const freight = subtotalWithDiscount * 0.05;
        const total = subtotalWithDiscount + freight;

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
    } catch (err) { console.error(err); }
}

async function applyCoupon() {
    const couponInput = document.getElementById('coupon-code');
    const msg = document.getElementById('coupon-message');
    const code = couponInput.value.toUpperCase();

    if (code !== "EKOVIVA10") {
        msg.textContent = translations.couponError[currentLang];
        msg.className = 'error'; discount = 0; loadOrderSummary(); return;
    }

    try {
        const response = await fetch(`http://localhost:3000/pedidos?usuario_id=${clienteLogado.id}`);
        const pedidos = await response.json();

        if (pedidos.length > 0) {
            msg.textContent = translations.couponNotFirst[currentLang];
            msg.className = 'error'; discount = 0;
        } else {
            discount = 0.10;
            msg.textContent = translations.couponSuccess[currentLang];
            msg.className = 'success';
            couponInput.disabled = true;
            document.getElementById('apply-coupon-btn').disabled = true;
        }
        loadOrderSummary();
    } catch (err) { console.error(err); }
}

function copyPixCode() {
    const input = document.getElementById('pix-code');
    navigator.clipboard.writeText(input.value).then(() => {
        showToast(translations.pixCopiedBtn[currentLang], 'success');
    });
}

async function processPayment(e) {
    e.preventDefault();
    
    // Validação Básica
    const formId = e.target.id;
    if (formId === 'credit') {
        const num = document.getElementById('card-number').value;
        const name = document.getElementById('card-name').value;
        const exp = document.getElementById('card-expiry').value;
        const cvv = document.getElementById('card-cvv').value;
        if (!num || !name || !exp || !cvv) {
            showToast(translations.fillCard[currentLang], 'error'); return;
        }
    } else if (formId === 'pix') {
        const file = document.getElementById('pix-receipt').files[0];
        if (!file) {
            showToast(translations.fillReceipt[currentLang], 'error'); return;
        }
    }

    showToast(translations.alertProcessing[currentLang], 'info');

    try {
        const cartResponse = await fetch(`http://localhost:3000/carrinho/${clienteLogado.id}`);
        const userCart = await cartResponse.json();

        if (userCart.length === 0) {
            showToast(translations.alertEmptyCart[currentLang], 'error'); return;
        }

        const subtotal = userCart.reduce((sum, item) => sum + item.Produto.preco * item.quantidade, 0);
        const total = (subtotal * (1 - discount)) * 1.05;

        const itensPedido = userCart.map(item => ({
            produto_id: item.produto_id, quantidade: item.quantidade, preco_unit: item.Produto.preco
        }));

        const pedidoResponse = await fetch('http://localhost:3000/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: clienteLogado.id, total: total, itens: itensPedido, status: "Pago"
            })
        });

        if (!pedidoResponse.ok) throw new Error();

        for (const item of userCart) {
            await fetch(`http://localhost:3000/carrinho/${item.id}`, { method: 'DELETE' });
        }

        showToast(translations.alertSuccess[currentLang], 'success');
        setTimeout(() => window.location.href = "perfil.html", 2000);

    } catch (err) {
        showToast('Erro ao processar.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!clienteLogado || !clienteLogado.id) {
        alert(translations.alertLogin[currentLang]);
        window.location.href = "entrar.html";
        return;
    }
    setLanguage(currentLang);
    loadOrderSummary();
    setupMasks();

    const methodBtns = document.querySelectorAll('.method-btn');
    const forms = document.querySelectorAll('.payment-form');

    methodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            methodBtns.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.method).classList.add('active');
        });
    });

    const btnCupom = document.getElementById('apply-coupon-btn');
    if(btnCupom) btnCupom.addEventListener('click', applyCoupon);

    const btnPix = document.getElementById('copy-pix-btn');
    if(btnPix) btnPix.addEventListener('click', copyPixCode);

    document.getElementById('pix').addEventListener('submit', processPayment);
    document.getElementById('credit').addEventListener('submit', processPayment);
});