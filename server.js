// ==================== IMPORTAÇÕES ====================
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');

// Puxa os modelos e a conexão do db.js
const {
  sequelize,
  Usuario,
  Produto,
  Carrinho,
  Pedido,
  ItemPedido,
  Op
} = require('./db');

// ==================== EXPRESS APP ====================
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARES ====================
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos (onde as imagens ficam acessíveis)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ==================== UPLOAD (MULTER) ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ==================== LOGIN ====================
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'email_ou_senha_obrigatorio' });

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta' });

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
      foto: usuario.foto
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro ao verificar login' });
  }
});

// ==================== USUÁRIOS ====================

app.get('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro ao buscar usuário.' }); }
});

// Criar usuário (POST)
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, telefone, cpf, senha, endereco, data_nascimento, tipoUsuario } = req.body;
    
    if (!nome || !email || !senha || !cpf) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    
    // TRATAMENTO DE DATA E LIMITES (Para evitar erro de SQL)
    let dataNasc = null;
    if (data_nascimento && data_nascimento.trim() !== '') {
        const d = new Date(data_nascimento);
        if (!isNaN(d)) dataNasc = d;
    }

    // Corta strings muito longas para caber no banco (Segurança)
    const telLimpo = telefone ? telefone.toString().substring(0, 50) : null;
    const endLimpo = endereco ? endereco.toString().substring(0, 255) : null;

    const novoUsuario = await Usuario.create({
      nome, 
      email, 
      telefone: telLimpo, 
      cpf,
      senha: senhaCriptografada,
      endereco: endLimpo,
      data_nascimento: dataNasc,
      tipoUsuario: tipoUsuario !== undefined ? tipoUsuario : 1, 
      data_cadastro: sequelize.literal('GETDATE()') 
    });

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ error: 'Erro ao criar usuário.', details: err.message });
  }
});

// Atualizar usuário (PUT) - COM CORREÇÃO DE ERROS
app.put('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    const { nome, telefone, endereco, data_nascimento, tipoUsuario, senha } = req.body;
    
    let novaSenha = usuario.senha;
    if (senha) novaSenha = await bcrypt.hash(senha, 10);

    // TRATAMENTO DE DATA (Evita Invalid Date e erro no SQL)
    let dataNasc = usuario.data_nascimento;
    if (data_nascimento !== undefined) {
        if (!data_nascimento || data_nascimento.trim() === '') {
            dataNasc = null;
        } else {
            const d = new Date(data_nascimento);
            if (!isNaN(d)) dataNasc = d;
            else dataNasc = null;
        }
    }

    // TRATAMENTO DE STRINGS INFINITAS (Evita erro de truncamento)
    // Se o telefone for maior que 50 chars, corta. Se endereço maior que 255, corta.
    let novoTelefone = usuario.telefone;
    if (telefone !== undefined) {
        novoTelefone = telefone ? telefone.toString().substring(0, 50) : null;
    }

    let novoEndereco = usuario.endereco;
    if (endereco !== undefined) {
        novoEndereco = endereco ? endereco.toString().substring(0, 255) : null;
    }

    await usuario.update({
      nome: nome ?? usuario.nome,
      telefone: novoTelefone,
      endereco: novoEndereco,
      data_nascimento: dataNasc,
      tipoUsuario: typeof tipoUsuario === 'number' ? tipoUsuario : usuario.tipoUsuario,
      senha: novaSenha
    });

    res.json(usuario);
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({ error: 'Erro ao atualizar usuário.', details: err.message });
  }
});

// ROTA ESPECÍFICA PARA FOTO DE PERFIL
app.put('/usuarios/:id/imagem', upload.single('arquivo'), async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
        
        if (req.file) {
            await usuario.update({ foto: req.file.filename });
            res.json({ message: "Foto atualizada", foto: req.file.filename });
        } else {
            res.status(400).json({ error: "Nenhuma imagem enviada" });
        }
    } catch (err) {
        console.error("Erro upload foto:", err);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

app.get('/usuarios_all', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: ['id', 'nome', 'email', 'cpf', 'telefone', 'data_cadastro', 'tipoUsuario'] });
    res.json(usuarios);
  } catch (err) { console.error('Erro ao listar usuários:', err); res.status(500).json({ error: 'Erro ao listar usuários.' }); }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    await usuario.destroy();
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (err) { console.error('Erro ao excluir usuário:', err); res.status(500).json({ error: 'Erro ao excluir usuário.' }); }
});

// ==================== PRODUTOS ====================

app.get('/produtos', async (req, res) => {
  try { const produtos = await Produto.findAll(); res.json(produtos); }
  catch (err) { res.status(500).json({ error: 'Erro ao listar produtos.' }); }
});

app.get('/produtos/:id', async (req, res) => {
  try { const produto = await Produto.findByPk(req.params.id); if(!produto) return res.status(404).json({}); res.json(produto); }
  catch (err) { res.status(500).json({ error: 'Erro' }); }
});

