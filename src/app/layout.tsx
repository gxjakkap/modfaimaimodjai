import type { Metadata } from "next"
import { IBM_Plex_Sans, Noto_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const notoSansHeading = Noto_Sans({
	subsets: ["latin"],
	variable: "--font-heading",
})

const ibmPlexSans = IBM_Plex_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
})

export const metadata: Metadata = {
	title: "อยากบอกอะไรกับตัวเองในวันที่เหนื่อยล้า - #หมดไฟไม่หมดใจ",
	description:
		"บางครั้ง คนที่รู้ใจตัวเองและให้กำลังใจเราได้ดีที่สุด ก็คือคนที่อยู่ใกล้เราที่สุด #หมดไฟไม่หมดใจ ชวนทุกคนมาเขียนจดหมายให้กำลังใจตัวเองในวันที่เหนื่อยล้า โดยสักวันหนึ่งข้อความนี้จะถูกส่งไปถึงคุณ",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				"font-sans",
				ibmPlexSans.variable,
				notoSansHeading.variable,
			)}
		>
			<body className="min-h-full flex flex-col">
				{children}
				<Toaster />
			</body>
		</html>
	)
}
