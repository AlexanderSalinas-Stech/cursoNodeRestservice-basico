import{ response,request } from "express";


const usuariosGet = (req=request, res=response) =>{
    const {q, nombre= 'no name',page=1,limit=10} =req.query;
    res.json({
        msg:'Get API',
        q,
        nombre,
        page,
        limit
    });
    
}

const usuariosPut= (req=request, res=response) =>{
    const id=req.params.id;
    res.json(
        {
            msg:'Put API',
            id
        }
    )
}

const usuariosPost= (req=request, res=response) =>{
    const {nombre,edad} =req.body;
    res.json(
        {
            msg:'Post API',
            nombre,
            edad
        }
    )
}

const usuariosDelete= (req=request, res=response) =>{
    res.json({msg:'Delete API'})
}

export {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}