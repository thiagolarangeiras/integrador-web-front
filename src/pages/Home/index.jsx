import { useState } from 'react';
import './styles.css';

function Home() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Headphone Premium',
      code: 'PH-1000',
      price: '799,90',
      stock: 45,
      category: 'Eletrônicos',
      description: 'Com cancelamento de ruído',
      status: 'active'
    },
    {
      id: 2,
      name: 'Teclado Sem Fio',
      code: 'TSF-200',
      price: '259,90',
      stock: 3,
      category: 'Eletrônicos',
      description: 'Layout ABNT2 - Branco',
      status: 'active'
    },
    {
      id: 3,
      name: 'Smart Watch X3',
      code: 'SWX-300',
      price: '1.199,90',
      stock: 0,
      category: 'Eletrônicos',
      description: 'Monitor cardíaco',
      status: 'inactive'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    status: 'active'
  });

  const exportToCSV = () => {
    // Cabeçalhos do CSV
    const headers = [
      'Nome',
      'Código',
      'Preço',
      'Estoque',
      'Categoria',
      'Status',
      'Descrição'
    ];

    // Dados dos produtos
    const data = products.map(product => [
      product.name,
      product.code,
      `R$ ${product.price}`,
      product.stock,
      product.category,
      product.status === 'active' ? 'Ativo' : 'Inativo',
      product.description
    ]);

    // Combinar cabeçalhos e dados
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'produtos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Editar produto existente
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? { ...newProduct, id: editingProduct.id, stock: parseInt(newProduct.stock) }
          : product
      ));
      setEditingProduct(null);
    } else {
      // Adicionar novo produto
      const productToAdd = {
        ...newProduct,
        id: Date.now(), // Usa o timestamp como ID único
        stock: parseInt(newProduct.stock)
      };
      setProducts([...products, productToAdd]);
    }
    
    setShowAddModal(false);
    setNewProduct({
      name: '',
      code: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      status: 'active'
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      code: product.code,
      price: product.price,
      stock: product.stock.toString(),
      category: product.category,
      description: product.description,
      status: product.status
    });
    setShowAddModal(true);
  };

  const handleDelete = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  // Calcular estatísticas
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const inactiveProducts = totalProducts - activeProducts;
  const lowStockProducts = products.filter(p => p.stock < 5).length;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo-icon">🛍️</div>
            <h1>ProductFolio <span>Manager</span></h1>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <input type="text" placeholder="Pesquisar produtos..." />
              <div className="search-icon">🔍</div>
            </div>
            <button 
              className="btn primary new-product-btn"
              onClick={() => {
                setEditingProduct(null);
                setShowAddModal(true);
              }}
            >
              <span>+</span> Novo Produto
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content-area">
        {/* Filtros */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Categoria</label>
            <select className="filter-select">
              <option>Todas Categorias</option>
              <option>Eletrônicos</option>
              <option>Moda</option>
              <option>Decoração</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select className="filter-select">
              <option>Todos Status</option>
              <option>Ativo</option>
              <option>Inativo</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Ordenar por</label>
            <select className="filter-select">
              <option>Nome (A-Z)</option>
              <option>Nome (Z-A)</option>
              <option>Preço (↑)</option>
              <option>Preço (↓)</option>
            </select>
          </div>
          
          <button className="btn filter-btn">
            Aplicar Filtros
          </button>
        </div>

        {/* Estatísticas */}
        <div className="stats-cards">
          <div className="stat-card">
            <span className="stat-value">{totalProducts}</span>
            <span className="stat-label">Produtos Totais</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-value">{activeProducts}</span>
            <span className="stat-label">Ativos</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-value">{inactiveProducts}</span>
            <span className="stat-label">Inativos</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-value">{lowStockProducts}</span>
            <span className="stat-label">Estoque Baixo</span>
          </div>
        </div>

        {/* Tabela de Produtos */}
        <div className="product-table-container">
          <div className="table-header">
            <h2>Lista de Produtos</h2>
            <div className="table-actions">
              <button 
                className="btn export-btn"
                onClick={exportToCSV}
              >
                <span className="action-icon">📄</span> Exportar CSV
              </button>
              <button className="btn refresh-btn">
                <span className="action-icon">🔄</span> Atualizar
              </button>
            </div>
          </div>
          
          <table className="product-table">
            <thead>
              <tr>
                <th>PRODUTO</th>
                <th>CÓDIGO</th>
                <th>PREÇO</th>
                <th>ESTOQUE</th>
                <th>CATEGORIA</th>
                <th>STATUS</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className="product-cell">
                    <span className="product-name">{product.name}</span>
                    <span className="product-desc">{product.description}</span>
                  </td>
                  <td>{product.code}</td>
                  <td>R$ {product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.category}</td>
                  <td>
                    <span className={`status-badge ${product.status}`}>
                      {product.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button 
                      className="btn action-btn edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn action-btn delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="table-footer">
            <span className="showing-text">
              <span className="action-icon">👁️</span> Mostrando {products.length} de {products.length} produtos
            </span>
          </div>
        </div>

        {/* Modal de Adicionar/Editar Produto */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="add-product-modal">
              <div className="modal-header">
                <h2>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
                <button 
                  className="close-modal-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                >
                  ×
                </button>
              </div>
              
              <form className="add-product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nome do Produto*</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Headphone Premium"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Código do Produto*</label>
                  <input
                    type="text"
                    name="code"
                    value={newProduct.code}
                    onChange={handleInputChange}
                    placeholder="Ex: PH-1000"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Preço (R$)*</label>
                    <input
                      type="text"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      placeholder="Ex: 799,90"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Quantidade em Estoque*</label>
                    <input
                      type="number"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      placeholder="Ex: 45"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder="Descrição do produto..."
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Categoria*</label>
                    <select
                      name="category"
                      value={newProduct.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option>Eletrônicos</option>
                      <option>Moda</option>
                      <option>Decoração</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Status*</label>
                    <select
                      name="status"
                      value={newProduct.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn cancel-btn"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingProduct(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn save-btn">
                    {editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;