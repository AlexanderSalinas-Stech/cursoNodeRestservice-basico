import {Router} from 'express';
import {usuariosGet,usuariosPost,usuariosPut,usuariosDelete} from '../controllers/usuarios.js'
import { validarCampos } from '../middlewares/validar-campos.js';
import { check } from "express-validator";
import { esRolValido, emailExiste, existeUsuarioId } from '../helpers/db-validators.js';


export const router = Router();

router.get('/',usuariosGet );

router.put('/:id',[
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom(existeUsuarioId)
], usuariosPut);

router.post('/',[
    check('correo','El correo no es valido').isEmail(),
    check('correo','El correo no es valido').custom(emailExiste),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio y contener mas de 6 letras').isLength({min:6}),
    // check('rol','No es un rol válido').isIn(['ADMIN','USER']),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.delete('/:id',[
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
], usuariosDelete);