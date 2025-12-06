/*******************************
 * CONFIGURAÇÃO API
 *******************************/
const apiBase = "http://localhost:3000";

/*******************************
 * CONTROLE DE ACESSO
 *******************************/
const cliente = JSON.parse(localStorage.getItem("clienteLogado"));
if (!cliente || cliente.tipoUsuario !== 0) {
    alert("Acesso restrito.");
    window.location.href = "index.html";
}

const toast = document.getElementById('toast');
const adminNameEl = document.getElementById('admin-name');
if(adminNameEl) adminNameEl.textContent = cliente.nome;

/* ELEMENTOS PRODUTO */
const modalProduto = document.getElementById('modal-produto');
const formProduto = document.getElementById('form-produto');
const produtoIdEl = document.getElementById('produto-id');
const produtoNomeEl = document.getElementById('produto-nome');
const produtoDescEl = document.getElementById('produto-desc');
const produtoPrecoEl = document.getElementById('produto-preco');
const produtoEstoqueEl = document.getElementById('produto-estoque');
const produtoImagemFileEl = document.getElementById('produto-imagem-file');
const produtoPreview = document.getElementById("produto-preview");
const produtoDestaqueEl = document.getElementById("produto-destaque");
const modalProdutoTitle = document.getElementById("modal-produto-title");
const btnCancelProduto = document.getElementById('btn-cancel-produto');
const produtosList = document.getElementById('produtos-list');

/* ELEMENTOS USUÁRIO */
const modalUsuario = document.getElementById('modal-usuario');
const formUsuario = document.getElementById('form-usuario');
const usuarioIdEl = document.getElementById('usuario-id');
const usuarioNomeEl = document.getElementById('usuario-nome');
const usuarioEmailEl = document.getElementById('usuario-email');
const usuarioCpfEl = document.getElementById('usuario-cpf');
const usuarioSenhaEl = document.getElementById('usuario-senha');
const usuarioTipoEl = document.getElementById('usuario-tipo');
const btnCancelUsuario = document.getElementById('btn-cancel-usuario');
const modalUsuarioTitle = document.getElementById("modal-usuario-title"); // Novo ID para título
const usuariosList = document.getElementById('usuarios-list');

/* ELEMENTOS PEDIDOS */
const pedidosList = document.getElementById('pedidos-list');
const modalItens = document.getElementById('modal-itens');
const itensContainer = document.getElementById('itens-container'); // Mudamos de UL para DIV
const btnFecharItens = document.getElementById('btn-fechar-itens');

/* VIEWS */
const dashboardView = document.getElementById('dashboard-view');
const produtosView = document.getElementById('produtos-view');
const usuariosView = document.getElementById('usuarios-view');
const pedidosView = document.getElementById('pedidos-view');
const pageTitle = document.getElementById('page-title');

/* DASHBOARD STATS */
const countProdutos = document.getElementById('count-produtos');
const countUsuarios = document.getElementById('count-usuarios');
const countPedidos = document.getElementById('count-pedidos');
const infoFaturamento = document.getElementById('info-faturamento');
const infoTicket = document.getElementById('info-ticket');
let chartRevenueInstance, chartStockInstance, chartUsersInstance;

// === UTILITÁRIOS ===
function showToast(msg, time = 3000) {
    toast.textContent = msg;
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", time);
}

function showView(view) {
    [dashboardView, produtosView, usuariosView, pedidosView].forEach(v => v.style.display = "none");
    view.style.display = "block";
}

// === NAVEGAÇÃO ===
document.getElementById('nav-dashboard').onclick = () => { showView(dashboardView); pageTitle.textContent="Dashboard"; loadDashboardData(); };
document.getElementById('nav-produtos').onclick = () => { showView(produtosView); pageTitle.textContent="Produtos"; loadProdutos(); };
document.getElementById('nav-usuarios').onclick = () => { showView(usuariosView); pageTitle.textContent="Usuários"; loadUsuarios(); };
document.getElementById('nav-pedidos').onclick = () => { showView(pedidosView); pageTitle.textContent="Pedidos"; loadPedidos(); };
document.getElementById('btn-home').onclick = () => window.location.href = "index.html";
document.getElementById('btn-logout').onclick = () => { localStorage.removeItem("clienteLogado"); window.location.href = "index.html"; };

loadDashboardData();

