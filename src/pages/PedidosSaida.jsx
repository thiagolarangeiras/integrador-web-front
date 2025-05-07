import { useState, useEffect } from "react";
import { getProdutoLista, deleteProduto } from "../requests";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Cards from "../components/Cards";
import Table, { TableSearch } from "../components/Table";
import Filters from "../components/Filters";

const defaultCliente = {
	id: null,
	nome: null,
}

const defaultVendedor = {
	id: null,
	nome: null,
}

const defaultPedidoSaida = {
	idCliente: null,
	idVendedor: null,
	dataCriacao: null,
	dataVigencia: null,
	dataEntregaPrevista: null,
	dataEntregaReal: null,
	status: null,
	statusEntrega: null,
	statusPagamento: null,
	valorTotal: null,
	valorFrete: null
}

export default function PedidosSaida() {
	const navigate = useNavigate();
	const [page, setPage] = useState(0);
	const [showAddModal, setShowAddModal] = useState(false);
	const [items, setItems] = useState([]);

	const tableColums = [
		{ label: "Codigo", value: "id" },
		{ label: "Nome", value: "nome" },
		{ label: "Descrição", value: "descricao" },
		{ label: "Marca", value: "marca.nome" },
		{ label: "Fornecedor", value: "fornecedor.nome" },
		{ label: "V. Compra", value: "valorCompra" },
		{ label: "V. Venda", value: "valorVenda" },
		{ label: "Estoque", value: "qtEstoque" },
	];

	useEffect(() => {
		handleUpdate();
	}, [page]);

	function handleUpdate() {
		getProdutoLista(page).then((value) => {
			if (value != null) {
				setItems(value);
			}
		})
	}

	function handleEdit(item) { navigate(`/pedidos/saida/${item.id}`) };

	function handleNew() { navigate('/pedidos/saida/novo') }

	function handleDelete(id) {
		deleteProduto(id).then(() => {
			handleUpdate();
		});
	};

	return (
		<div className="layout">
			<div className="app-container">
				<Header
					nomeBotao={"Novo Pedido"}
					nomePesquisa={"Pedidos"}
					handleNew={handleNew}
				/>

				<main className="content-area">
					<Filters uniqueCategories={[0]} />
					<Cards
						items={[
							{ value: 0, label: "Total de Produtos" },
							{ value: 0, label: "Produtos com baixo estoque" },
						]}
					/>
					<Table
						nome={"Produtos"}
						items={items}
						colunas={tableColums}
						handleEdit={handleEdit}
						handleDelete={handleDelete}
						handleUpdate={handleUpdate}
						exportToCSV={()=>{}}
						exportToExcel={()=>{}}
						exportToPDF={()=>{}}
					/>
				</main>
			</div>
		</div>
	);
}