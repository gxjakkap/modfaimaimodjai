import { Mali } from "next/font/google"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { EmailFormCard } from "./_components/email-form-card"

const mali = Mali({
	weight: "600",
})

export default function Home() {
	return (
		<div className="flex min-h-dvh w-full flex-col px-4 py-8 sm:px-6 sm:py-12">
			<main className="mx-auto flex max-w-screen w-full flex-1 flex-col items-center justify-center gap-6 sm:gap-8">
				<h1
					className={cn(
						"text-center font-heading whitespace-nowrap text-[clamp(0.95rem,4vw,3rem)] leading-tight hidden md:block",
						mali.className,
					)}
				>
					อยากบอกอะไรกับตัวเองในวันที่เหนื่อยล้า ?
				</h1>
				<div
					className={cn(
						"text-center font-heading whitespace-nowrap text-3xl leading-tight flex flex-col gap-y-2 md:hidden",
						mali.className,
					)}
				>
					<span>อยากบอกอะไรกับตัวเอง</span>
					<span>ในวันที่เหนื่อยล้า ?</span>
				</div>
				<EmailFormCard />
			</main>
			<footer className="mx-auto w-full max-w-3xl pt-4 sm:pt-6">
				<Image
					src="/footer.svg"
					alt="KMUTT, Gened, Modfaimaimodjai"
					width={500}
					height={150}
					className="mx-auto h-auto w-full max-w-40 sm:max-w-48 md:max-w-56"
				/>
			</footer>
		</div>
	)
}
