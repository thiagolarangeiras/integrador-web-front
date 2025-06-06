import { useState, useEffect } from 'react';
import { getClienteLista, postCliente, patchCliente, deleteCliente, getVendedorListaNome, getVendedorLista } from "../requests";
import { Cliente, EstadosBr } from '../utils';

import Header from "../components/Header";
import Cards from "../components/Cards";
import Table, { TableSearch } from "../components/Table";

export default function Clientes() {
    const [page, setPage] = useState(0);
    const [modal, setModal] = useState(false);
    const [modalItem, setModalItem] = useState(Cliente);
    const [items, setItems] = useState([]);

   async function handleUpdate() {
        let value = await getClienteLista(page);
        if (value != null) {
            setItems(value);
        }
    }

    async function handleEdit(item) {
        setModalItem(item);
        setModal(true);
    };

    async function handleNew() {
        setModal(true);
    }

    async function handleDelete(id) {
        await deleteCliente(id);
        handleUpdate();
    };

    useEffect(() => {
        handleUpdate();
    }, [page]);

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
                        nome={"Clientes"}
                        items={items}
                        colunas={[
                            { label: "Codigo", value: "id" },
                            { label: "Vendedor", value: "vendedor.nome" },
                            { label: "Nome", value: "nomePessoa" },
                            { label: "Descricao", value: "descricao" },
                            { label: "Tipo", value: "tipo" },
                            { label: "Documento", value: "cpfCnpj" },
                            { label: "Telefone", value: "telefone" },
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
                        setModalItem(Cliente);
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
    const [vendedor, setVendedor] = useState("");
    const [vendedorModal, setVendedorModal] = useState(false);

    useEffect(() => {
        if (item.id) {
            setVendedor(item.vendedor.nome);
        }
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();
        let input = { ...item, nomeEmpresa: item.nomePessoa, nomeFantasia: item.nomePessoa, vendedor: null }
        if (input.id) await patchCliente(input.id, input);
        else await postCliente(input);
        handleModalClose();
    };

    async function handleInputChange(e) {
        const { name, value } = e.target;
        setItem(prev => ({ ...prev, [name]: value }));
    };

    // Funções de máscara
    function aplicarMascaraDocumento(e) {
        const value = e.target.value.replace(/\D/g, '');
        let formattedValue = value;

        if (item.tipo === "pessoaFisica") {
            if (value.length <= 11) {
                formattedValue = value.replace(/(\d{3})(\d)/, '$1.$2');
                formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
                formattedValue = formattedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
        } else {
            if (value.length <= 14) {
                formattedValue = value.replace(/^(\d{2})(\d)/, '$1.$2');
                formattedValue = formattedValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                formattedValue = formattedValue.replace(/\.(\d{3})(\d)/, '.$1/$2');
                formattedValue = formattedValue.replace(/(\d{4})(\d)/, '$1-$2');
            }
        }

        setItem(prev => ({
            ...prev,
            cpfCnpj: formattedValue
        }));
    };

    function aplicarMascaraTelefone(e) {
        const value = e.target.value.replace(/\D/g, '');
        let formattedValue = value;

        if (value.length > 10) {
            formattedValue = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (value.length > 6) {
            formattedValue = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            formattedValue = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
        } else if (value.length > 0) {
            formattedValue = value.replace(/^(\d{0,2}).*/, '($1');
        }

        setItem(prev => ({
            ...prev,
            telefone: formattedValue
        }));
    };

    function aplicarMascaraCEP(e) {
        const value = e.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/^(\d{5})(\d)/, '$1-$2');

        setItem(prev => ({
            ...prev,
            cep: formattedValue
        }));
    };


    return (
        <>
            <div className="modal-overlay">
                <div className="modal">
                    <h2>{item.id ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>nome completo/razão social</label>
                            <input
                                type="text"
                                name="nomePessoa"
                                value={item.nomePessoa}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>descrição</label>
                            <input
                                type="text"
                                name="descricao"
                                value={item.descricao}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Tipo</label>
                                <select
                                    name="tipo"
                                    value={item.tipo}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="pessoaFisica">Pessoa Física</option>
                                    <option value="pessoaJuridica">Pessoa Jurídica</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>{item.tipo === 'pessoaFisica' ? 'CPF' : 'CNPJ'}</label>
                                <input
                                    type="text"
                                    name="cpfCnpj"
                                    value={item.cpfCnpj}
                                    onChange={aplicarMascaraDocumento}
                                    required
                                    placeholder={item.tipo === 'pessoaFisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                                    maxLength={item.tipo === 'pessoaFisica' ? 14 : 18}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Telefone</label>
                                <input
                                    type="text"
                                    name="telefone"
                                    value={item.telefone}
                                    onChange={aplicarMascaraTelefone}
                                    required
                                    placeholder="(00) 00000-0000"
                                    maxLength="15"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={item.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>CEP</label>
                                <input
                                    type="text"
                                    name="cep"
                                    value={item.cep}
                                    onChange={aplicarMascaraCEP}
                                    required
                                    placeholder="00000-000"
                                    maxLength="9"
                                />
                            </div>
                            <div className="form-group small">
                                <label>Estado</label>
                                <select
                                    name="estado"
                                    value={item.estado}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {EstadosBr.map((e) => (
                                        <option key={e} value={e}>
                                            {e}
                                        </option>
                                    ))}

                                </select>
                            </div>
                            <div className="form-group">
                                <label>Cidade</label>
                                <input
                                    type="text"
                                    name="cidade"
                                    value={item.cidade}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Bairro</label>
                                <input
                                    type="text"
                                    name="bairro"
                                    value={item.bairro}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Rua</label>
                                <input
                                    type="text"
                                    name="rua"
                                    value={item.rua}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group small">
                                <label>Número</label>
                                <input
                                    type="text"
                                    name="numero"
                                    value={item.numero}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Complemento</label>
                                <input
                                    type="text"
                                    name="complemento"
                                    value={item.complemento}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Vendedor</label>
                            <div class="input-group">
                                <button onClick={() => setVendedorModal(true)} type="button">🔍</button>
                                <input type="number" name="idVendedor" value={item.idVendedor} onChange={handleInputChange} required />
                                <div class="info-text">{vendedor}</div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn secondary" onClick={handleModalClose}>Cancelar</button>
                            <button type="submit" className="btn primary">{item.id ? 'Atualizar' : 'Adicionar'}</button>
                        </div>
                    </form>
                </div>
            </div>
            {vendedorModal && (
                <ModalSearchVendedor
                    handleModalClose={() => setVendedorModal(false)}
                    setItem={setItem}
                    setVendedor={setVendedor}
                />
            )}
        </>
    );
}

function ModalSearchVendedor({ handleModalClose, setItem, setVendedor }) {
    const [search, setSearch] = useState({ id: 0, nome: "" });
    const [items, setItems] = useState([]);

    useEffect(() => {
        handleUpdate();
    }, []);

    function handleSelect(item) {
        setItem(prev => ({ ...prev, idVendedor: item.id }));
        setVendedor(item.nome)
        handleModalClose();
    }

    function handleUpdate() {
        getVendedorLista(0).then((value) => {
            if (value != null) setItems(value);
        })
    }

    function handleUpdateName() {
        getVendedorListaNome(search.nome, 0).then((value) => {
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
                <h2>Selecionar Vendedor</h2>
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