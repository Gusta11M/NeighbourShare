# NeighbourShare

NeighbourShare é uma aplicação web colaborativa desenvolvida no âmbito das unidades curriculares de Projeto de Desenvolvimento de Software e Programação Web. O projeto visa fomentar a partilha de recursos entre vizinhos, promovendo a cooperação e fortalecendo os laços comunitários, bem como a gestão de recusos comuns ao condomínio, possbilitando a submissão de pedidos de aquisição de novos recursos bem como de manutenção de existentes.

## Visão Geral

A aplicação permite que os utilizadores:

- Publiquem itens que estão dispostos a emprestar com os seus vizinhos.

- Solicitem recursos disponíveis na sua vizinhança.

- Submetam pedidos de aquisição e manutenção de recursos comuns

- Participem nas votações de decisões de condomínio quanto aos recursos

## Tecnologias Utilizadas

- **Frontend**: React

- **Backend**: FastAPI

- **Base de Dados**: SQL Server

- **Contêinerização**: Docker e Docker Compose

- **Outras Ferramentas**: GitHub Actions para integração contínua

## Instalação e Execução

### Pré-requisitos

- Docker instalado na máquina local

### Passos para execução

1. Clone o repositório:

```bash
git clone https://github.com/Gusta11M/NeighbourShare.git
cd NeighbourShare
```

2. Inicie os containers com Docker Compose:

 ```bash
docker-compose up --build
```

3. Acesse a aplicação no navegadr em [http://localhost:80](http://localhost:80)

## Estrutura do Projeto

```bash
NeighbourShare/
├── backend/          # Código do servidor e API
├── frontend/         # Interface do utilizador
├── database/         # Scripts de inicialização da base de dados
├── docs/             # Documentação do projeto
├── .github/          # Workflows de CI/CD
├── docker-compose.yml
└── README.md
```
## Funcionalidades Principais

- **Autenticação de Utilizadores**: Registo e login seguros
- **Gestão de Recursos**: Publicação, edição e remoção de itens disponíveis para partilha.
- **Sistema de Requisições**: Solicitação de itens e gestão de pedidos.
- **Sistema de Votações**: Criação de votações e participação nas mesmas, existindo votações de sim/não e votações orçamentais
- **Sistema de Pedidos**: Solicitação de novos recursos comuns e de manutenção em recursos existentes
