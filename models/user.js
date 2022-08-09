const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');//plugin pour ne pas laisser entrer un doublon d'utilisateur en BD

const userSchema = mongoose.Schema({// schema de modèle d'utilisateur
  username: { type: String, required: true, unique: true },//pour identifier l'auteur des posts
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);