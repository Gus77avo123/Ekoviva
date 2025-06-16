// --- SISTEMA DE TRADUÇÃO ---
const translations = {
    backToHome: { pt: '← Voltar para a Loja', en: '← Back to Store' },
    headerTitle: { pt: 'Cadastro de Cliente - eKoviva', en: 'Customer Registration - eKoviva' },
    headerSubtitle: { pt: 'Preencha o formulário abaixo para se cadastrar e aproveitar nossos produtos ecológicos.', en: 'Fill out the form below to register and enjoy our eco-friendly products.' },
    formTitle: { pt: 'Formulário de Cadastro', en: 'Registration Form' },
    formInfo: { pt: 'Crie sua conta para se tornar um cliente eKoviva.', en: 'Create your account to become an eKoviva customer.' },
    labelName: { pt: 'Nome Completo:', en: 'Full Name:' },
    placeholderName: { pt: 'Digite seu nome completo', en: 'Enter your full name' },
    labelEmail: { pt: 'E-mail:', en: 'E-mail:' },
    placeholderEmail: { pt: 'exemplo@dominio.com', en: 'example@domain.com' },
    labelPhone: { pt: 'Telefone:', en: 'Phone:' },
    placeholderPhone: { pt: '(XX) XXXXX-XXXX', en: '(XX) XXXXX-XXXX' },
    labelCpf: { pt: 'CPF:', en: 'CPF (ID):' },
    placeholderCpf: { pt: '000.000.000-00', en: '000.000.000-00' },
    titleCpf: { pt: 'Digite o CPF no formato 000.000.000-00', en: 'Enter the CPF in the format 000.000.000-00' },
    labelPassword: { pt: 'Senha:', en: 'Password:' },
    placeholderPassword: { pt: 'Crie uma senha segura', en: 'Create a secure password' },
    labelConfirmPassword: { pt: 'Confirmar Senha:', en: 'Confirm Password:' },
    placeholderConfirmPassword: { pt: 'Confirme sua senha', en: 'Confirm your password' },
    labelAddress: { pt: 'Endereço Completo:', en: 'Full Address:' },
    placeholderAddress: { pt: 'Rua, Número, Bairro, Cidade - Estado, CEP', en: 'Street, Number, Neighborhood, City - State, ZIP Code' },
    labelDob: { pt: 'Data de Nascimento:', en: 'Date of Birth:' },
    labelPhoto: { pt: 'Foto de Perfil (opcional):', en: 'Profile Picture (optional):' },
    fileInfo: { pt: 'Tamanho máximo: 1MB. Formatos aceitos: JPG, PNG, GIF.', en: 'Max size: 1MB. Accepted formats: JPG, PNG, GIF.' },
    submitButton: { pt: 'Cadastrar', en: 'Register' },
    submitButtonLoading: { pt: 'Cadastrando...', en: 'Registering...' },
    successMessage: { pt: 'Cadastro realizado com sucesso! Redirecionando para a página inicial...', en: 'Registration successful! Redirecting to the homepage...' },
    successButton: { pt: 'Ir para o Início', en: 'Go to Homepage' },
    alertRequired: { pt: 'Por favor, preencha todos os campos obrigatórios!', en: 'Please fill in all required fields!' },
    alertCpfInvalid: { pt: 'Formato de CPF inválido. Use 000.000.000-00.', en: 'Invalid CPF format. Use 000.000.000-00.' },
    alertPasswordMismatch: { pt: 'As senhas não coincidem!', en: 'Passwords do not match!' },
    alertPasswordShort: { pt: 'A senha deve ter no mínimo 6 caracteres.', en: 'Password must be at least 6 characters long.' },
    alertPhotoSize: { pt: 'A foto excede o limite de 1MB. Por favor, escolha uma imagem menor.', en: 'The photo exceeds the 1MB limit. Please choose a smaller image.' },
    alertPhotoError: { pt: 'Erro ao processar a foto:', en: 'Error processing the photo:' },
    alertEmailExists: { pt: 'Este e-mail já está cadastrado!', en: 'This e-mail is already registered!' },
    alertCpfExists: { pt: 'Este CPF já está cadastrado!', en: 'This CPF (ID) is already registered!' },
    alertStorageQuota: { pt: 'O armazenamento local está cheio. Não foi possível salvar o cadastro. Tente remover alguns dados ou usar uma foto menor.', en: 'Local storage is full. Could not save registration. Try removing some data or using a smaller photo.' },
    alertGenericError: { pt: 'Ocorreu um erro ao realizar o cadastro:', en: 'An error occurred during registration:' }
};

