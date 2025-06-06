import { useState, useEffect } from "react";
import { getProdutoLista, postProduto, patchProduto, deleteProduto, getMarcaListaNome, getMarcaLista, getFornecedorListaNome, getFornecedorLista } from "../requests";
import { Produto } from "../utils";
import Header from "../components/Header";
import Cards from "../components/Cards";
import Table, { TableSearch } from "../components/Table";
import Filters from "../components/Filters";

export default function Produtos() {
	const [page, setPage] = useState(0);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editId, setEditId] = useState(null);
	const [items, setItems] = useState([]);
	const [newItem, setNewItem] = useState(Produto);

	useEffect(() => {
		handleUpdate();
	}, [page]);

	async function handleInputChange(e) {
		const { name, value } = e.target;
		setNewItem(prev => ({ ...prev, [name]: value }));
	};

	async function handleUpdate() {
		let value = await getProdutoLista(page)
		if (value != null) {
			setItems(value);
		}
	}

	async function handleModalClose(e) {
		setShowAddModal(false);
		setEditId(null);
		setNewItem(Produto);
	};

	async function handleSubmit(e) {
		e.preventDefault();
		if (editId) await patchProduto(editId, newItem);
		else await postProduto(newItem);
		handleUpdate();
		handleModalClose();
	};

	async function handleEdit(item) {
		setEditId(item.id);
		setNewItem(item);
		setShowAddModal(true);
	};

	async function handleNew() {
		setShowAddModal(true);
	}

	async function handleDelete(id) {
		let value = await deleteProduto(id)
		handleUpdate();
	};

	return (
		<div className="layout">
			<div className="app-container">
				<Header
					nomeBotao={"Novo Produto"}
					nomePesquisa={"Produtos"}
					handleNew={handleNew}
				/>

				<main className="content-area">
					<Cards items={[]}/>
					<Table
						nome={"Produtos"}
						items={items}
						colunas={[
							{ label: "Codigo", value: "id" },
							{ label: "Nome", value: "nome" },
							{ label: "Descrição", value: "descricao" },
							{ label: "Marca", value: "marca.nome" },
							{ label: "Fornecedor", value: "fornecedor.nome" },
							{ label: "V. Compra", value: "valorCompra" },
							{ label: "V. Venda", value: "valorVenda" },
							{ label: "Estoque", value: "qtEstoque" },
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
					newItem={newItem}
					setNewItem={setNewItem}
					handleSubmit={handleSubmit}
					handleModalClose={handleModalClose}
					handleInputChange={handleInputChange}
				/>
			)}
		</div>
	);
}

