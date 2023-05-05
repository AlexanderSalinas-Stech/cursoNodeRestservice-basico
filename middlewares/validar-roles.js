import { request, response } from "express";

const esAdminRol=(req=request,res=response, next)=>{
    if(!req.usuario){
        return res.status(500).json({msg:'se requiere validar el rol sin validar el token'});
    }

    const {rol,nombre}=req.usuario;

    if (rol !=='ADMIN') {
        return res.status(401).json({msg:`el usuario ${nombre}, no tiene permisos para realizar esto`});
    }
    next();
};

const tieneRol=(...roles)=>{
    return(req=request,res=response, next)=>{
        if(!req.usuario){
            return res.status(500).json({msg:'se requiere validar el rol sin validar el token'});
        }
        const {rol,nombre}=req.usuario;

        if (!roles.includes(rol)) {
            return res.status(401).json({msg:`el usuario ${nombre}, no tiene permisos para realizar esto`});
        }

        next();
    }
    
};

export {
    esAdminRol,
    tieneRol
}