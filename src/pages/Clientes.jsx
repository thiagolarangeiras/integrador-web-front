import { useState, useEffect } from 'react';

import {
    getClienteLista,
    postCliente,
    patchCliente,
    deleteCliente,
    getVendedorListaNome,
    getVendedorLista,
} from "../requests";

import { Cliente, EstadosBr } from '../utils';

import Header from "../components/Header";
import Cards from "../components/Cards";
import Table, { TableSearch } from "../components/Table";
import Filters from "../components/Filters";

export default function Clientes() {
    const [page, setPage] = useState(0);
    const [modal, setModal] = useState(false);
    const [modalItem, setModalItem] = useState(Cliente);
    const [items, setItems] = useState([]);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        handleUpdate();
    }, [page]);

    function handleUpdate() {
        getClienteLista(page).then((value) => {
            if (value != null) {
                setItems(value);
            }
        })
    }

    function handleEdit(item) {
        setModalItem(item);
        setModal(true);
    };

    function handleNew() {
        setModal(true);
    }

    async function handleDelete(id) {
        await deleteCliente(id);
        handleUpdate();
    };

    function applyFilters() {
        let filteredClientes = [...items];

        // Filtro por tipo
        if (filters.tipo !== 'Todos Tipos') {
            filteredClientes = filteredClientes.filter(
                cliente => cliente.tipo === filters.tipo
            );
        }

        // Filtro por status
        if (filters.status !== 'Todos Status') {
            const statusValue = filters.status === 'Ativo' ? 'active' : 'inactive';
            filteredClientes = filteredClientes.filter(
                cliente => cliente.status === statusValue
            );
        }

        // Ordenação
        filteredClientes.sort((a, b) => {
            switch (filters.sort) {
                case 'Nome (A-Z)':
                    return a.nomePessoa.localeCompare(b.nomePessoa);
                case 'Nome (Z-A)':
                    return b.nomePessoa.localeCompare(a.nomePessoa);
                default:
                    return 0;
            }
        });

        return filteredClientes;
    };

    const filteredClientes = applyFilters();

    function handleFilterChange(e) {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="layout">
            <div className="app-container">
                <Header
                    nomeBotao={"Novo Produto"}
                    nomePesquisa={"Produtos"}
                    handleNew={handleNew}
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
                        nome={"Clientes"}
                        items={items}
                        colunas={[
                            { label: "Codigo", value: "id" },
                            { label: "Vendedor", value: "vendedor.nome" },
                            { label: "Nome", value: "nomePessoa" },
                            //{ label: "Empresa", value: "nomeEmpresa" },
                            //{ label: "Fantasia/Apelido", value: "nomeFantasia" },
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

function Clientes2() {
    return (
        <div className="layout">
            {/* Conteúdo Principal */}
            <div className="app-container">

                <main className="content-area">
                    {/* Filtros */}
                    <div className="filters-section">
                        <div className="filter-group">
                            <label>Tipo</label>
                            <select
                                className="filter-select"
                                name="tipo"
                                value={filters.tipo}
                                onChange={handleFilterChange}
                            >
                                <option>Todos Tipos</option>
                                <option>pessoaFisica</option>
                                <option>pessoaJuridica</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Status</label>
                            <select
                                className="filter-select"
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                            >
                                <option>Todos Status</option>
                                <option>Ativo</option>
                                <option>Inativo</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Ordenar por</label>
                            <select
                                className="filter-select"
                                name="sort"
                                value={filters.sort}
                                onChange={handleFilterChange}
                            >
                                <option>Nome (A-Z)</option>
                                <option>Nome (Z-A)</option>
                            </select>
                        </div>
                    </div>

                    {/* Cartões */}
                    <div className="stats-cards">
                        <div className="stat-card">
                            <span className="stat-value">{totalClientes}</span>
                            <span className="stat-label">Clientes Totais</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{activeClientes}</span>
                            <span className="stat-label">Ativos</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{inactiveClientes}</span>
                            <span className="stat-label">Inativos</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{clientesPF}</span>
                            <span className="stat-label">Pessoa Física</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{clientesPJ}</span>
                            <span className="stat-label">Pessoa Jurídica</span>
                        </div>
                    </div>

                    {/* Tabela de Clientes */}
                    <div className="product-table-container">
                        <div className="table-header">
                            <h2>Lista de Clientes</h2>
                            <div className="table-actions">
                                <button className="btn export-btn" onClick={exportToCSV}>📄 Exportar CSV</button>
                                <button className="btn export-btn" onClick={exportToExcel}>📊 Exportar Excel</button>
                                <button className="btn export-btn" onClick={exportToPDF}>📑 Exportar PDF</button>
                                <button className="btn refresh-btn">🔄 Atualizar</button>
                            </div>
                        </div>

                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>NOME</th>
                                    <th>TIPO</th>
                                    <th>DOCUMENTO</th>
                                    <th>TELEFONE</th>
                                    <th>EMAIL</th>
                                    <th>ENDEREÇO</th>
                                    <th>STATUS</th>
                                    <th>AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClientes.map(cliente => (
                                    <tr key={cliente.id}>
                                        <td className="product-cell">
                                            <span className="product-name">{cliente.nome}</span>
                                        </td>
                                        <td>{cliente.tipo === 'pessoaFisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
                                        <td>{cliente.documento}</td>
                                        <td>{cliente.telefone}</td>
                                        <td>{cliente.email}</td>
                                        <td>
                                            {cliente.endereco.rua}, {cliente.endereco.numero} - {cliente.endereco.bairro}, {cliente.endereco.cidade}/{cliente.endereco.estado}
                                        </td>
                                        <td><span className={`status-badge ${cliente.status}`}>{cliente.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
                                        <td className="action-buttons">
                                            <button className="btn action-btn edit-btn" onClick={() => handleEdit(cliente)}>✏️</button>
                                            <button className="btn action-btn delete-btn" onClick={() => handleDelete(cliente.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="table-footer">
                            <span className="showing-text">👁️ Mostrando {filteredClientes.length} de {clientes.length} clientes</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
