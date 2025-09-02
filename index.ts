import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./src/utils/db.js"
import router from "./src/route.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

app.use("/", router)

await connectDB()

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log(`🚀Server running on port ${PORT}`)
})


