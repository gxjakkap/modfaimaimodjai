import mongoose, { type Connection } from "mongoose"

let cached: Connection | null = null

export async function connectToMongoDB() {
	if (cached) {
		console.log("Using cached db connection")
		return cached
	}
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI || "")

		cached = conn.connection

		console.log("New mongodb connection established")

		return cached
	} catch (error) {
		console.log(error)
		throw error
	}
}
