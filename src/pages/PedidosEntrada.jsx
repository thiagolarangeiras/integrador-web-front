import { useState, useEffect } from "react";
import { getPedidoEntradaLista, deletePedidoEntrada } from "../requests";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Cards from "../components/Cards";
import Filters from "../components/Filters";
import Table from "../components/Table";

export default function PedidosEntrada() {
	const navigate = useNavigate();
	const [page, setPage] = useState(0);
	const [items, setItems] = useState([]);

	useEffect(() => {
		handleUpdate();
	}, [page]);

	async function handleUpdate() {
		const value = await getPedidoEntradaLista(page);
		if (value != null) {
			setItems(value);
		}
	}

	function handleEdit(item) { navigate(`/pedidos/entrada/${item.id}`) };

	function handleNew() { navigate('/pedidos/entrada/novo') }

	async function handleDelete(id) {
		await deletePedidoEntrada(id);
		handleUpdate();
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
						nome={"Pedidos Saida"}
						items={items}
						colunas={[
							{ label: "Codigo", value: "id" },
							{ label: "Fornecedor", value: "fornecedor.nome" },
							{ label: "Data", value: "dataVigencia" },
							{ label: "Data entrega", value: "dataEntregaReal" },
							{ label: "Status", value: "status" },
							{ label: "Valor Total", value: "valorTotal" },
						]}
						handleEdit={handleEdit}
						handleDelete={handleDelete}
						handleUpdate={handleUpdate}
					/>
				</main>
			</div>
		</div>
	);
}