import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { getPedidoSaida, postPedidoSaida, patchPedidoSaida, postPedidoSaidaProduto, patchPedidoSaidaProduto, getPedidoSaidaProduto, deletePedidoSaidaProduto, getProdutoLista } from "../requests";
import { PedidoSaida } from "../utils";
import Header from "../components/Header";

export default function PedidosSaidaNovo() {
	const { id } = useParams();
	const [item, setItem] = useState(PedidoSaida);
	const [produtos, setProdutos] = useState([]);

	useEffect(() => {
		handleUpdate();
	}, []);

	function handleInputChange(e) {
		const { name, value } = e.target;
		setSearch(prev => ({ ...prev, [name]: value }));
	};

	function handleUpdate() {
		// if (id == null || id < 1) return;
		// getPedidoSaida(id).then((value) => {
		// 	if (value != null) {
		// 		setItem(value);
		// 	}
		// })
	}

	async function handleSubmit() {
		if (id) await patchPedidoSaida(id, item);
		else {
			let itemNovo = await postPedidoSaida(item);
			for (let produto in produtos) {
				produto.idPedidoSaida = itemNovo.id;
				await postPedidoSaidaProduto(produto);
			}
		}
		handleUpdate();
	}

	function handleClienteModal() { }

	function handleVendedorModal() { }

	return (
		<div className="layout">
			<div className="app-container">
				<Header
					nomeBotao={"Novo Produto"}
					nomePesquisa={"Produtos"}
					handleNew={() => { }}
				/>
				<form >
					<div className="form-group">
						<label>Cliente</label>
						<div class="input-group">
							<button onClick={handleClienteModal} type="button">🔍</button>
							<input type="number" name="idCliente" value={item.idCliente} onChange={handleInputChange} required />
							<div class="info-text">{item.cliente?.nome}</div>
						</div>
					</div>
					<div className="form-group">
						<label>Vendedor</label>
						<div class="input-group">
							<button onClick={handleVendedorModal} type="button">🔍</button>
							<input type="number" name="idVendedor" value={item.idVendedor} onChange={handleInputChange} required />
							<div class="info-text">{item.vendedor?.nome}</div>
						</div>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label>Data Criacao</label>
							<input type="text" name="dataCriacao" value={item.dataCriacao} onChange={handleInputChange} required />
						</div>
						<div className="form-group">
							<label>Data Vigencia</label>
							<input type="text" name="dataVigencia" value={item.dataVigencia} onChange={handleInputChange} required />
						</div>
						<div className="form-group">
							<label>Data Prevista de Entrega</label>
							<input type="text" name="dataEntregaPrevista" value={item.dataEntregaPrevista} onChange={handleInputChange} required />
						</div>
						<div className="form-group">
							<label>Data de Entrega</label>
							<input type="text" name="dataEntregaReal" value={item.dataEntregaReal} onChange={handleInputChange} required />
						</div>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label>Status Pedido</label>
							<input type="text" name="status" value={item.status} onChange={handleInputChange} required />
						</div>
						<div className="form-group">
							<label>Status Entrega</label>
							<input type="text" name="statusEntrega" value={item.statusEntrega} onChange={handleInputChange} required />
						</div>
						<div className="form-group">
							<label>Status Pagamento</label>
							<input type="text" name="statusPagamento" value={item.statusPagamento} onChange={handleInputChange} required />
						</div>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label>Valor Total</label>
							<input type="text" name="valorTotal" value={item.valorTotal} onChange={handleInputChange} required />
						</div>
						<div className="form-group">
							<label>Valor Frete</label>
							<input type="text" name="valorFrete" value={item.valorFrete} onChange={handleInputChange} required />
						</div>
					</div>
					<div className="modal-actions">
						<button type="button" onClick={handleSubmit} className="btn primary">{id ? 'Atualizar' : 'Adicionar'}</button>
					</div>
				</form>
				<main className="content-area">
					{/* <TableProdutos
						idPedidoSaida={id}
						items={produtos}
						setItems={setProdutos}
					/> */}
				</main>
			</div>
		</div>
	);
}

export function TableProdutos({ idPedidoSaida, items, setItems }) {
	const [showModal, setShowModal] = useState(false);
	const [idPedidoSaidaProduto, setIdPedidoSaidaProduto] = useState(null);

	const colunas = [
		{ label: "Cod. Produto", value: "idProduto" },
		{ label: "Quantidade", value: "qtde" },
		{ label: "Valor Unitario", value: "valorUnitario" },
		{ label: "Valor Total", value: "valorTotal" },
	];

	function handleUpdate() {
		if (idPedidoSaida == null || idPedidoSaida < 1) return;
		getPedidoSaidaProduto(id).then((value) => {
			if (value != null) {
				setItems(value);
			}
		})
	}

	async function handleEdit(id) {
		setIdPedidoSaidaProduto(id);
		setShowModal(true)
	}

	async function handleDelete(id) {
		await deletePedidoSaidaProduto(id);
	}

	return (
		<div className="product-table-container">
			<div className="table-header">
				<div className="table-actions">
					<button className="btn export-btn" onClick={() => { }}>📑 Adicionar</button>
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
					idPedidoSaida={idPedidoSaida}
					idPedidoSaidaProduto={idPedidoSaidaProduto}
					setItems={setItems}
					setShowModals={setShowModals}
				/>
			)}
		</div>
	);
}

function Modal({ idPedidoSaida, idPedidoSaidaProduto, setItems, setShowModals }) {
	const [itemEdit, setItemEdit] = useState(defaultPedidoSaidaProduto);
	const [produto, setProduto] = useState("");
	const [showProdutoModal, setShowProdutoModal] = useState(false);
	useEffect(async () => {
		if (idPedidoSaidaProduto) {
			let pedidoProduto = await getPedidoSaidaProduto(idPedidoSaidaProduto);
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


function ModalSearchProduto({ handleClose, setNewItem, setMarca }) {
	const [search, setSearch] = useState({ id: 0, nome: "" });
	const [items, setItems] = useState([]);

	useEffect(() => {
		handleUpdate();
	}, []);

	function handleSelect(item) {
		setNewItem(prev => ({ ...prev, idProduto: item.id }));
		setMarca(item.nome)
		handleClose();
	}

	function handleUpdate() {
		getProdutoLista(0).then((value) => {
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
					<TableSearchMarca items={items} handleSelect={handleSelect} />
					<div className="modal-actions">
						<button type="button" className="btn secondary" onClick={handleClose}>Cancelar</button>
					</div>
				</form>
			</div>
		</div>
	);
}