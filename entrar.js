const translations = {
  loginTitle: { pt: 'Entrar', en: 'Sign In' },
  placeholderEmail: { pt: 'Email', en: 'Email' },
  placeholderPassword: { pt: 'Senha', en: 'Password' },
  loginButton: { pt: 'Entrar', en: 'Sign In' },
  loginButtonLoading: { pt: 'Verificando...', en: 'Verifying...' },
  forgotPasswordLink: { pt: 'Esqueci minha senha', en: 'Forgot my password' },
  modalRecTitle: { pt: 'Redefinir Senha', en: 'Reset Password' },
  modalRecDesc: { pt: 'Confirme seus dados para criar uma nova senha.', en: 'Verify your data to create a new password.' },
  modalRecBtn: { pt: 'Alterar Senha', en: 'Change Password' },
  successWelcome: { pt: 'Bem-vindo, {name}!', en: 'Welcome, {name}!' },
  errorWrongPass: { pt: 'Senha incorreta.', en: 'Incorrect password.' },
  errorUserNotFound: { pt: 'E-mail não encontrado.', en: 'E-mail not found.' },
  errorServer: { pt: 'Erro no servidor.', en: 'Server error.' },
  alertRecSuccess: { pt: 'Senha redefinida!', en: 'Password reset!' },
  alertPassMismatch: { pt: 'Senhas não conferem.', en: 'Passwords do not match.' },
  footerDesc: { pt: 'Um projeto de estudantes de ADS.', en: 'A project by ADS students.' },
  footerNav: { pt: 'Navegação', en: 'Navigation' },
  footerContact: { pt: 'Contato', en: 'Contact' },
  footerRegister: { pt: 'Cadastro', en: 'Register' },
};

const languageLinks = document.querySelectorAll('.lang-link');
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
  document.querySelectorAll('[data-placeholder-key]').forEach(elem => {
    const key = elem.getAttribute('data-placeholder-key');
    if (translations[key]) elem.placeholder = translations[key][lang];
  });
  languageLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-lang') === lang);
  });
};

languageLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    setLanguage(link.getAttribute('data-lang'));
  });
});

document.addEventListener('DOMContentLoaded', function () {
  setLanguage(currentLang);

  // --- LÓGICA DE LOGIN ---
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const messageEl = document.getElementById('message');
  const loginButton = document.getElementById('login-button');
  const togglePasswordIcon = document.getElementById('password-toggle-icon');

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    messageEl.style.display = 'none';
    loginButton.disabled = true;
    loginButton.innerHTML = translations.loginButtonLoading[currentLang];

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro no login');

      messageEl.style.display = 'block';
      messageEl.className = 'message success';
      messageEl.innerHTML = translations.successWelcome[currentLang].replace('{name}', data.nome);

      localStorage.setItem('clienteLogado', JSON.stringify({
        id: data.id, nome: data.nome, email: data.email, tipoUsuario: data.tipoUsuario
      }));

      setTimeout(() => {
        if (data.tipoUsuario === 0) window.location.href = 'admin.html';
        else window.location.href = 'index.html';
      }, 1500);

    } catch (err) {
      messageEl.style.display = 'block';
      messageEl.className = 'message error';
      if (err.message.includes('não encontrado')) messageEl.innerHTML = translations.errorUserNotFound[currentLang];
      else if (err.message.includes('Senha')) messageEl.textContent = translations.errorWrongPass[currentLang];
      else messageEl.textContent = translations.errorServer[currentLang];
    } finally {
      loginButton.disabled = false;
      loginButton.innerHTML = translations.loginButton[currentLang];
    }
  });

  togglePasswordIcon.addEventListener('click', function () {
    const isPassword = senhaInput.type === 'password';
    senhaInput.type = isPassword ? 'text' : 'password';
    this.classList.toggle('bi-eye');
    this.classList.toggle('bi-eye-slash');
  });

  // --- LÓGICA DE RECUPERAÇÃO DE SENHA (MODAL) ---
  const modalRec = document.getElementById('modal-recuperacao');
  const btnForgot = document.getElementById('btn-forgot-pass');
  const btnCloseModal = document.getElementById('close-modal');
  const formRec = document.getElementById('form-recuperacao');
  const msgRec = document.getElementById('msg-recuperacao');

  const cpfInput = document.getElementById('rec-cpf');
  cpfInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, "");
      if (v.length > 11) v = v.slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      e.target.value = v;
  });

  btnForgot.onclick = (e) => {
      e.preventDefault();
      modalRec.style.display = "flex"; 
      msgRec.style.display = "none";
      formRec.reset();
  }

  btnCloseModal.onclick = () => modalRec.style.display = "none";
  window.onclick = (e) => { if (e.target == modalRec) modalRec.style.display = "none"; }

  formRec.onsubmit = async (e) => {
      e.preventDefault();
      const cpf = document.getElementById('rec-cpf').value;
      const email = document.getElementById('rec-email').value;
      const novaSenha = document.getElementById('rec-senha').value;
      const confirmar = document.getElementById('rec-confirmar').value;
      const btnSend = document.getElementById('btn-send-rec');

      if (novaSenha !== confirmar) {
          msgRec.className = 'message error';
          msgRec.innerText = translations.alertPassMismatch[currentLang];
          msgRec.style.display = 'block';
          return;
      }
      
      btnSend.disabled = true;
      btnSend.innerText = "...";

      try {
          const res = await fetch('http://localhost:3000/redefinir-senha', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cpf, email, novaSenha })
          });
          
          const data = await res.json();

          if (res.ok) {
              msgRec.className = 'message success';
              msgRec.innerText = translations.alertRecSuccess[currentLang];
              msgRec.style.display = 'block';
              setTimeout(() => {
                  modalRec.style.display = "none";
              }, 3000);
          } else {
              msgRec.className = 'message error';
              msgRec.innerText = data.error;
              msgRec.style.display = 'block';
          }
      } catch (err) {
          msgRec.className = 'message error';
          msgRec.innerText = translations.errorServer[currentLang];
          msgRec.style.display = 'block';
      } finally {
          btnSend.disabled = false;
          btnSend.innerText = translations.modalRecBtn[currentLang];
      }
  };
});