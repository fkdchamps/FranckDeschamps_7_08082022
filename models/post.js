const mongoose = require('mongoose');//import library pour connection à la base de données

const postSchema = mongoose.Schema({//schema de modèle d'un objet post en base de données
  userId: { type: String, required: true },
  title: { type: String, required: true },
  //paragraph: { type: String, required: true },
  imageUrl: { type: String, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number,  required: true },
  usersLiked: { type: [String],  required: true },
  usersDisliked: { type: [String],  required: true }
});

module.exports = mongoose.model('Post', postSchema);