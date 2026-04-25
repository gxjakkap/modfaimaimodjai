"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SendIcon } from "lucide-react"
import Script from "next/script"
import { useCallback, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod"
import { useServerAction } from "zsa-react"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertDialogPortal,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { messageSchema } from "@/lib/schemas/message"
import { submitMessage } from "../action"

type TurnstileOptions = {
	sitekey: string
	theme?: "light" | "dark" | "auto"
	size?: "normal" | "compact" | "flexible"
	callback: (token: string) => void
	"expired-callback"?: () => void
	"error-callback"?: () => void
}

type TurnstileApi = {
	render: (container: HTMLElement, options: TurnstileOptions) => string
	reset: (widgetId?: string) => void
}

declare global {
	interface Window {
		turnstile?: TurnstileApi
	}
}

export function EmailFormCard() {
	const turnstileContainerRef = useRef<HTMLDivElement | null>(null)
	const turnstileWidgetIdRef = useRef<string | null>(null)
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
	const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
	const isTurnstileConfigured = Boolean(siteKey)

	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			email: "",
			message: "",
			turnstileToken: "",
		},
	})

	const turnstileToken = form.watch("turnstileToken")

	const resetFormAfterSuccess = useCallback(() => {
		form.reset({
			email: "",
			message: "",
			turnstileToken: "",
		})

		if (window.turnstile && turnstileWidgetIdRef.current) {
			window.turnstile.reset(turnstileWidgetIdRef.current)
		}
	}, [form])

	const { execute, isPending } = useServerAction(submitMessage, {
		onSuccess: () => {
			resetFormAfterSuccess()
			setIsSuccessModalOpen(true)
		},
		onError: ({ err }) => {
			toast.error(
				typeof err.message === "string"
					? err.message
					: "เกิดข้อผิดพลาดบางอย่างขึ้น โปรดลองอีกครั้ง",
				{ position: "top-center" },
			)
		},
	})

	const renderTurnstile = useCallback(() => {
		if (!siteKey || !window.turnstile || !turnstileContainerRef.current)
			return

		if (turnstileWidgetIdRef.current) return

		turnstileWidgetIdRef.current = window.turnstile.render(
			turnstileContainerRef.current,
			{
				sitekey: siteKey,
				theme: "light",
				size: "flexible",
				callback: (token) => {
					form.setValue("turnstileToken", token, {
						shouldValidate: true,
					})
				},
				"expired-callback": () => {
					form.setValue("turnstileToken", "", {
						shouldValidate: true,
					})
				},
				"error-callback": () => {
					form.setValue("turnstileToken", "", {
						shouldValidate: true,
					})
				},
			},
		)
	}, [form, siteKey])

	const handleSubmit = (data: z.infer<typeof messageSchema>) => {
		void execute(data)
	}

	return (
		<>
			<Card className="w-full max-w-sm lg:max-w-md">
				<CardContent>
					{isTurnstileConfigured && (
						<Script
							src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
							strategy="afterInteractive"
							onReady={renderTurnstile}
						/>
					)}
					<form
						id="email-form"
						onSubmit={form.handleSubmit(handleSubmit)}
					>
						<input
							type="hidden"
							{...form.register("turnstileToken")}
						/>
						<div className="flex flex-col gap-6 lg:gap-7">
							<FieldGroup>
								<Controller
									name="email"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
										>
											<FieldLabel htmlFor="email-inp">
												อีเมล
											</FieldLabel>
											<Input
												{...field}
												id="email-inp"
												aria-invalid={
													fieldState.invalid
												}
												placeholder="kon.geng@kmutt.ac.th"
												autoComplete="off"
												className="lg:h-9 lg:text-base"
											/>
											{fieldState.invalid && (
												<FieldError
													errors={[fieldState.error]}
												/>
											)}
										</Field>
									)}
								/>
								<Controller
									name="message"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
										>
											<FieldLabel htmlFor="msg-inp">
												ข้อความ
											</FieldLabel>
											<Textarea
												{...field}
												id="msg-inp"
												aria-invalid={
													fieldState.invalid
												}
												placeholder="สิ่งที่คุณอยากบอกตัวเอง..."
												autoComplete="off"
												className="lg:min-h-20 lg:text-base"
											/>
											{fieldState.invalid && (
												<FieldError
													errors={[fieldState.error]}
												/>
											)}
										</Field>
									)}
								/>
								<Field
									data-invalid={
										form.formState.errors.turnstileToken !==
										undefined
									}
								>
									<div
										id="turnstile-widget"
										ref={turnstileContainerRef}
										className="w-full min-h-[64px]"
									/>
									{!isTurnstileConfigured && (
										<FieldError>
											Turnstile site key is not
											configured.
										</FieldError>
									)}
									{form.formState.errors.turnstileToken && (
										<FieldError
											errors={[
												form.formState.errors
													.turnstileToken,
											]}
										/>
									)}
								</Field>
							</FieldGroup>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex-col gap-2 lg:gap-3">
					<Button
						type="submit"
						form="email-form"
						className="w-full lg:h-9 lg:text-base"
						disabled={
							!isTurnstileConfigured ||
							!turnstileToken ||
							isPending
						}
					>
						<SendIcon /> ส่งข้อความ
					</Button>
				</CardFooter>
			</Card>

			<AlertDialog
				open={isSuccessModalOpen}
				onOpenChange={setIsSuccessModalOpen}
			>
				<AlertDialogPortal>
					<AlertDialogOverlay />
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>บันทึกกำลังใจสำเร็จ</AlertDialogTitle>
							<AlertDialogDescription>
								ข้อความของคุณถูกบันทึกแล้ว ขอบคุณที่แบ่งปันกำลังใจให้ตัวเอง 💖
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogAction>ตกลง</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogPortal>
			</AlertDialog>
		</>
	)
}
