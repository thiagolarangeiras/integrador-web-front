import { useEffect, useState } from "react";
import { getMarcaLista, postMarca, patchMarca, deleteMarca } from "../requests";
import { Marca } from "../utils";
import Header from "../components/Header";
import Cards from "../components/Cards";
import Table from "../components/Table";

export default function Marcas() {
	const [page, setPage] = useState(0);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editId, setEditId] = useState(null);
	const [marca, setMarca] = useState([]);
	const [newMarca, setNewMarca] = useState(Marca);

	useEffect(() => {
		handleUpdate();
	}, [page]);

	async function handleInputChange(e) {
		const { name, value } = e.target;
		setNewMarca(prev => ({ ...prev, [name]: value }));
	};

	async function handleUpdate() {
		getMarcaLista(page).then((value) => {
			if (value != null) setMarca(value);
		})
	}

	async function handleModalClose(e) {
		setShowAddModal(false);
		setEditId(null);
		setNewMarca(Marca);
	};

	async function handleSubmit(e) {
		e.preventDefault();
		if (editId) {
			let value = await patchMarca(editId, newMarca);
			handleUpdate();
		} else {
			let value = await postMarca(newMarca);
			handleUpdate();
		}
		handleModalClose();
	};

	async function handleEdit(item) {
		setEditId(item.id);
		setNewMarca(item);
		setShowAddModal(true);
	};

	function handleNew() {
		setShowAddModal(true);
	}

	async function handleDelete(id) {
		let value = await deleteMarca(id);
		handleUpdate();
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
					<Cards items={[]}/>
					<Table
						nome={"Marcas"}
						items={marca}
						colunas={[
							{ label: "Codigo", value: "id" },
							{ label: "Nome", value: "nome" },
						]}
						handleEdit={handleEdit}
						handleDelete={handleDelete}
						handleUpdate={handleUpdate}
					/>
				</main>
			</div>
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