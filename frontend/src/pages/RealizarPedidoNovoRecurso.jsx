import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar2 from "../components/Navbar2.jsx";
import ToastManager from '../components/ToastManager.jsx';
import Textarea from '../components/Textarea.jsx';
import Button from '../components/Button.jsx';
import "../styles/RealizarPedidoNovoRecurso.css";
import 'react-toastify/dist/ReactToastify.css';

const RealizarPedidoNovoRecurso = () => {
  const [desc_pedido_novo_recurso, setDescricao] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8000/api/recursoscomuns/pedidosnovos/inserir?desc_pedido_novo_recurso=${desc_pedido_novo_recurso}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // importante se usares cookies httpOnly
        body: JSON.stringify({ desc_pedido_novo_recurso }),
      });
      ToastManager.success('Pedido de novo recurso realizado com sucesso!');
      setDescricao('');
    } catch (error) {
      console.error('Erro ao realizar pedido de novo recurso:', error);
      ToastManager.error('Erro ao realizar pedido de novo recurso.');
    }
  };

  return (
    <>
      <Navbar2 />
      <br></br>
      <br></br>
      <div className="home-container">
        <div className='fundoNovosRecursos'>
          <div className='textoEsquerda'>
            <p className='p-NovosRecursos'>Realizar Pedido de Novo Recurso</p>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Descrição:</label><br></br>
                <Textarea value={desc_pedido_novo_recurso} onChange={(e) => setDescricao(e.target.value)} placeholder="Escreve aqui..." rows={6} variant="desc" required/>
              </div>
              <Button className='btnNovoRecurso' type="submit" text={"Realizar Pedido"}>Realizar Pedido</Button>
            </form>
          </div>

          <div className='imagemDireitaManu'>
            <img className='imgNovosRecursosManu' src="./img/fundo2.png" alt="Imagem"/>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default RealizarPedidoNovoRecurso;
