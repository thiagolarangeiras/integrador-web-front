import { useState, useEffect } from "react";
import { getProdutoLista, postProduto, patchProduto, deleteProduto } from "../requests";
import Header from "../components/Header";
import Cards from "../components/Cards";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Filters from "../components/Filters";

const defaultItem = {
    idFornecedor: null,
    idMarca: null,
    nome: null,
    descricao: null,
    valorCompra: null,
    valorVenda: null,
    qtEstoque: null,
} 

export default function Produtos() {
	const [page, setPage] = useState(0);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editId, setEditId] = useState(null);
	const [items, setItems] = useState([{...defaultItem, id:0}]);
	const [newItem, setNewItem] = useState(defaultItem);
	
	const tableColums = [
		{label: "Codigo", value: "id" },
		{label: "Nome", value: "nome" },
		{label: "Descrição", value: "descricao" },
		{label: "Marca", value: "idMarca" },
		{label: "Fornecedor", value: "idFornecedor" },
		{label: "V. Compra", value: "valorCompra" },
		{label: "V. Venda", value: "valorVenda" },
		{label: "Estoque", value: "qtEstoque" },		
	];

	const inputValues = [
		{ type:"text",   label:"Nome",       value: newItem.nome,         name: "nome" },
		{ type:"text",   label:"Descrição",  value: newItem.descricao,    name: "descricao" },
		{ type:"text",   label:"Marca",      value: newItem.idMarca,      name: "idMarca" },
		{ type:"text",   label:"Fornecedor", value: newItem.idFornecedor, name: "idFornecedor" },
		{ type:"number", label:"V. Compra",  value: newItem.valorCompra,  name: "valorCompra" },
		{ type:"number", label:"V. Venda",   value: newItem.valorVenda,   name: "valorVenda" },
		{ type:"number", label:"Estoque",    value: newItem.qtEstoque,    name: "qtEstoque" },
	];

	useEffect(() => {
		handleUpdate();
	}, [page]);

	function handleInputChange(e) {
		const { name, value } = e.target;
		setNewItem(prev => ({ ...prev, [name]: value }));
	};

	function handleUpdate() {
		getProdutoLista(page).then((value) => {
			if (value != null) setItems(value);
		})
	}

	function handleModalClose(e) {
		setShowAddModal(false);
		setEditId(null);
		setNewItem(defaultItem);
	};

	async function handleSubmit(e) {
		e.preventDefault();
		console.log("AAAAAAAA")
		if (editId) await patchProduto(editId, newItem);
		else await postProduto(newItem);
		handleUpdate();
		handleModalClose();
	};

	function handleEdit(item) {
		setEditId(item.id);
		setNewItem(item);
		setShowAddModal(true);
	};

	function handleNew() {
		setShowAddModal(true);
	}

	function handleDelete(id) {
		deleteProduto(id).then(() => {
			handleUpdate();
		});
	};

	function exportToCSV() { };
	function exportToExcel() { };
	function exportToPDF() { };

	return (
		<div className="layout">
			<div className="app-container">
				<Header
					nomeBotao={"Novo Produto"}
					handleNew={handleNew}
				/>

				<main className="content-area">
					<Filters uniqueCategories={[0]} />
					<Cards
						totalProducts={0}
						activeProducts={0}
						inactiveProducts={0}
						lowStockProducts={0}
					/>
					<Table
						nome={"Produtos"}
						items={items}
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
			{showAddModal && (
				<Modal
					editId={editId}
					newItem={newItem}
					inputValues={inputValues}
					handleSubmit={handleSubmit}
					handleModalClose={handleModalClose}
					handleInputChange={handleInputChange}
				/>
			)}
		</div>
	);
}