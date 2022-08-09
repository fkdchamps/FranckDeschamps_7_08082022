const Post = require('../models/post');//import schema
const fs = require('fs');//import module fs pour systeme de fichiers

//CREATION
exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post);
  const post = new Post({//valeurs parsées du corps de requete affectées à l'objet
      ...postObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
  });
  post.save()//sauvegarde objet
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

//GET ONE
exports.getOnePost = (req, res, next) => {
  Post.findOne({//trouver la post en BD
    _id: req.params.id
  }).then(
    (post) => {
      res.status(200).json(post);//envoyer au client
    })
    .catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//MODIF ONE
exports.modifyPost = (req, res, next) => {
  const postObject = req.file ? {//si on a une image on construit l'objet temporaire avec l'url d'image sinon directement du body
      ...JSON.parse(req.body.post),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  Post.findOne({_id: req.params.id})//trouver en BD
      .then((post) => {
          if (post.userId != req.auth.userId) {//droits?
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Post.updateOne({ _id: req.params.id}, { ...postObject, _id: req.params.id})//update vers BD depuis l'objet temporaire
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

//DELETE ONE
exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })//trouver
      .then(post => {
          if (post.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = post.imageUrl.split('/images/')[1];//destruction fichier fs.unlink
              fs.unlink(`images/${filename}`, () => {
                  Post.deleteOne({_id: req.params.id})//destruction post
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

//GET ALL
exports.getAllPosts = (req, res, next) => {
  Post.find().sort({date: -1, userId: 1}).then(//tout est trouvé et trié par date + user si nécessaire. Voir comment schema date et userid.
    (posts) => {
      res.status(200).json(posts);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//LIKES
exports.likePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      const numLikeSent = req.body.like;// -1, 0 ou 1
      const likeUser = req.body.userId;//celui qui like ou dislike
      if (likeUser == post.userId){
        res.status(403).json({ message : 'vous ne pouvez pas liker ou unliker'});
        return;
      };
      /* 3 parametrages conditionnels : */
      //--------------------------------------------
      if (numLikeSent == -1){//dislike
        if (post.usersDisliked.includes(likeUser) == false) {//user n'a jamais disliké ce post
          post.dislikes +=1;
          post.usersDisliked.push(likeUser);
          if (post.usersLiked.includes(likeUser)) {
            post.usersLiked = post.usersLiked.filter(function(f) { return f !== likeUser });
            post.likes += -1
          }
        }else{
          res.status(403).json({ message : 'vous avez déjà unliké' });
        }
      };

      //---------------------------------------------------
      if (numLikeSent == 0){//undislike ou unlike (annulation)
        if (post.usersDisliked.includes(likeUser) == true) {//user a disliké cette post
          post.dislikes += -1;
          post.usersDisliked = post.usersDisliked.filter(function(f) { return f !== likeUser });
        }else if (/* (post.usersLiked.length !== 1) &&  */(post.usersLiked.includes(likeUser) == true)) {//user a liké cette post
          post.likes += -1;
          post.usersLiked = post.usersLiked.filter(function(f) { return f !== likeUser });
        };
      };

      //------------------------------------------------------
      if (numLikeSent == 1){//like
        if (post.usersLiked.includes(likeUser) == false) {//user n'a jamais liké cette post
          post.likes +=1;
          post.usersLiked.push(likeUser);
          if (post.usersDisliked.includes(likeUser)) {
            post.usersDisliked = post.usersDisliked.filter(function(f) { return f !== likeUser });
            post.dislikes += -1
          }
        }else{
          res.status(403).json({ message : 'vous avez déjà liké'});
        }
      };
      /* mise à jour en BD dans tous les cas */
      Post.updateOne({ _id: req.params.id }, {$set: {likes: post.likes, dislikes: post.dislikes, usersLiked: post.usersLiked, usersDisliked: post.usersDisliked}})//mise à jour dans tous les cas
      .then(() => res.status(200).json({message : 'likes/dislikes de la post bien mis à jour'}))
      })
    .catch( error => {
      res.status(500).json({ error })
    })
};
