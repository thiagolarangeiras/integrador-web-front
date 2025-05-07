import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { postVendedor, patchVendedor, getVendedorLista, deleteVendedor } from '../requests';

const vendedorStruct = {
  id: 0,
  nome: "",
  email: "",
  senha: "",
  cargo: [""]
};

export default function Vendedores() {
  const [page, setPage] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(false);
  const [vendedores, setVendedores] = useState([
    {
      id: 1,
      nome: 'João',
      email: 'joao@gmail.com',
      cargo: ["Vendedor"]
    }
  ]);
  const [filters, setFilters] = useState({
    cargo: 'Todos Cargos',
    sort: 'Nome (A-Z)'
  });
  const [newVendedor, setNewVendedor] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: []
  });

  useEffect(() => {
    getVendedorLista(page, 50).then((value) => {
      if (value != null) setVendedores(value);
    })
  }, [page]);

  const handleUpdate = () => {
    getVendedorLista(page, 50).then((value) => {
      if (value != null) setVendedores(value);
    })
  };

  // Função para aplicar os filtros
  const applyFilters = () => {
    let filteredVendedores = [...vendedores];

    // Filtro por cargo
    if (filters.cargo !== 'Todos Cargos') {
      filteredVendedores = filteredVendedores.filter(
        vendedor => vendedor.cargo === filters.cargo
      );
    }

    // Ordenação
    filteredVendedores.sort((a, b) => {
      switch (filters.sort) {
        case 'Nome (A-Z)':
          return a.nome.localeCompare(b.nome);
        case 'Nome (Z-A)':
          return b.nome.localeCompare(a.nome);
        case 'Cargo (A-Z)':
          return a.cargo.localeCompare(b.cargo);
        case 'Cargo (Z-A)':
          return b.cargo.localeCompare(a.cargo);
        default:
          return 0;
      }
    });

    return filteredVendedores;
  };

  const filteredVendedores = applyFilters();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVendedor(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (vendedor) => {
    setEditId(vendedor.id);
    setNewVendedor({
      nome: vendedor.nome,
      email: vendedor.email,
      cargo: vendedor.cargo
    });
    setShowAddModal(true);
  };

  const handleDelete = (vendedorId) => {
    deleteVendedor(vendedorId).then(() => {
      handleUpdate();
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      patchVendedor(editId, newVendedor).then(() => {
        handleUpdate();
      });
      setEditId(null);
    } else {
      const x = { ...newVendedor, cargo: [newVendedor.cargo] }
      postVendedor(x).then((value) => {
        handleUpdate(); 
      })
    }
    setShowAddModal(false);
    setNewVendedor({
      nome: '',
      email: '',
      senha: "",
      cargo: []
    });
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditId(0);
    setNewVendedor({
      nome: "",
      email: "",
      senha: "",
      cargo: []
    });
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Cargo'];
    const data = filteredVendedores.map(vendedor => [
      vendedor.nome,
      vendedor.email,
      vendedor.cargo
    ]);

    const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'vendedores.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const worksheetData = [
      ['Nome', 'Email', 'Cargo'],
      ...filteredVendedores.map(v => [
        v.nome,
        v.email,
        v.cargo
      ])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendedores');
    XLSX.writeFile(workbook, 'vendedores.xlsx');
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Relatório de Vendedores', 105, 15, { align: 'center' });

      const safeVendedores = filteredVendedores.map(v => ({
        nome: String(v.nome || '-'),
        email: String(v.email || '-'),
        cargo: String(v.cargo || '-')
      }));

      doc.autoTable({
        head: [['Nome', 'Email', 'Cargo']],
        body: safeVendedores.map(v => [v.nome, v.email, v.cargo]),
        startY: 25,
        margin: { left: 10, right: 10 },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak'
        }
      });

      const fileName = `vendedores_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert(`Falha na exportação para PDF:\n${error.message}`);
    }
  };

  const totalVendedores = vendedores.length;

  // Obter cargos únicos para o filtro
  const uniqueCargos = ['Todos Cargos', ...new Set(vendedores.map(v => v.cargo))];

  return (
    <div className="layout">
      {/* Conteúdo Principal */}
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="logo-container">
              <div className="logo-icon">👥</div>
              <h1>VendedorFolio <span>Manager</span></h1>
            </div>
            <div className="header-actions">
              <div className="search-box">
                <input type="text" placeholder="Pesquisar vendedores..." />
                <div className="search-icon">🔍</div>
              </div>
              <button className="btn primary new-user-btn" onClick={() => { setEditId(null); setShowAddModal(true); }}>
                <span>+</span> Novo Vendedor
              </button>
            </div>
          </div>
        </header>

        <main className="content-area">
          {/* Filtros */}
          <div className="filters-section">
            <div className="filter-group">
              <label>Cargo</label>
              <select 
                className="filter-select"
                name="cargo"
                value={filters.cargo}
                onChange={handleFilterChange}
              >
                {uniqueCargos.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
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
                <option>Cargo (A-Z)</option>
                <option>Cargo (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Cartões */}
          <div className="stats-cards">
            <div className="stat-card">
              <span className="stat-value">{totalVendedores}</span>
              <span className="stat-label">Vendedores Totais</span>
            </div>
          </div>

          {/* Tabela de Vendedores */}
          <div className="user-table-container">
            <div className="table-header">
              <h2>Lista de Vendedores</h2>
              <div className="table-actions">
                <button className="btn export-btn" onClick={exportToCSV}>📄 Exportar CSV</button>
                <button className="btn export-btn" onClick={exportToExcel}>📊 Exportar Excel</button>
                <button className="btn export-btn" onClick={exportToPDF}>📑 Exportar PDF</button>
                <button className="btn refresh-btn" onClick={handleUpdate} >🔄 Atualizar</button>
              </div>
            </div>

            <table className="user-table">
              <thead>
                <tr>
                  <th>CODIGO</th>
                  <th>NOME</th>
                  <th>EMAIL</th>
                  <th>CARGO</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendedores.map(vendedor => (
                  <tr key={vendedor.id}>
                    <td>{vendedor.id}</td>
                    <td>{vendedor.nome}</td>
                    <td>{vendedor.email}</td>
                    <td>{vendedor.cargo}</td>
                    <td className="action-buttons">
                      <button className="btn action-btn edit-btn" onClick={() => handleEdit(vendedor)}>✏️</button>
                      <button className="btn action-btn delete-btn" onClick={() => handleDelete(vendedor.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-footer">
              <span className="showing-text">👁️ Mostrando {filteredVendedores.length} de {vendedores.length} vendedores</span>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showAddModal && (
        <Modal 
          editId={editId} 
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          newVendedor={newVendedor}
          handlerModalClose={handleModalClose}/>
      )}
    </div>
  );
}

function Modal({ editId, handleSubmit, handleInputChange, newVendedor, handlerModalClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editId ? 'Editar Vendedor' : 'Adicionar Novo Vendedor'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input type="text" name="nome" value={newVendedor.nome} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={newVendedor.email} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="text" name="senha" value={newVendedor.senha} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Cargo</label>
            <input type="text" name="cargo" value={newVendedor.cargo} onChange={handleInputChange} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={handlerModalClose}>Cancelar</button>
            <button type="submit" className="btn primary">{editId ? 'Atualizar' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
