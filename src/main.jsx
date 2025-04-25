import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider, useNavigate, Link, Outlet } from 'react-router-dom'

//import { getTeste } from "./requests.js"

import SignUp_Up from './pages/SignUp_In/Up/Up.jsx'
import SignUp_In from './pages/SignUp_In/In/in.jsx'
import Home from './pages/Home/home.jsx'
import Clientes from './pages/Cadastro/Clientes.jsx'
import Fornecedores from './pages/Fornecedores/Fornecedores.jsx'
import Pedidos from './pages/Pedidos/Pedidos.jsx'
import Usuarios from './pages/Usuarios/Usuarios.jsx'

import './index.css'
import List from './example/List.jsx'
import Teste from './example/Teste.jsx'

function Auth({ children }) {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(true);

    useEffect(() => {
        // getTeste().then((value) => {
        //     setAuth(value);
        // })
    }, []);

    useEffect(() => {
        if (!auth) navigate("/login");
    }, [auth]);

    return children;
}

function Redirec() {
    return <Navigate to="/login" />;
}

function SideBar() {
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

const router = createBrowserRouter([
    {
        path: "/*",
        element: <Redirec />
    },
    {
        path: "/login",
        element: <SignUp_Up />
    },
    {
        path: "/signin",
        element: <SignUp_In />
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
        path: "/",
        element: <SideBar />,
        children: [
            {
                path: "/clientes",
                element: <Clientes />,
            },
            {
                path: "/fornecedores",
                element: <Fornecedores />,
            },
            {
                path: "/pedidos",
                element: <Pedidos />,
            },
            {
                path: "/usuarios",
                element: <Usuarios />,
            },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
  </StrictMode >
)
