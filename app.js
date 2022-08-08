/* import des modules */
const express = require('express');

const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();


/* import des chemins de fichiers de méthodes de routes d'API */
const postsRoutes = require('./routes/posts');

const userRoutes = require('./routes/user');

const path = require('path');//import module path pour gérer le chemin d'accès aux images

/* connection à la base de données */
mongoose.connect(process.env.MDB_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json());

/* definition des requêtes */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
/* mise en place des correspondances de routes */
app.use('/api/posts', postsRoutes);
app.use("/api/auth", userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;