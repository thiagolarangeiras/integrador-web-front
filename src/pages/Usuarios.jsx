import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { postUsuario, patchUsuario, getUsuarioLista, deleteUsuario } from '../requests';

const usuarioStruct = {
	id: 0,
	username: "",
	email: "",
	password: "",
	cargo: [""]
}

export default function Usuarios() {
  const [page, setPage] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(false);
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'Inácio',
      email: 'inacio@gmail.com',
      cargo: ["Representante"]
    }
  ]);
  const [filters, setFilters] = useState({
    cargo: 'Todos Cargos',
    sort: 'Nome (A-Z)'
  });
  const [newUser, setNewUser] = useState({
	  username: "",
	  email: "",
	  password: "",
	  cargo: []
  });

	useEffect(() => {
		getUsuarioLista(page, 50).then((value) => {
      if (value != null)
			  setUsers(value);
		})
	}, [page]);

  const handleUpdate = () => {
    getUsuarioLista(page, 50).then((value) => {
			if (value != null)
			  setUsers(value);
		})
  }

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
          return a.username.localeCompare(b.username);
        case 'Nome (Z-A)':
          return b.username.localeCompare(a.username);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setNewUser({
      username: user.username,
      email: user.email,
      cargo: user.cargo
    });
    setShowAddModal(true);
  };

  const handleDelete = (userId) => {
    deleteUsuario(userId).then(() => {
      handleUpdate();
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      patchUsuario(editId, newUser).then(()=>{
        handleUpdate();
      })
      setEditId(null);
    } else {
      const x = { ...newUser, cargo: [ newUser.cargo ] }
      postUsuario(x).then((value) => {
        handleUpdate(); 
      })
    }
    setShowAddModal(false);
    setNewUser({
      username: '',
      email: '',
      password: "",
      cargo: []
    });
  };

  const handleModalClose = (e) => {
    setShowAddModal(false);
    setEditId(0);
    setNewUser({
      username: "",
      email: "",
      password: "",
      cargo: []
    });
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Cargo'];
    const data = filteredUsers.map(user => [
      user.username,
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
        username: String(u.username || '-'),
        email: String(u.email || '-'),
        cargo: String(u.cargo || '-')
      }));

      doc.autoTable({
        head: [['Nome', 'Email', 'Cargo']],
        body: safeUsers.map(u => [u.username, u.email, u.cargo]),
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

  const totalUsers = users.length;

  // Obter cargos únicos para o filtro
  const uniqueCargos = ['Todos Cargos', ...new Set(users.map(u => u.cargo))];

  return (
    <div className="layout">
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
              <button className="btn primary new-user-btn" onClick={() => { setEditId(null); setShowAddModal(true); }}>
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
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
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
        <Modal 
          editId={editId} 
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          newUser={newUser}
          handlerModalClose={handleModalClose}/>
      )}
    </div>
  );
}

function Modal({ editId, handleSubmit, handleInputChange, newUser, handlerModalClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editId ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input type="text" name="username" value={newUser.username} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={newUser.email} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="text" name="password" value={newUser.password} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Cargo</label>
            <input type="text" name="cargo" value={newUser.cargo} onChange={handleInputChange} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={handlerModalClose}>Cancelar</button>
            <button type="submit" className="btn primary">{editId ? 'Atualizar' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}