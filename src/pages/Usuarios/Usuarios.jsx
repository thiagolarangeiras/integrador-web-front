import { useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import { Link } from 'react-router-dom';
import autoTable from "jspdf-autotable";

function Home() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Inácio',
      email: 'inacio@gmail.com',
      cargo: 'Representante'
    },
    {
      id: 2,
      name: 'Maicou',
      email: 'maicou@hotmail.com',
      cargo: 'Programador'
    },
    {
      id: 3,
      name: 'Carine',
      email: 'carine@outlook.com',
      cargo: 'Traficante'
    }
  ]);

  const [filters, setFilters] = useState({
    cargo: 'Todos Cargos',
    sort: 'Nome (A-Z)'
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    cargo: ''
  });

  // Função para aplicar os filtros
  const applyFilters = () => {
    let filteredUsers = [...users];

    // Filtro por cargo
    if (filters.cargo !== 'Todos Cargos') {
      filteredUsers = filteredUsers.filter(
        user => user.cargo === filters.cargo
      );
    }

    // Ordenação
    filteredUsers.sort((a, b) => {
      switch (filters.sort) {
        case 'Nome (A-Z)':
          return a.name.localeCompare(b.name);
        case 'Nome (Z-A)':
          return b.name.localeCompare(a.name);
        case 'Cargo (A-Z)':
          return a.cargo.localeCompare(b.cargo);
        case 'Cargo (Z-A)':
          return b.cargo.localeCompare(a.cargo);
        default:
          return 0;
      }
    });

    return filteredUsers;
  };

  const filteredUsers = applyFilters();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Cargo'];
    const data = filteredUsers.map(user => [
      user.name,
      user.email,
      user.cargo
    ]);

    const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'usuarios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const worksheetData = [
      ['Nome', 'Email', 'Cargo'],
      ...filteredUsers.map(u => [
        u.name,
        u.email,
        u.cargo
      ])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuários');
    XLSX.writeFile(workbook, 'usuarios.xlsx');
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Relatório de Usuários', 105, 15, { align: 'center' });

      const safeUsers = filteredUsers.map(u => ({
        name: String(u.name || '-'),
        email: String(u.email || '-'),
        cargo: String(u.cargo || '-')
      }));

      doc.autoTable({
        head: [['Nome', 'Email', 'Cargo']],
        body: safeUsers.map(u => [u.name, u.email, u.cargo]),
        startY: 25,
        margin: { left: 10, right: 10 },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak'
        }
      });

      const fileName = `usuarios_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert(`Falha na exportação para PDF:\n${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...newUser, id: editingUser.id }
          : user
      ));
      setEditingUser(null);
    } else {
      const userToAdd = {
        ...newUser,
        id: Date.now()
      };
      setUsers([...users, userToAdd]);
    }

    setShowAddModal(false);
    setNewUser({
      name: '',
      email: '',
      cargo: ''
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      cargo: user.cargo
    });
    setShowAddModal(true);
  };

  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const totalUsers = users.length;

  // Obter cargos únicos para o filtro
  const uniqueCargos = ['Todos Cargos', ...new Set(users.map(u => u.cargo))];

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">UserFolio</div>
        <ul className="sidebar-menu">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/">Produtos</Link></li>
          <li><Link to="/clientes">Clientes</Link></li>
          <li><Link to="/fornecedores">Fornecedores</Link></li>
          <li><Link to="/pedidos">Pedidos</Link></li>
          <li><Link to="/usuarios">Usuários</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </div>

      {/* Conteúdo Principal */}
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="logo-container">
              <div className="logo-icon">👥</div>
              <h1>UserFolio <span>Manager</span></h1>
            </div>
            <div className="header-actions">
              <div className="search-box">
                <input type="text" placeholder="Pesquisar usuários..." />
                <div className="search-icon">🔍</div>
              </div>
              <button className="btn primary new-user-btn" onClick={() => { setEditingUser(null); setShowAddModal(true); }}>
                <span>+</span> Novo Usuário
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
              <span className="stat-value">{totalUsers}</span>
              <span className="stat-label">Usuários Totais</span>
            </div>
          </div>

          {/* Tabela de Usuários */}
          <div className="user-table-container">
            <div className="table-header">
              <h2>Lista de Usuários</h2>
              <div className="table-actions">
                <button className="btn export-btn" onClick={exportToCSV}>📄 Exportar CSV</button>
                <button className="btn export-btn" onClick={exportToExcel}>📊 Exportar Excel</button>
                <button className="btn export-btn" onClick={exportToPDF}>📑 Exportar PDF</button>
                <button className="btn refresh-btn">🔄 Atualizar</button>
              </div>
            </div>

            <table className="user-table">
              <thead>
                <tr>
                  <th>NOME</th>
                  <th>EMAIL</th>
                  <th>CARGO</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.cargo}</td>
                    <td className="action-buttons">
                      <button className="btn action-btn edit-btn" onClick={() => handleEdit(user)}>✏️</button>
                      <button className="btn action-btn delete-btn" onClick={() => handleDelete(user.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-footer">
              <span className="showing-text">👁️ Mostrando {filteredUsers.length} de {users.length} usuários</span>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome</label>
                <input type="text" name="name" value={newUser.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={newUser.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Cargo</label>
                <input type="text" name="cargo" value={newUser.cargo} onChange={handleInputChange} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button type="submit" className="btn primary">{editingUser ? 'Atualizar' : 'Adicionar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;