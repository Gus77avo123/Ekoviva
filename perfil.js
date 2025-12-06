// --- SISTEMA DE TRADUÇÃO COMPLETO ---
const translations = {
    pageTitle: { pt: 'Visão Geral', en: 'Overview' },
    historyTitle: { pt: 'Meus Pedidos', en: 'My Orders' },
    backToHomeButton: { pt: 'Ir para Loja', en: 'Go to Store' },
    logoutButton: { pt: 'Sair', en: 'Logout' },
    editButton: { pt: 'Editar Dados', en: 'Edit Data' },
    changePassButton: { pt: 'Senha', en: 'Password' },
    saveButton: { pt: 'Salvar', en: 'Save' },
    savePassButton: { pt: 'Atualizar', en: 'Update' },
    statOrders: { pt: 'Pedidos Realizados', en: 'Orders Placed' },
    statInvested: { pt: 'Total Investido', en: 'Total Invested' },
    shippingInfoTitle: { pt: 'Informações de Envio', en: 'Shipping Info' },
    labelEmailJS: { pt: 'E-mail', en: 'Email'},
    labelPhoneJS: { pt: 'Telefone', en: 'Phone'},
    labelAddressJS: { pt: 'Endereço', en: 'Address'},
    labelDobJS: { pt: 'Nascimento', en: 'Date of Birth'},
    thId: { pt: 'ID', en: 'ID' },
    thProduct: { pt: 'Produto', en: 'Product' },
    thQty: { pt: 'Qtd.', en: 'Qty.' },
    thTotal: { pt: 'Total', en: 'Total' },
    thDate: { pt: 'Data', en: 'Date' },
    thStatus: { pt: 'Status', en: 'Status' },
    thActions: { pt: 'Ações', en: 'Actions' },
    thPrice: { pt: 'Preço Unit.', en: 'Unit Price' },
    thSubtotal: { pt: 'Subtotal', en: 'Subtotal' },
    labelTotal: { pt: 'Total Pago:', en: 'Total Paid:' },
    statusPending: { pt: 'Pendente', en: 'Pending' },
    statusShipped: { pt: 'Enviado', en: 'Shipped' },
    statusDelivered: { pt: 'Entregue', en: 'Delivered' },
    statusCancelled: { pt: 'Cancelado', en: 'Cancelled' },
    alertCancelConfirm: { pt: 'Tem certeza que deseja desistir desta compra?', en: 'Are you sure you want to cancel this order?' },
    alertLoginNeeded: { pt: 'Faça login para acessar.', en: 'Please log in.'},
    noInfo: { pt: 'Não informado', en: 'Not provided' }
};

let currentLang = localStorage.getItem('language') || 'pt';
const apiBase = "http://localhost:3000"; 
let clienteDados = null; // Variável para armazenar dados do cliente

const setLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.querySelectorAll('[data-lang-key]').forEach(elem => {
        const key = elem.getAttribute('data-lang-key');
        if (translations[key] && translations[key][lang]) {
            elem.textContent = translations[key][lang];
        }
    });
    document.querySelectorAll('.lang-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('data-lang') === lang);
    });
    carregarDadosNaTela(); // Recarrega textos dinâmicos
};

document.querySelectorAll('.lang-link').forEach(link => {
    link.addEventListener('click', (e) => { e.preventDefault(); setLanguage(link.getAttribute('data-lang')); });
});

document.addEventListener("DOMContentLoaded", () => {
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    if (!clienteLogado || !clienteLogado.id) {
        alert(translations.alertLoginNeeded[currentLang]);
        window.location.href = "login.html";
        return;
    }
    setLanguage(currentLang);
});

