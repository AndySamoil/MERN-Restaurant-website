import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/restaurants", restaurants)
// if not valid request, return 404
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

export default app