import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoActrya from "../../assets/actrya-logo.png";
import { login, saveAuthToken } from "../../services/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await login({
        email,
        password,
      });

      saveAuthToken(data.idToken);

      navigate("/app");
    } catch (error) {
      console.error(error);
      setErrorMessage("E-mail ou senha inválidos. Verifique e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__logo-wrap">
          <img src={logoActrya} alt="Logo Actrya" className="auth-card__logo" />
        </div>

        <div className="auth-card__header">
          <h1>Entrar no Actrya</h1>
          <p>Organize projetos, tarefas e progresso em um só lugar.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-form__group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {errorMessage && <p className="auth-form__error">{errorMessage}</p>}

          <button type="submit" className="auth-form__button" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-card__footer">
          Ainda não tem conta? <Link to="/auth/register">Criar conta</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;