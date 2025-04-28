import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider, useNavigate, Outlet, useLocation } from 'react-router-dom'

import { getTesteLogin, logout } from './requests.js'

import List from './example/List.jsx'
import Teste from './example/Teste.jsx'

import Login from './pages/SignUp_In/In/in.jsx'
import SignUp_Up from './pages/SignUp_In/Up/Up.jsx'

import Home from './pages/Home/home.jsx'
import Clientes from "./pages/Clientes/Clientes.jsx"
import Fornecedores from "./pages/Fornecedores/Fornecedores.jsx"
import Marca from "./pages/Marca.jsx"
import PedidosEntrada from "./pages/PedidosEntrada/PedidosEntrada.jsx"
import PedidosSaida from "./pages/PedidosSaida.jsx"
import Produtos from "./pages/Produtos.jsx"
import Usuarios from './pages/Usuarios/Usuarios.jsx'
import Vendedores from './pages/Vendedores.jsx'

function Auth({ children }) {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
        getTesteLogin().then((value) => {
            setAuth(value);
            if (!value) {
                logout()
                navigate("/login");
            }
        })
    }, []);

    // useEffect(() => {
    //     if (!auth) navigate("/login");
    // }, [auth]);

    if (auth) return children;
    return <></>;
}

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate("/login");
    }, []);
    return <></>;
}

function Redirec() {
    return <Navigate to="/" />;
}

function SideBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [ loc, setLoc ] = useState("");
    
    const isCurrentPath = (path) => {
        console.log(path)
        if (location == path) return true;
        return false;
    }

    return (
        <>
            <nav>
            <div className="sidebar">
                <div className="sidebar-header">Side Bar Official</div>    
                <ul className="sidebar-menu">
                    <li 
                        onClick={() => navigate("/")} 
                        className={isCurrentPath("/") ? "active" : "inactive"}
                    >Home</li>
                    
                    <li 
                        onClick={() => navigate("/clientes")}
                        className={isCurrentPath("/clientes") ? "active" : "inactive"}
                    >Clientes</li>
                    
                    <li 
                        onClick={() => navigate("/fornecedores")}
                        className={isCurrentPath("/fornecedores") ? "active" : "inactive"}
                    >Fornecedores</li>
                    
                    <li 
                        onClick={() => navigate("/marca")}
                        className={isCurrentPath ? "active" : "inactive"}
                    >Marca</li>
                    
                    <li 
                        onClick={() => navigate("/pedidos/entrada")}
                        className={isCurrentPath ? "active" : "inactive"}
                    >Pedidos de Entrada</li>
                    
                    <li 
                        onClick={() => navigate("/pedidos/saida")}
                        className={isCurrentPath ? "active" : "inactive"}
                    >Pedidos de Saída</li>
                    
                    <li 
                        onClick={() => navigate("/produtos")}
                        className={isCurrentPath ? "active" : "inactive"}
                    >Produtos</li>
                    
                    <li 
                        onClick={() => navigate("/usuarios")}
                        className={isCurrentPath ? "active" : "inactive"}
                    >Usuarios</li>
                    
                    <li 
                        onClick={() => navigate("/vendedores")}
                        className={isCurrentPath ? "active" : "inactive"}
                    >Vendedores</li>                    
                    
                    <li 
                        onClick={() => navigate("/logout")}
                        className={isCurrentPath ? "active" : "inactive"}
                    >Sair</li>
                </ul>
            </div>
            </nav>
            <Outlet />
        </>
    );
}

const router = createBrowserRouter([
    {
        path: "/*",
        element: <Redirec />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/logout",
        element: <Logout />
    },
    {
        path: "/signin",
        element: <SignUp_Up />
    },
    {
        path: "/example/list",
        element: <List />
    },
    {
        path: "/example/teste",
        element: <Teste />
    },
    {
        //path: "/",
        element: <SideBar />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/clientes",
                element: <Clientes />,
            },
            {
                path: "/fornecedores",
                element: <Fornecedores />,
            },
            {
                path: "/marca",
                element: <Marca />,
            },
            {
                path: "/pedidos/entrada",
                element: <PedidosEntrada />,
            },
            {
                path: "/pedidos/saida",
                element: <PedidosSaida />,
            },
            {
                path: "/produtos",
                element: <Produtos />,
            },
            {
                path: "/usuarios",
                element: <Usuarios />,
            },
            {
                path: "/vendedores",
                element: <Vendedores />,
            },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode >
)