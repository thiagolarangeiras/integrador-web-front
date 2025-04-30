import { useEffect, useState } from "react";
import { getMarcaLista, postMarca, patchMarca, deleteMarca } from "../requests";
import Header from "../components/Header";
import Cards from "../components/Cards";
import Filters from "../components/Filters";
import Table from "../components/Table";

const defaultItem = {
    nome: null,
} 

export default function Marca() {
	const [page, setPage] = useState(0);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editId, setEditId] = useState(null);
	const [marca, setMarca] = useState([
		{
			id: 1,
			nome: 'MARCA EXEMPLO',
		}
	]);
	const [newMarca, setNewMarca] = useState(defaultItem);

	const tableColums = [
		{label: "Codigo", value: "id" },
		{label: "Nome", value: "nome" },
	];

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
					nomePesquisa={"Marca"}
					nomeBotao={"Nova Marca"}
					handleNew={handleNew}
				/>

				<main className="content-area">
					{/* Filtros */}
					<Filters uniqueCategories={[0]} />

					{/* Cartões */}
					<Cards
						totalProducts={0}
						activeProducts={0}
						inactiveProducts={0}
						lowStockProducts={0}
					/>

					{/* Tabela de Produtos */}
					<Table
						nome={"Marcas"}
						items={marca}
						colunas={tableColums}
						handleEdit={handleEdit}
						handleDelete={handleDelete}
						handleUpdate={handleUpdate}
						exportToCSV={exportToCSV}
						exportToExcel={exportToExcel}
						exportToPDF={exportToPDF}
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