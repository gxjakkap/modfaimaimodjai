import mongoose, { Schema } from "mongoose"

type Message = {
	email: string
	message: string
	timestamp: Date
}

const messageSchema = new Schema<Message>(
	{
		email: {
			type: String,
			required: true,
			trim: true,
		},
		message: {
			type: String,
			required: true,
			trim: true,
		},
		timestamp: {
			type: Date,
			required: true,
			default: Date.now,
		},
	},
	{
		versionKey: false,
	},
)

export type MessageDocument = mongoose.HydratedDocument<Message>

export const MessageModel =
	(mongoose.models.Message as mongoose.Model<Message>) ||
	mongoose.model<Message>("Message", messageSchema)
