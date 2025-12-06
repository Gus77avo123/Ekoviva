/* ===========================================================
   SISTEMA DE TRADUÇÃO
   =========================================================== */
const translations = {
    backToHome: { pt: '← Voltar para Login', en: '← Back to Login' },
    headerTitle: { pt: 'Criar Conta', en: 'Create Account' },
    headerSubtitle: { pt: 'Preencha seus dados abaixo', en: 'Fill in your details below' },
    formTitle: { pt: 'Criar Conta', en: 'Create Account' },
    formInfo: { pt: 'Preencha seus dados abaixo', en: 'Fill in your details below' },
    
    labelName: { pt: 'Nome Completo', en: 'Full Name' },
    placeholderName: { pt: 'Seu nome', en: 'Your name' },
    
    labelEmail: { pt: 'E-mail', en: 'Email' },
    placeholderEmail: { pt: 'exemplo@email.com', en: 'example@email.com' },
    
    labelPhone: { pt: 'Telefone', en: 'Phone' },
    placeholderPhone: { pt: '(99) 99999-9999', en: '(99) 99999-9999' },
    
    labelCpf: { pt: 'CPF', en: 'ID Number' },
    placeholderCpf: { pt: '000.000.000-00', en: '000.000.000-00' },
    
    labelPassword: { pt: 'Senha', en: 'Password' },
    placeholderPassword: { pt: 'Mínimo 6 caracteres', en: 'Min 6 characters' },
    
    labelConfirmPassword: { pt: 'Confirmar Senha', en: 'Confirm Password' },
    placeholderConfirmPassword: { pt: 'Repita a senha', en: 'Repeat password' },
    
    labelAddress: { pt: 'Endereço Completo', en: 'Full Address' },
    placeholderAddress: { pt: 'Rua, Número, Bairro...', en: 'Street, Number...' },
    
    labelDob: { pt: 'Nascimento', en: 'Date of Birth' },
    labelPhoto: { pt: 'Foto de Perfil (Opcional)', en: 'Profile Picture (Optional)' },
    
    submitButton: { pt: 'CRIAR CONTA', en: 'CREATE ACCOUNT' },
    submitButtonLoading: { pt: 'CADASTRANDO...', en: 'REGISTERING...' },
    successMessage: { pt: 'Cadastro realizado com sucesso!', en: 'Registration successful!' },
    
    // Alertas
    alertRequired: { pt: 'Preencha todos os campos!', en: 'Fill all fields!' },
    alertCpfInvalid: { pt: 'CPF inválido.', en: 'Invalid ID.' },
    alertPasswordMismatch: { pt: 'As senhas não coincidem.', en: 'Passwords do not match.' },
    alertEmailExists: { pt: 'E-mail já cadastrado.', en: 'Email already exists.' },
    alertCpfExists: { pt: 'CPF já cadastrado.', en: 'ID already exists.' }
};

let currentLang = localStorage.getItem('language') || 'pt';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        if (translations[key]) el.innerHTML = translations[key][lang];
    });
    document.querySelectorAll('[data-placeholder-key]').forEach(el => {
        const key = el.dataset.placeholderKey;
        if (translations[key]) el.placeholder = translations[key][lang];
    });
    document.querySelectorAll('.lang-link').forEach(link => {
        link.classList.toggle('active', link.dataset.lang === lang);
    });
}

/* ===========================================================
   VALIDAÇÃO CPF & SENHA
   =========================================================== */
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(cpf.substring(10, 11))) return false;
    return true;
}

function calcularForcaSenha(senha) {
    let score = 0;
    if (senha.length >= 6) score++;
    if (/[A-Z]/.test(senha)) score++;
    if (/[0-9]/.test(senha)) score++;
    if (/[^A-Za-z0-9]/.test(senha)) score++;
    return score;
}

function atualizarForcaSenha() {
    const senha = document.getElementById('senha').value;
    const fill = document.getElementById('strength-fill');
    const text = document.getElementById('strength-text');
    const score = calcularForcaSenha(senha);

    fill.className = 'strength-fill'; // reset
    
    if (!senha) {
        fill.style.width = '0%';
        text.textContent = '';
        return;
    }

    if (score <= 1) { fill.classList.add('strength-fraca'); text.textContent = 'Fraca'; }
    else if (score === 2) { fill.classList.add('strength-media'); text.textContent = 'Média'; }
    else { fill.classList.add('strength-forte'); text.textContent = 'Forte'; }
}

function toggleSenha(id, btn) {
    const input = document.getElementById(id);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'bi bi-eye';
    } else {
        input.type = 'password';
        icon.className = 'bi bi-eye-slash';
    }
}

/* ===========================================================
   INICIALIZAÇÃO & SUBMIT
   =========================================================== */
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);

    document.querySelectorAll('.lang-link').forEach(l => l.addEventListener('click', e => {
        e.preventDefault(); setLanguage(l.dataset.lang);
    }));

    const inputs = {
        cpf: document.getElementById('cpf'),
        tel: document.getElementById('telefone'),
        senha: document.getElementById('senha'),
        nasc: document.getElementById('data-nascimento')
    };

    // Máscaras
    if (inputs.cpf) inputs.cpf.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');
    });
    if (inputs.tel) inputs.tel.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g,'').replace(/^(\d{2})(\d)/g,'($1) $2').replace(/(\d)(\d{4})$/,'$1-$2');
    });
    if (inputs.senha) inputs.senha.addEventListener('input', atualizarForcaSenha);
    if (inputs.nasc) inputs.nasc.setAttribute('max', new Date().toISOString().split('T')[0]);

    document.getElementById('form-cadastro').addEventListener('submit', cadastrarCliente);
});

async function cadastrarCliente(e) {
    e.preventDefault();
    
    const form = {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
        cpf: document.getElementById('cpf').value.trim(),
        senha: document.getElementById('senha').value,
        confirmar: document.getElementById('confirmar-senha').value,
        endereco: document.getElementById('endereco').value.trim(),
        nasc: document.getElementById('data-nascimento').value,
        btn: document.getElementById('submit-button')
    };

    if (form.senha !== form.confirmar) return alert(translations.alertPasswordMismatch[currentLang]);
    if (!validarCPF(form.cpf)) return alert(translations.alertCpfInvalid[currentLang]);

    form.btn.disabled = true;
    form.btn.textContent = translations.submitButtonLoading[currentLang];

    try {
        const res = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: form.nome, email: form.email, telefone: form.tel, cpf: form.cpf,
                senha: form.senha, endereco: form.endereco, data_nascimento: form.nasc, tipoUsuario: 1
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro');

        document.getElementById('form-content').style.display = 'none';
        document.getElementById('success-message-container').style.display = 'block';
        setTimeout(() => window.location.href = 'index.html?reg=ok', 2500);

    } catch (err) {
        alert(err.message.includes('email') ? translations.alertEmailExists[currentLang] : translations.alertCpfExists[currentLang]);
        form.btn.disabled = false;
        form.btn.textContent = translations.submitButton[currentLang];
    }
}