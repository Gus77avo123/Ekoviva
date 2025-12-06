// --- SISTEMA DE TRADUÇÃO ---
const translations = {
    headerTitle: { pt: 'Meu Carrinho', en: 'My Cart' },
    cartTitle: { pt: 'Itens no Carrinho', en: 'Items in Cart' },
    summaryTitle: { pt: 'Resumo do Pedido', en: 'Order Summary' },
    thProduct: { pt: 'Produto', en: 'Product' },
    thPrice: { pt: 'Preço', en: 'Price' },
    thQty: { pt: 'Qtd', en: 'Qty' },
    thSubtotal: { pt: 'Total', en: 'Total' },
    summarySubtotal: { pt: 'Subtotal:', en: 'Subtotal:' },
    summaryShipping: { pt: 'Frete (5%):', en: 'Shipping (5%):' },
    summaryTotal: { pt: 'Total a Pagar:', en: 'Total to Pay:' },
    btnContinue: { pt: 'Continuar Comprando', en: 'Continue Shopping' },
    btnClear: { pt: 'Esvaziar Carrinho', en: 'Empty Cart' },
    btnCheckout: { pt: 'Finalizar Compra', en: 'Checkout' },
    emptyCartMessage: { pt: 'Seu carrinho está vazio!', en: 'Your cart is empty!' },
    emptyCartLink: { pt: 'Comece a comprar', en: 'Start shopping' },
    alertLogin: { pt: 'Você precisa estar logado.', en: 'You need to be logged in.' },
    alertConfirmClear: { pt: 'Tem certeza que deseja esvaziar o carrinho?', en: 'Are you sure you want to empty the cart?' },
    msgRemoved: { pt: 'Item removido!', en: 'Item removed!' },
    msgCleared: { pt: 'Carrinho esvaziado!', en: 'Cart cleared!' },
    errorLoading: { pt: 'Erro ao carregar carrinho.', en: 'Error loading cart.' },
    
    // Footer
    footerNav: { pt: 'Navegação', en: 'Navigation' },
    footerAbout: { pt: 'Sobre o Projeto', en: 'About the Project' },
    footerProducts: { pt: 'Produtos', en: 'Products' },
    footerRegister: { pt: 'Cadastro', en: 'Register' },
    footerContact: { pt: 'Contato', en: 'Contact' },
    footerSocial: { pt: 'Siga-nos', en: 'Follow us' },
    footerRights: { pt: '© 2025 eKoviva - Projeto Integrador Acadêmico.', en: '© 2025 eKoviva - Academic Integrator Project.' },
    footerPrivacy: { pt: 'Política de Privacidade e LGPD.', en: 'Privacy Policy & GDPR.' },
    footerAdmin: { pt: 'Gerenciar Dados', en: 'Manage Data' },
    footerDesc: { pt: 'Um projeto de estudantes de ADS para um mundo mais sustentável.', en: 'An ADS student project for a more sustainable world.' }
};

let currentLang = localStorage.getItem('language') || 'pt';

const setLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.querySelectorAll('[data-lang-key]').forEach(elem => {
        const key = elem.getAttribute('data-lang-key');
        if (translations[key] && translations[key][lang]) elem.innerHTML = translations[key][lang];
    });
    document.querySelectorAll('.language-switcher a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-lang') === lang) link.classList.add('active');
    });
    renderCart();
};

document.querySelectorAll('.language-switcher a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage(link.getAttribute('data-lang'));
    });
});

// --- LÓGICA DO CARRINHO ---
const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
const cartDisplayArea = document.getElementById("cart-display-area");
const cartListContainer = document.getElementById("cart-list-container");
const summarySection = document.getElementById("summary-section");

// Toasts (Notificações)
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = type === 'success' ? `<i class="bi bi-check-circle-fill"></i> ${message}` : `<i class="bi bi-info-circle-fill"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Modal Confirmar Limpeza
function clearCart() {
    const modal = document.getElementById('modal-confirm');
    const msg = document.getElementById('confirm-msg');
    const btnYes = document.getElementById('btn-confirm-yes');
    
    msg.textContent = translations.alertConfirmClear[currentLang];
    modal.style.display = 'flex';
    
    btnYes.onclick = async () => {
        try {
            await fetch(`http://localhost:3000/carrinho/usuario/${clienteLogado.id}`, { method: 'DELETE' });
            showToast(translations.msgCleared[currentLang], 'success');
            renderCart();
        } catch (e) { console.error(e); }
        modal.style.display = 'none';
    };
}
function closeModalConfirm() { document.getElementById('modal-confirm').style.display = 'none'; }

