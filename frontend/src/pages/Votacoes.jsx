import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import ToastManager from '../components/ToastManager.jsx';
import Navbar2 from "../components/Navbar2.jsx";
import Tabela from "../components/Tabela";
import ModalForm from "../components/ModalForm.jsx";
import Button from "../components/Button.jsx";
import 'react-toastify/dist/ReactToastify.css';

const Votacoes = () => {
  const [votacoes, setVotacoes] = useState({
    lista_votacao_pedido_manutencao: [],
    lista_votacao_pedido_novo_recurso_binarias: [],
    lista_votacao_pedido_novo_recurso_multiplas: []
  });

  const [orcamentos, setOrcamentos] = useState([]);
  const [votacaoAtual, setVotacaoAtual] = useState(null);
  const [votoSelecionado, setVotoSelecionado] = useState('');
  const [modalAberto, setModalAberto] = useState('');

  // Obter as votações ao carregar o componente
  useEffect(() => {
    const fetchVotacoes = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/listar_votacaos', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        setVotacoes(data);
      } catch (error) {
        console.error('Erro ao buscar votações:', error);
      }
    };
    fetchVotacoes();
  }, []);

  const abrirModal = async (votacao, tipo) => {
    setVotacaoAtual(votacao);
    setModalAberto(tipo);
    setVotoSelecionado('');
    let endpoint = null;
    if (tipo === 'manutencao') {
      endpoint = `http://localhost:8000/api/votacao_orcamento_pm?id_v=${votacao.votacao_id}`;
    } else if (tipo === 'switch') {
      endpoint = `http://localhost:8000/api/votacao_orcamento_pedido_novo_recurso?votacao_id=${votacao.votacao_id}`;
    }

    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include'
        });
        
        const data = await res.json();
        setOrcamentos(data);
      } catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
      }
    }
  };

  const submeterVoto = async () => {
    try {

      const res = await fetch('http://localhost:8000/api/votar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          voto : String(votoSelecionado),
          id_votacao: votacaoAtual.votacao_id,
        })
      });

      if (!res.ok) throw new Error('Erro ao registrar voto.');

      ToastManager.success('Voto registrado com sucesso!');
      setModalAberto('');
      setVotacaoAtual(null);
      setVotoSelecionado('');
      votacaoAtual.ja_votou = true;
      setVotacoes((prevState) => ({
        ...prevState,
        lista_votacao_pedido_novo_recurso_binarias: prevState.lista_votacao_pedido_novo_recurso_binarias.map((item) =>
          item.votacao_id === votacaoAtual.votacao_id ? { ...item, ja_votou: true } : item
        ),
        lista_votacao_pedido_novo_recurso_multiplas: prevState.lista_votacao_pedido_novo_recurso_multiplas.map((item) =>
          item.votacao_id === votacaoAtual.votacao_id ? { ...item, ja_votou: true } : item
        ),
        lista_votacao_pedido_manutencao: prevState.lista_votacao_pedido_manutencao.map((item) =>
          item.votacao_id === votacaoAtual.votacao_id ? { ...item, ja_votou: true } : item
        )
      }));
    } catch (error) {
      console.error('Erro ao registrar voto:', error);
      ToastManager.error('Erro ao registrar voto.');
    }
  };

  const renderTabela = (titulo, lista, tipo) => {
    const colunas = [
      { accessorKey: 'Titulo', header: 'Título' },
      { accessorKey: 'Descricao', header: 'Descrição' },
      { accessorKey: 'DataInicio', header: 'Data de Início' },
      { accessorKey: 'DataFim', header: 'Data de Fim' },
      { 
        accessorKey: 'Acao',
        header: 'Ação',
        cell: ({ row }) => (
        row.original.ja_votou ? (
          <span>Já votou!</span>
        ) : (
          <Button
            variant="default"
            onClick={() => {
              abrirModal(row.original, tipo)
            }}>
            Votar
          </Button>
        )
      )
      }
    ];
    const dados = lista.map((item) => ({
      Titulo: item.titulo,
      Descricao: item.descricao,
      DataInicio: new Date(item.data_inicio).toLocaleDateString(),
      DataFim: new Date(item.data_fim).toLocaleDateString(),
      votacao_id: item.votacao_id,
      ja_votou: item.ja_votou,  
      Acao: ''
    }));
    return (
        <Tabela
          titulo={titulo}
          colunas={colunas}
          dados={dados}
        />
    );
  };

  const renderModal = () => {
    if (!votacaoAtual) return null;

    const isBinario = modalAberto === 'binario';

    const options = isBinario
      ? [
          { value: 'sim', label: 'Sim' },
          { value: 'nao', label: 'Não' }
        ]
      : orcamentos.map((orc) => ({
          value: orc.OrcamentoID,
          label: orc.OrcamentoID + ' - ' + orc.DescOrcamento,
          url: `http://localhost:8000/${orc.NomePDF.replace(/\\/g, '/')}`
        }));

    const fields = [
      {
        name: 'voto',
        label: isBinario ? 'Selecione o seu voto' : 'Selecione um orçamento',
        type: 'select',
        required: true,
        options: options,
        placeholder: 'Escolha uma opção',
        variant: 'geral'
      }
    ];

    const formData = { voto: votoSelecionado };

    const handleChange = (e) => {
      setVotoSelecionado(e.target.value);
    };

    return (
    <ModalForm
      show={modalAberto !== ''}
      onclose={() => {
        setModalAberto('');
        setVotacaoAtual(null);
        setVotoSelecionado('');
      }}
      title={`Votação: ${votacaoAtual.Titulo}`}
      textBotao="Votar"
      fields={fields}
      formData={formData}
      onChange={handleChange}
      onSubmit={(e) => {
        e.preventDefault();
        submeterVoto();
      }}
    />
  );
  };

  return (
    <>
      <Navbar2 />
      <div className="home-container">
        {renderTabela('Votações Pedidos Manutenção', votacoes.lista_votacao_pedido_manutencao, 'manutencao')}
        {renderTabela('Votações Novos Recursos (Sim/Não)', votacoes.lista_votacao_pedido_novo_recurso_binarias, 'binario')}
        {renderTabela('Votações Novos Recursos (Múltipla Escolha)', votacoes.lista_votacao_pedido_novo_recurso_multiplas, 'switch')}
        {renderModal()}
      </div>
      <Toaster />
    </>
  );
};

export default Votacoes;
