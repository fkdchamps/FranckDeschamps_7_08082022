const jwt = require('jsonwebtoken')//import module jsonwebtoken pour jetons de signature d'authentification

//import des variables d'environnement
const dotenv = require("dotenv");
dotenv.config();
const RANDOM_TOKEN_SECRET = process.env.TOKEN_SECRET;//récup var environnement

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];//extraction du token de requête
        const decodedToken = jwt.verify(token, RANDOM_TOKEN_SECRET);//décodage token avec notre clé
        const userId = decodedToken.userId;//extraction userId du token décodé
        req.auth = {//paramétrage supplémentaire de la requête avec l'userid
            userId: userId
        }
    next();
    } catch(error) {
        res.status(401).json({ error });
    }
};
//ceci est la première barrière aux routes d'API