app.post('/produtos', upload.single('arquivo'), async (req, res) => {
  try {
    let { nome, descricao, preco, estoque, destaque } = req.body;
    if (!nome || !preco) return res.status(400).json({ error: 'Obrigatório' });
    if (preco) preco = parseFloat(preco.toString().replace(',', '.'));

    const novo = await Produto.create({
      nome, descricao, preco,
      estoque: estoque ? parseInt(estoque) : 0,
      destaque: destaque === 'true' || destaque === 'on' || destaque === '1',
      imagem: req.file ? req.file.filename : null,
      data_cadastro: sequelize.literal('GETDATE()')
    });
    res.status(201).json(novo);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro ao criar' }); }
});

app.put('/produtos/:id', upload.single('arquivo'), async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Não encontrado' });
    let { nome, descricao, preco, estoque, destaque } = req.body;
    if (preco) preco = parseFloat(preco.toString().replace(',', '.'));

    const dados = {
      nome: nome ?? produto.nome,
      descricao: descricao ?? produto.descricao,
      preco: preco ?? produto.preco,
      estoque: estoque ?? produto.estoque,
      destaque: (destaque !== undefined) ? (destaque === 'true' || destaque === 'on' || destaque === '1') : produto.destaque
    };
    if (req.file) dados.imagem = req.file.filename;
    await produto.update(dados);
    res.json(produto);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro' }); }
});

app.delete('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Não encontrado' });
    await produto.destroy();
    res.json({ message: 'Excluído' });
  } catch (err) { res.status(500).json({ error: 'Erro' }); }
});

// ==================== CARRINHO E PEDIDOS ====================

app.get('/carrinho/:usuario_id', async (req, res) => {
  const itens = await Carrinho.findAll({ where: { usuario_id: req.params.usuario_id }, include: [{ model: Produto, as: 'Produto' }] });
  res.json(itens);
});
app.post('/carrinho', async (req, res) => {
  const { usuario_id, produto_id, quantidade } = req.body;
  const existente = await Carrinho.findOne({ where: { usuario_id, produto_id } });
  if (existente) { existente.quantidade += Number(quantidade||1); await existente.save(); return res.json(existente); }
  const novo = await Carrinho.create({ usuario_id, produto_id, quantidade: Number(quantidade||1) });
  res.status(201).json(novo);
});
app.put('/carrinho/:id', async (req, res) => {
    const item = await Carrinho.findByPk(req.params.id);
    if(!item) return res.status(404).json({});
    if(req.body.quantidade === 'increment') item.quantidade++;
    else if(req.body.quantidade === 'decrement') item.quantidade--;
    else if(typeof req.body.quantidade === 'number') item.quantidade = req.body.quantidade;
    if(item.quantidade<=0) { await item.destroy(); return res.json({message:'removido'}); }
    await item.save(); res.json(item);
});
app.delete('/carrinho/:id', async(req,res)=>{ const i=await Carrinho.findByPk(req.params.id); if(i)await i.destroy(); res.json({}); });
app.delete('/carrinho/usuario/:uid', async(req,res)=>{ await Carrinho.destroy({where:{usuario_id:req.params.uid}}); res.json({}); });

app.post('/pedidos', async (req, res) => {
  const { usuario_id, total, itens } = req.body;
  const t = await sequelize.transaction();
  try {
    const novoPedido = await Pedido.create({ usuario_id, total, data_pedido: sequelize.literal('GETDATE()') }, { transaction: t });
    const itensC = itens.map(i => ({ pedido_id: novoPedido.id, produto_id: i.produto_id, quantidade: i.quantidade, preco_unit: i.preco_unit }));
    await ItemPedido.bulkCreate(itensC, { transaction: t });
    await Carrinho.destroy({ where: { usuario_id }, transaction: t });
    await t.commit(); res.status(201).json({ pedido: novoPedido });
  } catch (e) { await t.rollback(); res.status(500).json({ error: 'Erro' }); }
});
app.get('/pedidos', async(req,res)=>{ 
  const where = req.query.usuario_id ? { usuario_id: req.query.usuario_id } : {};
  const pedidos = await Pedido.findAll({ where, order: [['data_pedido', 'DESC']] });
  res.json(pedidos);
});
app.get('/pedidos/usuario/:id', async(req,res)=>{ 
    const pedidos = await Pedido.findAll({ where: { usuario_id: req.params.id }, order: [['data_pedido', 'DESC']] });
    res.json(pedidos);
});
app.delete('/pedidos/:id', async(req,res)=>{ 
    const p = await Pedido.findByPk(req.params.id);
    if(p) await p.destroy();
    res.json({message:'ok'});
});
app.get('/itens_pedido/pedido/:id', async(req,res)=>{ 
  const itens = await ItemPedido.findAll({ where: { pedido_id: req.params.id }, include: [Produto] });
  res.json(itens);
});

// ==================== SERVIDOR ====================
app.listen(PORT, async () => {
  try { await sequelize.authenticate(); console.log('✅ Conectado ao SQL Server.'); }
  catch (err) { console.error('❌ Erro:', err); }
  console.log(`🚀 Servidor: http://localhost:${PORT}`);
});