async function carregarDadosNaTela() {
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    try {
        // Busca dados atualizados do usuário
        const response = await fetch(`${apiBase}/usuarios/${clienteLogado.id}`);
        clienteDados = await response.json(); // Salva na variável global

        if (!clienteDados) return logout();

        // 1. Preenche Painel Principal
        const fotoUrl = clienteDados.foto ? `${apiBase}/uploads/${clienteDados.foto}` : "https://via.placeholder.com/150";
        document.getElementById("foto-perfil").src = fotoUrl;
        document.getElementById("header-avatar").src = fotoUrl;
        
        document.getElementById("nome-display").textContent = clienteDados.nome;
        document.getElementById("welcome-message").textContent = `Olá, ${clienteDados.nome.split(' ')[0]}!`;
        document.getElementById("email-display").textContent = clienteDados.email;
        
        document.getElementById("telefone").textContent = clienteDados.telefone || translations.noInfo[currentLang];
        document.getElementById("endereco").textContent = clienteDados.endereco || translations.noInfo[currentLang];
        
        if (clienteDados.data_nascimento) {
            // Corrige fuso horário visualmente
            const dataObj = new Date(clienteDados.data_nascimento);
            const userTimezoneOffset = dataObj.getTimezoneOffset() * 60000;
            const dataCorrigida = new Date(dataObj.getTime() + userTimezoneOffset);
            document.getElementById("data-nascimento").textContent = dataCorrigida.toLocaleDateString(currentLang === 'pt' ? 'pt-BR' : 'en-US');
        } else {
            document.getElementById("data-nascimento").textContent = translations.noInfo[currentLang];
        }

        // 2. Busca Pedidos
        const pedidosRes = await fetch(`${apiBase}/pedidos/usuario/${clienteLogado.id}`);
        const pedidos = await pedidosRes.json();
        
        renderizarTabelaPedidos(pedidos);
        calcularEstatisticas(pedidos);

    } catch (err) { console.error(err); }
}

// --- FUNÇÕES DE PEDIDOS ---

function getStatusBadge(status) {
    const s = (status || 'Pendente').toLowerCase();
    if (s.includes('entregue') || s.includes('delivered')) return `<span class="badge delivered">${translations.statusDelivered[currentLang]}</span>`;
    if (s.includes('enviado') || s.includes('shipped')) return `<span class="badge shipped">${translations.statusShipped[currentLang]}</span>`;
    if (s.includes('cancelado') || s.includes('cancelled')) return `<span class="badge cancelled">${translations.statusCancelled[currentLang]}</span>`;
    return `<span class="badge pending">${translations.statusPending[currentLang]}</span>`;
}

