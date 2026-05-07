import type { Metadata } from "next"
import { IBM_Plex_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const ibmPlexSans = IBM_Plex_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
})

export const metadata: Metadata = {
	title: "Words of Wonder - #หมดไฟไม่หมดใจ",
	description:
		"บางครั้ง คำพูดที่เยียวยาใจเราได้ดีที่สุด อาจไม่ได้มาจากตัวเรา แต่มาจากคนที่เข้าใจความรู้สึกแบบเดียวกับเรา มาร่วมเขียนข้อความส่งกำลังใจถึงใครซักคนที่กำลังหลงอยู่ในพายุเดียวกันกับคุณ ข้อความที่ออกมาจากใจ อาจเป็นคำพูดที่ใครสักคนกำลังคอยฟังอยู่ และคุณเองอาจได้รับข้อความที่ใครสักคนเคยเขียนทิ้งไว้เช่นกัน",
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
			)}
		>
			<body className="min-h-full flex flex-col">
				{children}
				<Toaster />
			</body>
		</html>
	)
}
