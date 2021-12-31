// 1.Connect to DataBase (MongoDB) and 2. start server
import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDAO from "./dao/restaurantsDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
  // Connect to DB
  process.env.RESTREVIEWS_DB_URI,
  {
      maxpoolSize: 50,
      wtimeoutMS: 250,
      useNewUrlParser: true}
  )
  .catch(err => {
      console.log(err.stack)
      process.exit(1)
  })
  .then(async client => {
      await RestaurantsDAO.injectDB(client)
      await ReviewsDAO.injectDB(client)
      app.listen(port, () => {
          console.log(`listening on port ${port}`)
      })
  })
