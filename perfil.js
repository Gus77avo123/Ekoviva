// --- SISTEMA DE TRADUÇÃO ---
const translations = {
    pageTitle: { pt: 'Perfil do Cliente', en: 'Customer Profile' },
    personalDataTitle: { pt: 'Dados Pessoais', en: 'Personal Data' },
    editButton: { pt: 'Editar', en: 'Edit' },
    historyTitle: { pt: 'Histórico de Compras', en: 'Purchase History' },
    thProduct: { pt: 'Produto', en: 'Product' },
    thQty: { pt: 'Qtd.', en: 'Qty.' },
    thValue: { pt: 'Valor', en: 'Value' },
    thShipping: { pt: 'Frete', en: 'Shipping' },
    thTotal: { pt: 'Total Pago', en: 'Total Paid' },
    thDate: { pt: 'Data', en: 'Date' },
    thTracking: { pt: 'Rastreamento', en: 'Tracking' },
    backToHomeButton: { pt: 'Voltar à Página Inicial', en: 'Back to Homepage' },
    logoutButton: { pt: 'Sair', en: 'Logout' },
    modalTitle: { pt: 'Editar Dados Pessoais', en: 'Edit Personal Data' },
    labelName: { pt: 'Nome Completo', en: 'Full Name' },
    labelPhone: { pt: 'Telefone', en: 'Phone' },
    labelAddress: { pt: 'Endereço', en: 'Address' },
    labelDob: { pt: 'Data de Nascimento', en: 'Date of Birth' },
    saveButton: { pt: 'Salvar Alterações', en: 'Save Changes' },
    // Strings do JS
    labelEmailJS: { pt: 'E-mail:', en: 'Email:'},
    labelPhoneJS: { pt: 'Telefone:', en: 'Phone:'},
    labelAddressJS: { pt: 'Endereço:', en: 'Address:'},
    labelDobJS: { pt: 'Data de Nascimento:', en: 'Date of Birth:'},
    noInfo: { pt: 'Não informado', en: 'Not provided' },
    noHistory: { pt: 'Nenhum histórico de compras encontrado.', en: 'No purchase history found.' },
    trackButton: { pt: 'Rastrear', en: 'Track' },
    statusAwaiting: { pt: 'Aguardando Envio', en: 'Awaiting Shipment' },
    statusDelivered: { pt: 'Entregue', en: 'Delivered' },
    alertUpdateSuccess: { pt: 'Dados atualizados com sucesso!', en: 'Data updated successfully!' },
    alertLoginNeeded: { pt: 'Sessão expirada. Por favor, faça login novamente.', en: 'Session expired. Please log in again.'},
    alertUserNotFound: { pt: 'Cliente não encontrado!', en: 'Customer not found!'}
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
    document.querySelectorAll('.language-switcher a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-lang') === lang) link.classList.add('active');
    });
    carregarDadosNaTela(); // Recarrega os dados com o novo idioma
};

document.querySelectorAll('.language-switcher a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage(link.getAttribute('data-lang'));
    });
});
// --- FIM DO SISTEMA DE TRADUÇÃO ---


document.addEventListener("DOMContentLoaded", () => {
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    if (!clienteLogado || !clienteLogado.email) {
        alert(translations.alertLoginNeeded[currentLang]);
        window.location.href = "entrar.html";
        return;
    }
    setLanguage(currentLang); // Carga inicial do idioma e dos dados
});

