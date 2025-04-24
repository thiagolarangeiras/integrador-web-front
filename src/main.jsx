import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import SignUp_Up from './pages/SignUp_In/Up/Up.jsx'
import SignUp_In from './pages/SignUp_In/In/in.jsx'
import Home from './pages/Home/home.jsx'
import Clientes from './pages/Cadastro/Clientes.jsx'
import Fornecedores from './pages/Fornecedores/Fornecedores.jsx'
import Pedidos from './pages/Pedidos/Pedidos.jsx'
import Usuarios from './pages/Usuarios/Usuarios.jsx'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SignUp_In />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp_Up />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="*" element={<Home />} /> {/* Fallback para qualquer rota desconhecida */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
