import { useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import { Link } from 'react-router-dom';
import autoTable from "jspdf-autotable";
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

  const [filters, setFilters] = useState({
    category: 'Todas Categorias',
    status: 'Todos Status',
    sort: 'Nome (A-Z)'
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    status: 'active'
  });

  // Função para aplicar os filtros
  const applyFilters = () => {
    let filteredProducts = [...products];

    // Filtro por categoria
    if (filters.category !== 'Todas Categorias') {
      filteredProducts = filteredProducts.filter(
        product => product.category === filters.category
      );
    }

    // Filtro por status
    if (filters.status !== 'Todos Status') {
      const statusValue = filters.status === 'Ativo' ? 'active' : 'inactive';
      filteredProducts = filteredProducts.filter(
        product => product.status === statusValue
      );
    }

    // Ordenação
    filteredProducts.sort((a, b) => {
      switch (filters.sort) {
        case 'Nome (A-Z)':
          return a.name.localeCompare(b.name);
        case 'Nome (Z-A)':
          return b.name.localeCompare(a.name);
        case 'Preço (↑)':
          return parseFloat(a.price.replace('.', '').replace(',', '.')) - 
                 parseFloat(b.price.replace('.', '').replace(',', '.'));
        case 'Preço (↓)':
          return parseFloat(b.price.replace('.', '').replace(',', '.')) - 
                 parseFloat(a.price.replace('.', '').replace(',', '.'));
        default:
          return 0;
      }
    });

    return filteredProducts;
  };

  const filteredProducts = applyFilters();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Código', 'Preço', 'Estoque', 'Categoria', 'Status', 'Descrição'];
    const data = filteredProducts.map(product => [
      product.name,
      product.code,
      `R$ ${product.price}`,
      product.stock,
      product.category,
      product.status === 'active' ? 'Ativo' : 'Inativo',
      product.description
    ]);

    const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
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

  const exportToExcel = () => {
    const worksheetData = [
      ['Nome', 'Código', 'Preço', 'Estoque', 'Categoria', 'Status', 'Descrição'],
      ...filteredProducts.map(p => [
        p.name,
        p.code,
        `R$ ${p.price}`,
        p.stock,
        p.category,
        p.status === 'active' ? 'Ativo' : 'Inativo',
        p.description
      ])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos');
    XLSX.writeFile(workbook, 'produtos.xlsx');
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Relatório de Produtos', 105, 15, { align: 'center' });

      const safeProducts = filteredProducts.map(p => ({
        name: String(p.name || '-'),
        code: String(p.code || '-'),
        price: `R$ ${String(p.price || '0,00')}`,
        stock: String(p.stock || '0'),
        category: String(p.category || '-'),
        status: p.status === 'active' ? 'Ativo' : 'Inativo',
        description: String(p.description || '-')
      }));

      doc.autoTable({
        head: [['Nome', 'Código', 'Preço', 'Estoque', 'Categoria', 'Status', 'Descrição']],
        body: safeProducts.map(p => [p.name, p.code, p.price, p.stock, p.category, p.status, p.description]),
        startY: 25,
        margin: { left: 10, right: 10 },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        columnStyles: {
          6: { cellWidth: 'auto' }
        }
      });

      const fileName = `produtos_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert(`Falha na exportação para PDF:\n${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingProduct) {
      setProducts(products.map(product =>
        product.id === editingProduct.id
          ? { ...newProduct, id: editingProduct.id, stock: parseInt(newProduct.stock) }
          : product
      ));
      setEditingProduct(null);
    } else {
      const productToAdd = {
        ...newProduct,
        id: Date.now(),
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

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const inactiveProducts = totalProducts - activeProducts;
  const lowStockProducts = products.filter(p => p.stock < 5).length;

  // Obter categorias únicas para o filtro
  const uniqueCategories = ['Todas Categorias', ...new Set(products.map(p => p.category))];

  return (
    <div className="layout">
      {/* Conteúdo Principal */}
      <div className="app-container">
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
              <button className="btn primary new-product-btn" onClick={() => { setEditingProduct(null); setShowAddModal(true); }}>
                <span>+</span> Novo Produto
              </button>
            </div>
          </div>
        </header>

        <main className="content-area">
          {/* Filtros */}
          <div className="filters-section">
            <div className="filter-group">
              <label>Categoria</label>
              <select 
                className="filter-select"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select 
                className="filter-select"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option>Todos Status</option>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Ordenar por</label>
              <select 
                className="filter-select"
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <option>Nome (A-Z)</option>
                <option>Nome (Z-A)</option>
                <option>Preço (↑)</option>
                <option>Preço (↓)</option>
              </select>
            </div>
          </div>

          {/* Cartões */}
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
                <button className="btn export-btn" onClick={exportToCSV}>📄 Exportar CSV</button>
                <button className="btn export-btn" onClick={exportToExcel}>📊 Exportar Excel</button>
                <button className="btn export-btn" onClick={exportToPDF}>📑 Exportar PDF</button>
                <button className="btn refresh-btn">🔄 Atualizar</button>
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
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td className="product-cell">
                      <span className="product-name">{product.name}</span>
                      <span className="product-desc">{product.description}</span>
                    </td>
                    <td>{product.code}</td>
                    <td>R$ {product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.category}</td>
                    <td><span className={`status-badge ${product.status}`}>{product.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
                    <td className="action-buttons">
                      <button className="btn action-btn edit-btn" onClick={() => handleEdit(product)}>✏️</button>
                      <button className="btn action-btn delete-btn" onClick={() => handleDelete(product.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-footer">
              <span className="showing-text">👁️ Mostrando {filteredProducts.length} de {products.length} produtos</span>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome do Produto</label>
                <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Código</label>
                <input type="text" name="code" value={newProduct.code} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Preço (R$)</label>
                  <input type="text" name="price" value={newProduct.price} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Estoque</label>
                  <input type="number" name="stock" value={newProduct.stock} onChange={handleInputChange} required min="0" />
                </div>
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <input type="text" name="category" value={newProduct.category} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea name="description" value={newProduct.description} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={newProduct.status} onChange={handleInputChange}>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button type="submit" className="btn primary">{editingProduct ? 'Atualizar' : 'Adicionar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;