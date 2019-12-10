const express = require("express")
const db = require("../data/db")

const router = express.Router()

// POST a post
router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({ message: "Please include a title and contents in your post."})
  } else {
    db.insert(req.body)
      .then(post => res.status(201).json(post))
      .catch(err => res.status(500).json({ message: "There was an error while saving the post to the database."}))
  }
})

// POST a comment
router.post("/:id/comments", (req, res) => {

  if (!req.body.text) {
    return res.status(400).json({ message: "Please provide text for the comment." })
  } else if (req.params.id !== req.body.post_id) {
    return res.status(400).json({ message: "The post id and comment id do not match. Please provide corresponding id's." })
  }

  db.findById(req.params.id)
    .then(post => {
      if(post) {
        return db.insertComment(req.body)
      }
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    })
    .then(comment => res.status(201).json(comment))
    .then(() => db.findById(req.params.id))
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: "There was an error while saving the comment to the database" }))
})

// GET posts
router.get("/", (req, res) => {
  db.find()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ message: 'There was a server error.' }))
})

// GET post by ID
router.get("/:id", (req, res) => {

  db.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        res.status(200).json(post)
      }
    })
    .catch(err => res.status(500).json({ message: 'There was a server error.' }))
})

// GET comments for a post by id
router.get("/:id/comments", (req, res) => {
  db.findPostComments(req.params.id)
    .then(comments => {
      if (comments) {
        return res.status(200).json(comments)
      } else {
        return res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => res.status(500).json({ message: 'There was a server error.' }))
})

// DELETE post by id
router.delete("/:id", (req, res) => {
  db.remove(req.params.id)
    .then(deleted => {
      if(!deleted) {
        return res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        res.status(204).json({ deleted: deleted })
      }
    })
    .catch(err => res.status(500).json({ message: 'There was a server error.' }))
})

// PUT a post by id
router.put("/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({ message: "Please include a title and contents in your post."})
  } else {
    db.update(req.params.id, req.body)
    .then(updated => res.status(201).json(updated))
    .catch(err => res.status(500).json({ message: 'There was a server error.' }))
  }
})

module.exports = router