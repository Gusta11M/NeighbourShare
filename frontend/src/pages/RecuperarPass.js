import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from '../components/Input.jsx';

function RecuperarPass() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const search = location.search;
    if (search.startsWith('?')) {
      const tokenFromUrl = search.substring(1); // remove o '?'
      setToken(tokenFromUrl);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/api/password/reset?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Senha alterada com sucesso!');
        setPassword("");
      } else {
        setError(data.detail);
        toast.error('Erro ao alterar senha.');
      }
    } catch (error) {
      setError("Erro");
      toast.error('Erro ao alterar senha.');
    }
  };

  return (
    <div className="container-recuperar-pass">
      <h1>Recuperar Senha</h1>
      <form className="form-recuperar-pass" onSubmit={handleSubmit}>
        <div className="container-center">
          <Input name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nova Senha" type="password" variant="default"/>

          <div className="container-btn">
            <button className="btn" type="submit">
              Alterar Senha
            </button>
          </div>
          <p className="erro">{error && error}</p>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default RecuperarPass;
