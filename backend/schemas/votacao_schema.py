from pydantic import BaseModel, constr, conint, EmailStr
from datetime import date
from enum import Enum
from typing import List

class TipoVotacao(str, Enum):
    AQUISICAO = "Aquisição"
    MANUTENCAO = "Manutenção"

class TipoVotacaoPedidoNovoRecurso(int,Enum):
    BINARIA = 0
    MULTIPLA = 1

class Criar_Votacao(BaseModel):
    titulo: constr(min_length=2, max_length=100)
    descricao: constr(min_length=2, max_length=500)
    id_processo: conint(gt=0)
    data_fim: date
    tipo_votacao: TipoVotacao

    class Config:
        str_strip_whitespace = True

class Votar(BaseModel):
    voto:constr(min_length=1, max_length=50)
    id_votacao:conint(gt=0)

    class Config:
        str_strip_whitespace = True

class Votar_id(BaseModel):
    voto:constr(min_length=1, max_length=50)
    id_votacao:conint(gt=0)
    id_user:conint(gt=0)

    class Config:
        str_strip_whitespace = True

class Consulta_Votacao(BaseModel):
    id_votacao: conint(gt=0)
    id_user: conint(gt=0)

class Votacao_Return(BaseModel):
    id_votacao: conint(gt=0)
    data_inicio: date
    data_fim: date
    processada: bool

    class Config:
        str_strip_whitespace = True

class VotacaoGet(BaseModel):
    votacao_id : conint(gt=0)
    titulo: constr(min_length=2, max_length=100)
    descricao: constr(min_length=2, max_length=500)
    data_inicio: date
    data_fim: date
    pedido_recurso: conint(gt=0)
    ja_votou: bool

    class Config:
        str_strip_whitespace = True

class ObtemTodasVotacoes(BaseModel):
    lista_votacao_pedido_novo_recurso_binarias: List[VotacaoGet]
    lista_votacao_pedido_novo_recurso_multiplas : List[VotacaoGet]
    lista_votacao_pedido_manutencao : List[VotacaoGet]