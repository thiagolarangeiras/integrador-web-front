import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function exportToCSV(nome, colunas, items) {
	const headers = colunas.map(coluna => coluna.label)
	const data = items.map(item => 
		colunas.map(coluna => {
			let keys = coluna.value.split(".")
			if (keys.length > 1) {
				let result = item;
				for (const key of keys) {
					result = result[key];
				}
				return result;
			}
			return item[coluna.value];
		})
	);
	
	const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.setAttribute('href', url);
	link.setAttribute('download', `${nome}.csv`);
	link.style.visibility = 'hidden';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

function exportToExcel(nome, colunas, items) {
	const headers = colunas.map(coluna => coluna.label)
	const data = items.map(item => 
		colunas.map(coluna => {
			let keys = coluna.value.split(".")
			if (keys.length > 1) {
				let result = item;
				for (const key of keys) {
					result = result[key];
				}
				return result;
			}
			return item[coluna.value];
		})
	);
	const worksheetData = [
		headers,
		...data
	];
	const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, nome);
	XLSX.writeFile(workbook, `${nome}.xlsx`);
};

function exportToPDF(nome, colunas, items) {
	const headers = colunas.map(coluna => coluna.label)
	const data = items.map(item => 
		colunas.map(coluna => {
			let keys = coluna.value.split(".")
			if (keys.length > 1) {
				let result = item;
				for (const key of keys) {
					result = result[key];
				}
				return result;
			}
			return item[coluna.value];
		})
	);
	try {
		const doc = new jsPDF({ orientation: 'portrait', unit: 'mm' });
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(16);
		doc.text(`Relatório de ${nome}`, 105, 15, { align: 'center' });

		// const safeClientes = filteredClientes.map(c => ({
		// 	nome: String(c.nome || '-'),
		// 	tipo: c.tipo === 'pessoaFisica' ? 'Pessoa Física' : 'Pessoa Jurídica',
		// 	documento: String(c.documento || '-'),
		// 	telefone: String(c.telefone || '-'),
		// 	email: String(c.email || '-'),
		// 	endereco: `${c.endereco.rua || ''}, ${c.endereco.numero || ''} - ${c.endereco.bairro || ''}, ${c.endereco.cidade || ''}/${c.endereco.estado || ''}`,
		// 	status: c.status === 'active' ? 'Ativo' : 'Inativo'
		// }));
		
		doc.autoTable({
			head: [headers],
			body: data,
			startY: 25,
			margin: { left: 10, right: 10 },
			styles: {
				fontSize: 9,
				cellPadding: 3,
				overflow: 'linebreak'
			},
			columnStyles: {
				5: { cellWidth: 'auto' }
			}
		});

		const fileName = `${nome}${new Date().toISOString().slice(0, 10)}.pdf`;
		doc.save(fileName);
	} catch (error) {
		console.error('Erro ao gerar PDF:', error);
		alert(`Falha na exportação para PDF:\n${error.message}`);
	}
};


export default function Table({ nome, colunas, items, handleEdit, handleDelete, handleUpdate}) {
	return (
		<div className="product-table-container">
			<div className="table-header">
				<h2>Lista de {nome}</h2>
				<div className="table-actions">
					<button className="btn export-btn" onClick={()=> exportToCSV(nome, colunas, items)}>📄 Exportar CSV</button>
					<button className="btn export-btn" onClick={()=> exportToExcel(nome, colunas, items)}>📊 Exportar Excel</button>
					<button className="btn export-btn" onClick={()=> exportToPDF(nome, colunas, items)}>📑 Exportar PDF</button>
					<button className="btn refresh-btn" onClick={handleUpdate}>🔄 Atualizar</button>
				</div>
			</div>

			<table className="product-table">
				<thead>
					<tr>
						{colunas.map(coluna => (
							<th>{coluna.label}</th>
						))}
						<th>STATUS</th>
						<th>AÇÕES</th>
					</tr>
				</thead>
				<tbody>
					{items.map(item => (
						<tr key={item.id}>
							{colunas.map(coluna => {
								let keys = coluna.value.split(".")
								if (keys.length > 1) {
									let result = item;
									for (const key of keys) {
										result = result[key];
									}
									return (<td>{result}</td>)
								}
								return (<td>{item[coluna.value]}</td>)

							})}
							{/* <td>{item.id}</td>
							<td className="product-cell">
								<span className="product-name">{item.nome}</span>
								<span className="product-desc">{ }</span>
							</td> */}
							<td><span className={`status-badge ${item.status}`}>{item.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
							<td className="action-buttons">
								<button className="btn action-btn edit-btn" onClick={() => handleEdit(item)}>✏️</button>
								<button className="btn action-btn delete-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="table-footer">
				<span className="showing-text">👁️ Mostrando {items.length} de {items.length} {nome}</span>
			</div>
		</div>
	);
}



export function TableSearch({ items, handleSelect }) {
	return (
		<table className="product-table">
			<thead>
				<tr>
					<th>Codigo</th>
					<th>Nome</th>
					<th>AÇÕES</th>
				</tr>
			</thead>
			<tbody>
				{items.map(item => (
					<tr key={item.id}>
						<td>{item.id}</td>
						<td>{item.nome}</td>
						<td className="action-buttons">
							<button className="btn action-btn edit-btn" onClick={() => handleSelect(item)}>✅</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}