/* fichier des routes d'API attendues sur requête pour gérer des utilisateurs */
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const userVerif = require('../middleware/userVerif');
const passVerif = require('../middleware/passVerif');
router.post('/signup', userVerif, passVerif, userCtrl.signup);
router.post('/login', userVerif, passVerif, userCtrl.login);

module.exports = router;