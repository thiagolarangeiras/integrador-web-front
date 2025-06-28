import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { HeaderForm } from "../components/Header";
import { TableListaDeProduto, TableSearch } from "../components/Table";

import { 
	getPedidoEntrada, postPedidoEntrada, patchPedidoEntrada, 
	getPedidoEntradaProdutoLista, postPedidoEntradaProduto, patchPedidoEntradaProduto, deletePedidoEntradaProduto, 
	getProdutoLista, getProdutoListaNome, getFornecedorLista, getFornecedorListaNome
} from "../requests";

import { 
	aplicarMascaraDinheiro, handleInputChange, PedidoEntradaProduto,
	PedidoEntrada, StatusEntrega, StatusPagamento, StatusPedido 
} from "../utils";

function cleanMaskPost(value){
	const cleaned = value
		.replace(/\s/g, '')  // remove espaços
		.replace('R$', '')   // remove símbolo R$
		.replace(/\./g, '')  // remove pontos (milhar)
		.replace(',', '.');  // troca vírgula decimal por ponto
	
	return parseFloat(cleaned);
}

function cleanMaskGet(value){
	return value?.split("T")[0];
}

export default function PedidosEntradaNovo() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [item, setItem] = useState(PedidoEntrada);
	const [produtos, setProdutos] = useState([]);
	const [produtosDel, setProdutosDel] = useState([]);
	const [fornecedorModal, setFornecedorModal] = useState(false);

	function cleanGet(){
		setItem(prev => ({
			...prev, 
			dataCriacao: cleanMaskGet(prev.dataCriacao),
			dataEntregaPrevista: cleanMaskGet(prev.dataEntregaPrevista),
			dataEntregaReal: cleanMaskGet(prev.dataEntregaReal),
			dataVigencia: cleanMaskGet(prev.dataVigencia)
		}));
	}
	
	async function handleUpdate() {
		if (id == null || id < 1) {
			return;
		} 

		let pedido = await getPedidoEntrada(id);
		if (pedido == null) { return }
		setItem(pedido);

		let produtos = await getPedidoEntradaProdutoLista(id, 0, 200);
		if (produtos == null) { return }
		setProdutos(produtos);
		cleanGet();
	}

	async function handleSubmit(){
		let itemLimpo = { ...item, vendedor: null, cliente:null }
		if (typeof itemLimpo.valorFrete == "string"){
			itemLimpo.valorFrete = cleanMaskPost(itemLimpo.valorFrete);
		}
		if (typeof itemLimpo.valorTotal == "string"){
			itemLimpo.valorTotal = cleanMaskPost(itemLimpo.valorTotal);
		}
		
		if(itemLimpo.id){
			await patchPedidoEntrada(itemLimpo.id, itemLimpo);
			let prods = produtos;
			for(let i=0; i<prods.length; i++){
				if(prods[i].id){
					await patchPedidoEntradaProduto(prods[i].id, prods[i]);
				} else {
					prods[i].idPedidoEntrada = itemLimpo.id;
					await postPedidoEntradaProduto(prods[i]);
				}
			}
			let prodsDel = produtosDel;
			for(let i=0; i<prodsDel.length; i++){
				if(prodsDel[i].id == null){ continue; }
				await deletePedidoEntradaProduto(prodsDel[i].id);
			}
			handleUpdate();
			return;
		}

		let itemResult = await postPedidoEntrada(itemLimpo);
		produtos.forEach(async (p, index) => {
			p.idPedidoEntrada = itemResult.id;
			await postPedidoEntradaProduto(p);
		});
		navigate(`/pedidos/entrada/${itemResult.id}`);
	}
	
	useEffect(() => {
		handleUpdate();
	}, []);

	return (
		<div className="layout">
			<div className="app-container">
				<HeaderForm nome={id ? "Atualizar Pedido" : "Novo Pedido" } botaoNome={id ? 'Atualizar' : 'Adicionar'} botaoAcao={handleSubmit}  />
				<form >
					<div className="form-group">
						<label>Fornecedor</label>
						<div class="input-group">
							<button onClick={() => setFornecedorModal(true)} type="button">🔍</button>
							<input type="number" name="idFornecedor" value={item.idFornecedor} onChange={(e) => handleInputChange(e, setItem)}/>
							<div class="info-text">{item.fornecedor?.nome}</div>
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
				</form>
				<main className="content-area">
					<TableProdutos items={produtos} setItems={setProdutos} itemsDel={produtosDel} setItemsDel={setProdutosDel} />
				</main>
				{fornecedorModal && (
					<ModalSearchFornecedor handleModalClose={() => { setFornecedorModal(false); }} setItem={setItem} />
				)}
			</div>
		</div>
	);
}

