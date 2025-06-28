//import MyIcon from "./assets/icons/my-icon.png"; 

export default function Header({ nomeBotao, nomePesquisa, handleNew }) {
	const placeHolder = `Pesquisar ${nomePesquisa}...`;
	return (
		<header className="app-header">
			<div className="header-content">
				<div className="logo-container">
					<img src="/logo1.png" alt="logo" width={32} height={32} />
					{/* <div className="logo-icon">🛍️</div> */}
					<h1>IntegroSys <span>ERP</span></h1>
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

export function HeaderForm({ nome, botaoNome, botaoAcao, pdfBotao, pdfDownload }) {
	return (
		<header className="app-header">
			<div className="header-content">
				<div className="logo-container">
					<img src="/logo1.png" alt="logo" width={32} height={32} />
					{/* <div className="logo-icon">🛍️</div> */}
					<h1>IntegroSys <span>ERP</span></h1>
				</div>
				<div className="logo-container">
					<h1>{nome}</h1>
				</div>
				{pdfBotao && (
					<div className="header-actions">
					<button className="btn primary new-product-btn" onClick={pdfDownload}>
						Baixar Pdf
					</button>
					</div>
				)}
				<div className="header-actions">
					<button className="btn primary new-product-btn" onClick={botaoAcao}>
						{botaoNome}
					</button>
				</div>
			</div>
		</header>
	);
}