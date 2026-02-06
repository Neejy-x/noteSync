import express, { Express } from "express"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import * as useragent from "express-useragent"
import { authRouter } from "./routes/auth.routes"
import {sessionsRouter} from "./routes/sessions.routes"
import { noteRouter } from "./routes/notes.routes"
import { notFoundHandler } from './middlewares/notfound.middlewares'
import { errorHandler } from "./middlewares/errorHandler.middlewares"

const app: Express = express()


app.use(express.json())
app.use(cookieParser())
app.use(useragent.express())
app.use('/auth', authRouter)
app.use('/sessions', sessionsRouter)
app.use('/notes', noteRouter)
app.use(notFoundHandler)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    (): void => {
    console.log(`Server is running on ${PORT}`)
})