/* contrôle force mot de passe */
module.exports = (req, res, next) => {
   
    let varMdp = req.body.password;
    
    const regXvarMdp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
    
    if (regXvarMdp.test(varMdp)===true) {
        next();
    } else {
        res.status(401).json({"erreur":"password non-valide"});
    }
    // 1 lowercase, 1 uppercase, 1 numeric, 1 special character excepted reserved RegEx characters, 8 length min

}


