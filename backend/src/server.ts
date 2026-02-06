import app from "./app.ts";
import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}/api/movie`)
})