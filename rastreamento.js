const translations = {
    pageTitle: { pt: "Rastreamento de Frete", en: "Shipment Tracking" },
    backToProfile: { pt: "← Voltar ao Perfil", en: "← Back to Profile" },
    placeholder: { pt: "Digite seu código de rastreio", en: "Enter your tracking code" },
    trackButton: { pt: "Rastrear Pedido", en: "Track Order" },
    resultTitle: { pt: "Status do Pedido: {productName}", en: "Order Status: {productName}" },
    confirmDeliveryButton: { pt: "Confirmar Recebimento", en: "Confirm Delivery" },
    errorInvalidCode: { pt: "Por favor, insira um código de rastreamento válido.", en: "Please enter a valid tracking code." },
    errorCodeNotFound: { pt: "Código de rastreamento ({trackingCode}) não encontrado.", en: "Tracking code ({trackingCode}) not found." },
    alertDeliverySuccess: { pt: "Entrega confirmada com sucesso! Você será redirecionado para seu perfil.", en: "Delivery confirmed successfully! You will be redirected to your profile." },
    timelineSteps: [
        { key: "Pedido Realizado", status: { pt: "Pedido Realizado", en: "Order Placed" }, description: { pt: "Seu pedido foi recebido e está aguardando aprovação.", en: "Your order has been received and is awaiting approval." } },
        { key: "Pagamento Aprovado", status: { pt: "Pagamento Aprovado", en: "Payment Approved" }, description: { pt: "O pagamento foi confirmado. Estamos preparando seu pedido.", en: "Payment has been confirmed. We are preparing your order." } },
        { key: "Em Separação", status: { pt: "Em Separação", en: "Processing" }, description: { pt: "Seus produtos estão sendo separados em nosso estoque.", en: "Your products are being picked in our warehouse." } },
        { key: "Enviado", status: { pt: "Enviado", en: "Shipped" }, description: { pt: "Seu pedido foi enviado para a transportadora.", en: "Your order has been shipped to the carrier." } },
        { key: "Entregue", status: { pt: "Entregue", en: "Delivered" }, description: { pt: "Seu pedido foi entregue com sucesso!", en: "Your order has been delivered successfully!" } }
    ]
};

let currentLang = localStorage.getItem('language') || 'pt';

const setLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.querySelectorAll('[data-lang-key]').forEach(elem => {
        const key = elem.getAttribute('data-lang-key');
        if (translations[key] && translations[key][lang]) {
            elem.textContent = translations[key][lang];
        }
    });
    document.querySelectorAll('[data-placeholder-key]').forEach(elem => {
        const key = elem.getAttribute('data-placeholder-key');
        if (translations[key] && translations[key][lang]) {
            elem.placeholder = translations[key][lang];
        }
    });
    document.querySelectorAll('.language-switcher a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-lang') === lang) link.classList.add('active');
    });
    // Se já houver um resultado, atualiza a timeline
    if (document.getElementById('result').style.display === 'block') {
        trackShipment(false); // Re-executa a busca sem o spinner
    }
};

const trackingCodeInput = document.getElementById('trackingCode');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error-message');
const spinner = document.getElementById('loading-spinner');
const timelineUl = document.getElementById('tracking-timeline');
const confirmButton = document.getElementById('btn-confirmar-entrega');

function displayMessage(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function updateTimeline(currentStatusKey, productName) {
    timelineUl.innerHTML = "";
    const currentStatusIndex = translations.timelineSteps.findIndex(step => step.key === currentStatusKey);
    
    document.getElementById('result-title').textContent = translations.resultTitle[currentLang].replace('{productName}', productName);

    translations.timelineSteps.forEach((step, index) => {
        const li = document.createElement('li');
        if (index <= currentStatusIndex) {
            li.classList.add('completed');
        }
        li.innerHTML = `<span>${step.status[currentLang]}</span><p>${step.description[currentLang]}</p>`;
        timelineUl.appendChild(li);
    });
}

function trackShipment(showSpinner = true) {
    const trackingCode = trackingCodeInput.value.trim().toUpperCase();
    
    resultDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    confirmButton.style.display = 'none';
    
    if (!trackingCode) {
        displayMessage(errorDiv, translations.errorInvalidCode[currentLang]);
        return;
    }

    if (showSpinner) spinner.style.display = 'block';

    setTimeout(() => {
        if (showSpinner) spinner.style.display = 'none';
        const historicoCompras = JSON.parse(localStorage.getItem("historicoCompras")) || [];
        const pedido = historicoCompras.find(p => p.codigoRastreio && p.codigoRastreio.toUpperCase() === trackingCode);

        if (pedido) {
            resultDiv.style.display = 'block';
            const productName = (pedido.name && pedido.name[currentLang]) ? pedido.name[currentLang] : (pedido.name || 'Produto');
            updateTimeline(pedido.status, productName);

            if (pedido.status !== "Entregue") {
                const newConfirmButton = confirmButton.cloneNode(true);
                newConfirmButton.textContent = translations.confirmDeliveryButton[currentLang];
                newConfirmButton.style.display = 'block';
                confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
                
                newConfirmButton.addEventListener('click', () => {
                    finalizarEntrega(trackingCode);
                });
            }
        } else {
            displayMessage(errorDiv, translations.errorCodeNotFound[currentLang].replace('{trackingCode}', trackingCode));
        }
    }, showSpinner ? 1500 : 0);
}

function finalizarEntrega(trackingCode) {
    let historicoCompras = JSON.parse(localStorage.getItem("historicoCompras")) || [];
    const pedidoIndex = historicoCompras.findIndex(p => p.codigoRastreio && p.codigoRastreio.toUpperCase() === trackingCode);

    if (pedidoIndex !== -1) {
        historicoCompras[pedidoIndex].status = "Entregue";
        localStorage.setItem("historicoCompras", JSON.stringify(historicoCompras));
        
        alert(translations.alertDeliverySuccess[currentLang]);
        
        setTimeout(() => {
            window.location.href = "perfil.html";
        }, 1500);
    }
}

document.getElementById('trackButton').addEventListener('click', () => trackShipment(true));
document.querySelectorAll('.language-switcher a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage(link.getAttribute('data-lang'));
    });
});

// Carga inicial
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    const codeToTrack = localStorage.getItem('trackingToView');
    if (codeToTrack) {
        trackingCodeInput.value = codeToTrack;
        trackShipment();
        localStorage.removeItem('trackingToView'); // Limpa para não rastrear de novo
    }
});