function carregarDadosNaTela() {
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    let clienteAtual = clientes.find(c => c.email === JSON.parse(localStorage.getItem("clienteLogado")).email);

    if (!clienteAtual) {
        alert(translations.alertUserNotFound[currentLang]);
        logout();
        return;
    }

    document.getElementById("foto-perfil").src = clienteAtual.foto || "https://via.placeholder.com/150";
    document.getElementById("nome-display").textContent = clienteAtual.nome || translations.noInfo[currentLang];
    document.getElementById("email").innerHTML = `<strong>${translations.labelEmailJS[currentLang]}</strong> ${clienteAtual.email || translations.noInfo[currentLang]}`;
    document.getElementById("telefone").innerHTML = `<strong>${translations.labelPhoneJS[currentLang]}</strong> ${clienteAtual.telefone || translations.noInfo[currentLang]}`;
    document.getElementById("endereco").innerHTML = `<strong>${translations.labelAddressJS[currentLang]}</strong> ${clienteAtual.endereco || translations.noInfo[currentLang]}`;
    
    const dobLocale = currentLang === 'pt' ? 'pt-BR' : 'en-CA';
    document.getElementById("data-nascimento").innerHTML = `<strong>${translations.labelDobJS[currentLang]}</strong> ${clienteAtual.data_nascimento ? new Date(clienteAtual.data_nascimento).toLocaleDateString(dobLocale, {timeZone: 'UTC'}) : translations.noInfo[currentLang]}`;

    const historicoCompras = JSON.parse(localStorage.getItem("historicoCompras")) || [];
    const clienteHistorico = historicoCompras.filter(item => item.cliente === clienteAtual.email);
    const rastreamentoListEl = document.getElementById("rastreamento-list");
    rastreamentoListEl.innerHTML = "";
    
    if (clienteHistorico.length > 0) {
        clienteHistorico.forEach(item => {
            const subtotal = item.price * item.quantity;
            const frete = subtotal * 0.05;
            const totalPago = subtotal + frete;
            const productName = (item.name && item.name[currentLang]) ? item.name[currentLang] : (item.name || 'Produto');
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${productName}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(subtotal)}</td>
                <td>${formatCurrency(frete)}</td>
                <td><strong>${formatCurrency(totalPago)}</strong></td>
                <td>${item.dataCompra || 'N/A'}</td>
                <td>${generateTrackingHTML(item)}</td>
            `;
            rastreamentoListEl.appendChild(row);
        });
    } else {
        rastreamentoListEl.innerHTML = `<tr><td colspan='7' style='text-align:center;'>${translations.noHistory[currentLang]}</td></tr>`;
    }
}

function formatCurrency(value) {
    const locale = currentLang === 'pt' ? 'pt-BR' : 'en-US';
    return value.toLocaleString(locale, { style: 'currency', currency: 'BRL' });
}

function generateTrackingHTML(item) {
    if (!item.codigoRastreio) {
        return `<span>${translations.statusAwaiting[currentLang]}</span>`;
    }
    if (item.status === 'Entregue' || item.status === 'Delivered') {
        const statusText = currentLang === 'pt' ? 'Entregue' : 'Delivered';
        return `<span style="color: green;"><i class="bi bi-check-circle-fill"></i> ${statusText}</span><br><small>${item.codigoRastreio}</small>`;
    }
    return `<button class="btn btn-track" onclick="trackOrder('${item.codigoRastreio}')"><i class="bi bi-truck"></i> ${translations.trackButton[currentLang]}</button><br><small>${item.codigoRastreio}</small>`;
}

window.trackOrder = function(trackingCode) {
    localStorage.setItem('trackingToView', trackingCode);
    window.location.href = 'rastreamento.html';
}

window.logout = function() {
    localStorage.removeItem("clienteLogado");
    window.location.href = "index.html";
}

// Modal Logic
const modal = document.getElementById("modal-edicao");
document.getElementById("btn-abrir-modal").onclick = () => {
    let clienteAtual = JSON.parse(localStorage.getItem("clientes")).find(c => c.email === JSON.parse(localStorage.getItem("clienteLogado")).email);
    document.getElementById("edit-nome").value = clienteAtual.nome || "";
    document.getElementById("edit-telefone").value = clienteAtual.telefone || "";
    document.getElementById("edit-endereco").value = clienteAtual.endereco || "";
    document.getElementById("edit-data-nascimento").value = clienteAtual.data_nascimento || "";
    modal.style.display = "block";
}
document.getElementById("close-modal").onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) { modal.style.display = "none"; } }

document.getElementById("form-edicao").onsubmit = (e) => {
    e.preventDefault();
    let clientes = JSON.parse(localStorage.getItem("clientes"));
    let clienteAtual = clientes.find(c => c.email === JSON.parse(localStorage.getItem("clienteLogado")).email);
    clienteAtual.nome = document.getElementById("edit-nome").value;
    clienteAtual.telefone = document.getElementById("edit-telefone").value;
    clienteAtual.endereco = document.getElementById("edit-endereco").value;
    clienteAtual.data_nascimento = document.getElementById("edit-data-nascimento").value;
    
    const indiceCliente = clientes.findIndex(c => c.email === clienteAtual.email);
    if (indiceCliente !== -1) {
        clientes[indiceCliente] = clienteAtual;
        localStorage.setItem("clientes", JSON.stringify(clientes));
        localStorage.setItem("clienteLogado", JSON.stringify(clienteAtual)); // Atualiza o cliente logado também
    }
    setLanguage(currentLang); // Recarrega os dados na tela com o novo idioma
    modal.style.display = "none";
    alert(translations.alertUpdateSuccess[currentLang]);
};

document.getElementById("input-foto").addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const fotoBase64 = e.target.result;
        document.getElementById("foto-perfil").src = fotoBase64;
        let clientes = JSON.parse(localStorage.getItem("clientes"));
        let clienteAtual = clientes.find(c => c.email === JSON.parse(localStorage.getItem("clienteLogado")).email);
        clienteAtual.foto = fotoBase64;
        const indiceCliente = clientes.findIndex(c => c.email === clienteAtual.email);
        if (indiceCliente !== -1) {
            clientes[indiceCliente] = clienteAtual;
            localStorage.setItem("clientes", JSON.stringify(clientes));
            localStorage.setItem("clienteLogado", JSON.stringify(clienteAtual)); // Atualiza o cliente logado também
        }
    };
    reader.readAsDataURL(file);
});