// --- SISTEMA DE TRADUÇÃO ---
const translations = {
    headerTitle: { pt: '<i class="bi bi-cart4"></i> Meu Carrinho', en: '<i class="bi bi-cart4"></i> My Cart' },
    cartTitle: { pt: 'Itens no Carrinho', en: 'Items in Cart' },
    thProduct: { pt: 'Produto', en: 'Product' },
    thPrice: { pt: 'Preço', en: 'Price' },
    thQty: { pt: 'Quantidade', en: 'Quantity' },
    thSubtotal: { pt: 'Subtotal', en: 'Subtotal' },
    thAction: { pt: 'Ação', en: 'Action' },
    summarySubtotal: { pt: 'Subtotal:', en: 'Subtotal:' },
    summaryShipping: { pt: 'Frete:', en: 'Shipping:' },
    summaryTotal: { pt: 'Total a Pagar:', en: 'Total to Pay:' },
    btnContinue: { pt: 'Continuar Comprando', en: 'Continue Shopping' },
    btnClear: { pt: 'Limpar Carrinho', en: 'Clear Cart' },
    btnCheckout: { pt: 'Ir para o Pagamento', en: 'Proceed to Payment' },
    emptyCartMessage: { pt: 'Seu carrinho está vazio!', en: 'Your cart is empty!' },
    emptyCartLink: { pt: 'Comece a comprar', en: 'Start shopping' },
    alertLogin: { pt: 'Você precisa estar logado para ver seu carrinho.', en: 'You must be logged in to view your cart.' },
    alertConfirmClear: { pt: 'Tem certeza que deseja limpar todos os itens do carrinho?', en: 'Are you sure you want to clear all items from the cart?' }
};

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

    document.querySelectorAll('.language-switcher a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active');
        }
    });
    renderCart(); // Re-renderiza o carrinho com o novo idioma
};

document.querySelectorAll('.language-switcher a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage(link.getAttribute('data-lang'));
    });
});

// --- FIM DO SISTEMA DE TRADUÇÃO ---

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));

const cartDisplayArea = document.getElementById("cart-display-area");
const subtotalPriceEl = document.getElementById("subtotal-price");
const freightPriceEl = document.getElementById("freight-price");
const totalPriceEl = document.getElementById("total-price");
const summarySection = document.getElementById("summary-section");
const cartActionsSection = document.getElementById("cart-actions-section");

function renderCart() {
    if (!clienteLogado) {
        alert(translations.alertLogin[currentLang]);
        window.location.href = "entrar.html";
        return;
    }

    let userCart = cart.filter(item => item.cliente === clienteLogado.email);
    
    cartDisplayArea.innerHTML = '';
    let subtotal = 0;

    if (userCart.length === 0) {
        cartDisplayArea.innerHTML = `<div class="empty-cart-message"><p data-lang-key="emptyCartMessage">${translations.emptyCartMessage[currentLang]}</p><a href="index.html" data-lang-key="emptyCartLink">${translations.emptyCartLink[currentLang]}</a></div>`;
        summarySection.style.display = 'none';
        cartActionsSection.style.display = 'none';
        return;
    }

    summarySection.style.display = 'flex';
    cartActionsSection.style.display = 'flex';

    const table = document.createElement('table');
    table.className = 'cart-items';
    table.innerHTML = `
        <thead>
            <tr>
                <th data-lang-key="thProduct">${translations.thProduct[currentLang]}</th>
                <th data-lang-key="thPrice">${translations.thPrice[currentLang]}</th>
                <th data-lang-key="thQty">${translations.thQty[currentLang]}</th>
                <th data-lang-key="thSubtotal">${translations.thSubtotal[currentLang]}</th>
                <th data-lang-key="thAction">${translations.thAction[currentLang]}</th>
            </tr>
        </thead>
        <tbody id="cart-items-body"></tbody>
    `;
    cartDisplayArea.appendChild(table);
    const cartItemsBody = document.getElementById("cart-items-body");

    userCart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        const productName = (item.name && item.name[currentLang]) ? item.name[currentLang] : (item.name || 'Produto');
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.image ? `<img src="${item.image}" alt="${productName}">` : ''} ${productName}</td>
            <td>${formatCurrency(item.price)}</td>
            <td><div class="quantity-controls"><button onclick="decrementQuantity('${item.id}')">-</button><span>${item.quantity}</span><button onclick="incrementQuantity('${item.id}')">+</button></div></td>
            <td>${formatCurrency(itemSubtotal)}</td>
            <td><button class="action-btn" onclick="removeFromCart('${item.id}')"><i class="bi bi-trash"></i></button></td>`;
        cartItemsBody.appendChild(row);
    });

    const freight = subtotal * 0.05; // 5% de frete
    const total = subtotal + freight;

    subtotalPriceEl.textContent = formatCurrency(subtotal);
    freightPriceEl.textContent = formatCurrency(freight);
    totalPriceEl.textContent = formatCurrency(total);
}

function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function incrementQuantity(productId) {
    const item = cart.find(p => p.id == productId && p.cliente === clienteLogado.email);
    if (item) item.quantity++;
    updateLocalStorage();
}

function decrementQuantity(productId) {
    const item = cart.find(p => p.id == productId && p.cliente === clienteLogado.email);
    if (item && item.quantity > 1) {
        item.quantity--;
    } else {
        removeFromCart(productId);
    }
    updateLocalStorage();
}

function removeFromCart(productId) {
    cart = cart.filter(item => !(item.id == productId && item.cliente === clienteLogado.email));
    updateLocalStorage();
}

function clearCart() {
    if (confirm(translations.alertConfirmClear[currentLang])) {
        cart = cart.filter(item => item.cliente !== clienteLogado.email);
        updateLocalStorage();
    }
}

function proceedToPayment() { window.location.href = "pagamento.html"; }
function goBack(page) { window.location.href = page; }

function formatCurrency(amount) {
    const locale = currentLang === 'pt' ? 'pt-BR' : 'en-US';
    return amount.toLocaleString(locale, { style: 'currency', currency: 'BRL' });
}

// Carga inicial
setLanguage(currentLang);