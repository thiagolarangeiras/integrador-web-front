export default function Cards({ items }) {
	return (
		<div className="stats-cards">
			{items.map(item => (
				<div className="stat-card">
					<span className="stat-value">{item.value}</span>
					<span className="stat-label">{item.label}</span>
				</div>
			))}
		</div>
	);
}