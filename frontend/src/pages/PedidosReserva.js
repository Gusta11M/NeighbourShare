import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/RecursosDisponiveis.css";
import Navbar2 from "../components/Navbar2.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from '../components/Input.jsx';

const ReservarRecurso = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/recursos/${id}`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        console.log(data);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleReserve = async () => {
    const formData = new FormData();
    formData.append('recurso_id', id);
    formData.append('data_inicio', startDate);
    formData.append('data_fim', endDate);

    try {
      const res = await fetch('http://localhost:8000/api/reserva/pedidosreserva/criar', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (res.ok) {
        alert('Reserva realizada com sucesso!');
      } else {
        alert('Erro ao realizar reserva.');
      }
    } catch (error) {
      console.error('Erro ao enviar reserva:', error);
      alert('Erro ao enviar reserva.');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!product) {
    return <div>Erro ao carregar o produto.</div>;
  }

  return (
    <div className="page-content">
      <Navbar2 />
      <div className='home-container'>

        <div>
          <div>
            <div key={product.RecursoID}>
              <img src={product.Image} alt={product.name} />
              <h2>{product.Nome}</h2>
              <h2>{product.Categoria_.DescCategoria}</h2>
              <h2>{product.Caucao}</h2>
            </div>
          </div>

          <div>
        <label>Data Início:<Input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" variant="default"/></label>
        <label>Data Fim:<Input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" variant="default"/></label>
        <button onClick={handleReserve}>Reservar!</button>
      </div>
        </div>
        

      </div>
      <ToastContainer />
    </div>
  );
};

export default ReservarRecurso;
