import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Redirec, Auth, Logout } from "./components/Tools.jsx";

import Sidebar from "./components/Sidebar.jsx";

import Login from "./pages/Signin.jsx";
import SignUp_Up from "./pages/Signup.jsx";
import Clientes from "./pages/Clientes.jsx";
import Fornecedores from "./pages/Fornecedores.jsx";
import Marca from "./pages/Marca.jsx";
import PedidosEntrada from "./pages/PedidosEntrada.jsx";
import PedidosSaida from "./pages/PedidosSaida.jsx";
import PedidosSaidaNovo from "./pages/PedidosSaidaNovo.jsx";
import Produtos from "./pages/Produtos.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import Vendedores from "./pages/Vendedores.jsx";

import "./styles.css"

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
        //path: "/",
        element: <Auth> <Sidebar /> </Auth>,
        children: [
            {
                path: "/",
                element: <Usuarios />,
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
                path: "/pedidos/saida/:id",
                element: <PedidosSaidaNovo />,
            },
            {
                path: "/pedidos/saida/novo",
                element: <PedidosSaidaNovo />,
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