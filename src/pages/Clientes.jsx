import { useRef, useState, useEffect } from 'react';
import { } from "react";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import {
    getClienteLista,
    postCliente,
    patchCliente,
    deleteCliente,
    getVendedorListaNome,
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

    function handleDelete(id) {
        deleteCliente(id).then(() => {
            handleUpdate();
        });
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

    function exportToCSV() {
        const headers = ['Nome', 'Tipo', 'Documento', 'Telefone', 'Email', 'CEP', 'Endereço', 'Status'];
        const data = filteredClientes.map(cliente => [
            cliente.nome,
            cliente.tipo === 'pessoaFisica' ? 'Pessoa Física' : 'Pessoa Jurídica',
            cliente.documento,
            cliente.telefone,
            cliente.email,
            cliente.endereco.cep,
            `${cliente.endereco.rua}, ${cliente.endereco.numero} - ${cliente.endereco.bairro}, ${cliente.endereco.cidade}/${cliente.endereco.estado}`,
            cliente.status === 'active' ? 'Ativo' : 'Inativo'
        ]);

        const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'clientes.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    function exportToExcel() {
        const worksheetData = [
            ['Nome', 'Tipo', 'Documento', 'Telefone', 'Email', 'CEP', 'Endereço', 'Status'],
            ...filteredClientes.map(c => [
                c.nome,
                c.tipo === 'pessoaFisica' ? 'Pessoa Física' : 'Pessoa Jurídica',
                c.documento,
                c.telefone,
                c.email,
                c.endereco.cep,
                `${c.endereco.rua}, ${c.endereco.numero} - ${c.endereco.bairro}, ${c.endereco.cidade}/${c.endereco.estado}`,
                c.status === 'active' ? 'Ativo' : 'Inativo'
            ])
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
        XLSX.writeFile(workbook, 'clientes.xlsx');
    };

    function exportToPDF() {
        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm' });
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text('Relatório de Clientes', 105, 15, { align: 'center' });

            const safeClientes = filteredClientes.map(c => ({
                nome: String(c.nome || '-'),
                tipo: c.tipo === 'pessoaFisica' ? 'Pessoa Física' : 'Pessoa Jurídica',
                documento: String(c.documento || '-'),
                telefone: String(c.telefone || '-'),
                email: String(c.email || '-'),
                endereco: `${c.endereco.rua || ''}, ${c.endereco.numero || ''} - ${c.endereco.bairro || ''}, ${c.endereco.cidade || ''}/${c.endereco.estado || ''}`,
                status: c.status === 'active' ? 'Ativo' : 'Inativo'
            }));

            doc.autoTable({
                head: [['Nome', 'Tipo', 'Documento', 'Telefone', 'Email', 'Endereço', 'Status']],
                body: safeClientes.map(c => [c.nome, c.tipo, c.documento, c.telefone, c.email, c.endereco, c.status]),
                startY: 25,
                margin: { left: 10, right: 10 },
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    overflow: 'linebreak'
                },
                columnStyles: {
                    5: { cellWidth: 'auto' }
                }
            });

            const fileName = `clientes_${new Date().toISOString().slice(0, 10)}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert(`Falha na exportação para PDF:\n${error.message}`);
        }
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
                        nome={"Cliente"}
                        items={items}
                        colunas={[
                            { label: "Codigo", value: "id" },
                            { label: "Vendedor", value: "idVendedor" },
                            { label: "Nome", value: "nomePessoa" },
                            { label: "Empresa", value: "nomeEmpresa" },
                            { label: "Fantasia/Apelido", value: "nomeFantasia" },
                            { label: "Descricao", value: "descricao" },
                            { label: "Tipo", value: "tipo" },
                            { label: "Documento", value: "cpfCnpj" },
                            { label: "Telefone", value: "telefone" },
                        ]}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleUpdate={handleUpdate}
                        exportToCSV={exportToCSV}
                        exportToExcel={exportToExcel}
                        exportToPDF={exportToPDF}
                    />
                </main>
            </div>
            {modal && (
                <Modal
                    handleModalClose={handleModalClose}
                    item={modalItem}
                    setItem={setModalItem}
                />
            )}
        </div>
    );
}

function Modal({ handleModalClose, item, setItem }) {
    const [vendedor, setVendedor] = useState("");
    const [showVendedorModal, setShowVendedorModal] = useState(false);

    useEffect(() => {
        if (newItem.id) {
            setVendedor(newItem.vendedor.nome);
        }
    }, [])
    
    async function handleSubmit(e) {
        e.preventDefault();
        if (newItem.id) await patchCliente(newItem.id, newItem);
        else await postCliente(newItem);
        handleUpdate();
        handleModalClose();
    };

    function handleInputChange(e) {
        const { name, value } = e.target;
        setModalItem(prev => ({ ...prev, [name]: value }));
    };

    function handleVendedorModalOpen() {
        setShowVendedorModal(true);
    }

    function handleVendedorModalClose() {
        setShowVendedorModal(false);
    }

    // Funções de máscara
    function aplicarMascaraDocumento(e) {
        const value = e.target.value.replace(/\D/g, '');
        let formattedValue = value;

        if (newItem.tipo === "pessoaFisica") {
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

        setModalItem(prev => ({
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

        setNewCliente(prev => ({
            ...prev,
            telefone: formattedValue
        }));
    };

    function aplicarMascaraCEP(e) {
        const value = e.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/^(\d{5})(\d)/, '$1-$2');

        setNewCliente(prev => ({
            ...prev,
            endereco: {
                ...prev.endereco,
                cep: formattedValue
            }
        }));
    };


    return (
        <>
            <div className="modal-overlay">
                <div className="modal">
                    <h2>{newItem.id ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>nome completo/razão social</label>
                            <input
                                type="text"
                                name="nome"
                                value={newItem.nome}
                                onchange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Tipo</label>
                                <select
                                    name="tipo"
                                    value={newItem.tipo}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="pessoaFisica">Pessoa Física</option>
                                    <option value="pessoaJuridica">Pessoa Jurídica</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>{newItem.tipo === 'pessoaFisica' ? 'CPF' : 'CNPJ'}</label>
                                <input
                                    type="text"
                                    name="cpfCnpj"
                                    value={newItem.cpfCnpj}
                                    onChange={aplicarMascaraDocumento}
                                    required
                                    placeholder={newItem.tipo === 'pessoaFisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                                    maxLength={newItem.tipo === 'pessoaFisica' ? 14 : 18}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Telefone</label>
                                <input
                                    type="text"
                                    name="telefone"
                                    value={newItem.telefone}
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
                                    value={newItem.email}
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
                                    value={newItem.cep}
                                    onChange={aplicarMascaraCEP}
                                    required
                                    placeholder="00000-000"
                                    maxLength="9"
                                />
                            </div>
                            <div className="form-group">
                                <label>Rua</label>
                                <input
                                    type="text"
                                    name="rua"
                                    value={newItem.rua}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group small">
                                <label>Número</label>
                                <input
                                    type="text"
                                    name="numero"
                                    value={newItem.numero}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Complemento</label>
                            <input
                                type="text"
                                name="complemento"
                                value={newItem.complemento}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Bairro</label>
                                <input
                                    type="text"
                                    name="bairro"
                                    value={newItem.bairro}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Cidade</label>
                                <input
                                    type="text"
                                    name="cidade"
                                    value={newItem.cidade}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group small">
                                <label>Estado</label>
                                <select
                                    name="estado"
                                    value={newItem.estado}
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
                        </div>
                        <div className="form-group">
                            <label>Vendedor</label>
                            <div class="input-group">
                                <button onClick={handleVendedorModalOpen} type="button">🔍</button>
                                <input type="number" name="idVendedor" value={newItem.idVendedor} onChange={handleInputChange} required />
                                <div class="info-text">{vendedor}</div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn secondary" onClick={handleModalClose}>Cancelar</button>
                            <button type="submit" className="btn primary">{newItem.id ? 'Atualizar' : 'Adicionar'}</button>
                        </div>
                    </form>
                </div>
            </div>
            {showVendedorModal && (
                <ModalSearchVendedor
                    handleModalClose={handleVendedorModalClose}
                    setModalItem={setModalItem}
                    setMarca={setVendedor}
                />
            )}
        </>
    );
}

function ModalSearchVendedor({ handleModalClose, setModalItem, setVendedor }) {
    const [search, setSearch] = useState({ id: 0, nome: "" });
    const [items, setItems] = useState([]);

    useEffect(() => {
        handleUpdate();
    }, []);

    function handleSelect(item) {
        setModalItem(prev => ({ ...prev, idVendedor: item.id }));
        setVendedor(item.nome)
        handleModalClose();
    }

    function handleUpdate() {
        getVendedorListaNome(0).then((value) => {
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
