"use client";

import { BannerContent } from "@/lib/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import RichTextViewer from "./RichTextViewer";

interface BannerProps {
	content: BannerContent;
}

export default function Banner({ content }: BannerProps) {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
			{/* Background con efecto parallax */}
			{content.imageUrl ? (
				<div className="absolute inset-0 z-0">
					<Image
						src={content.imageUrl}
						alt={content.title}
						fill
						className="object-cover"
						priority
					/>
					<div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-background/95 dark:from-black/80 dark:via-black/70 dark:to-background" />
				</div>
			) : (
				<div className="absolute inset-0 z-0 bg-linear-to-br from-primary via-secondary to-accent opacity-10 dark:opacity-20" />
			)}

			{/* Elementos decorativos flotantes */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<motion.div
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 0.1, scale: 1 }}
					transition={{ duration: 1.5, delay: 0.5 }}
					className="absolute top-10 sm:top-20 right-10 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 bg-primary rounded-full blur-3xl"
				/>
				<motion.div
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 0.1, scale: 1 }}
					transition={{ duration: 1.5, delay: 0.7 }}
					className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-64 h-64 sm:w-96 sm:h-96 bg-secondary rounded-full blur-3xl"
				/>
			</div>

			{/* Contenido principal */}
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass border border-white/20 text-xs sm:text-sm font-medium"
				>
					<Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
					<span className="text-foreground dark:text-white">
						Bienvenido al futuro
					</span>
				</motion.div>
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-linear-to-r from-foreground via-primary to-secondary dark:from-white dark:via-primary dark:to-accent px-2"
				>
					{content.title}
				</motion.h1>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="text-base sm:text-xl md:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto text-foreground/80 dark:text-white/90 leading-relaxed px-2"
				>
					<RichTextViewer content={content.subtitle} />
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className="px-4"
				>
					<a
						href={content.ctaLink}
						className="group inline-flex items-center justify-center gap-2 sm:gap-3 bg-linear-to-r from-primary to-secondary hover:from-primary-dark hover:to-primary text-white font-semibold px-6 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 active:scale-95 min-h-12 sm:min-h-0 w-full sm:w-auto max-w-sm"
					>
						{content.ctaText}
						<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
					</a>
				</motion.div>
			</div>
		</section>
	);
}
