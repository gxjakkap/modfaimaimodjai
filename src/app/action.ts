"use server"
import { createServerAction } from "zsa"
import { connectToMongoDB } from "@/lib/db"
import { MessageModel } from "@/lib/models/message"
import { messageSchema } from "@/lib/schemas/message"

async function verifyTurnstile(token: string, secret: string) {
	const verificationUrl =
		"https://challenges.cloudflare.com/turnstile/v0/siteverify"

	const verificationResponse = await fetch(verificationUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			secret: secret,
			response: token,
		}),
	})

	const verificationResult = await verificationResponse.json()
	return verificationResult.success
}

export const submitMessage = createServerAction()
	.input(messageSchema)
	.handler(async ({ input }) => {
		const normalizedEmail = input.email.trim().toLowerCase()

		const isValid = await verifyTurnstile(
			input.turnstileToken,
			process.env.TURNSTILE_SECRET_KEY || "",
		)

		if (!isValid) {
			throw new Error("CAPTCHA verification failed. Please try again.")
		}

		await connectToMongoDB()

		const existing = await MessageModel.exists({ email: normalizedEmail })

		if (existing) {
			throw new Error(
				"มีข้อความส่งถึงอีเมลนี้แล้ว หากต้องการแก้ข้อความโปรดติดต่อ IG: modfaimaimodjai",
			)
		}

		try {
			const newMsg = await MessageModel.create({
				email: normalizedEmail,
				message: input.message,
				timestamp: new Date(),
			})

			return { id: newMsg.id }
		} catch (error) {
			if (
				typeof error === "object" &&
				error !== null &&
				"code" in error &&
				error.code === 11000
			) {
				throw new Error(
					"มีข้อความส่งถึงอีเมลนี้แล้ว หากต้องการแก้ข้อความโปรดติดต่อ IG: modfaimaimodjai",
				)
			}

			throw error
		}
	})
