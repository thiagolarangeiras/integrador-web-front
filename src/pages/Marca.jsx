import { useEffect, useState } from "react";
import { getMarcaLista, postMarca, patchMarca, deleteMarca } from "../requests";

export default function Marca() {
	const [page, setPage] = useState(0);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editId, setEditId] = useState(null);
	const [marca, setMarca] = useState([
		{
			id: 1,
			nome: 'MARCA EXEMPLO',
		},

	]);
	const [newMarca, setNewMarca] = useState({
		nome: "",
	});
	const tableColums = [
		"Codigo",
		"Nome",
	]

	useEffect(() => {
		handleUpdate();
	}, [page]);

	function exportToCSV() { };
	function exportToExcel() { };
	function exportToPDF() { };

	function handleInputChange(e) {
		const { name, value } = e.target;
		setNewMarca(prev => ({ ...prev, [name]: value }));
	};

	function handleUpdate() {
		getMarcaLista(page).then((value) => {
			if (value != null) setMarca(value);
		})
	}

	function handleModalClose(e) {
		setShowAddModal(false);
		setEditId(null);
		setNewMarca({
			nome: ""
		});
	};

	function handleSubmit(e) {
		e.preventDefault();
		if (editId) {
			patchMarca(editId, newMarca).then(() => {
				handleUpdate();
			});
		} else {
			postMarca(newMarca).then((value) => {
				handleUpdate();
			});
		}
		handleModalClose();
	};

	function handleEdit(item) {
		setEditId(item.id);
		setNewMarca({
			nome: item.nome,
		});
		setShowAddModal(true);
	};

	function handleNew() {
		setShowAddModal(true);
	}

	function handleDelete(id) {
		deleteMarca(id).then(() => {
			handleUpdate();
		});
	};

	return (
		<div className="layout">
			{/* Conteúdo Principal */}
			<div className="app-container">
				<Header
					nomeBotao={"Nova Marca"}
					handleNew={handleNew}
				/>

				<main className="content-area">
					{/* Filtros */}
					<Filtros uniqueCategories={[0]} />

					{/* Cartões */}
					<Cartoes
						totalProducts={0}
						activeProducts={0}
						inactiveProducts={0}
						lowStockProducts={0}
					/>

					{/* Tabela de Produtos */}
					<Tabela
						exportToCSV={exportToCSV}
						exportToExcel={exportToExcel}
						exportToPDF={exportToPDF}
						items={marca}
						handleEdit={handleEdit}
						handleDelete={handleDelete}
						colunas={tableColums}
						handleUpdate={handleUpdate}
					/>
				</main>
			</div>

			{/* Modal */}
			{showAddModal && (
				<Modal
					editId={editId}
					newMarca={newMarca}
					handleSubmit={handleSubmit}
					handleModalClose={handleModalClose}
					handleInputChange={handleInputChange}
				/>
			)}
		</div>
	);
}

function Modal({ editId, newMarca, handleSubmit, handleModalClose, handleInputChange }) {
	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>{editId ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Nome da Marca</label>
						<input type="text" name="nome" value={newMarca.nome} onChange={handleInputChange} required />
					</div>
					<div className="modal-actions">
						<button type="button" className="btn secondary" onClick={handleModalClose}>Cancelar</button>
						<button type="submit" className="btn primary">{editId ? 'Atualizar' : 'Adicionar'}</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function Header({ nomeBotao, handleNew }) {
	return (
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
					<button className="btn primary new-product-btn" onClick={handleNew}>
						<span>+</span> {nomeBotao}
					</button>
				</div>
			</div>
		</header>
	);
}

function Tabela({ nome, colunas, items, handleEdit, handleDelete, handleUpdate, exportToCSV, exportToExcel, exportToPDF, }) {
	return (
		<div className="product-table-container">
			<div className="table-header">
				<h2>Lista de {nome}</h2>
				<div className="table-actions">
					<button className="btn export-btn" onClick={exportToCSV}>📄 Exportar CSV</button>
					<button className="btn export-btn" onClick={exportToExcel}>📊 Exportar Excel</button>
					<button className="btn export-btn" onClick={exportToPDF}>📑 Exportar PDF</button>
					<button className="btn refresh-btn" onClick={handleUpdate}>🔄 Atualizar</button>
				</div>
			</div>

			<table className="product-table">
				<thead>
					<tr>
						{colunas.map(coluna => (
							<th>{coluna}</th>
						))}
						<th>STATUS</th>
						<th>AÇÕES</th>
					</tr>
				</thead>
				<tbody>
					{items.map(item => (
						<tr key={item.id}>
							<td>{item.id}</td>
							<td className="product-cell">
								<span className="product-name">{item.nome}</span>
								<span className="product-desc">{ }</span>
							</td>
							<td><span className={`status-badge ${item.status}`}>{item.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
							<td className="action-buttons">
								<button className="btn action-btn edit-btn" onClick={() => handleEdit(item)}>✏️</button>
								<button className="btn action-btn delete-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="table-footer">
				<span className="showing-text">👁️ Mostrando {items.length} de {items.length} produtos</span>
			</div>
		</div>
	);
}

function Cartoes({ totalProducts, activeProducts, inactiveProducts, lowStockProducts }) {
	return (
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
	);
}

function Filtros({ uniqueCategories }) {
	return (
		<div className="filters-section">
			<div className="filter-group">
				<label>Categoria</label>
				<select
					className="filter-select"
					name="category"
					value={""}
					onChange={""}
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
					value={"filters.status"}
					onChange={"handleFilterChange"}
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
					value={"filters.sort"}
					onChange={"handleFilterChange"}
				>
					<option>Nome (A-Z)</option>
					<option>Nome (Z-A)</option>
					<option>Preço (↑)</option>
					<option>Preço (↓)</option>
				</select>
			</div>
		</div>
	);
}