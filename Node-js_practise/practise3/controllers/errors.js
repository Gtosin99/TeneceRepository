exports.error404=(req,res,next)=>{
    res.status(404).render('404',{
        pageTitle:'Page Not Found',
        path:'',  
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.error500=(req,res,next)=>{
    res.status(500).render('500',{
        pageTitle:'Error',
        path:'',  
        isAuthenticated: req.session.isLoggedIn
    })
}