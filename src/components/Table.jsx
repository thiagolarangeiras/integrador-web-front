export default function Table({ nome, colunas, items, handleEdit, handleDelete, handleUpdate, exportToCSV, exportToExcel, exportToPDF }) {
	return (
		<div className="product-table-container">
			<div className="table-header">
				<h2>Lista de {nome}</h2>
				<div className="table-actions">
					<button className="btn export-btn" onClick={exportToCSV}>📄 Exportar CSV</button>
					<button className="btn export-btn" onClick={exportToExcel}>📊 Exportar Excel</button>
					<button className="btn export-btn" onClick={exportToPDF}>📑 Exportar PDF</button>
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
								if(keys.length > 1){
									let result = item;
									for (const key of keys){
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