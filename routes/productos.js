import {Router} from 'express';
import { check } from "express-validator";
import { 
    validarCampos, 
    validarJWT,
    esAdminRol 
} from '../middlewares/index.js';
import { 
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    BorrarProducto 
} from '../controllers/productos.js';
import { existeProductoId, existeCategoriaId } from '../helpers/db-validators.js';


export const routerProductos = Router();

// get Obtener todas las Productos -publico
routerProductos.get('/',obtenerProductos);

// get Obtener una Producto por id -publico
routerProductos.get('/:id',[
    check('id').custom(existeProductoId),
    validarCampos,    
],obtenerProducto);

// post crear Producto cualquiera con token valido - privado
routerProductos.post('/',[
    validarJWT,
    check('nombre', 'el campo nombre es obligatorio').not().isEmpty(),    
    check('categoria', 'el campo categoria es obligatorio').not().isEmpty(),
    check('categoria').custom(existeCategoriaId),
    validarCampos,
],crearProducto);


// put actualizar cualquier Producto con token valido- privado
routerProductos.put('/:id',[
    validarJWT,
    check('id').custom(existeProductoId),
    validarCampos,
],actualizarProducto);

// delete borrar cualquier Producto con token valido- Admin
routerProductos.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id').custom(existeProductoId),
    validarCampos
],BorrarProducto);