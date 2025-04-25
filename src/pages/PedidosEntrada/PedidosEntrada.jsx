import { useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './styles.css';

function PedidosEntrada() {
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      fornecedor: 'Tech Supplies',
      numeroPedido: 'PE-001',
      data: '2025-04-01',
      status: 'aberto',
      total: '2.500,00'
    },
    {
      id: 2,
      fornecedor: 'DigitalStore',
      numeroPedido: 'PE-002',
      data: '2025-04-10',
      status: 'concluido',
      total: '980,00'
    },
    {
      id: 3,
      fornecedor: 'Eletronix LTDA',
      numeroPedido: 'PE-003',
      data: '2025-04-12',
      status: 'aberto',
      total: '1.200,00'
    }
  ]);

  const [filters, setFilters] = useState({
    fornecedor: 'Todos',
    status: 'Todos'
  });

  const filteredPedidos = pedidos.filter(p => {
    const fornecedorMatch = filters.fornecedor === 'Todos' || p.fornecedor === filters.fornecedor;
    const statusMatch = filters.status === 'Todos' || p.status === filters.status;
    return fornecedorMatch && statusMatch;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const exportToExcel = () => {
    const data = [
      ['Fornecedor', 'Número Pedido', 'Data', 'Status', 'Total'],
      ...filteredPedidos.map(p => [p.fornecedor, p.numeroPedido, p.data, p.status, `R$ ${p.total}`])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos de Entrada');
    XLSX.writeFile(workbook, 'pedidos_entrada.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório - Pedidos de Entrada', 105, 15, { align: 'center' });

    autoTable(doc, {
      head: [['Fornecedor', 'Número Pedido', 'Data', 'Status', 'Total']],
      body: filteredPedidos.map(p => [p.fornecedor, p.numeroPedido, p.data, p.status, `R$ ${p.total}`]),
      startY: 25,
      margin: { left: 10, right: 10 }
    });

    doc.save(`pedidos_entrada_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const uniqueFornecedores = ['Todos', ...new Set(pedidos.map(p => p.fornecedor))];
  const totalPedidos = pedidos.length;
  const abertos = pedidos.filter(p => p.status === 'aberto').length;
  const concluidos = pedidos.filter(p => p.status === 'concluido').length;

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <h2>ProductFolio</h2>
        <nav>
          <ul>
            <li><a href="/produtos">Dashboard</a></li>
            <li className="active"><a href="/entrada">Entrada</a></li>
            <li><a href="/saida">Saída</a></li>
            <li><a href="/clientes">Clientes</a></li>
            <li><a href="/parcelas">Parcelas</a></li>
            <li><a href="/relatorios">Relatórios</a></li>
          </ul>
        </nav>
      </aside>

      <main className="app-container">
        <header className="app-header">
          <h1>Pedidos de Entrada</h1>
          <button className="btn primary">+ Novo Pedido</button>
        </header>

        <div className="filters-section">
          <div className="filter-group">
            <label>Fornecedor</label>
            <select name="fornecedor" value={filters.fornecedor} onChange={handleFilterChange}>
              {uniqueFornecedores.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option>Todos</option>
              <option>aberto</option>
              <option>concluido</option>
            </select>
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat-card"><span>{totalPedidos}</span><span>Total</span></div>
          <div className="stat-card"><span>{abertos}</span><span>Abertos</span></div>
          <div className="stat-card"><span>{concluidos}</span><span>Concluídos</span></div>
        </div>

        <div className="table-header">
          <h2>Lista de Pedidos</h2>
          <div className="table-actions">
            <button className="btn export-btn" onClick={exportToExcel}>📊 Excel</button>
            <button className="btn export-btn" onClick={exportToPDF}>📄 PDF</button>
          </div>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>Fornecedor</th>
              <th>Número Pedido</th>
              <th>Data</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map(p => (
              <tr key={p.id}>
                <td>{p.fornecedor}</td>
                <td>{p.numeroPedido}</td>
                <td>{p.data}</td>
                <td>{p.status}</td>
                <td>R$ {p.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default PedidosEntrada;
