const express = require("express")
const hubRouter = require("./routers/hub")

const app = express()
const port = 4000

app.use(express.json())

app.use("/api/posts", hubRouter)

app.listen(port, () => console.log(`Server is listening at http://localhost:${port}`))