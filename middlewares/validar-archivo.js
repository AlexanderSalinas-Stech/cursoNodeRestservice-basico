import { response } from "express";

const validarArchivoSubir=(req, res=response,next)=>{
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({msg:'no hay archivos'});
        return;
    }
    next();
};

export{
    validarArchivoSubir
}