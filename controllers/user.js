const bcrypt = require("bcrypt");//import module bcrypt Hash and Verify Passwords

const User = require("../models/user");//import schema utilisateur

const jwt = require('jsonwebtoken');//import module jsonwebtoken pour jetons de signature d'authentification

//import des variables d'environnement
const dotenv = require("dotenv");
dotenv.config();
const RANDOM_TOKEN_SECRET = process.env.TOKEN_SECRET;

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 12)//chiffrage du mot de passe à partir du password de requête
    .then(hash => {//parametrage d'utilisateur avec ce hash à la place du password en clair
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()//sauvegarde de ce user adapté en BD
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
          if (!user) {
              return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
          }
          bcrypt.compare(req.body.password, user.password)//test "correspondance absolue passClair/hash bcrypt" ;-)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                  }
                  res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(//construction du token d'identification à envoyer au front
                        { userId: user._id },
                        RANDOM_TOKEN_SECRET,
                        { expiresIn: '24h' }//re-login obligé dans 24h
                    )
                });
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};