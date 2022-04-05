const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const pool = require('../../config/db');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function getPost(posts){
 try{
   await asyncForEach(posts, async (post) => {
   //posts.forEach(async (post) => {
    // ottengo i commenti del post e li inserisco nell'oggetto post
    const comments = await pool.query('SELECT * FROM comments WHERE pid = $1', [post.pid]);
    if(comments.rows.length > 0){
      post.comments = comments.rows;

    //post.comments.forEach(async (comment) => {
      await asyncForEach(post.comments, async (comment) => {
      const q_user = await pool.query('SELECT * FROM users WHERE uid = $1', [comment.userid]);
      const user = q_user.rows[0];
      comment.name = user.name;
      comment.avatar = user.avatar;
    });}else{
      post.comments = [];
    }
    if (post.likes !== null) {
      const q_likes = await pool.query('SELECT * FROM likes WHERE pid = $1', [post.pid]);
      post.likes = q_likes.rows;
    }else{
      
      post.likes = [];
    } 
})}
catch(err){
  console.log(err.message);}
  
return posts;}
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
      //const user = await User.findById(req.user.id).select('-password');
      const q_user = await pool.query('SELECT * FROM users WHERE uid = $1', [req.user.id]);
      const user = q_user.rows[0];
      if(user){
      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      }

      //const post = await newPost.save();
      await pool.query('INSERT INTO posts (text, name, avatar, userid) VALUES ($1, $2, $3, $4) RETURNING *', [newPost.text, newPost.name, newPost.avatar, newPost.user]);
      
      const post = await pool.query('SELECT * FROM posts ORDER BY date DESC');
      const p = await getPost([post.rows[0]]);

      res.json(p[0]);}
      else{
        res.status(400).json({ errors: [{ msg: 'Utente non trovato' }] });}
      //res.json(post);
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
    //const posts = await Post.find().sort({ date: -1 }); //Tira su tutti  i post mettendoli in ordine cronologico
    const post = await pool.query('SELECT * FROM posts ORDER BY date DESC');
    /* post.rows.forEach(post => {
      if(post.likes == null){
        post.likes = [];
      }
      if(post.comments == null){
        post.comments = [];
      }}
    ); */
    
    res.json(await getPost(post.rows));
    //res.json(posts);
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
    //const post = await Post.findById(req.params.post_id);
    const q_post = await pool.query('SELECT * FROM posts WHERE pid = $1', [req.params.post_id]);
    const post = q_post.rows[0];
    if (!post) {
      return res.status(404).json({ msg: 'Post non trovato' });
    }

const p = await getPost([post])
console.log(p);
    res.json(p[0]);
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
    //const post = await Post.findById(req.params.post_id);
    const q_post = await pool.query('SELECT * FROM posts WHERE pid = $1', [req.params.post_id]);
    const post = q_post.rows[0];
    if (!post) {
      return res.status(404).json({ msg: 'Post non trovato' });
    }
    //mi assicuro che sia l'utente creatore del post ad eliminarlo
    if (post.userid.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Utente non autorizzato' });
    }

    //await post.remove();
    await pool.query('DELETE FROM posts WHERE pid = $1', [req.params.post_id]);
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
    //const post = await Post.findById(req.params.post_id);
    const q_post = await pool.query('SELECT * FROM posts WHERE pid = $1', [req.params.post_id]);
    const post = q_post.rows[0];
    if (!post) {
      return res.status(404).json({ msg: 'Post non trovato' });
    }

    //controllo che l'utente non abbia già messo like al post
    if (
      
      //like.user.toString() == req.user.id).length > 0
      pool.query('SELECT * FROM likes WHERE userid = $1 AND postid = $2', [req.user.id, req.params.post_id]).rowCount > 0
      
    ) {
      return res.status(400).json({ msg: 'Like già messo al post' });
    }

    //post.likes.unshift({ user: req.user.id });
   // await post.save();
    await pool.query('INSERT INTO likes (userid, postid) VALUES ($1, $2)', [req.user.id, req.params.post_id]);
    const likes = await pool.query('SELECT * FROM likes WHERE postid = $1', [req.params.post_id]);
    res.json(likes.rows);
    //res.json(post.likes);
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
  /* try {
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
    res.json(post.likes); */
    try {
      //const post = await Post.findById(req.params.post_id);
      const q_post = await pool.query('SELECT * FROM posts WHERE pid = $1', [req.params.post_id]);
      const post = q_post.rows[0];
      if (!post) {
        return res.status(404).json({ msg: 'Post non trovato' });
      }
      //controllo che l'utente non abbia già messo like al post
      if (pool.query('SELECT * FROM likes WHERE userid = $1 AND postid = $2', [req.user.id, req.params.post_id]).rowCount > 0) {
        return res.status(400).json({ msg: 'Like già messo al post' });
      }
      
      await pool.query('DELETE FROM likes WHERE userid = $1 AND postid = $2', [req.user.id, req.params.post_id]);
      const likes = await pool.query('SELECT * FROM likes WHERE postid = $1', [req.params.post_id]);
      res.json(likes.rows);
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
      //const user = await User.findById(req.user.id).select('-password');
      const q_user = await pool.query('SELECT * FROM users WHERE uid = $1', [req.user.id]);
      const user = q_user.rows[0];

      //const post = await Post.findById(req.params.post_id);
      const q_post = await pool.query('SELECT * FROM posts WHERE pid = $1', [req.params.post_id]);
      const post = q_post.rows[0];
      
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      //post.comments.unshift(newComment);
      //await post.save();
      await pool.query('INSERT INTO comments (text, userid, pid) VALUES ($1, $2, $3)', [req.body.text, req.user.id, req.params.post_id]);
      const comments = await pool.query('SELECT * FROM comments WHERE pid = $1', [req.params.post_id]);
      comments.rows.forEach(async (comment) => {
        const q_user = await pool.query('SELECT * FROM users WHERE uid = $1', [comment.userid]);
        const user = q_user.rows[0];
        comment.name = user.name;
        comment.avatar = user.avatar;
      });
      res.json(comments.rows);
      //res.json(post.comments);
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
    //const post = await Post.findById(req.params.post_id);
    const q_post = await pool.query('SELECT * FROM posts WHERE pid = $1', [req.params.post_id]);
    const post = q_post.rows[0];
    if (!post) {
      return res.status(404).json({ msg: 'Post non trovato' });
    }
    //trovo il commento
    /* const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    ); */
    const q_comment = await pool.query('SELECT * FROM comments WHERE cid = $1', [req.params.comment_id]);
    const comment = q_comment.rows[0];
    if (!comment) {
      return res.status(404).json({ msg: 'Commento non trovato' });
    }
    //controllo che sia l'utente che ha fatto il commento ad eliminarlo
    if (comment.userid != req.user.id) {
      return res.status(404).json({ msg: 'Utente non autorizzato' });
    }

    //cancello il commento
/*     const toRemoveId = post.comments
      .map((comment) => comment.id.toString())
      .indexOf(req.params.comment_id);
    post.comments.splice(toRemoveId, 1);
    await post.save();*/
    await pool.query('DELETE FROM comments WHERE cid = $1', [req.params.comment_id]);
    const comments = await pool.query('SELECT * FROM comments WHERE postid = $1', [req.params.post_id]);
    res.json(comments.rows);
    //res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server error');
  }
});
module.exports = router;
