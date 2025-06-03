import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import {
	getPedidoSaida,
	postPedidoSaida,
	patchPedidoSaida,
	postPedidoSaidaProduto,
	patchPedidoSaidaProduto,
	getPedidoSaidaProduto,
	deletePedidoSaidaProduto,
	getProdutoLista,
	getVendedorLista,
	getVendedorListaNome,
	getClienteLista,
	getClienteListaNome,
} from "../requests";
import { aplicarMascaraDinheiro, handleInputChange, PedidoSaida, StatusEntrega, StatusPagamento, StatusPedido } from "../utils";
import { HeaderForm } from "../components/Header";
import { TableSearch } from "../components/Table";

export default function PedidosSaidaNovo() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [item, setItem] = useState(PedidoSaida);
	const [produtos, setProdutos] = useState([]);
	const [vendedorModal, setVendedorModal] = useState(false);
	const [clienteModal, setClienteModal] = useState(false);

	useEffect(() => {
		handleUpdate();
	}, [id]);

	async function handleUpdate() {
		if (id == null || id < 1) return;
		const value = await getPedidoSaida(id);
		if (value == null) {
			return;
		}
		setItem(value);
		cleanGet();
	}

	function cleanMask(value){
		const cleaned = value
			.replace(/\s/g, '')  // remove espaços
    		.replace('R$', '')   // remove símbolo R$
    		.replace(/\./g, '')  // remove pontos (milhar)
    		.replace(',', '.');  // troca vírgula decimal por ponto
		
  		return parseFloat(cleaned);
	}

	function cleanGet(){
		setItem(prev => ({
			...prev, 
			dataCriacao: prev.dataCriacao?.split("T")[0],
			dataEntregaPrevista: prev.dataEntregaPrevista?.split("T")[0],
			dataEntregaReal: prev.dataEntregaReal?.split("T")[0],
			dataVigencia: prev.dataVigencia?.split("T")[0]
		}));
	}

	async function handleSubmit() {
		let itemLimpo = { ...item, vendedor: null, cliente:null }
		if (typeof itemLimpo.valorFrete == "string"){
			itemLimpo.valorFrete = cleanMask(itemLimpo.valorFrete);
		}
		if (typeof itemLimpo.valorTotal == "string"){
			itemLimpo.valorTotal = cleanMask(itemLimpo.valorTotal);
		}
		
		if (id) {
			await patchPedidoSaida(id, itemLimpo);
			return;
		}
		
		let itemNovo = await postPedidoSaida(itemLimpo);
		for (let produto in produtos) {
			produto.idPedidoSaida = itemNovo.id;
			await postPedidoSaidaProduto(produto);
		}
		setItem(itemNovo);
		navigate(`/pedidos/saida/${itemNovo.id}`);
	}
	return (
		<div className="layout">
			<div className="app-container">
				<HeaderForm nome={id ? "Atualizar Pedido" : "Novo Pedido" } botaoNome={id ? 'Atualizar' : 'Adicionar'} botaoAcao={handleSubmit}  />
				<form >
					<div className="form-group">
						<label>Cliente</label>
						<div class="input-group">
							<button onClick={() => setClienteModal(true)} type="button">🔍</button>
							<input type="number" name="idCliente" value={item.idCliente} onChange={(e) => handleInputChange(e, setItem)} required />
							<div class="info-text">{item.cliente?.nome}</div>
						</div>
					</div>
					<div className="form-group">
						<label>Vendedor</label>
						<div class="input-group">
							<button onClick={() => setVendedorModal(true)} type="button">🔍</button>
							<input type="number" name="idVendedor" value={item.idVendedor} onChange={(e) => handleInputChange(e, setItem)} required />
							<div class="info-text">{item.vendedor?.nome}</div>
						</div>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label>Data Criacao</label>
							<input type="date" name="dataCriacao" value={item.dataCriacao} onChange={(e) => handleInputChange(e, setItem)} required />
						</div>
						<div className="form-group">
							<label>Data Vigencia</label>
							<input type="date" name="dataVigencia" value={item.dataVigencia} onChange={(e) => handleInputChange(e, setItem)} required />
						</div>
						<div className="form-group">
							<label>Data Prevista de Entrega</label>
							<input type="date" name="dataEntregaPrevista" value={item.dataEntregaPrevista} onChange={(e) => handleInputChange(e, setItem)} required />
						</div>
						<div className="form-group">
							<label>Data de Entrega</label>
							<input type="date" name="dataEntregaReal" value={item.dataEntregaReal} onChange={(e) => handleInputChange(e, setItem)} required />
						</div>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label>Status Pedido</label>
							<select name="status" value={item.status} onChange={(e) => handleInputChange(e, setItem)}>
								{StatusPedido.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</div>
						<div className="form-group">
							<label>Status Entrega</label>
							<select name="statusEntrega" value={item.statusEntrega} onChange={(e) => handleInputChange(e, setItem)}>
								{StatusEntrega.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</div>
						<div className="form-group">
							<label>Status Pagamento</label>
							<select name="statusPagamento" value={item.statusPagamento} onChange={(e) => handleInputChange(e, setItem)}>
								{StatusPagamento.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label>Valor Total</label>
							<input type="text" name="valorTotal" value={item.valorTotal} onChange={(e) => aplicarMascaraDinheiro(e, setItem)} required />
						</div>
						<div className="form-group">
							<label>Valor Frete</label>
							<input type="text" name="valorFrete" value={item.valorFrete} onChange={(e) => aplicarMascaraDinheiro(e, setItem)} required />
						</div>
					</div>
					{/* <div className="modal-actions">
						<button type="button" onClick={handleSubmit} className="btn primary">{id ? 'Atualizar' : 'Adicionar'}</button>
					</div> */}
				</form>
				<main className="content-area">
					<TableProdutos
						idPedidoSaida={id}
						items={produtos}
						setItems={setProdutos}
					/>
				</main>
				{clienteModal && (
					<ModalSearchCliente handleModalClose={() => { setClienteModal(false); }} setItem={setItem} />
				)}
				{vendedorModal && (
					<ModalSearchVendedor handleModalClose={() => setVendedorModal(false)} setItem={setItem} />
				)}
			</div>
		</div>
	);
}

function ModalSearchVendedor({ handleModalClose, setItem }) {
	const [searchParams, setSearchParams] = useState({ id: 0, nome: "" });
	const [searchItems, setSearchItems] = useState([]);

	useEffect(() => {
		handleUpdate();
	}, []);

	async function handleUpdate() {
		const value = await getVendedorLista(0);
		if (value != null) setSearchItems(value);
	}

	async function handleSelect(item) {
		setItem(prev => ({ ...prev, idVendedor: item.id, vendedor: item }));
		handleModalClose();
	}

	async function handleUpdateName() {
		const value = await getVendedorListaNome(searchParams.nome, 0);
		if (value != null) setSearchItems(value);
	}

	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>Selecionar Vendedor</h2>
				<form>
					<div className="form-row">
						<div className="form-group">
							<label>Codigo</label>
							<input type="number" name="id" value={searchParams.id} onChange={(e) => handleInputChange(e, setSearchParams)} required min="0" />
						</div>
						<div className="form-group">
							<label>Nome</label>
							<input type="text" name="nome" value={searchParams.nome} onChange={(e) => handleInputChange(e, setSearchParams)} required />
						</div>
						<div className="form-group">
							<label>Procurar </label>
							<button type="button" className="btn secondary" onClick={() => handleUpdateName()}>🔍</button>
						</div>
					</div>
					<TableSearch items={searchItems} handleSelect={handleSelect} />
					<div className="modal-actions">
						<button type="button" className="btn secondary" onClick={handleModalClose}>Cancelar</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function ModalSearchCliente({ handleModalClose, setItem }) {
	const [searchParams, setSearchParams] = useState({ id: 0, nome: "" });
	const [searchItems, setSearchItems] = useState([]);

	useEffect(() => {
		handleUpdate();
	}, []);

	async function handleUpdate() {
		const value = await getClienteLista(0);
		if (value != null) setSearchItems(value);
	}

	async function handleSelect(item) {
		setItem(prev => ({ ...prev, idCliente: item.id, cliente: item }));
		handleModalClose();
	}

	async function handleUpdateName() {
		const value = await getClienteListaNome(searchParams.nome, 0);
		if (value != null) setSearchItems(value);
	}

	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>Selecionar Cliente</h2>
				<form>
					<div className="form-row">
						<div className="form-group">
							<label>Codigo</label>
							<input type="number" name="id" value={searchParams.id} onChange={(e) => handleInputChange(e, setSearchParams)} required min="0" />
						</div>
						<div className="form-group">
							<label>Nome</label>
							<input type="text" name="nome" value={searchParams.nome} onChange={(e) => handleInputChange(e, setSearchParams)} required />
						</div>
						<div className="form-group">
							<label>Procurar </label>
							<button type="button" className="btn secondary" onClick={() => handleUpdateName()}>🔍</button>
						</div>
					</div>
					<TableSearch items={searchItems} handleSelect={handleSelect} />
					<div className="modal-actions">
						<button type="button" className="btn secondary" onClick={handleModalClose}>Cancelar</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export function TableProdutos({ idPedido, items, setItems }) {
	const [showModal, setModal] = useState(false);
	const [idProdutoNovo, setIdProdutoNovo] = useState(null);

	const colunas = [
		{ label: "Cod. Produto", value: "idProduto" },
		{ label: "Quantidade", value: "qtde" },
		{ label: "Valor Unitario", value: "valorUnitario" },
		{ label: "Valor Total", value: "valorTotal" },
	];

	async function handleNew() {
		setIdProdutoNovo(null);
		setModal(true);
	}

	async function handleUpdate() {
		if (idPedido == null || idPedido < 1) {
			return;
		} 
		let value = await getPedidoSaidaProduto(id);
		if (value != null) { 
			setItems(value);
		}
	}

	async function handleEdit(id) {
		setIdProdutoNovo(id);
		setModal(true);
	}

	async function handleDelete(id) {
		if (idPedido == null || idPedido < 1) {
			setItems((prev) => prev.filter(item => item.id !== id));
			return;
		};
		await deletePedidoSaidaProduto(id);
		handleUpdate();
	}

	return (
		<div className="product-table-container">
			<div className="table-header">
				<div className="table-actions">
					<button className="btn export-btn" onClick={handleNew}>📑 Adicionar</button>
					<button className="btn refresh-btn" onClick={handleUpdate}>🔄 Atualizar</button>
				</div>
			</div>

			<table className="product-table">
				<thead>
					<tr>
						{colunas.map(coluna => (
							<th>{coluna.label}</th>
						))}
						<th>AÇÕES</th>
					</tr>
				</thead>
				<tbody>
					{items.map(item => (
						<tr key={item.id}>
							{colunas.map(coluna => {
								let keys = coluna.value.split(".")
								if (keys.length > 1) {
									let result = item;
									for (const key of keys) {
										result = result[key];
									}
									return (<td>{result}</td>)
								}
								return (<td>{item[coluna.value]}</td>)

							})}
							<td className="action-buttons">
								<button className="btn action-btn edit-btn" onClick={() => handleEdit(item.id)}>✏️</button>
								<button className="btn action-btn delete-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="table-footer">
				<span className="showing-text">👁️ Mostrando {items.length} de {items.length}</span>
			</div>
			{showModal && (
				<Modal
					idPedido={idPedido}
					idProduto={idProdutoNovo}
					setItems={setItems}
					setModal={setModal}
				/>
			)}
		</div>
	);
}

function Modal({ idPedido, idProduto, setItems, setModal }) {
	const [item, setItem] = useState(defaultPedidoSaidaProduto);
	const [produto, setProduto] = useState("");
	const [showProdutoModal, setShowProdutoModal] = useState(false);
	
	useEffect(async () => {
		if (idProduto) {
			let pedidoProduto = await getPedidoSaidaProduto(idProduto);
			setItemEdit(pedidoProduto);
		}
	}, [])

	async function handleSubmit(e) {
		e.preventDefault();
		if (!idPedidoSaida) {
			await setItems(prev => ({ ...prev, value }));
			handleClose();
			return;
		}

		if (idPedidoSaidaProduto) {
			await patchPedidoSaidaProduto(idPedidoSaidaProduto, itemEdit);
		} else {
			await postPedidoSaidaProduto(itemEdit);
		}
		handleUpdate();
		handleClose();
	}

	async function handleClose() {
		setShowModals(false);
		setItemEdit(defaultPedidoSaidaProduto);
	}

	function handleProdutoModalOpen() {
		setShowProdutoModal(true);
	}

	function handleProdutoModalClose() {
		setShowProdutoModal(false);
	}

	return (
		<>
			<div className="modal-overlay">
				<div className="modal">
					<h2>{idPedidoSaidaProduto ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label>Produto</label>
							<div class="input-group">
								<button onClick={handleClienteModal} type="button">🔍</button>
								<input type="number" name="idProduto" value={itemEdit.idProduto} onChange={handleInputChange} required />
								<div class="info-text">{itemEdit.produto.nome}</div>
							</div>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label>Quantidade</label>
								<input type="text" name="qtde" value={itemEdit.qtde} onChange={handleInputChange} required />
							</div>
							<div className="form-group">
								<label>Valor Unitario</label>
								<input type="text" name="valorUnitario" value={itemEdit.valorUnitario} onChange={handleInputChange} required />
							</div>
							<div className="form-group">
								<label>Valor Total</label>
								<input type="text" name="valorTotal" value={itemEdit.valorTotal} onChange={handleInputChange} required />
							</div>
						</div>
						<div className="form-row">
							<div className="modal-actions">
								<button type="button" className="btn secondary" onClick={handleClose}>Cancelar</button>
								<button type="submit" className="btn primary">{idPedidoSaidaProduto ? 'Atualizar' : 'Adicionar'}</button>
							</div>
						</div>
					</form>
				</div>
			</div>
			{showProdutoModal && (
				<ModalSearchProduto
					handleClose={handleProdutoModalClose}
					setNewItem={setItemEdit}
					setMarca={setProduto}
				/>
			)}
		</>
	);
}

// function ModalSearchProduto({ handleClose, setNewItem, setMarca }) {
// 	const [search, setSearch] = useState({ id: 0, nome: "" });
// 	const [items, setItems] = useState([]);

// 	useEffect(() => {
// 		handleUpdate();
// 	}, []);

// 	function handleSelect(item) {
// 		setNewItem(prev => ({ ...prev, idProduto: item.id }));
// 		setMarca(item.nome)
// 		handleClose();
// 	}

// 	function handleUpdate() {
// 		getProdutoLista(0).then((value) => {
// 			if (value != null) setItems(value);
// 		})
// 	}

// 	function handleUpdateName() {
// 		getMarcaListaNome(search.nome, 0).then((value) => {
// 			if (value != null) setItems(value);
// 		})
// 	}

// 	function handleInputChange(e) {
// 		const { name, value } = e.target;
// 		setSearch(prev => ({ ...prev, [name]: value }));
// 	};

// 	return (
// 		<div className="modal-overlay">
// 			<div className="modal">
// 				<h2>Selecionar Marca</h2>
// 				<form>
// 					<div className="form-row">
// 						<div className="form-group">
// 							<label>Codigo</label>
// 							<input type="number" name="id" value={search.id} onChange={handleInputChange} required min="0" />
// 						</div>
// 						<div className="form-group">
// 							<label>Nome</label>
// 							<input type="text" name="nome" value={search.nome} onChange={handleInputChange} required />
// 						</div>
// 						<div className="form-group">
// 							<label>Procurar </label>
// 							<button type="button" className="btn secondary" onClick={handleUpdateName}>🔍</button>
// 						</div>
// 					</div>
// 					<TableSearch items={items} handleSelect={handleSelect} />
// 					<div className="modal-actions">
// 						<button type="button" className="btn secondary" onClick={handleClose}>Cancelar</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// }