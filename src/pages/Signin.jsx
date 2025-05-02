import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { postLogin } from '../requests';

export default function In() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({
        username: "",
        password: ""
    });
    
    function handleLogin(e) {
        e.preventDefault();
        postLogin(usuario).then((value)=> {
            if (value.token) navigate("/");
        });
    };

    return (
        <div className='container'>
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <input
                    name="usuario"
                    type="text"
                    placeholder="Nome de usuario"
                    value={usuario.username}
                    onChange={(e) => setUsuario({ ...usuario, username: e.target.value })}
                />
                <input
                    name="senha"
                    type="password"
                    placeholder="Senha"
                    value={usuario.password}
                    onChange={(e) => setUsuario({ ...usuario, password: e.target.value })}
                />
                <div className="buttons">
                    <button type="submit">Entrar</button>
                    <button type="button" className="forgot-btn">
                        Esquecí minha senha
                    </button>
                </div>
            </form>
        </div>
    );
}