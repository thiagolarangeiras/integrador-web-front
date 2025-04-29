export default function Cards({ totalProducts, activeProducts, inactiveProducts, lowStockProducts }) {
	return (
		<div className="stats-cards">
			<div className="stat-card">
				<span className="stat-value">{totalProducts}</span>
				<span className="stat-label">Produtos Totais</span>
			</div>
			<div className="stat-card">
				<span className="stat-value">{activeProducts}</span>
				<span className="stat-label">Ativos</span>
			</div>
			<div className="stat-card">
				<span className="stat-value">{inactiveProducts}</span>
				<span className="stat-label">Inativos</span>
			</div>
			<div className="stat-card">
				<span className="stat-value">{lowStockProducts}</span>
				<span className="stat-label">Estoque Baixo</span>
			</div>
		</div>
	);
}