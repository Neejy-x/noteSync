import express, { Express } from "express"
import 'dotenv/config'
import { noteRouter } from "./routes/notes.routes"
import { notFoundHandler } from './middlewares/notfound.middlewares'

const app = express()


app.use(express.json())
app.use('/notes', noteRouter)
app.use(notFoundHandler)

const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    (): void => {
    console.log(`Server is running on ${PORT}`)
})