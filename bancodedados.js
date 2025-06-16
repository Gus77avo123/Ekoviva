function createTable(data, headers) {
    if (!data || data.length === 0) {
        const p = document.createElement('p');
        p.className = 'empty-state';
        p.textContent = 'Nenhum dado encontrado.';
        return p;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const headerRow = document.createElement('tr');

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    data.forEach(item => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            // Para o campo foto, mostramos apenas se existe ou não
            if (header.toLowerCase() === 'foto' && item[header.toLowerCase()]) {
                td.textContent = 'Sim (Base64)';
            } else {
                td.textContent = item[header.toLowerCase()] || 'N/A';
            }
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    return table;
}

function renderData() {
    // Renderiza Clientes
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const clientesContainer = document.getElementById('clientes-table-container');
    clientesContainer.innerHTML = ''; // Limpa antes de renderizar
    const clientesHeaders = ['nome', 'email', 'senha', 'cpf', 'telefone', 'endereco', 'foto'];
    clientesContainer.appendChild(createTable(clientes, clientesHeaders));

    // Renderiza Carrinho
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-table-container');
    cartContainer.innerHTML = '';
    const cartHeaders = ['name', 'price', 'quantity', 'cliente'];
    cartContainer.appendChild(createTable(cart, cartHeaders));
    
    // Renderiza Histórico
    const historico = JSON.parse(localStorage.getItem('historicoCompras')) || [];
    const historicoContainer = document.getElementById('historico-table-container');
    historicoContainer.innerHTML = '';
    const historicoHeaders = ['name', 'price', 'quantity', 'cliente', 'dataCompra', 'status', 'codigoRastreio'];
    historicoContainer.appendChild(createTable(historico, historicoHeaders));
}

function clearData(key) {
    const confirmation = confirm(`Tem certeza que deseja limpar "${key}"? Esta ação não pode ser desfeita.`);
    if (confirmation) {
        if (key === 'all') {
            localStorage.clear();
            alert('Todos os dados do localStorage foram limpos.');
        } else {
            localStorage.removeItem(key);
            alert(`Os dados de "${key}" foram limpos.`);
        }
        // Recarrega a página para mostrar o estado atualizado
        window.location.reload();
    }
}

// Renderiza os dados quando a página carrega
document.addEventListener('DOMContentLoaded', renderData);