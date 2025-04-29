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
