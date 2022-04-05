const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route POST api/posts
// @desc Creo un post
// @access Private
router.post(
  '/',
  [auth, [check('text', 'Testo mancante').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route GET api/posts
// @desc Ottengo tutti i posts
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //Tira su tutti  i post mettendoli in ordine cronologico
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server error');
  }
});

// @route GET api/posts/:post_id
// @desc Ottengo il post singolo
// @access Private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post non trovato' });
    }

    res.json(post);
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Post non trovato' });
    }
    return res.status(500).send('Server error');
  }
});

// @route DELETE api/posts/:post_id
// @desc Cancella post singolo
// @access Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post non trovato' });
    }
    //mi assicuro che sia l'utente creatore del post ad eliminarlo
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Utente non autorizzato' });
    }

    await post.remove();
    res.json({ msg: 'Post eliminato' });
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Post non trovato' });
    }
    return res.status(500).send('Server error');
  }
});

// @route PUT api/posts/like/:post_id
// @desc like al post
// @access Private
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post non trovato' });
    }

    //controllo che l'utente non abbia già messo like al post
    if (
      post.likes.filter((like) => like.user.toString() == req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Like già messo al post' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Post non trovato' });
    }
    return res.status(500).send('Server error');
  }
});

// @route PUT api/posts/unlike/:post_id
// @desc like al post
// @access Private
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post non trovato' });
    }

    //controllo che l'utente non abbia già messo like al post
    if (
      post.likes.filter((like) => like.user.toString() == req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Non cè un like per questo post' });
    }

    const toRemoveId = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(toRemoveId, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Post non trovato' });
    }
    return res.status(500).send('Server error');
  }
});

// @route POST api/posts/comment/:post_id
// @desc Crea commento al post
// @access Private
router.post(
  '/comment/:post_id',
  [auth, [check('text', 'Testo mancante').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.post_id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route DELETE api/posts/comment/:post_id/:comment_id
// @desc Cancella commento al post
// @access Private

router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    //trovo il post da cui eliminare il commento
    const post = await Post.findById(req.params.post_id);
    //trovo il commento
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: 'Commento non trovato' });
    }
    //controllo che sia l'utente che ha fatto il commento ad eliminarlo
    if (comment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Utente non autorizzato' });
    }

    //cancello il commento
    const toRemoveId = post.comments
      .map((comment) => comment.id.toString())
      .indexOf(req.params.comment_id);

    post.comments.splice(toRemoveId, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server error');
  }
});
module.exports = router;
