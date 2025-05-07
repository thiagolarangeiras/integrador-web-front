import { useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function PedidosSaida() {
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      cliente: 'Info Store',
      numeroPedido: 'PS-001',
      data: '2025-01-07',
      status: 'concluído',
      total: '4.400,00'
    },
    {
      id: 2,
      cliente: 'DigitalMania',
      numeroPedido: 'PS-002',
      data: '2025-03-07',
      status: 'concluido',
      total: '540,00'
    },
    {
      id: 3,
      cliente: 'Eletronix LTDA',
      numeroPedido: 'PS-003',
      data: '2025-01-12',
      status: 'aberto',
      total: '1.200,00'
    }
  ]);

  const [filters, setFilters] = useState({
    cliente: 'Todos',
    status: 'Todos'
  });

  const filteredPedidos = pedidos.filter(p => {
    const clienteMatch = filters.cliente === 'Todos' || p.cliente === filters.cliente;
    const statusMatch = filters.status === 'Todos' || p.status === filters.status;
    return clienteMatch && statusMatch;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const exportToExcel = () => {
    const data = [
      ['Cliente', 'Número Pedido', 'Data', 'Status', 'Total'],
      ...filteredPedidos.map(p => [p.cliente, p.numeroPedido, p.data, p.status, `R$ ${p.total}`])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos de Saída');
    XLSX.writeFile(workbook, 'pedidos_saida.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório - Pedidos de Saída', 105, 15, { align: 'center' });

    autoTable(doc, {
      head: [['Cliente', 'Número Pedido', 'Data', 'Status', 'Total']],
      body: filteredPedidos.map(p => [p.cliente, p.numeroPedido, p.data, p.status, `R$ ${p.total}`]),
      startY: 25,
      margin: { left: 10, right: 10 }
    });

    doc.save(`pedidos_saida_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const uniqueClientes = ['Todos', ...new Set(pedidos.map(p => p.cliente))];
  const totalPedidos = pedidos.length;
  const abertos = pedidos.filter(p => p.status === 'aberto').length;
  const concluidos = pedidos.filter(p => p.status === 'concluido').length;

  return (
    <div className="layout-container">
      <main className="app-container">
        <header className="app-header">
          <h1>Pedidos de Saída</h1>
          <button className="btn primary">+ Novo Pedido</button>
        </header>

        <div className="filters-section">
          <div className="filter-group">
            <label>Cliente</label>
            <select name="cliente" value={filters.cliente} onChange={handleFilterChange}>
              {uniqueClientes.map(c => <option key={c}>{c}</option>)}
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
              <th>Cliente</th>
              <th>Número Pedido</th>
              <th>Data</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map(p => (
              <tr key={p.id}>
                <td>{p.cliente}</td>
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

export default PedidosSaida;