async function renderCart() {
    if (!clienteLogado || !clienteLogado.id) {
        cartDisplayArea.innerHTML = `<p style="text-align:center; padding:40px;">${translations.alertLogin[currentLang]} <a href="index.html" style="color:var(--cor-primaria); font-weight:bold;">Login</a></p>`;
        summarySection.style.display = 'none';
        return;
    }

    // Efeito Loading visual
    cartListContainer.classList.add('table-loading');

    let subtotal = 0;

    try {
        const response = await fetch(`http://localhost:3000/carrinho/${clienteLogado.id}`);
        const userCart = await response.json();

        cartListContainer.classList.remove('table-loading');

        if (userCart.length === 0) {
            cartDisplayArea.innerHTML = `
                <div style="text-align:center; padding: 50px 20px;">
                    <i class="bi bi-cart-x" style="font-size: 4rem; color:#e0e0e0; margin-bottom: 20px; display: block;"></i>
                    <p style="font-size: 1.2rem; color: #666; margin-bottom: 20px;">${translations.emptyCartMessage[currentLang]}</p>
                    <a href="index.html#products" class="checkout-btn" style="text-decoration:none; display:inline-block; max-width: 250px; padding: 12px 20px; border-radius:8px; margin: 0 auto;">
                        ${translations.emptyCartLink[currentLang]}
                    </a>
                </div>`;
            summarySection.style.display = 'none';
            cartListContainer.style.background = 'transparent'; 
            cartListContainer.style.boxShadow = 'none';
            return;
        }

        // Restaura estilo se tiver itens
        cartListContainer.style.background = 'white'; 
        cartListContainer.style.boxShadow = 'var(--sombra-suave)';
        summarySection.style.display = 'block';

        const table = document.createElement('table');
        table.className = 'cart-items';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>${translations.thProduct[currentLang]}</th>
                    <th>${translations.thPrice[currentLang]}</th>
                    <th>${translations.thQty[currentLang]}</th>
                    <th>${translations.thSubtotal[currentLang]}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="cart-items-body"></tbody>
        `;
        cartDisplayArea.innerHTML = '';
        cartDisplayArea.appendChild(table);
        const tbody = document.getElementById("cart-items-body");

        userCart.forEach(item => {
            if (!item.Produto) return;
            const totalItem = item.Produto.preco * item.quantidade;
            subtotal += totalItem;
            
            const imgUrl = item.Produto.imagem ? `http://localhost:3000/uploads/${item.Produto.imagem}` : 'https://via.placeholder.com/70';

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center;">
                        <img src="${imgUrl}" alt="${item.Produto.nome}">
                        <span style="font-weight: 500;">${item.Produto.nome}</span>
                    </div>
                </td>
                <td data-label="${translations.thPrice[currentLang]}">${formatCurrency(item.Produto.preco)}</td>
                <td data-label="${translations.thQty[currentLang]}">
                    <div class="quantity-controls">
                        <button onclick="decrementQuantity(${item.id}, ${item.quantidade})">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="incrementQuantity(${item.id})">+</button>
                    </div>
                </td>
                <td data-label="${translations.thSubtotal[currentLang]}" style="font-weight: bold; color: var(--cor-primaria);">
                    ${formatCurrency(totalItem)}
                </td>
                <td>
                    <button class="action-btn" onclick="removeFromCart(${item.id})" title="Remover">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        const frete = subtotal * 0.05; 
        document.getElementById("subtotal-price").textContent = formatCurrency(subtotal);
        document.getElementById("freight-price").textContent = formatCurrency(frete);
        document.getElementById("total-price").textContent = formatCurrency(subtotal + frete);

    } catch (err) {
        console.error(err);
        cartDisplayArea.innerHTML = `<p style="text-align:center; color:#dc3545;">${translations.errorLoading[currentLang]}</p>`;
    }
}

async function incrementQuantity(id) {
    try {
        await fetch(`http://localhost:3000/carrinho/${id}`, { 
            method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ quantidade: 'increment' }) 
        });
        renderCart();
    } catch (e) { console.error(e); }
}

async function decrementQuantity(id, qtd) {
    if (qtd <= 1) { removeFromCart(id); return; }
    try {
        await fetch(`http://localhost:3000/carrinho/${id}`, { 
            method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ quantidade: 'decrement' }) 
        });
        renderCart();
    } catch (e) { console.error(e); }
}

async function removeFromCart(id) {
    try { 
        await fetch(`http://localhost:3000/carrinho/${id}`, { method: 'DELETE' }); 
        showToast(translations.msgRemoved[currentLang], 'success');
        renderCart(); 
    } 
    catch (e) { console.error(e); }
}

function proceedToPayment() { window.location.href = "pagamento.html"; }
function goBack(url) { window.location.href = url; }
function formatCurrency(val) { return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

document.addEventListener('DOMContentLoaded', () => { setLanguage(currentLang); });