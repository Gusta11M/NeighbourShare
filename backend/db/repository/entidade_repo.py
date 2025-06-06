from fastapi import HTTPException
from sqlalchemy.orm import Session
from db.models import EntidadeExterna
from schemas.entidade_schema import EntidadeSchema, EntidadeUpdateSchema
from sqlalchemy.exc import SQLAlchemyError

#Inserção de uma entidade externa na base de dados
async def inserir_entidade_db(db: Session, entidade: EntidadeSchema):
    try:
        nova_entidade = EntidadeExterna(
            Especialidade=entidade.Especialidade,
            Nome=entidade.Nome,
            Email=str(entidade.Email),
            Contacto=entidade.Contacto,
            Nif=entidade.Nif)
        db.add(nova_entidade)
        db.commit()
        db.refresh(nova_entidade)
        return nova_entidade
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

#Visualização de todas as entidades externas registadas na base de dados
async def visualizar_entidades_db(db: Session):
    try:
        entidades = db.query(EntidadeExterna).all()
        return entidades
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

#Eliminação de uma entidade externa na base de dados
async def remover_entidade_db(entidade_id: int,db: Session):
    try:
        db.query(EntidadeExterna).filter(EntidadeExterna.EntidadeID == entidade_id).delete()
        db.commit()
        return True, {'Entidade removida com sucesso.'}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

#Update a uma entidade externa na base de dados
async def update_entidade_db(entidade: EntidadeUpdateSchema, db: Session):
    try:
        db.query(EntidadeExterna).filter(EntidadeExterna.EntidadeID == entidade.EntidadeID).update(
            {EntidadeExterna.Especialidade: entidade.Especialidade,
             EntidadeExterna.Nome: entidade.Nome,
             EntidadeExterna.Email: str(entidade.Email),
             EntidadeExterna.Contacto: entidade.Contacto,
             EntidadeExterna.Nif: entidade.Nif})
        db.commit()
        return True, {'Entidade atualizada com sucesso.'}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

#Verifica se a entidade existe
async def existe_entidade_db(entidade_id: int, db: Session) -> bool:
    try:
        entidade = db.query(EntidadeExterna).filter(EntidadeExterna.EntidadeID == entidade_id).first()
        return entidade
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

#Metedo APENAS para teste (não usar)
async def inserir_entidade_testes(db: Session, entidade: EntidadeExterna):
    try:
        db.add(entidade)
        db.commit()
        db.refresh(entidade)
        return entidade
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))