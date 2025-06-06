import { useState, useEffect } from 'react';
import { postUsuario, patchUsuario, getUsuarioLista, deleteUsuario } from '../requests';
import { Usuario, UsuarioCargo } from '../utils';
import Header from '../components/Header';
import Cards from '../components/Cards';
import Table from '../components/Table';

export default function Usuarios() {
    const [page, setPage] = useState(0);
    const [showModal, setshowModal] = useState(false);
    const [editId, setEditId] = useState(false);
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState(Usuario);

    async function handleInputChange(e) {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    async function handleUpdate() {
        let value = await getUsuarioLista(page, 50)
        if (value != null){
            setUsers(value);
        }
    }

    async function handleEdit(user) {
        setEditId(user.id);
        setNewUser(user);
        setshowModal(true);
    };

    async function handleDelete(userId) {
        let value = await deleteUsuario(userId)
        handleUpdate();
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (editId) {
            let value = await patchUsuario(editId, newUser)
            handleUpdate();
            setEditId(null);
        } else {
            let value = await postUsuario(newUser)
            handleUpdate();
        }
        setshowModal(false);
        setNewUser(Usuario);
    };

    async function handleModalClose(e) {
        setshowModal(false);
        setEditId(0);
        setNewUser(Usuario);
    };

    useEffect(() => {
        handleUpdate();
    }, [page]);

    return (
        <div className="layout">
            <div className="app-container">
                <Header
                    nomePesquisa={"Usuarios"}
                    handleNew={() => { setEditId(null); setshowModal(true); }}
                    nomeBotao={"Novo Usuário"}
                />
                <main className="content-area">
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