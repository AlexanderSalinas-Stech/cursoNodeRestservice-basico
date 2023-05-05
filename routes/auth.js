import {Router} from 'express';
import { check } from "express-validator";
import { login } from '../controllers/auth.js';
import { validarCampos } from '../middlewares/validar-campos.js';


export const routerAuth = Router();

routerAuth.post('/login',[
    check('correo', 'el correo es obligatorio').isEmail(),
    check('password','El password es obligatorio').not().isEmpty(),
    validarCampos
],login);


