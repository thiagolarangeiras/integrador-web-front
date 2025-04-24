import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import './styles.css';

function Clientes() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nome: 'João Silva',
      tipo: 'PF',
      documento: '123.456.789-09',
      telefone: '(11) 98765-4321',
      email: 'joao@example.com',
      endereco: {
        cep: '01234-567',
        rua: 'Rua das Flores',
        numero: '100',
        complemento: 'Apto 101',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      status: 'active'
    },
    {
      id: 2,
      nome: 'Empresa XYZ Ltda',
      tipo: 'PJ',
      documento: '12.345.678/0001-99',
      telefone: '(11) 2345-6789',
      email: 'contato@xyz.com',
      endereco: {
        cep: '04567-890',
        rua: 'Av. Paulista',
        numero: '2000',
        complemento: '10º andar',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      status: 'active'
    }
  ]);

  const [filters, setFilters] = useState({
    tipo: 'Todos Tipos',
    status: 'Todos Status',
    sort: 'Nome (A-Z)'
  });

  const [newCliente, setNewCliente] = useState({
    nome: '',
    tipo: 'PF',
    documento: '',
    telefone: '',
    email: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    status: 'active'
  });

  // Aplicar filtros
  const applyFilters = () => {
    let filteredClientes = [...clientes];

    // Filtro por tipo
    if (filters.tipo !== 'Todos Tipos') {
      filteredClientes = filteredClientes.filter(
        cliente => cliente.tipo === filters.tipo
      );
    }

    // Filtro por status
    if (filters.status !== 'Todos Status') {
      const statusValue = filters.status === 'Ativo' ? 'active' : 'inactive';
      filteredClientes = filteredClientes.filter(
        cliente => cliente.status === statusValue
      );
    }

    // Ordenação
    filteredClientes.sort((a, b) => {
      switch (filters.sort) {
        case 'Nome (A-Z)':
          return a.nome.localeCompare(b.nome);
        case 'Nome (Z-A)':
          return b.nome.localeCompare(a.nome);
        default:
          return 0;
      }
    });

    return filteredClientes;
  };

  const filteredClientes = applyFilters();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Funções de máscara
  const aplicarMascaraDocumento = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    
    if (newCliente.tipo === 'PF') {
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
    
    setNewCliente(prev => ({
      ...prev,
      documento: formattedValue
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
    
    setNewCliente(prev => ({
      ...prev,
      telefone: formattedValue
    }));
  };

  const aplicarMascaraCEP = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/^(\d{5})(\d)/, '$1-$2');
    
    setNewCliente(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        cep: formattedValue
      }
    }));
  };

  // Exportação
  const exportToCSV = () => {
    const headers = ['Nome', 'Tipo', 'Documento', 'Telefone', 'Email', 'CEP', 'Endereço', 'Status'];
    const data = filteredClientes.map(cliente => [
      cliente.nome,
      cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica',
      cliente.documento,
      cliente.telefone,
      cliente.email,
      cliente.endereco.cep,
      `${cliente.endereco.rua}, ${cliente.endereco.numero} - ${cliente.endereco.bairro}, ${cliente.endereco.cidade}/${cliente.endereco.estado}`,
      cliente.status === 'active' ? 'Ativo' : 'Inativo'
    ]);

    const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'clientes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const worksheetData = [
      ['Nome', 'Tipo', 'Documento', 'Telefone', 'Email', 'CEP', 'Endereço', 'Status'],
      ...filteredClientes.map(c => [
        c.nome,
        c.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica',
        c.documento,
        c.telefone,
        c.email,
        c.endereco.cep,
        `${c.endereco.rua}, ${c.endereco.numero} - ${c.endereco.bairro}, ${c.endereco.cidade}/${c.endereco.estado}`,
        c.status === 'active' ? 'Ativo' : 'Inativo'
      ])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
    XLSX.writeFile(workbook, 'clientes.xlsx');
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Relatório de Clientes', 105, 15, { align: 'center' });

      const safeClientes = filteredClientes.map(c => ({
        nome: String(c.nome || '-'),
        tipo: c.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica',
        documento: String(c.documento || '-'),
        telefone: String(c.telefone || '-'),
        email: String(c.email || '-'),
        endereco: `${c.endereco.rua || ''}, ${c.endereco.numero || ''} - ${c.endereco.bairro || ''}, ${c.endereco.cidade || ''}/${c.endereco.estado || ''}`,
        status: c.status === 'active' ? 'Ativo' : 'Inativo'
      }));

      doc.autoTable({
        head: [['Nome', 'Tipo', 'Documento', 'Telefone', 'Email', 'Endereço', 'Status']],
        body: safeClientes.map(c => [c.nome, c.tipo, c.documento, c.telefone, c.email, c.endereco, c.status]),
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

      const fileName = `clientes_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert(`Falha na exportação para PDF:\n${error.message}`);
    }
  };

  // Manipulação de formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    setNewCliente(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCliente) {
      setClientes(clientes.map(cliente =>
        cliente.id === editingCliente.id
          ? { ...newCliente, id: editingCliente.id }
          : cliente
      ));
      setEditingCliente(null);
    } else {
      const clienteToAdd = {
        ...newCliente,
        id: Date.now()
      };
      setClientes([...clientes, clienteToAdd]);
    }

    setShowAddModal(false);
    setNewCliente({
      nome: '',
      tipo: 'PF',
      documento: '',
      telefone: '',
      email: '',
      endereco: {
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      },
      status: 'active'
    });
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setNewCliente({
      nome: cliente.nome,
      tipo: cliente.tipo,
      documento: cliente.documento,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: { ...cliente.endereco },
      status: cliente.status
    });
    setShowAddModal(true);
  };

  const handleDelete = (clienteId) => {
    setClientes(clientes.filter(cliente => cliente.id !== clienteId));
  };

  // Estatísticas
  const totalClientes = clientes.length;
  const activeClientes = clientes.filter(c => c.status === 'active').length;
  const inactiveClientes = totalClientes - activeClientes;
  const clientesPF = clientes.filter(c => c.tipo === 'PF').length;
  const clientesPJ = clientes.filter(c => c.tipo === 'PJ').length;

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
                <input type="text" placeholder="Pesquisar clientes..." />
                <div className="search-icon">🔍</div>
              </div>
              <button className="btn primary new-product-btn" onClick={() => { setEditingCliente(null); setShowAddModal(true); }}>
                <span>+</span> Novo Cliente
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
              <span className="stat-value">{totalClientes}</span>
              <span className="stat-label">Clientes Totais</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{activeClientes}</span>
              <span className="stat-label">Ativos</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{inactiveClientes}</span>
              <span className="stat-label">Inativos</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{clientesPF}</span>
              <span className="stat-label">Pessoa Física</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{clientesPJ}</span>
              <span className="stat-label">Pessoa Jurídica</span>
            </div>
          </div>

          {/* Tabela de Clientes */}
          <div className="product-table-container">
            <div className="table-header">
              <h2>Lista de Clientes</h2>
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
                  <th>DOCUMENTO</th>
                  <th>TELEFONE</th>
                  <th>EMAIL</th>
                  <th>ENDEREÇO</th>
                  <th>STATUS</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map(cliente => (
                  <tr key={cliente.id}>
                    <td className="product-cell">
                      <span className="product-name">{cliente.nome}</span>
                    </td>
                    <td>{cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
                    <td>{cliente.documento}</td>
                    <td>{cliente.telefone}</td>
                    <td>{cliente.email}</td>
                    <td>
                      {cliente.endereco.rua}, {cliente.endereco.numero} - {cliente.endereco.bairro}, {cliente.endereco.cidade}/{cliente.endereco.estado}
                    </td>
                    <td><span className={`status-badge ${cliente.status}`}>{cliente.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
                    <td className="action-buttons">
                      <button className="btn action-btn edit-btn" onClick={() => handleEdit(cliente)}>✏️</button>
                      <button className="btn action-btn delete-btn" onClick={() => handleDelete(cliente.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-footer">
              <span className="showing-text">👁️ Mostrando {filteredClientes.length} de {clientes.length} clientes</span>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingCliente ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome Completo/Razão Social</label>
                <input 
                  type="text" 
                  name="nome" 
                  value={newCliente.nome} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo</label>
                  <select 
                    name="tipo" 
                    value={newCliente.tipo} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="PF">Pessoa Física</option>
                    <option value="PJ">Pessoa Jurídica</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>{newCliente.tipo === 'PF' ? 'CPF' : 'CNPJ'}</label>
                  <input 
                    type="text" 
                    name="documento" 
                    value={newCliente.documento} 
                    onChange={aplicarMascaraDocumento} 
                    required 
                    placeholder={newCliente.tipo === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
                    maxLength={newCliente.tipo === 'PF' ? 14 : 18}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Telefone</label>
                  <input 
                    type="text" 
                    name="telefone" 
                    value={newCliente.telefone} 
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
                    value={newCliente.email} 
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
                  value={newCliente.endereco.cep} 
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
                    value={newCliente.endereco.rua} 
                    onChange={handleEnderecoChange} 
                    required 
                  />
                </div>
                
                <div className="form-group small">
                  <label>Número</label>
                  <input 
                    type="text" 
                    name="numero" 
                    value={newCliente.endereco.numero} 
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
                  value={newCliente.endereco.complemento} 
                  onChange={handleEnderecoChange} 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Bairro</label>
                  <input 
                    type="text" 
                    name="bairro" 
                    value={newCliente.endereco.bairro} 
                    onChange={handleEnderecoChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Cidade</label>
                  <input 
                    type="text" 
                    name="cidade" 
                    value={newCliente.endereco.cidade} 
                    onChange={handleEnderecoChange} 
                    required 
                  />
                </div>
                
                <div className="form-group small">
                  <label>Estado</label>
                  <select 
                    name="estado" 
                    value={newCliente.endereco.estado} 
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
                  value={newCliente.status} 
                  onChange={handleInputChange}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button type="submit" className="btn primary">{editingCliente ? 'Atualizar' : 'Adicionar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;