import { useNavigate, Outlet, useLocation } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();    
    const isCurrentPath = (path) => {
        if (location.pathname == path) return true;
        return false;
    }

    return (
        <>
            <nav>
            <div className="sidebar">
                <div className="sidebar-header">IntegroSys</div>    
                <ul className="sidebar-menu">
                    <li onClick={() => navigate("/")} className={isCurrentPath("/") ? "active" : ""}>
                        Home
                    </li>

                    <li onClick={() => navigate("/usuarios")} className={isCurrentPath("/usuarios") ? "active" : ""}> 
                        Usuarios
                    </li>

                    <li onClick={() => navigate("/marca")} className={isCurrentPath("/marca") ? "active" : ""}>
                        Marca
                    </li>

                    <li onClick={() => navigate("/fornecedores")} className={isCurrentPath("/fornecedores") ? "active" : ""}>
                        Fornecedores
                    </li>

                    <li onClick={() => navigate("/produtos")} className={isCurrentPath("/produtos") ? "active" : ""}>
                        Produtos
                    </li>
                    
                    <li onClick={() => navigate("/clientes")} className={isCurrentPath("/clientes") ? "active" : ""}>
                        Clientes
                    </li>

                    <li onClick={() => navigate("/vendedores")} className={isCurrentPath("/vendedores") ? "active" : ""}> 
                        Vendedores
                    </li>

                    <li onClick={() => navigate("/pedidos/saida")} className={isCurrentPath("/pedidos/saida") ? "active" : ""}>
                        Pedidos de Saída
                    </li>
                    
                    <li onClick={() => navigate("/pedidos/entrada")} className={isCurrentPath("/pedidos/entrada") ? "active" : ""}>
                        Pedidos de Entrada
                    </li>
                    
                    <li onClick={() => navigate("/logout")}>Sair</li>
                </ul>
            </div>
            </nav>
            <Outlet />
        </>
    );
}