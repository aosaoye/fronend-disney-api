import express from "express"
import cors from "cors"
import movieRoutes from "./interfaces/http/routes/movies.routes.ts"
import morgan from "morgan"

const app = express()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))


app.get("/", (req, res) => {
    res.redirect("/api/movie")
})

app.use(morgan("dev"))
app.use(express.json())
app.use("/api/movie", movieRoutes)

export default app