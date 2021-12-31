import { query } from "express"
import monogodb from "mongodb"
const ObjectId = monogodb.ObjectID

// Variable to store reference to database (MongoDB)
let restaurants

export default class RestaurantsDAO {
	static async injectDB(conn) {
		// if already connected don't reconnect
		if (restaurants) {
			return
		}
		try {
			// connect to DB
			restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
		} catch (e) {
			console.error(
				`Unable to establish a collection handle in restaurantsDAO: ${e}`,
			)
		}
	}

	static async getRestaurants({
		filters = null,
		page = 0,
		restaurantsPerPage = 20,
	} = {}) {
		let query
		if (filters) {
			// Name of restaurant
			if ("name" in filters) {
				// search if text has this name
				query = { $text: { $search: filters["name"] } }
			} else if ("cuisine" in filters) {
				// $eq means equals
				query = { "cuisine": { $eq: filters["cuisine"] } }
			} else if ("zipcode" in filters) {
				query = { "address.zipcode": { $eq: filters["zipcode"] } }
			}
		}

		let cursor

		try {
			// fetch DB query
			cursor = await restaurants
				.find(query)
		} catch (e) {
			console.error(`Unable to issue find command, ${e}`)
			return { restaurantsList: [], totalNumRestaurants: 0 }
		}

		// cursor will have every result ever based on query

		// we dont want every result in the DB we want say only 20

		// display Cursor will limit the results to this amount

		const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

		try {
			const restaurantsList = await displayCursor.toArray()
			const totalNumRestaurants = await restaurants.countDocuments(query)

			return { restaurantsList, totalNumRestaurants }
		} catch (e) {
			console.error(
				`Unable to conver cursor to array or problem counting documents, ${e}`
			)

			return { restaurantsList: [], totalNumRestaurants: 0 }
		}
	}

	static async getRestaurantById(id) {
		try {
			// create pipeline to help match certain collections together
			const pipeline = [
				{
					$match: {
						_id: new ObjectId(id)
					},
				},
				{
					$lookup: {
						from: "reviews",
						let: {
							id: "$_id"
						},
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ["$restaurant_id", "$$id"],
									},
								},
							},
							{
								$sort: {
									date: -1,
								},
							},
						],
						as: "reviews",
					},
				},
				{
					$addFields: {
						reviews: "$reviews",
					},
				}
			]
			// aggregate means collect everything together
			return await restaurants.aggregate(pipeline).next()
		} catch (e) {
			console.error(`Something went wrong in getRestaurantByID: ${e}`)
			throw e
		}
	}

	static async getCuisines() {
		let cuisines = []
		try {
			// get all distinct cuisines that exist
			cuisines = await restaurants.distinct("cuisine")
			return cuisines
		} catch (e) {
			console.error(`Unable to get cuisines, ${e}`)
			return cuisines
		}
	}

}