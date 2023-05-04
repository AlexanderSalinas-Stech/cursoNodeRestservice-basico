import { Role } from '../models/role.js';
import { Usuario } from '../models/usuario.js';

const esRolValido =async(rol='')=>{
    const exsitRol = await Role.findOne({rol});
    if (!exsitRol) {
        throw new Error(`el rol ${rol} no esta registrado en BD`);
    }
}

const emailExiste= async (correo='')=>{
    //verificar si el correo existe
    const existeEmail=await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`el correo ya existe`);
    }
};

const existeUsuarioId= async (id)=>{
    //verificar si el correo existe
    const existeUsuario=await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id} `);
    }
};

export{
    esRolValido,
    emailExiste,
    existeUsuarioId
}