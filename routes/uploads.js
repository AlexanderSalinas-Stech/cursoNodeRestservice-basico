import {Router} from 'express';
import { check } from "express-validator";
import { validarCampos, validarArchivoSubir} from '../middlewares/index.js';
import { actualizarImagen, actualizarImagenCloudinary, cargarArchivo,mostrarArchivo } from '../controllers/uploads.js';
import { coleccionesPermitidas} from '../helpers/index.js';


export const routerUpload = Router();


routerUpload.post('/',validarArchivoSubir,cargarArchivo);

routerUpload.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','El id no es valido').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
// ],actualizarImagen);
],actualizarImagenCloudinary);

routerUpload.get('/:coleccion/:id',[
    check('id','El id no es valido').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],mostrarArchivo);