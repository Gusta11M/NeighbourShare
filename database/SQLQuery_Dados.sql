/*Tipo de processo associado � tabela notifica��es*/

INSERT INTO TipoProcesso (DescTipoProcesso) VALUES ('Aquisi��o');
INSERT INTO TipoProcesso (DescTipoProcesso) VALUES ('Manuten��o');
INSERT INTO TipoProcesso (DescTipoProcesso) VALUES ('Reserva');
INSERT INTO TipoProcesso (DescTipoProcesso) VALUES ('Vota��o');

/*Estado Pedido Novo Recurso*/

INSERT INTO EstadoPedidoNovoRecurso (DescEstadoPedidoNovoRecurso)
VALUES ('Pendente');

INSERT INTO EstadoPedidoNovoRecurso (DescEstadoPedidoNovoRecurso)
VALUES ('Em vota��o');

INSERT INTO EstadoPedidoNovoRecurso (DescEstadoPedidoNovoRecurso)
VALUES ('Rejeitado');

INSERT INTO EstadoPedidoNovoRecurso (DescEstadoPedidoNovoRecurso)
VALUES ('Aprovado para or�amenta��o');

INSERT INTO EstadoPedidoNovoRecurso (DescEstadoPedidoNovoRecurso)
VALUES ('Rejeitado ap�s or�amenta��o');

INSERT INTO EstadoPedidoNovoRecurso (DescEstadoPedidoNovoRecurso)
VALUES ('Aprovado para compra');

INSERT INTO EstadoPedidoNovoRecurso (DescEstadoPedidoNovoRecurso)
VALUES ('Conclu�do');

/*Estado Pedido de Manuten��o de um recurso comum*/

INSERT INTO EstadoPedidoManutencao (DescEstadoPedidoManutencao)
VALUES ('Em an�lise');

INSERT INTO EstadoPedidoManutencao (DescEstadoPedidoManutencao)
VALUES ('Aprovado para execu��o interna');

INSERT INTO EstadoPedidoManutencao (DescEstadoPedidoManutencao)
<<<<<<< HEAD
VALUES ('Em negocia��o com entidades externas');

INSERT INTO EstadoPedidoManutencao (DescEstadoPedidoManutencao)
VALUES ('Em vota��o');
=======
VALUES ('Aprovado para execu��o externa');
>>>>>>> origin/votação

INSERT INTO EstadoPedidoManutencao (DescEstadoPedidoManutencao)
VALUES ('Rejeitado');


<<<<<<< HEAD
/*Estado Manuten��o de um recurso comum*/


INSERT INTO EstadoManutencao (DescEstadoManutencao)
VALUES ('Em progresso');

INSERT INTO EstadoManutencao (DescEstadoManutencao)
VALUES ('Conclu�da');


=======
>>>>>>> origin/votação
/*Tipo Utilizador*/

INSERT INTO TipoUtilizador (DescTU) VALUES ('Residente')
INSERT INTO TipoUtilizador (DescTU) VALUES ('Gestor')

/*Disponibilidade do recurso*/

INSERT INTO Disponibilidade (DescDisponibilidade) VALUES ('Dispon�vel')
INSERT INTO Disponibilidade (DescDisponibilidade) VALUES ('Indispon�vel')

/*Categoria de Recursos*/

INSERT INTO Categoria (DescCategoria) VALUES ('Lazer')
INSERT INTO Categoria (DescCategoria) VALUES ('Tecnologia')
INSERT INTO Categoria (DescCategoria) VALUES ('Ferramentas')
INSERT INTO Categoria (DescCategoria) VALUES ('Cozinha')
INSERT INTO Categoria (DescCategoria) VALUES ('Outros')

/* Estado Pedido Reserva */

INSERT INTO EstadoPedidoReserva (DescEstadoPedidoReserva) VALUES ('Em an�lise')
INSERT INTO EstadoPedidoReserva (DescEstadoPedidoReserva) VALUES ('Aprovado')
INSERT INTO EstadoPedidoReserva (DescEstadoPedidoReserva) VALUES ('Rejeitado')




