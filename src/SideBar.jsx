import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function SideBar() {
    return (
        <>
            <div className="sidebar">
                <div className="sidebar-header">ProductFolio</div>
                <ul className="sidebar-menu">
                    <li><Link to="/">Dashboard</Link></li>
                    <li><Link to="/produtos">Produtos</Link></li>
                    <li><Link to="/clientes">Clientes</Link></li>
                    <li><Link to="/fornecedores">Fornecedores</Link></li>
                    <li><Link to="/pedidos">Pedidos</Link></li>
                    <li><Link to="/usuarios">Usuários</Link></li>
                </ul>
            </div>
            <Outlet/>
        </>
    );
}