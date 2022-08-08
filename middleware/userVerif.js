/* contrôle format @mail */
module.exports = (req, res, next) => {
   
        let varEmail = req.body.email;
        
        const regXvarEmail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        
        if (regXvarEmail.test(varEmail)===true) {
            next();
        } else {
            res.status(401).json({"erreur":"email non-valide"});
            
        }
}