function ModalSearchFornecedor({ handleModalClose, setItem }) {
	const [searchParams, setSearchParams] = useState({ id: 0, nome: "" });
	const [searchItems, setSearchItems] = useState([]);

	useEffect(() => {
		handleUpdate();
	}, []);

	async function handleUpdate() {
		const value = await getFornecedorLista(0);
		if (value != null) setSearchItems(value);
	}

	async function handleSelect(item) {
		setItem(prev => ({ ...prev, idFornecedor: item.id, fornecedor: item }));
		handleModalClose();
	}

	async function handleUpdateName() {
		const value = await getFornecedorListaNome(searchParams.nome, 0);
		if (value != null) setSearchItems(value);
	}

	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>Selecionar Fornecedor</h2>
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

function TableProdutos({ items, setItems, itemsDel, setItemsDel }) {
	const [showModal, setModal] = useState(false);
	const [idProdutoNovo, setIdProdutoNovo] = useState(null);

	async function handleNew() {
		setIdProdutoNovo(null);
		setModal(true);
	}

	async function handleEdit(id, index) {
		setIdProdutoNovo({id: id, index: index});
		setModal(true);
	}

	async function handleDelete(id, index) {
		let itemsNew = items;
		let itemsDelNew = itemsDel;
		itemsDelNew = itemsDelNew.concat(itemsNew.splice(index, 1)); 
		setItems(itemsNew);
		setItemsDel(itemsDelNew);
	}

	return (
		<>
			<TableListaDeProduto 
				items={items}
				colunas={[
					{ label: "Cod. Produto", value: "idProduto" },
					{ label: "Nome", value: "produto.nome" },
					{ label: "Quantidade", value: "qtde" },
					{ label: "Valor Unitario", value: "valorUnitario" },
					{ label: "Valor Total", value: "valorTotal" },
				]}
				handleDelete={handleDelete}
				handleEdit={handleEdit}
				handleNew={handleNew}
			/>
			{showModal && (
				<Modal
					idProduto={idProdutoNovo}
					items={items}
					setItems={setItems}
					setModal={setModal}
				/>
			)}
		</>
	);
}

function Modal({ idProduto, items, setItems, setModal }) {
	const [item, setItem] = useState(PedidoEntradaProduto);
	const [produtoModal, setProdutoModal] = useState(false);
	
	useEffect(() => {
		if(idProduto) {
			setItem(items[idProduto.index]);
		}
	}, [])

	async function openProdutoModal(){
		setProdutoModal(true);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if(idProduto) {
			await setItems(prev => {
				prev[idProduto.index] = item;
				return prev;
			});
		} else {
			await setItems(prev => {
				prev.push(item);
				return prev;
			});
		}
		handleClose();
	}

	async function handleClose() {
		setModal(false);
		setItem(PedidoEntradaProduto);
	}

	return (
		<>
			<div className="modal-overlay">
				<div className="modal">
					<h2>{idProduto ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label>Produto</label>
							<div class="input-group">
								<button onClick={openProdutoModal} type="button">🔍</button>
								<input type="number" name="idProduto" value={item.idProduto} onChange={(e)=> handleInputChange(e, setItem)} required />
								<div class="info-text">{item.produto?.nome}</div>
							</div>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label>Quantidade</label>
								<input type="text" name="qtde" value={item.qtde} onChange={(e)=> handleInputChange(e, setItem)} required />
							</div>
							<div className="form-group">
								<label>Valor Unitario</label>
								<input type="text" name="valorUnitario" value={item.valorUnitario} onChange={(e)=> handleInputChange(e, setItem)} required />
							</div>
							<div className="form-group">
								<label>Valor Total</label>
								<input type="text" name="valorTotal" value={item.valorTotal} onChange={(e)=> handleInputChange(e, setItem)} required />
							</div>
						</div>
						<div className="form-row">
							<div className="modal-actions">
								<button type="button" className="btn secondary" onClick={handleClose}>Cancelar</button>
								<button type="submit" className="btn primary">{idProduto ? 'Atualizar' : 'Adicionar'}</button>
							</div>
						</div>
					</form>
				</div>
			</div>
			{produtoModal && (
				<ModalSearchProduto
					setProdutoModal={setProdutoModal}
					setMainItem={setItem}
				/>
			)}
		</>
	);
}

function ModalSearchProduto({ setProdutoModal, setMainItem }) {
	const [search, setSearch] = useState({ id: 0, nome: "" });
	const [items, setItems] = useState([]);

	async function handleClose() {
		setItems([]);
		setProdutoModal(false);
	}

	async function handleUpdate() {
		let value = await getProdutoLista(0);
		if (value != null) setItems(value);
	}

	async function handleUpdateName() {
		let value = await getProdutoListaNome(search.nome, 0);
		if (value != null) setItems(value);
	}

	async function handleSelect(item) {
		setMainItem(prev => ({ ...prev, idProduto: item.id, produto: item }));
		handleClose();
	}
	
	useEffect(() => {
		handleUpdate();
	}, []);

	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>Selecionar Produto</h2>
				<div>
					<div className="form-row">
						<div className="form-group">
							<label>Codigo</label>
							<input type="number" name="id" value={search.id} onChange={(e)=> handleInputChange(e, setSearch)} min="0" />
						</div>
						<div className="form-group">
							<label>Nome</label>
							<input type="text" name="nome" value={search.nome} onChange={(e)=> handleInputChange(e, setSearch)} />
						</div>
						<div className="form-group">
							<label>Procurar </label>
							<button type="button" className="btn secondary" onClick={handleUpdateName}>🔍</button>
						</div>
					</div>
					<TableSearch items={items} handleSelect={handleSelect} />
					<div className="modal-actions">
						<button type="button" className="btn secondary" onClick={handleClose}>Cancelar</button>
					</div>
				</div>
			</div>
		</div>
	);
}