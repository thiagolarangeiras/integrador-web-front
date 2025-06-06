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

function AutoModalGroup({ fields }) {
	let i = 0;
	let mainHtml = (<></>);
	while (i < fields.length) {
		const x = fields[i];
		let html;
		if (Array.isArray(x)) {
			console.log("1")
			console.log(x)
			html = (<AutoF fields={x}/>);
			mainHtml = (
				<>
					{mainHtml}
					<div className="form-row">
						{html}
					</div>
				</>
			);
			i++;
			continue;
		}
		if (x.type == "text") {
			mainHtml = (
				<>
					{mainHtml}
					<div className="form-group">
						<label>{x.label}</label>
						<input
							type={x.type}
							name={x.name}
							value={x.value}
							onChange={(e) => x.onChange(e, setItem)}
							maxLength={x.maxLength}
							placeholder={x.placeholder}
							required={x.required}
						/>
					</div>
				</>
			);
		}
		i++;
	}
	return mainHtml;
}

export function CrudAutoModalJson({ item, setItem, fields, handleSubmit, handleModalClose }) {
	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>{item.id ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
				<form onSubmit={handleSubmit}>
					<AutoModalGroup fields={fields} />
					<div className="modal-actions">
						<button type="button" className="btn secondary" onClick={handleModalClose}>Cancelar</button>
						<button type="submit" className="btn primary">{item.id ? 'Atualizar' : 'Adicionar'}</button>
					</div>
				</form>
			</div>
		</div>
	);
}