import './style.css';

function In() {
  return (
    <div className='container'>
      <form>
        <h1>Login</h1>
        <input 
          name="usuario" 
          type="text" 
          placeholder="Nome de usuário" 
        />
        <input 
          name="senha" 
          type="password" 
          placeholder="Senha" 
        />
        <div className="buttons">
          <button type="submit">Entrar</button>
          <button type="button" className="forgot-btn">
            Esqueci minha senha
          </button>
        </div>
      </form>
    </div>
  );
}

export default In;