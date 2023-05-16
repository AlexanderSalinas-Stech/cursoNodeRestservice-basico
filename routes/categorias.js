import {Router} from 'express';
import { check } from "express-validator";
import { 
    validarCampos, 
    validarJWT,
    esAdminRol 
} from '../middlewares/index.js';
import { crearCategoria, obtenerCategorias,obtenerCategoria,actualizarCategoria,BorrarCategoria } from '../controllers/categoria.js';
import { existeCategoriaId } from '../helpers/db-validators.js';


export const routerCategorias = Router();

// get Obtener todas las Categorias -publico
routerCategorias.get('/',obtenerCategorias);

// get Obtener una categoria por id -publico
routerCategorias.get('/:id',[
    check('id').custom(existeCategoriaId),
    validarCampos,    
],obtenerCategoria);

// post crear categoria cualquiera con token valido - privado
routerCategorias.post('/',[
    validarJWT,
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    validarCampos,
],crearCategoria);


// put actualizar cualquier categoria con token valido- privado
routerCategorias.put('/:id',[
    validarJWT,
    check('id').custom(existeCategoriaId),
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    validarCampos,
],actualizarCategoria);

// delete borrar cualquier categoria con token valido- Admin
routerCategorias.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id').custom(existeCategoriaId),
    validarCampos
],BorrarCategoria);