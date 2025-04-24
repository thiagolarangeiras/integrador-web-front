import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import './styles.css';

function Fornecedores() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState(null);
  const [fornecedores, setFornecedores] = useState([
    {
      id: 1,
      nome: 'TechParts Ltda',
      tipo: 'PJ',
      cpfCnpj: '12.345.678/0001-99',
      endereco: {
        rua: 'Av. das Indústrias',
        numero: '1000',
        complemento: 'Galpão 5',
        bairro: 'Industrial',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '04567-890'
      },
      telefone: '(11) 3456-7890',
      email: 'contato@techparts.com',
      status: 'active'
    },
    {
      id: 2,
      nome: 'Componentes Eletrônicos S.A.',
      tipo: 'PJ',
      cpfCnpj: '98.765.432/0001-11',
      endereco: {
        rua: 'Rua dos Circuitos',
        numero: '250',
        complemento: 'Sala 301',
        bairro: 'Tecnológico',
        cidade: 'Campinas',
        estado: 'SP',
        cep: '13098-765'
      },
      telefone: '(19) 98765-4321',
      email: 'vendas@componentes.com',
      status: 'active'
    },
    {
      id: 3,
      nome: 'João Silva Materiais',
      tipo: 'PF',
      cpfCnpj: '123.456.789-09',
      endereco: {
        rua: 'Rua dos Fornecedores',
        numero: '35',
        complemento: '',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20040-010'
      },
      telefone: '(21) 9876-5432',
      email: 'joao.silva@email.com',
      status: 'inactive'
    }
  ]);

  const [filters, setFilters] = useState({
    tipo: 'Todos Tipos',
    status: 'Todos Status',
    sort: 'Nome (A-Z)'
  });

  const [newFornecedor, setNewFornecedor] = useState({
    nome: '',
    tipo: 'PJ',
    cpfCnpj: '',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    telefone: '',
    email: '',
    status: 'active'
  });

  // Aplicar filtros
  const applyFilters = () => {
    let filteredFornecedores = [...fornecedores];

    // Filtro por tipo
    if (filters.tipo !== 'Todos Tipos') {
      filteredFornecedores = filteredFornecedores.filter(
        fornecedor => fornecedor.tipo === filters.tipo
      );
    }

    // Filtro por status
    if (filters.status !== 'Todos Status') {
      const statusValue = filters.status === 'Ativo' ? 'active' : 'inactive';
      filteredFornecedores = filteredFornecedores.filter(
        fornecedor => fornecedor.status === statusValue
      );
    }

    // Ordenação
    filteredFornecedores.sort((a, b) => {
      switch (filters.sort) {
        case 'Nome (A-Z)':
          return a.nome.localeCompare(b.nome);
        case 'Nome (Z-A)':
          return b.nome.localeCompare(a.nome);
        default:
          return 0;
      }
    });

    return filteredFornecedores;
  };

  const filteredFornecedores = applyFilters();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Funções de máscara
  const aplicarMascaraDocumento = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    
    if (newFornecedor.tipo === 'PF') {
      if (value.length <= 11) {
        formattedValue = value.replace(/(\d{3})(\d)/, '$1.$2');
        formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
        formattedValue = formattedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
    } else {
      if (value.length <= 14) {
        formattedValue = value.replace(/^(\d{2})(\d)/, '$1.$2');
        formattedValue = formattedValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        formattedValue = formattedValue.replace(/\.(\d{3})(\d)/, '.$1/$2');
        formattedValue = formattedValue.replace(/(\d{4})(\d)/, '$1-$2');
      }
    }
    
    setNewFornecedor(prev => ({
      ...prev,
      cpfCnpj: formattedValue
    }));
  };

  const aplicarMascaraTelefone = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    
    if (value.length > 10) {
      formattedValue = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 6) {
      formattedValue = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      formattedValue = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    } else if (value.length > 0) {
      formattedValue = value.replace(/^(\d{0,2}).*/, '($1');
    }
    
    setNewFornecedor(prev => ({
      ...prev,
      telefone: formattedValue
    }));
  };

  const aplicarMascaraCEP = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/^(\d{5})(\d)/, '$1-$2');
    
    setNewFornecedor(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        cep: formattedValue
      }
    }));
  };

  // Exportação
  const exportToCSV = () => {
    const headers = ['Nome', 'Tipo', 'CPF/CNPJ', 'Telefone', 'Email', 'Endereço', 'Status'];
    const data = filteredFornecedores.map(fornecedor => [
      fornecedor.nome,
      fornecedor.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica',
      fornecedor.cpfCnpj,
      fornecedor.telefone,
      fornecedor.email,
      `${fornecedor.endereco.rua}, ${fornecedor.endereco.numero} - ${fornecedor.endereco.bairro}, ${fornecedor.endereco.cidade}/${fornecedor.endereco.estado}`,
      fornecedor.status === 'active' ? 'Ativo' : 'Inativo'
    ]);

    const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'fornecedores.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const worksheetData = [
      ['Nome', 'Tipo', 'CPF/CNPJ', 'Telefone', 'Email', 'Endereço', 'Status'],
      ...filteredFornecedores.map(f => [
        f.nome,
        f.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica',
        f.cpfCnpj,
        f.telefone,
        f.email,
        `${f.endereco.rua}, ${f.endereco.numero} - ${f.endereco.bairro}, ${f.endereco.cidade}/${f.endereco.estado}`,
        f.status === 'active' ? 'Ativo' : 'Inativo'
      ])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fornecedores');
    XLSX.writeFile(workbook, 'fornecedores.xlsx');
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Relatório de Fornecedores', 105, 15, { align: 'center' });

      const safeFornecedores = filteredFornecedores.map(f => ({
        nome: String(f.nome || '-'),
        tipo: f.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica',
        cpfCnpj: String(f.cpfCnpj || '-'),
        telefone: String(f.telefone || '-'),
        email: String(f.email || '-'),
        endereco: `${f.endereco.rua || ''}, ${f.endereco.numero || ''} - ${f.endereco.bairro || ''}, ${f.endereco.cidade || ''}/${f.endereco.estado || ''}`,
        status: f.status === 'active' ? 'Ativo' : 'Inativo'
      }));

      doc.autoTable({
        head: [['Nome', 'Tipo', 'CPF/CNPJ', 'Telefone', 'Email', 'Endereço', 'Status']],
        body: safeFornecedores.map(f => [f.nome, f.tipo, f.cpfCnpj, f.telefone, f.email, f.endereco, f.status]),
        startY: 25,
        margin: { left: 10, right: 10 },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        columnStyles: {
          5: { cellWidth: 'auto' }
        }
      });

      const fileName = `fornecedores_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert(`Falha na exportação para PDF:\n${error.message}`);
    }
  };

  // Manipulação de formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFornecedor(prev => ({ ...prev, [name]: value }));
  };

  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    setNewFornecedor(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingFornecedor) {
      setFornecedores(fornecedores.map(fornecedor =>
        fornecedor.id === editingFornecedor.id
          ? { ...newFornecedor, id: editingFornecedor.id }
          : fornecedor
      ));
      setEditingFornecedor(null);
    } else {
      const fornecedorToAdd = {
        ...newFornecedor,
        id: Date.now()
      };
      setFornecedores([...fornecedores, fornecedorToAdd]);
    }

    setShowAddModal(false);
    setNewFornecedor({
      nome: '',
      tipo: 'PJ',
      cpfCnpj: '',
      endereco: {
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      },
      telefone: '',
      email: '',
      status: 'active'
    });
  };

  const handleEdit = (fornecedor) => {
    setEditingFornecedor(fornecedor);
    setNewFornecedor({
      nome: fornecedor.nome,
      tipo: fornecedor.tipo,
      cpfCnpj: fornecedor.cpfCnpj,
      endereco: { ...fornecedor.endereco },
      telefone: fornecedor.telefone,
      email: fornecedor.email,
      status: fornecedor.status
    });
    setShowAddModal(true);
  };

  const handleDelete = (fornecedorId) => {
    setFornecedores(fornecedores.filter(fornecedor => fornecedor.id !== fornecedorId));
  };

  // Estatísticas
  const totalFornecedores = fornecedores.length;
  const activeFornecedores = fornecedores.filter(f => f.status === 'active').length;
  const inactiveFornecedores = totalFornecedores - activeFornecedores;
  const fornecedoresPF = fornecedores.filter(f => f.tipo === 'PF').length;
  const fornecedoresPJ = fornecedores.filter(f => f.tipo === 'PJ').length;

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">ProductFolio</div>
        <ul className="sidebar-menu">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/produtos">Produtos</Link></li>
          <li><Link to="/clientes">Clientes</Link></li>
          <li><Link to="/fornecedores">Fornecedores</Link></li>
          <li><Link to="/pedidos">Pedidos</Link></li>
          <li><Link to="/usuarios">Usuários</Link></li>
        </ul>
      </div>

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
                <input type="text" placeholder="Pesquisar fornecedores..." />
                <div className="search-icon">🔍</div>
              </div>
              <button className="btn primary new-product-btn" onClick={() => { setEditingFornecedor(null); setShowAddModal(true); }}>
                <span>+</span> Novo Fornecedor
              </button>
            </div>
          </div>
        </header>

        <main className="content-area">
          {/* Filtros */}
          <div className="filters-section">
            <div className="filter-group">
              <label>Tipo</label>
              <select 
                className="filter-select"
                name="tipo"
                value={filters.tipo}
                onChange={handleFilterChange}
              >
                <option>Todos Tipos</option>
                <option>PF</option>
                <option>PJ</option>
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
              </select>
            </div>
          </div>

          {/* Cartões */}
          <div className="stats-cards">
            <div className="stat-card">
              <span className="stat-value">{totalFornecedores}</span>
              <span className="stat-label">Fornecedores Totais</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{activeFornecedores}</span>
              <span className="stat-label">Ativos</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{inactiveFornecedores}</span>
              <span className="stat-label">Inativos</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{fornecedoresPF}</span>
              <span className="stat-label">Pessoa Física</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{fornecedoresPJ}</span>
              <span className="stat-label">Pessoa Jurídica</span>
            </div>
          </div>

          {/* Tabela de Fornecedores */}
          <div className="product-table-container">
            <div className="table-header">
              <h2>Lista de Fornecedores</h2>
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
                  <th>NOME</th>
                  <th>TIPO</th>
                  <th>CPF/CNPJ</th>
                  <th>TELEFONE</th>
                  <th>EMAIL</th>
                  <th>ENDEREÇO</th>
                  <th>STATUS</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {filteredFornecedores.map(fornecedor => (
                  <tr key={fornecedor.id}>
                    <td className="product-cell">
                      <span className="product-name">{fornecedor.nome}</span>
                    </td>
                    <td>{fornecedor.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
                    <td>{fornecedor.cpfCnpj}</td>
                    <td>{fornecedor.telefone}</td>
                    <td>{fornecedor.email}</td>
                    <td>
                      {fornecedor.endereco.rua}, {fornecedor.endereco.numero} - {fornecedor.endereco.bairro}, {fornecedor.endereco.cidade}/{fornecedor.endereco.estado}
                    </td>
                    <td><span className={`status-badge ${fornecedor.status}`}>{fornecedor.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
                    <td className="action-buttons">
                      <button className="btn action-btn edit-btn" onClick={() => handleEdit(fornecedor)}>✏️</button>
                      <button className="btn action-btn delete-btn" onClick={() => handleDelete(fornecedor.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-footer">
              <span className="showing-text">👁️ Mostrando {filteredFornecedores.length} de {fornecedores.length} fornecedores</span>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingFornecedor ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome/Razão Social</label>
                <input 
                  type="text" 
                  name="nome" 
                  value={newFornecedor.nome} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo</label>
                  <select 
                    name="tipo" 
                    value={newFornecedor.tipo} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="PF">Pessoa Física</option>
                    <option value="PJ">Pessoa Jurídica</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>{newFornecedor.tipo === 'PF' ? 'CPF' : 'CNPJ'}</label>
                  <input 
                    type="text" 
                    name="cpfCnpj" 
                    value={newFornecedor.cpfCnpj} 
                    onChange={aplicarMascaraDocumento} 
                    required 
                    placeholder={newFornecedor.tipo === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
                    maxLength={newFornecedor.tipo === 'PF' ? 14 : 18}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Telefone</label>
                  <input 
                    type="text" 
                    name="telefone" 
                    value={newFornecedor.telefone} 
                    onChange={aplicarMascaraTelefone} 
                    required 
                    placeholder="(00) 00000-0000"
                    maxLength="15"
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={newFornecedor.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>CEP</label>
                <input 
                  type="text" 
                  name="cep" 
                  value={newFornecedor.endereco.cep} 
                  onChange={aplicarMascaraCEP} 
                  required 
                  placeholder="00000-000"
                  maxLength="9"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Rua</label>
                  <input 
                    type="text" 
                    name="rua" 
                    value={newFornecedor.endereco.rua} 
                    onChange={handleEnderecoChange} 
                    required 
                  />
                </div>
                
                <div className="form-group small">
                  <label>Número</label>
                  <input 
                    type="text" 
                    name="numero" 
                    value={newFornecedor.endereco.numero} 
                    onChange={handleEnderecoChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Complemento</label>
                <input 
                  type="text" 
                  name="complemento" 
                  value={newFornecedor.endereco.complemento} 
                  onChange={handleEnderecoChange} 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Bairro</label>
                  <input 
                    type="text" 
                    name="bairro" 
                    value={newFornecedor.endereco.bairro} 
                    onChange={handleEnderecoChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Cidade</label>
                  <input 
                    type="text" 
                    name="cidade" 
                    value={newFornecedor.endereco.cidade} 
                    onChange={handleEnderecoChange} 
                    required 
                  />
                </div>
                
                <div className="form-group small">
                  <label>Estado</label>
                  <select 
                    name="estado" 
                    value={newFornecedor.endereco.estado} 
                    onChange={handleEnderecoChange} 
                    required
                  >
                    <option value="">UF</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select 
                  name="status" 
                  value={newFornecedor.status} 
                  onChange={handleInputChange}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button type="submit" className="btn primary">{editingFornecedor ? 'Atualizar' : 'Adicionar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fornecedores;