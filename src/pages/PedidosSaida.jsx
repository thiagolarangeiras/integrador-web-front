import { useState, useEffect } from "react";
import {deletePedidoSaida, getPedidoSaidaLista } from "../requests";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Cards from "../components/Cards";
import Filters from "../components/Filters";
import Table from "../components/Table";

export default function PedidosSaida() {
	const navigate = useNavigate();
	const [page, setPage] = useState(0);
	const [items, setItems] = useState([]);

	useEffect(() => {
		handleUpdate();
	}, [page]);

	async function handleUpdate() {
		const value = await getPedidoSaidaLista(page);
		if (value != null) {
			setItems(value);
		}
	}

	function handleEdit(item) { navigate(`/pedidos/saida/${item.id}`) };

	function handleNew() { navigate('/pedidos/saida/novo') }

	async function handleDelete(id) {
		await deletePedidoSaida(id);
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
							{ label: "Cliente", value: "idCliente" },
							{ label: "Vendedor", value: "idVendedor" },
							{ label: "Status", value: "status" },
							{ label: "Status Entraga", value: "statusEntrega" },
							{ label: "Status Pagamento", value: "statusPagamento" },
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