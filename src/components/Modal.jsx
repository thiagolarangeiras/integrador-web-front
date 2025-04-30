export default function Modal({ editId, newItem, inputValues, handleSubmit, handleModalClose, handleInputChange }) {
	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>{editId ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
				<form onSubmit={handleSubmit}>
					{inputValues.map(values => (
						<div className="form-group">
							<label>{values.label}</label>
							<input type="text" name={values.name} value={values.value} onChange={handleInputChange} required />
						</div>
					))}
					<div className="modal-actions">
						<button type="button" className="btn secondary" onClick={handleModalClose}>Cancelar</button>
						<button type="submit" className="btn primary">{editId ? 'Atualizar' : 'Adicionar'}</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export function SearchModal() {
	return (
		<table className="product-table">
			<thead>
				<tr>
					<th>Codigo</th>
					<th>Nome</th>
					<th>Ações</th>
				</tr>
			</thead>
			<tbody>
				{items.map(item => (
					<tr key={item.id}>
						{colunas.map(coluna => (
							<td>{item[coluna.value]}</td>
						))}
						{/* {Object.values(item).map((value, key) => (
								
            					<td key={key}>{value}</td>
          					))} */}
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
	);
}