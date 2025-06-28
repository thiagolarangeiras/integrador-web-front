import { useEffect, useState } from "react";
import { getFornecedorLista, postFornecedor, patchFornecedor, deleteFornecedor } from "../requests";
import { aplicarMascaraDocumento, aplicarMascaraTelefone, handleInputChange, Fornecedor } from '../utils';

import Header from "../components/Header";
import Cards from "../components/Cards";
import Table from "../components/Table";

export default function Fornecedores() {
    const [page, setPage] = useState(0);
    const [modal, setModal] = useState(false);
    const [modalItem, setModalItem] = useState(Fornecedor);
    const [items, setItems] = useState([]);

    useEffect(() => {
        handleUpdate();
    }, [page]);

    async function handleUpdate() {
        const value = await getFornecedorLista(page);
        if (value != null) {
            setItems(value);
        }
    }

    async function handleEdit(item) {
        setModalItem(item);
        setModal(true);
    };

    async function handleDelete(id) {
        await deleteFornecedor(id);
        handleUpdate();
    };

    return (
        <div className="layout">
            <div className="app-container">
                <Header
                    nomeBotao={"Novo Fornecedor"}
                    nomePesquisa={"Fornecedores"}
                    handleNew={() => setModal(true)}
                />

                <main className="content-area">
                    <Cards items={[]} />
                    <Table
                        nome={"Fornecedores"}
                        items={items}
                        colunas={[
                            { label: "Codigo", value: "id" },
                            { label: "Nome", value: "nome" },
                            { label: "CPF/CNPJ", value: "cpfCnpj" },
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
                    handleModalClose={async () => {
                        setModalItem(Fornecedor);
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
    async function handleSubmit(e) {
        e.preventDefault();
        if (item.id) await patchFornecedor(item.id, item);
        else await postFornecedor(item);
        handleModalClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{item.id ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome</label>
                        <input type="text" name="nome" value={item.nome} onChange={(e) => handleInputChange(e, setItem)} required />
                    </div>
                    <div className="form-group">
                        <label>CPF/CNPJ</label>
                        <input type="text" name="cpfCnpj" value={item.cpfCnpj} onChange={(e) => aplicarMascaraDocumento(e, setItem, "Fiscal")} maxLength={14} required />
                    </div>
                    <div className="form-group">
                        <label>Telefone</label>
                        <input type="text" name="telefone" value={item.telefone} onChange={(e) => aplicarMascaraTelefone(e, setItem)} placeholder="(00) 00000-0000" maxLength="15" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" name="email" value={item.email} onChange={(e) => handleInputChange(e, setItem)} required />
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