function Modal({ editId, newItem, setNewItem, handleSubmit, handleModalClose, handleInputChange }) {
	const [marca, setMarca] = useState("");
	const [fornecedor, setFornecedor] = useState("");
	const [showMarcaModal, setShowMarcaModal] = useState(false);
	const [showFornecedorModal, setShowFornecedorModal] = useState(false);

	useEffect(() => {
		if (editId) {
			setMarca(newItem.marca?.nome);
			setFornecedor(newItem.fornecedor?.nome);
		}
	}, [])

	function handleMarcaModalOpen() {
		setShowMarcaModal(true);
	}

	function handleMarcaModalClose() {
		setShowMarcaModal(false);
	}

	function handleFornecedorModalOpen() {
		setShowFornecedorModal(true);
	}

	function handleFornecedorModalClose() {
		setShowFornecedorModal(false);
	}

	return (
		<>
			<div className="modal-overlay">
				<div className="modal">
					<h2>{editId ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label>Nome</label>
							<input type="text" name="nome" value={newItem.nome} onChange={handleInputChange} required />
						</div>
						<div className="form-group">
							<label>Descrição</label>
							<input type="text" name="descricao" value={newItem.descricao} onChange={handleInputChange} required />
						</div>
						<div className="form-group">
							<label>Marca</label>
							<div class="input-group">
								<button onClick={handleMarcaModalOpen} type="button">🔍</button>
								<input type="number" name="marca" value={newItem.idMarca} onChange={handleInputChange} required />
								<div class="info-text">{marca}</div>
							</div>
						</div>
						<div className="form-group">
							<label>Fornecedor</label>
							<div class="input-group">
								<button onClick={handleFornecedorModalOpen} type="button">🔍</button>
								<input type="number" name="idFornecedor" value={newItem.idFornecedor} onChange={handleInputChange} required />
								<div class="info-text">{fornecedor}</div>
							</div>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label>Valor Compra</label>
								<input type="number" name="valorCompra" value={newItem.valorCompra} onChange={handleInputChange} required />
							</div>
							<div className="form-group">
								<label>Valor Venda</label>
								<input type="number" name="valorVenda" value={newItem.valorVenda} onChange={handleInputChange} required />
							</div>
							<div className="form-group">
								<label>Estoque</label>
								<input type="number" name="qtEstoque" value={newItem.qtEstoque} onChange={handleInputChange} required />
							</div>
						</div>
						<div className="modal-actions">
							<button type="button" className="btn secondary" onClick={handleModalClose}>Cancelar</button>
							<button type="submit" className="btn primary">{editId ? 'Atualizar' : 'Adicionar'}</button>
						</div>
					</form>
				</div>
			</div>
			{showMarcaModal && (
				<ModalSearchMarca
					handleModalClose={handleMarcaModalClose}
					setNewItem={setNewItem}
					setMarca={setMarca}
				/>
			)}
			{showFornecedorModal && (
				<ModalSearchFornecedor
					handleModalClose={handleFornecedorModalClose}
					setNewItem={setNewItem}
					setFornecedor={setFornecedor}
				/>
			)}
		</>
	);
}

function ModalSearchMarca({ handleModalClose, setNewItem, setMarca }) {
	const [search, setSearch] = useState({ id: 0, nome: "" });
	const [items, setItems] = useState([]);

	useEffect(() => {
		handleUpdate();
	}, []);

	function handleSelect(item) {
		setNewItem(prev => ({ ...prev, idMarca: item.id }));
		setMarca(item.nome)
		handleModalClose();
	}

	function handleUpdate() {
		getMarcaLista(0).then((value) => {
			if (value != null) setItems(value);
		})
	}

	function handleUpdateName() {
		getMarcaListaNome(search.nome, 0).then((value) => {
			if (value != null) setItems(value);
		})
	}

	function handleInputChange(e) {
		const { name, value } = e.target;
		setSearch(prev => ({ ...prev, [name]: value }));
	};

	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>Selecionar Marca</h2>
				<form>
					<div className="form-row">
						<div className="form-group">
							<label>Codigo</label>
							<input type="number" name="id" value={search.id} onChange={handleInputChange} required min="0" />
						</div>
						<div className="form-group">
							<label>Nome</label>
							<input type="text" name="nome" value={search.nome} onChange={handleInputChange} required />
						</div>
						<div className="form-group">
							<label>Procurar </label>
							<button type="button" className="btn secondary" onClick={handleUpdateName}>🔍</button>
						</div>
					</div>
					<TableSearch items={items} handleSelect={handleSelect} />
					<div className="modal-actions">
						<button type="button" className="btn secondary" onClick={handleModalClose}>Cancelar</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function ModalSearchFornecedor({ handleModalClose, setNewItem, setFornecedor }) {
	const [search, setSearch] = useState({ id: 0, nome: "" });
	const [items, setItems] = useState([]);

	useEffect(() => {
		handleUpdate();
	}, []);

	function handleSelect(item) {
		setNewItem(prev => ({ ...prev, idFornecedor: item.id }));
		setFornecedor(item.nome)
		handleModalClose();
	}

	function handleUpdate() {
		getFornecedorLista(0).then((value) => {
			if (value != null) setItems(value);
		})
	}

	function handleUpdateName() {
		getFornecedorListaNome(search.nome, 0).then((value) => {
			if (value != null) setItems(value);
		})
	}

	function handleInputChange(e) {
		const { name, value } = e.target;
		setSearch(prev => ({ ...prev, [name]: value }));
	};

	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>Selecionar Fornecedor</h2>
				<form>
					<div className="form-row">
						<div className="form-group">
							<label>Codigo</label>
							<input type="number" name="id" value={search.id} onChange={handleInputChange} required min="0" />
						</div>
						<div className="form-group">
							<label>Nome</label>
							<input type="text" name="nome" value={search.nome} onChange={handleInputChange} required />
						</div>
						<div className="form-group">
							<label>Procurar </label>
							<button type="button" className="btn secondary" onClick={handleUpdateName}>🔍</button>
						</div>
					</div>
					<TableSearch items={items} handleSelect={handleSelect} />
					<div className="modal-actions">
						<button type="button" className="btn secondary" onClick={handleModalClose}>Cancelar</button>
					</div>
				</form>
			</div>
		</div>
	);
}