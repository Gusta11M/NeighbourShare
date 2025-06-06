from dotenv import load_dotenv
from db.session import get_db
from pathlib import Path
import db.repository.recurso_repo as recurso_repo
from db.repository.recurso_repo import existe_recurso, update_recurso_db
from sqlalchemy.orm import Session
import db.session as session
from fastapi import HTTPException, UploadFile
from schemas.recurso_schema import *
import os
import dotenv
from tempfile import SpooledTemporaryFile

async def get_disponibilidade_id_service(db:session, disponibilidade:str):
    try:
        disponibilidade_id = recurso_repo.get_disponibilidade_id_db(disponibilidade,db)
        return disponibilidade_id
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_categoria_id_service(db:session, categoria:str):
    try:
        categoria_id = recurso_repo.get_categoria_id_db(categoria,db)
        return categoria_id
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def inserir_recurso_service(db:session, novo_recurso, imagem_recurso:UploadFile):
    try:
        recurso_id, mensagem = await recurso_repo.inserir_recurso_db(db, novo_recurso)
        if recurso_id :
            return await guardar_imagem_recurso(imagem_recurso, recurso_id, db)
        else:
            return False, "Erro ao guardar a imagem referente ao recurso"
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def guardar_imagem_recurso(imagem_recurso:UploadFile, recurso_id:int,db:session):
    try:
        tipos_permitidos = ['image/png', 'image/jpeg', 'image/jpg']

        if imagem_recurso.content_type not in tipos_permitidos:
            raise HTTPException (status_code=400, detail="Apenas imagens são permitidas (png, jpeg, jpg)")

        pasta_imagens = os.getenv('UPLOAD_DIR_RECURSO')

        imagem_path = os.path.join(pasta_imagens, str(recurso_id))

        os.makedirs(imagem_path, exist_ok=True)

        caminho_arquivo = os.path.join(imagem_path, imagem_recurso.filename)
        with open(caminho_arquivo,'wb+') as f:
            f.write(imagem_recurso.file.read())

        url_imagens = os.getenv('SAVE_RECRUSO')
        caminho_arquivo_new = os.path.join(url_imagens,str(recurso_id), imagem_recurso.filename)
        clean_path = caminho_arquivo_new.replace("\\", "/")

        if await recurso_repo.update_path(db, recurso_id, clean_path):
            return True, {"message": "Imagem guardada com sucesso"}
        else:
            return False, {"message": "Erro ao guardada imagem"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Lista todos os recursos existentes no sistema
async def lista_recursos_service(db:session):
    try:
        lista_recursos = await recurso_repo.listar_recursos_db(db)

        if not lista_recursos:
            raise HTTPException(status_code=200, detail="Nenhum recurso encontrado")

        lista_recursos_imagens = await lista_imagens_recursos_service(lista_recursos)

        if not lista_recursos_imagens:
            raise HTTPException(status_code=400, detail="Erro no carregameto das imagens dos recursos")

        return lista_recursos_imagens
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Lista as informações relativas a um recurso registado no sistema
async def lista_recurso_service(db:session, recurso_id:int):
    try:
        recurso = await recurso_repo.listar_recurso_db(db, recurso_id)
        if not recurso:
            raise HTTPException(status_code=400, detail="Nenhum recurso encontrado")

        recurso.Image = recurso.Path

        return recurso
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Lista os recursos de um utilizador
async def lista_recursos_utilizador_service(db:session, utilizador_id:int):
    try:
        lista_recursos = await recurso_repo.listar_recursos_utilizador_db(db, utilizador_id)

        if not lista_recursos:
            raise HTTPException(status_code=400, detail="Nenhum recurso encontrado")

        lista_recursos_utilizador = []

        for recurso in lista_recursos:

            recurso_utilizador = RecursoGetUtilizadorSchema(
                RecursoID= recurso.RecursoID,
                Nome=recurso.Nome,
                Descricao=recurso.DescRecurso,
                Caucao=recurso.Caucao,
                Categoria_=recurso.Categoria_,
                Disponibilidade_=recurso.Disponibilidade_,
                Image=recurso.Path
            )

            lista_recursos_utilizador.append(recurso_utilizador)

        return lista_recursos_utilizador
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Obtem as imagens referentes a uma lista de recursos
async def lista_imagens_recursos_service(lista_recursos:list):
    try:
        lista_recursos_imagens = []

        for recurso in lista_recursos:

            caminho_foto_recurso = await carrega_imagem_recurso_service(recurso.RecursoID)

            if not caminho_foto_recurso:
                caminho_foto_recurso = None

            novo_recurso = RecursoGetTodosSchema(
                RecursoID = recurso.RecursoID,
                Nome = recurso.Nome,
                DescRecurso = recurso.DescRecurso,
                Caucao = recurso.Caucao,
                Categoria_ = recurso.Categoria_,
                Utilizador_=recurso.Utilizador_,
                Disponibilidade_ = recurso.Disponibilidade_,
                Image = recurso.Path
            )

            lista_recursos_imagens.append(novo_recurso)

        return lista_recursos_imagens
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def carrega_imagem_recurso_service(recurso_id:int):
    try:
        load_dotenv()

        pasta_path = os.path.join(os.getenv('UPLOAD_DIR_RECURSO'), str(recurso_id))

        if not os.path.exists(pasta_path):
            os.makedirs(pasta_path)

        pasta = Path(pasta_path)

        arquivos = [f for f in pasta.iterdir() if f.is_file()]

        if not arquivos:
            return None

        imagem_path = str(arquivos[0])

        return imagem_path
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def checkar_estado_recurso():
    db:session = get_db()
    try:
        recurso_repo.atualizar_disponibilidade_recurso_db(db)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def update_service(db: session, recurso: UpdateRecursoSchema, imagem: UploadFile):
    try:
        if not await existe_recurso(db, recurso.Id):
            raise HTTPException(status_code=404, detail="Recurso não existe.")

        if await update_recurso_db(db, recurso):
            if imagem is not None:
                return await guardar_imagem_recurso(imagem, recurso.Id, db)
            return True  # Atualização feita, mas sem imagem
        else:
            return False
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def lista_categorias_service(db: session):
    try:
        categorias = await recurso_repo.listar_categorias_db(db)
        if not categorias:
            raise HTTPException(status_code=404, detail="Nenhuma categoria encontrada.")
        return categorias
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def lista_disponibilidades_service(db: session):
    try:
        disponibilidades = await recurso_repo.listar_disponibilidades_db(db)
        if not disponibilidades:
            raise HTTPException(status_code=404, detail="Nenhuma disponibilidade encontrada.")
        return disponibilidades
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))