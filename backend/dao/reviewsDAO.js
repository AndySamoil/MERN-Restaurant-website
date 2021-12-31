import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

// fill with reviews collection from DB
let reviews

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews){
      return
    }

    try {
      // process.env stores global constants. i.e. API key, Port Number etc.

      // reviews is fetching the reviews collection from DB
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async addReview(restaurantId, user, review, date) {
    try {
      // create DB entry
      const reviewDoc = { 
        name: user.name,
        user_id: user._id,
        date: date,
        text: review,
        restaurant_id: ObjectId(restaurantId),
      }
      // insert entry to DB
      return await reviews.insertOne(reviewDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return {error: e}
    }
  }

  static async updateReview(reviewId, userId, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        // find a review with same user_id and reviewId
        { user_id: userId, _id: ObjectId(reviewId)},
        // then set the text (review) and new date
        { $set: { text: text, date: date} },
      )

      return updateResponse
    } catch(e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e}

    }
  }

  static async deleteReview(reviewId, userId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id: userId
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }
  
}