// === 1. DASHBOARD ===
async function loadDashboardData() {
    try {
        const [p, u, pe] = await Promise.all([
            fetch(`${apiBase}/produtos`).then(r => r.json()),
            fetch(`${apiBase}/usuarios_all`).then(r => r.json()),
            fetch(`${apiBase}/pedidos`).then(r => r.json())
        ]);
        countProdutos.textContent = p.length;
        countUsuarios.textContent = u.length;
        countPedidos.textContent = pe.length;
        let total = 0; pe.forEach(pd => total += parseFloat(pd.total));
        infoFaturamento.textContent = total.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
        infoTicket.textContent = (pe.length ? total/pe.length : 0).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
        renderCharts(pe, p, u);
    } catch (e) { console.error(e); }
}

function renderCharts(pedidos, produtos, usuarios) {
    const ctxR = document.getElementById('chart-revenue');
    if(chartRevenueInstance) chartRevenueInstance.destroy();
    const vendas = {}; pedidos.forEach(p => { const d = new Date(p.data_pedido).toLocaleDateString(); vendas[d] = (vendas[d]||0) + parseFloat(p.total); });
    chartRevenueInstance = new Chart(ctxR, { type: 'line', data: { labels: Object.keys(vendas).reverse(), datasets: [{ label: 'Faturamento', data: Object.values(vendas).reverse(), borderColor: '#28a745', fill: true }] } });

    const ctxS = document.getElementById('chart-stock');
    if(chartStockInstance) chartStockInstance.destroy();
    const prodS = [...produtos].sort((a,b)=>a.estoque-b.estoque).slice(0,10);
    chartStockInstance = new Chart(ctxS, { type: 'bar', data: { labels: prodS.map(p=>p.nome.substring(0,10)), datasets: [{ label: 'Estoque', data: prodS.map(p=>p.estoque), backgroundColor: '#0f1723' }] } });

    const ctxU = document.getElementById('chart-users');
    if(chartUsersInstance) chartUsersInstance.destroy();
    chartUsersInstance = new Chart(ctxU, { type: 'doughnut', data: { labels: ['Clientes','Admin'], datasets: [{ data: [usuarios.filter(u=>u.tipoUsuario===1).length, usuarios.filter(u=>u.tipoUsuario===0).length], backgroundColor: ['#28a745', '#0f1723'] }] } });
}

// === 2. PRODUTOS ===
async function loadProdutos() {
    produtosList.innerHTML = "Carregando...";
    try {
        const res = await fetch(`${apiBase}/produtos`);
        const data = await res.json();
        renderProdutos(data);
    } catch (err) { produtosList.innerHTML = "Erro ao carregar."; }
}

