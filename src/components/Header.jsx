export default function Header({ nomeBotao, nomePesquisa, handleNew }) {
	const placeHolder = `Pesquisar ${nomePesquisa}...`;
	return (
		<header className="app-header">
			<div className="header-content">
				<div className="logo-container">
					<div className="logo-icon">🛍️</div>
					<h1>ProductFolio <span>Manager</span></h1>
				</div>
				<div className="header-actions">
					<div className="search-box">
						<input type="text" placeholder={placeHolder} />
						<div className="search-icon">🔍</div>
					</div>
					<button className="btn primary new-product-btn" onClick={handleNew}>
						<span>+</span> {nomeBotao}
					</button>
				</div>
			</div>
		</header>
	);
}