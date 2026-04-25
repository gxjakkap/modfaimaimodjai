import z from "zod"

export const messageSchema = z.object({
	email: z.string().email({ message: "" }),
	message: z.string().min(5, { message: "" }),
	turnstileToken: z.string().min(1, { message: "" }),
})

export type MessageFormData = z.infer<typeof messageSchema>