function renderizarTabelaPedidos(pedidos) {
    const lista = document.getElementById("rastreamento-list");
    lista.innerHTML = "";

    if (pedidos.length === 0) {
        lista.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#999;">Nenhum pedido encontrado.</td></tr>`;
        return;
    }

    pedidos.sort((a,b) => new Date(b.data_pedido) - new Date(a.data_pedido));

    pedidos.forEach(p => {
        const tr = document.createElement("tr");
        const dataFormatada = new Date(p.data_pedido).toLocaleDateString(currentLang === 'pt' ? 'pt-BR' : 'en-US');
        const valorFormatado = Number(p.total).toLocaleString(currentLang === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL' });

        tr.innerHTML = `
            <td>#${p.id}</td>
            <td>${dataFormatada}</td>
            <td>${getStatusBadge(p.status)}</td>
            <td style="font-weight: bold; color: var(--cor-primaria);">${valorFormatado}</td>
            <td>
                <div class="action-btn-group">
                    <button class="btn-icon btn-view" title="Ver Detalhes" onclick="verDetalhesPedido(${p.id}, '${p.status || 'Pendente'}', '${p.data_pedido}', '${p.total}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    ${(p.status !== 'Entregue' && p.status !== 'Cancelado') ? 
                        `<button class="btn-icon btn-cancel" title="Cancelar Pedido" onclick="cancelarPedido(${p.id})">
                            <i class="bi bi-x-lg"></i>
                        </button>` : ''}
                </div>
            </td>
        `;
        lista.appendChild(tr);
    });
}

async function verDetalhesPedido(id, status, data, total) {
    const modal = document.getElementById("modal-detalhes");
    const listaItens = document.getElementById("lista-itens-pedido");
    
    document.getElementById("detalhes-titulo").textContent = `Pedido #${id}`;
    document.getElementById("det-data").textContent = new Date(data).toLocaleDateString(currentLang === 'pt' ? 'pt-BR' : 'en-US');
    document.getElementById("det-status").innerHTML = getStatusBadge(status);
    document.getElementById("det-total").textContent = Number(total).toLocaleString(currentLang === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL' });

    listaItens.innerHTML = "<tr><td colspan='4'>Carregando...</td></tr>";
    modal.style.display = "flex";

    try {
        const res = await fetch(`${apiBase}/itens_pedido/pedido/${id}`);
        const itens = await res.json();
        
        listaItens.innerHTML = "";
        
        for (const item of itens) {
            // CORREÇÃO: Tratamento para produto deletado (evita erro "undefined")
            let nomeProduto = "Produto Indisponível";
            
            if (item.Produto) {
                nomeProduto = item.Produto.nome;
            } else {
                // Tenta buscar pelo ID se não vier populado, ou mantém msg de erro
                try {
                    const prodRes = await fetch(`${apiBase}/produtos/${item.produto_id}`);
                    if(prodRes.ok) {
                        const produto = await prodRes.json();
                        nomeProduto = produto.nome;
                    }
                } catch(e) { console.log("Produto não encontrado"); }
            }
            
            const subtotal = item.quantidade * item.preco_unit;
            
            listaItens.innerHTML += `
                <tr>
                    <td>${nomeProduto}</td>
                    <td>${item.quantidade}</td>
                    <td>${Number(item.preco_unit).toLocaleString(currentLang === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL' })}</td>
                    <td>${subtotal.toLocaleString(currentLang === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL' })}</td>
                </tr>
            `;
        }
    } catch (err) {
        listaItens.innerHTML = "<tr><td colspan='4'>Erro ao carregar itens.</td></tr>";
    }
}

async function cancelarPedido(id) {
    if(!confirm(translations.alertCancelConfirm[currentLang])) return;
    try {
        const res = await fetch(`${apiBase}/pedidos/${id}`, { method: 'DELETE' });
        if(res.ok) carregarDadosNaTela(); 
        else alert("Erro ao cancelar.");
    } catch(err) { alert("Erro de conexão."); }
}

function calcularEstatisticas(pedidos) {
    const validos = pedidos.filter(p => p.status !== 'Cancelado');
    const totalPedidos = validos.length;
    let totalGasto = 0;
    validos.forEach(p => totalGasto += Number(p.total));

    document.getElementById("total-pedidos").textContent = totalPedidos;
    document.getElementById("total-gasto").textContent = totalGasto.toLocaleString(currentLang === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL' });
}

// --- MODAIS E EDIÇÃO ---

window.logout = function() {
    localStorage.removeItem("clienteLogado");
    window.location.href = "index.html";
}

const modals = document.querySelectorAll(".modal");
document.querySelectorAll(".closeModalBtn").forEach(btn => {
    btn.onclick = () => modals.forEach(m => m.style.display = "none");
});
window.onclick = (e) => {
    if (e.target.classList.contains('modal')) e.target.style.display = "none";
}

// CORREÇÃO: Preenche TODOS os campos do modal de edição
document.getElementById("btn-abrir-modal").onclick = () => {
    if(clienteDados) {
        document.getElementById("edit-nome").value = clienteDados.nome || "";
        document.getElementById("edit-telefone").value = clienteDados.telefone || "";
        document.getElementById("edit-endereco").value = clienteDados.endereco || "";
        
        // Formata data para o input HTML (yyyy-MM-dd)
        if(clienteDados.data_nascimento) {
            const date = new Date(clienteDados.data_nascimento);
            const isoDate = date.toISOString().split('T')[0];
            document.getElementById("edit-data-nascimento").value = isoDate;
        } else {
            document.getElementById("edit-data-nascimento").value = "";
        }
    }
    document.getElementById("modal-edicao").style.display = "flex";
}

document.getElementById("btn-abrir-senha").onclick = () => document.getElementById("modal-senha").style.display = "flex";

// --- SALVAR EDIÇÃO ---
document.getElementById("form-edicao").onsubmit = async (e) => {
    e.preventDefault();
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    
    const dataInput = document.getElementById("edit-data-nascimento").value;
    
    const body = {
        nome: document.getElementById("edit-nome").value,
        telefone: document.getElementById("edit-telefone").value,
        endereco: document.getElementById("edit-endereco").value,
        data_nascimento: dataInput || null // Envia null se estiver vazio
    };

    try {
        const res = await fetch(`${apiBase}/usuarios/${clienteLogado.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        
        if (res.ok) {
            document.getElementById("modal-edicao").style.display = "none";
            carregarDadosNaTela(); // Atualiza a tela
        } else {
            alert("Erro ao atualizar dados.");
        }
    } catch (error) { console.error(error); }
};

// --- UPLOAD FOTO ---
document.getElementById("input-foto").addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    
    const formData = new FormData();
    formData.append('arquivo', file);
    
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    
    try {
        const res = await fetch(`${apiBase}/usuarios/${clienteLogado.id}/imagem`, { 
            method: 'PUT', 
            body: formData 
        });
        
        if (res.ok) {
            carregarDadosNaTela();
        } else {
            alert("Erro ao enviar imagem.");
        }
    } catch (err) { console.error(err); }
});