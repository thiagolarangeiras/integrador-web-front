import { useState, useEffect } from 'react';
import { postUsuario, patchUsuario, getUsuarioLista, deleteUsuario } from '../requests';
import { Usuario, UsuarioCargo} from '../utils';
import Header from '../components/Header';
import Filters from '../components/Filters';
import Cards from '../components/Cards';
import Table from '../components/Table';

export default function Usuarios() {
    const [page, setPage] = useState(0);
    const [showModal, setshowModal] = useState(false);
    const [editId, setEditId] = useState(false);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({});
    const [newUser, setNewUser] = useState(Usuario);

    useEffect(() => {
        getUsuarioLista(page, 50).then((value) => {
            if (value != null)
                setUsers(value);
        })
    }, [page]);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    function handleUpdate() {
        getUsuarioLista(page, 50).then((value) => {
            if (value != null)
                setUsers(value);
        })
    }

    function handleEdit(user) {
        setEditId(user.id);
        setNewUser({
            username: user.username,
            email: user.email,
            cargo: user.cargo
        });
        setshowModal(true);
    };

    function handleDelete(userId) {
        deleteUsuario(userId).then(() => {
            handleUpdate();
        });
    };

    function handleSubmit(e) {
        e.preventDefault();

        if (editId) {
            patchUsuario(editId, newUser).then(() => {
                handleUpdate();
            })
            setEditId(null);
        } else {
            postUsuario(newUser).then((value) => {
                handleUpdate();
            })
        }
        setshowModal(false);
        setNewUser({
            username: '',
            email: '',
            password: "",
            cargo: []
        });
    };

    function handleModalClose(e) {
        setshowModal(false);
        setEditId(0);
        setNewUser(Usuario);
    };

    function handleFilterChange(e) {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    function applyFilters() {
        let filteredUsers = [...users];

        // Filtro por cargo
        if (filters.cargo !== 'Todos Cargos') {
            filteredUsers = filteredUsers.filter(
                user => user.cargo === filters.cargo
            );
        }

        // Ordenação
        filteredUsers.sort((a, b) => {
            switch (filters.sort) {
                case 'Nome (A-Z)':
                    return a.username.localeCompare(b.username);
                case 'Nome (Z-A)':
                    return b.username.localeCompare(a.username);
                case 'Cargo (A-Z)':
                    return a.cargo.localeCompare(b.cargo);
                case 'Cargo (Z-A)':
                    return b.cargo.localeCompare(a.cargo);
                default:
                    return 0;
            }
        });

        return filteredUsers;
    };

    const filteredUsers = applyFilters();

    const totalUsers = users.length;
    const uniqueCargos = ['Todos Cargos', ...new Set(users.map(u => u.cargo))];

    return (
        <div className="layout">
            <div className="app-container">
                <Header
                    nomePesquisa={"Usuarios"}
                    handleNew={() => { setEditId(null); setshowModal(true); }}
                    nomeBotao={"Novo Usuário"}
                />
                <main className="content-area">
                    <Filters uniqueCategories={[]} />

                    <Cards items={[]} />

                    <Table
                        nome={"Usuarios"}
                        items={users}
                        colunas={[
                            { label: "Codigo", value: "id" },
                            { label: "Nome", value: "nome" },
                            { label: "Email", value: "email" },
                            { label: "Cargo", value: "cargo" },
                        ]}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        handleUpdate={handleUpdate}
                    />
                </main>
            </div>

            {showModal && (
                <Modal
                    newUser={newUser}
                    editId={editId}
                    handleSubmit={handleSubmit}
                    handleInputChange={handleInputChange}
                    handlerModalClose={handleModalClose} />
            )}
        </div>
    );
}

function Modal({ editId, handleSubmit, handleInputChange, newUser, handlerModalClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{editId ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome</label>
                        <input type="text" name="username" value={newUser.username} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={newUser.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Senha</label>
                        <input type="text" name="password" value={newUser.password} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Cargo</label>
                        <select name="cargo" value={newUser.cargo} onChange={handleInputChange}>
                            {UsuarioCargo.map((cargo) => (
                                <option key={cargo} value={cargo}>
                                    {cargo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn secondary" onClick={handlerModalClose}>Cancelar</button>
                        <button type="submit" className="btn primary">{editId ? 'Atualizar' : 'Adicionar'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}