const languageLinks = document.querySelectorAll('.lang-link');
let currentLang = localStorage.getItem('language') || 'pt';

const setLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Traduz innerHTML/textContent
    document.querySelectorAll('[data-lang-key]').forEach(elem => {
        const key = elem.getAttribute('data-lang-key');
        if (translations[key] && translations[key][lang]) {
            elem.innerHTML = translations[key][lang];
        }
    });

    // Traduz placeholders
     document.querySelectorAll('[data-placeholder-key]').forEach(elem => {
        const key = elem.getAttribute('data-placeholder-key');
        if (translations[key] && translations[key][lang]) {
            elem.placeholder = translations[key][lang];
        }
    });

     // Traduz titles
      document.querySelectorAll('[data-title-key]').forEach(elem => {
        const key = elem.getAttribute('data-title-key');
        if (translations[key] && translations[key][lang]) {
            elem.title = translations[key][lang];
        }
    });

    // Atualiza o seletor de idioma
    languageLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active');
        }
    });
};

languageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedLang = link.getAttribute('data-lang');
        setLanguage(selectedLang);
    });
});

// --- FIM DO SISTEMA DE TRADUÇÃO ---


document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o idioma na carga da página
    setLanguage(currentLang);

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('data-nascimento').setAttribute('max', today);

    const form = document.getElementById('form-cadastro');
    form.addEventListener('submit', cadastrarCliente);
});

async function cadastrarCliente(event) {
    event.preventDefault(); 
    const submitButton = document.getElementById('submit-button');
    const formContent = document.getElementById('form-content');
    const successMessageContainer = document.getElementById('success-message-container');

    submitButton.disabled = true;
    submitButton.textContent = translations.submitButtonLoading[currentLang];

    try {
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const cpf = document.getElementById("cpf").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmar-senha").value;
        const endereco = document.getElementById("endereco").value.trim();
        const dataNascimento = document.getElementById("data-nascimento").value;
        const fotoInput = document.getElementById("foto");

        if (!nome || !email || !telefone || !cpf || !senha || !confirmarSenha || !endereco || !dataNascimento) {
            throw new Error(translations.alertRequired[currentLang]);
        }

        const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfPattern.test(cpf)) {
            throw new Error(translations.alertCpfInvalid[currentLang]);
        }

        if (senha !== confirmarSenha) {
            throw new Error(translations.alertPasswordMismatch[currentLang]);
        }

        if (senha.length < 6) {
            throw new Error(translations.alertPasswordShort[currentLang]);
        }

        let fotoUrl = "";
        if (fotoInput.files && fotoInput.files.length > 0) {
            const file = fotoInput.files[0];
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > 1) {
                throw new Error(translations.alertPhotoSize[currentLang]);
            }
            fotoUrl = await readFileAsDataURL(file);
        }

        const cliente = { id: Date.now(), nome, email, telefone, cpf, senha, endereco, data_nascimento: dataNascimento, foto: fotoUrl };
        let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

        if (clientes.some(c => c.email === email)) {
            throw new Error(translations.alertEmailExists[currentLang]);
        }
        if (clientes.some(c => c.cpf === cpf)) {
            throw new Error(translations.alertCpfExists[currentLang]);
        }

        clientes.push(cliente);
        localStorage.setItem("clientes", JSON.stringify(clientes));

        formContent.style.display = 'none';
        successMessageContainer.style.display = 'block';

        setTimeout(() => {
            window.location.href = "index.html?registration=success";
        }, 3000);

    } catch (error) {
        alert(error.message);
        console.error("Erro ao cadastrar cliente:", error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = translations.submitButton[currentLang];
    }
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (errorEvent) => reject(new Error(translations.alertPhotoError[currentLang] + (errorEvent.target.error.name || '')));
        reader.readAsDataURL(file);
    });
}