import { Schema, model } from "mongoose";

const usuarioSchema=Schema({
    nombre: {
        type: String, 
        required: [true, 'el nombre es obligatorio']
    },
    correo:{
        type: String, 
        required: [true, 'el correo es obligatorio']
    },
    password:{
        type: String, 
        required: [true, 'el password es obligatorio']
    },
    img:{
        type: String, 
    },
    rol:{
        type: String, 
        required: true,
        enum:['ADMIN','USER']
    },
    estado:{
        type: Boolean, 
        default:true
    },
    google:{
        type: Boolean, 
        default:false
    },
});

usuarioSchema.methods.toJSON=function() {
    const {__v, password, ...usuario} =this.toObject();
    return usuario;
}

export const Usuario=model('Usuarios',usuarioSchema);