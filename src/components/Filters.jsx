export default function Filters({ uniqueCategories }) {
	return (
		<div className="filters-section">
			<div className="filter-group">
				<label>Categoria</label>
				<select
					className="filter-select"
					name="category"
					value={""}
					onChange={""}
				>
					{uniqueCategories.map(category => (
						<option key={category} value={category}>{category}</option>
					))}
				</select>
			</div>
			<div className="filter-group">
				<label>Status</label>
				<select
					className="filter-select"
					name="status"
					value={"filters.status"}
					onChange={"handleFilterChange"}
				>
					<option>Todos Status</option>
					<option>Ativo</option>
					<option>Inativo</option>
				</select>
			</div>
			<div className="filter-group">
				<label>Ordenar por</label>
				<select
					className="filter-select"
					name="sort"
					value={"filters.sort"}
					onChange={"handleFilterChange"}
				>
					<option>Nome (A-Z)</option>
					<option>Nome (Z-A)</option>
					<option>Preço (↑)</option>
					<option>Preço (↓)</option>
				</select>
			</div>
		</div>
	);
}