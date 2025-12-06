// ==================== db.js ====================
// 📦 Configuração do banco de dados e definição dos modelos da Ekoviva

const { Sequelize, DataTypes, Op } = require("sequelize");

// ==================== CONEXÃO COM SQL SERVER ====================
const sequelize = new Sequelize("ekoviva", "ekoviva", "123456", {
  host: "DESKTOP-BLG93ED\\GUSTAVO",
  dialect: "mssql",
  port: 1433,
  logging: false,
  dialectOptions: { trustServerCertificate: true },
});

// ==================== MODELOS ====================

// --- Usuários ---
const Usuario = sequelize.define(
  "usuarios",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { name: "UQ_usuarios_email", msg: "E-mail já cadastrado" },
      validate: { isEmail: true },
    },
    senha: { type: DataTypes.STRING(255), allowNull: false },
    data_cadastro: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    telefone: { type: DataTypes.STRING(20), allowNull: true },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: true,
      unique: { name: "UQ_usuarios_cpf", msg: "CPF já cadastrado" },
    },
    endereco: { type: DataTypes.STRING(255), allowNull: true },
    data_nascimento: { type: DataTypes.DATE, allowNull: true },
    foto: { type: DataTypes.STRING(255), allowNull: true },
    tipoUsuario: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "usuarios", timestamps: false }
);


// --- Produtos (Atualizado com 'destaque') ---
const Produto = sequelize.define(
  "produtos",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(200), allowNull: false },
    descricao: { type: DataTypes.STRING(510) },
    preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    estoque: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    imagem: { type: DataTypes.STRING(510) },
    
    // CAMPO NOVO
    destaque: { type: DataTypes.BOOLEAN, defaultValue: false },

    data_cadastro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "produtos", timestamps: false }
);

// --- Carrinho ---
const Carrinho = sequelize.define(
  "carrinho",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    produto_id: { type: DataTypes.INTEGER, allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  },
  { tableName: "carrinho", timestamps: false }
);

// --- Pedidos ---
const Pedido = sequelize.define(
  "pedidos",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    data_pedido: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "pedidos", timestamps: false }
);

// --- Itens do Pedido ---
const ItemPedido = sequelize.define(
  "itens_pedido",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pedido_id: { type: DataTypes.INTEGER, allowNull: false },
    produto_id: { type: DataTypes.INTEGER, allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    preco_unit: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { tableName: "itens_pedido", timestamps: false }
);

// ==================== RELACIONAMENTOS ====================
Usuario.hasMany(Pedido, { foreignKey: "usuario_id", onDelete: "CASCADE" });
Pedido.belongsTo(Usuario, { foreignKey: "usuario_id" });

Pedido.hasMany(ItemPedido, { foreignKey: "pedido_id", onDelete: "CASCADE" });
ItemPedido.belongsTo(Pedido, { foreignKey: "pedido_id" });

Produto.hasMany(ItemPedido, { foreignKey: "produto_id", onDelete: "CASCADE" });
ItemPedido.belongsTo(Produto, { foreignKey: "produto_id" });

Usuario.hasMany(Carrinho, { foreignKey: "usuario_id", onDelete: "CASCADE" });
Carrinho.belongsTo(Usuario, { foreignKey: "usuario_id" });

Produto.hasMany(Carrinho, { foreignKey: "produto_id", as: "Carrinhos", onDelete: "CASCADE" });
Carrinho.belongsTo(Produto, { foreignKey: "produto_id", as: "Produto" });

// ==================== TESTE DE CONEXÃO ====================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com SQL Server OK!");
    await sequelize.sync(); // Isso sincroniza a estrutura se possível
    console.log("🗂️ Tabelas sincronizadas!");
  } catch (err) {
    console.error("❌ Erro ao conectar:", err);
  }
})();

module.exports = { sequelize, Usuario, Produto, Carrinho, Pedido, ItemPedido, Op };