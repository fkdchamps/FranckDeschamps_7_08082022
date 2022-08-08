/* fichier des routes d'API attendues sur requête pour gérer des posts */
const express = require("express");
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config');
const postCtrl = require("../controllers/post");


    
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.post('/', auth, multer, postCtrl.createPost);
router.post('/:id/like', auth, postCtrl.likePost);
router.delete('/:id', auth, postCtrl.deletePost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
module.exports = router;
