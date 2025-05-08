import { useEffect, useState } from "react";
import { getVendedorLista, postVendedor, patchVendedor, deleteVendedor } from "../requests";
import { aplicarMascaraDocumento, aplicarMascaraTelefone, handleInputChange, Vendedor } from '../utils';

import Header from "../components/Header";
import Cards from "../components/Cards";
import Filters from "../components/Filters";
import Table from "../components/Table";

export default function Vendedores() {
	const [page, setPage] = useState(0);
	const [modal, setModal] = useState(false);
	const [modalItem, setModalItem] = useState(Vendedor);
	const [items, setItems] = useState([]);

	useEffect(() => {
		handleUpdate();
	}, [page]);

	async function handleUpdate() {
		const value = await getVendedorLista(page);
		if (value != null) {
			setItems(value);
		}
	}

	async function handleEdit(item) {
		setModalItem(item);
		setModal(true);
	};

	async function handleDelete(id) {
		await deleteVendedor(id);
		handleUpdate();
	};

	return (
		<div className="layout">
			<div className="app-container">
				<Header
					nomeBotao={"Novo Produto"}
					nomePesquisa={"Produtos"}
					handleNew={()=> setModal(true)}
				/>

				<main className="content-area">
					<Filters uniqueCategories={[0]} />
					<Cards
						items={[
							{ value: items.length, label: "Total de Clientes" },
							{ value: items.filter(c => c.status === 'active').length, label: "Clientes ativos" },
							{ value: items.filter(c => c.tipo === 'pessoaFisica').length, label: "Clientes Pessoa Fisica" },
							{ value: items.filter(c => c.tipo === 'pessoaJuridica').length, label: "Clientes Pessoa Juridica" },
						]}
					/>
					<Table
						nome={"Vendedores"}
						items={items}
						colunas={[
							{ label: "Codigo", value: "id" },
							{ label: "Nome", value: "nome" },
							{ label: "Descricao", value: "descricao" },
							{ label: "Cpf", value: "cpf" },
							{ label: "Telefone", value: "telefone" },
							{ label: "Email", value: "email" },
						]}
						handleEdit={handleEdit}
						handleDelete={handleDelete}
						handleUpdate={handleUpdate}
					/>
				</main>
			</div>
			{modal && (
				<Modal
					handleModalClose={() => {
						setModalItem(Vendedor);
						handleUpdate();
						setModal(false);
					}}
					item={modalItem}
					setItem={setModalItem}
				/>
			)}
		</div>
	);
}

function Modal({ handleModalClose, item, setItem }) {
	useEffect(() => {
	}, [])

	async function handleSubmit(e) {
		e.preventDefault();
		if (item.id) await patchVendedor(item.id, item);
		else await postVendedor(item);
		handleModalClose();
	};

	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>{item.id ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Nome</label>
						<input type="text" name="nome" value={item.nome} onChange={(e)=> handleInputChange(e, setItem)} required />
					</div>
					<div className="form-group">
						<label>descrição</label>
						<input type="text" name="descricao" value={item.descricao} onChange={(e)=> handleInputChange(e, setItem)} required />
					</div>
					<div className="form-group">
						<label>CPF</label>
						<input type="text" name="cpf" value={item.cpf} onChange={(e)=> aplicarMascaraDocumento(e, setItem, "pessoaFisica")} maxLength={14} required />
					</div>
					<div className="form-group">
						<label>Telefone</label>
						<input type="text" name="telefone" value={item.telefone} onChange={(e)=> aplicarMascaraTelefone(e, setItem)} placeholder="(00) 00000-0000" maxLength="15" required />
					</div>
					<div className="form-group">
						<label>Email</label>
						<input type="text" name="email" value={item.email} onChange={(e)=> handleInputChange(e, setItem)} required />
					</div>
					<div className="modal-actions">
						<button type="button" className="btn secondary" onClick={handleModalClose}>Cancelar</button>
						<button type="submit" className="btn primary">{item.id ? 'Atualizar' : 'Adicionar'}</button>
					</div>
				</form>
			</div>
		</div>
	);
}