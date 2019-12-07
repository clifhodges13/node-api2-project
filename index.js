const express = require("express")
const db = require("./data/db")

const app = express()
const port = 4000

app.use(express.json())

// POST a post
app.post("/api/posts", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({ message: "Please include a title and contents in your post."})
  } else {
    db.insert(req.body)
      .then(post => res.status(201).json(post))
      .catch(err => res.status(500).json({ message: "There was an error while saving the post to the database."}))
  }
})

// POST a comment
app.post("/api/posts/:id/comments", (req, res) => {
  const { id } = req.params.id

  if(!db.findById(id)) {
    res.status(404).json({ message: "The post with the specified ID does not exist." })
  }

  if (!req.body.text) {
    return res.status(400).json({ message: "Please provide text for the comment." })
  } else if (req.params.id !== req.body.post_id) {
    return res.status(404).json({ message: "The post id and comment id do not match. Please provide corresponding id's." })
  } else {
    db.insertComment(req.body)
      .then(comment => res.status(201).json(comment))
      .catch(err => res.status(500).json({ message: "There was an error while saving the comment to the database" }))
  }
})

// GET posts
app.get("/api/posts", (req, res) => {
  db.find()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ message: 'There was a server error.' }))
})

// GET post by ID
app.get("/api/posts/:id", (req, res) => {
  db.findById(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(err => res.status(500).json({ message: 'There was a server error.' }))
})

app.listen(port, () => console.log(`Server is listening at http://localhost:${port}`))