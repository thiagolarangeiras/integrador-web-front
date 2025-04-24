import './style.css';

function In() {
  return (
    <div className='container'>
      <form>
        <h1>Login</h1>
        <input 
          name="usuario" 
          type="text" 
          placeholder="Nome de usuario"  // Removido o acento de "usuário"
        />
        <input 
          name="senha" 
          type="password" 
          placeholder="Senha" 
        />
        <div className="buttons">
          <button type="submit">Entrar</button>
          <button type="button" className="forgot-btn">
            Esquecí minha senha  // Acentuação corrigida para "Esquecí"
          </button>
        </div>
      </form>
    </div>
  );
}

export default In;