function renderProdutos(items) {
    if (!items.length) { produtosList.innerHTML = "Vazio."; return; }
    let html = `<table class="list-table"><thead><tr><th>Img</th><th>Nome</th><th>Preço</th><th>Estoque</th><th>Destaque</th><th>Ações</th></tr></thead><tbody>`;
    items.forEach(p => {
        const destaqueIcon = p.destaque ? '<i class="bi bi-star-fill" style="color:gold"></i>' : '<i class="bi bi-star" style="color:#ccc"></i>';
        html += `<tr>
            <td>${p.imagem ? `<img src="${apiBase}/uploads/${p.imagem}" height="30">` : "-"}</td>
            <td>${p.nome}</td>
            <td>R$ ${Number(p.preco).toFixed(2)}</td>
            <td>${p.estoque}</td>
            <td style="text-align:center">${destaqueIcon}</td>
            <td>
                <button class="primary" onclick="openEditProduto(${p.id})"><i class="bi bi-pencil-square"></i></button>
                <button class="danger" onclick="deleteProduto(${p.id})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;
    });
    html += "</tbody></table>";
    produtosList.innerHTML = html;
}

document.getElementById("btn-novo-produto").onclick = () => {
    modalProdutoTitle.textContent = "Novo Produto";
    produtoIdEl.value = ""; produtoNomeEl.value = ""; produtoDescEl.value = ""; produtoPrecoEl.value = ""; produtoEstoqueEl.value = "";
    if(produtoDestaqueEl) produtoDestaqueEl.checked = false;
    produtoImagemFileEl.value = ""; produtoPreview.style.display = "none";
    modalProduto.style.display = "flex";
};

window.openEditProduto = async (id) => {
    const res = await fetch(`${apiBase}/produtos/${id}`);
    const p = await res.json();
    modalProdutoTitle.textContent = "Editar Produto";
    produtoIdEl.value = p.id; produtoNomeEl.value = p.nome; produtoDescEl.value = p.descricao;
    produtoPrecoEl.value = p.preco; produtoEstoqueEl.value = p.estoque;
    if(produtoDestaqueEl) produtoDestaqueEl.checked = p.destaque;
    if(p.imagem) { produtoPreview.src = `${apiBase}/uploads/${p.imagem}`; produtoPreview.style.display = "block"; }
    modalProduto.style.display = "flex";
};

btnCancelProduto.onclick = () => modalProduto.style.display = "none";
produtoImagemFileEl.onchange = () => { if(produtoImagemFileEl.files[0]) { produtoPreview.src = URL.createObjectURL(produtoImagemFileEl.files[0]); produtoPreview.style.display="block"; }};

formProduto.onsubmit = async (e) => {
    e.preventDefault();
    const id = produtoIdEl.value;
    const formData = new FormData();
    formData.append("nome", produtoNomeEl.value); formData.append("descricao", produtoDescEl.value);
    formData.append("preco", produtoPrecoEl.value); formData.append("estoque", produtoEstoqueEl.value);
    if(produtoDestaqueEl) formData.append("destaque", produtoDestaqueEl.checked);
    if (produtoImagemFileEl.files.length > 0) formData.append("arquivo", produtoImagemFileEl.files[0]);

    const method = id ? "PUT" : "POST";
    const url = id ? `${apiBase}/produtos/${id}` : `${apiBase}/produtos`;
    const res = await fetch(url, { method, body: formData });

    if (!res.ok) return showToast("Erro ao salvar");
    modalProduto.style.display = "none";
    loadProdutos(); loadDashboardData(); showToast("Salvo com sucesso!");
};

window.deleteProduto = async (id) => {
    if(!confirm("Excluir?")) return;
    await fetch(`${apiBase}/produtos/${id}`, { method: "DELETE" });
    loadProdutos(); loadDashboardData(); showToast("Excluído!");
};

// === 3. USUÁRIOS (EDIÇÃO E EXCLUSÃO) ===
async function loadUsuarios() {
    usuariosList.innerHTML = "Carregando...";
    try {
        const res = await fetch(`${apiBase}/usuarios_all`);
        const data = await res.json();
        renderUsuarios(data);
    } catch (err) { usuariosList.innerHTML = "Erro."; }
}

function renderUsuarios(items) {
    if (!items.length) { usuariosList.innerHTML = "Vazio."; return; }
    let html = `<table class="list-table"><thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Tipo</th><th>Ações</th></tr></thead><tbody>`;
    items.forEach(u => {
        html += `<tr><td>${u.id}</td><td>${u.nome}</td><td>${u.email}</td>
        <td>${u.tipoUsuario===0?'<span class="badge-admin">Admin</span>':'Cliente'}</td>
        <td>
            <button class="primary" onclick="openEditUsuario(${u.id})"><i class="bi bi-pencil-square"></i></button>
            <button class="danger" onclick="deleteUsuario(${u.id})"><i class="bi bi-trash"></i></button>
        </td></tr>`;
    });
    html += "</tbody></table>";
    usuariosList.innerHTML = html;
}

// Abrir Modal Novo Usuário
document.getElementById("btn-novo-usuario").onclick = () => { 
    if(modalUsuarioTitle) modalUsuarioTitle.textContent = "Novo Usuário";
    usuarioIdEl.value = "";
    usuarioNomeEl.value = "";
    usuarioEmailEl.value = "";
    usuarioCpfEl.value = "";
    usuarioSenhaEl.value = "";
    usuarioSenhaEl.placeholder = "Senha";
    usuarioTipoEl.value = "1";
    modalUsuario.style.display = "flex"; 
};

// Abrir Modal Editar Usuário
window.openEditUsuario = async (id) => {
    try {
        const res = await fetch(`${apiBase}/usuarios/${id}`);
        const u = await res.json();
        
        if(modalUsuarioTitle) modalUsuarioTitle.textContent = "Editar Usuário";
        usuarioIdEl.value = u.id;
        usuarioNomeEl.value = u.nome;
        usuarioEmailEl.value = u.email;
        usuarioCpfEl.value = u.cpf || "";
        usuarioTipoEl.value = u.tipoUsuario;
        
        // Limpa a senha (opcional na edição)
        usuarioSenhaEl.value = "";
        usuarioSenhaEl.placeholder = "Deixe em branco para manter";
        
        modalUsuario.style.display = "flex";
    } catch(e) { console.error(e); }
};

btnCancelUsuario.onclick = () => modalUsuario.style.display = "none";

// Salvar Usuário (Criação ou Edição)
formUsuario.onsubmit = async (e) => {
    e.preventDefault();
    const id = usuarioIdEl.value;
    
    const payload = { 
        nome: usuarioNomeEl.value, 
        email: usuarioEmailEl.value, 
        cpf: usuarioCpfEl.value, 
        tipoUsuario: parseInt(usuarioTipoEl.value) 
    };

    // Só envia senha se foi digitada
    if(usuarioSenhaEl.value) {
        payload.senha = usuarioSenhaEl.value;
    } else if (!id) {
        // Se for novo usuário, senha é obrigatória
        return alert("Senha é obrigatória para cadastro.");
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `${apiBase}/usuarios/${id}` : `${apiBase}/usuarios`;

    try {
        const res = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        if(!res.ok) throw new Error();
        modalUsuario.style.display = "none"; 
        loadUsuarios(); 
        showToast(id ? "Usuário atualizado!" : "Usuário criado!");
    } catch(err) {
        showToast("Erro ao salvar usuário.");
    }
};

window.deleteUsuario = async (id) => {
    if(id===cliente.id) return alert("Não pode se excluir.");
    if(!confirm("Excluir este usuário?")) return;
    await fetch(`${apiBase}/usuarios/${id}`, { method: "DELETE" });
    loadUsuarios();
};

// === 4. PEDIDOS (TABELA DETALHADA NO MODAL) ===
async function loadPedidos() {
    pedidosList.innerHTML = "Carregando...";
    try {
        const res = await fetch(`${apiBase}/pedidos`);
        const data = await res.json();
        renderPedidos(data);
    } catch (err) { pedidosList.innerHTML = "Erro."; }
}

function renderPedidos(items) {
    if (!items.length) { pedidosList.innerHTML = "Vazio."; return; }
    let html = `<table class="list-table"><thead><tr><th>#</th><th>Data</th><th>Total</th><th>Ações</th></tr></thead><tbody>`;
    items.forEach(p => {
        html += `<tr><td>${p.id}</td><td>${new Date(p.data_pedido).toLocaleDateString()}</td><td>R$ ${Number(p.total).toFixed(2)}</td>
        <td><button class="primary" onclick="verItens(${p.id})"><i class="bi bi-eye"></i> Detalhes</button></td></tr>`;
    });
    html += "</tbody></table>";
    pedidosList.innerHTML = html;
}

// CORREÇÃO: Monta uma tabela bonita dentro do modal
window.verItens = async (id) => {
    const res = await fetch(`${apiBase}/itens_pedido/pedido/${id}`);
    const itens = await res.json();
    
    let html = `
    <table class="list-table" style="width:100%; margin-top:10px;">
        <thead>
            <tr>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Preço Unit.</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>`;
    
    let totalCalculado = 0;

    itens.forEach(i => {
        // Correção do BUG "Undefined": Verifica se i.Produto existe
        const nomeProduto = i.Produto ? i.Produto.nome : '<span style="color:red; font-style:italic;">Produto Removido</span>';
        const subtotal = i.quantidade * i.preco_unit;
        totalCalculado += subtotal;

        html += `
            <tr>
                <td>${nomeProduto}</td>
                <td style="text-align:center">${i.quantidade}</td>
                <td>R$ ${Number(i.preco_unit).toFixed(2)}</td>
                <td><strong>R$ ${subtotal.toFixed(2)}</strong></td>
            </tr>
        `;
    });

    html += `
        <tr style="background:#f0f0f0; font-weight:bold;">
            <td colspan="3" style="text-align:right;">TOTAL:</td>
            <td>R$ ${totalCalculado.toFixed(2)}</td>
        </tr>
    </tbody></table>`;

    // Injeta a tabela na div do modal (substituindo a lista antiga)
    itensContainer.innerHTML = html;
    modalItens.style.display = "flex";
};

btnFecharItens.onclick = () => modalItens.style.display = "none";