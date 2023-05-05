exports.logErrors = (err,req,res,next)=>{
    console.log(err.stack)   
}

exports.clientError = (err, req, res, next)=>{
    if (req.xhr) {
        res.status(500).send({ error: 'Something blew up!' });
    } else {
        next(err);
    }
}

exports.errorHandler = (err,req,res,next)=>{
    res.status(500)
    res.render('error',{
        title:'Error',
        error:err
    })
}