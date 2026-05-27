import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoActrya from "../../assets/actrya-logo.png";
import { register } from "../../services/auth";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    try {
      await register({
        name,
        username,
        email,
        password,
      });

      navigate("/auth/login");
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível criar sua conta. Verifique os dados.");
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
          <h1>Criar conta</h1>
          <p>Comece a organizar seus projetos com o Actrya.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__group">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="auth-form__group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="seuusuario"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

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
              placeholder="Crie uma senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {errorMessage && <p className="auth-form__error">{errorMessage}</p>}

          <button type="submit" className="auth-form__button" disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="auth-card__footer">
          Já tem conta? <Link to="/auth/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;