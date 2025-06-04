export default function Signup() {
    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1>Registro</h1>

                <form>
                    <div className="form-group">
                        <input
                            id="name"
                            type="text"
                            placeholder="Nome completo"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            id="username"
                            type="text"
                            placeholder="Nome de usuário"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            id="password"
                            type="password"
                            placeholder="Crie uma senha"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <select id="role" required>
                                <option value="">Permissão</option>
                                <option value="admin">Administrador</option>
                                <option value="operator">Funcionário</option>
                                <option value="manager">Gerente</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <select id="status" required>
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                            </select>
                        </div>
                    </div>

                    <div className="button-group">
                        <button type="submit" className="save-btn">
                            Save
                        </button>
                        <button type="button" className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}