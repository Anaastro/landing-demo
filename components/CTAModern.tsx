"use client";

import { CTASection } from "@/lib/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";
import RichTextViewer from "./RichTextViewer";

interface CTAProps {
	content: CTASection;
}

export default function CTAModern({ content }: CTAProps) {
	return (
		<section className="relative py-24 overflow-hidden">
			{content.backgroundImageUrl && (
				<>
					<div className="absolute inset-0 z-0">
						<Image
							src={content.backgroundImageUrl}
							alt="CTA Background"
							fill
							className="object-cover"
						/>
					</div>
					<div className="absolute inset-0 bg-linear-to-br from-primary/90 via-secondary/80 to-accent/90 dark:from-primary/95 dark:via-secondary/90 dark:to-accent/95 z-0" />
				</>
			)}

			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"
				/>
			</div>

			<div
				className={`relative z-10 max-w-7xl mx-auto px-6 lg:px-8 ${
					!content.backgroundImageUrl
						? "bg-linear-to-br from-primary via-secondary to-accent rounded-3xl py-20 px-8 shadow-2xl"
						: ""
				}`}
			>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center max-w-4xl mx-auto"
				>
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-6">
						<Rocket className="w-4 h-4" />
						<span className="text-sm font-semibold">COMIENZA HOY</span>
					</div>
					<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
						{content.title}
					</h2>
					<div className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed">
						<RichTextViewer content={content.description} />
					</div>{" "}
					<motion.a
						href={content.buttonLink}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="group inline-flex items-center gap-3 bg-white text-primary hover:bg-gray-50 font-bold px-10 py-5 rounded-2xl text-lg shadow-2xl transition-all duration-300"
					>
						{content.buttonText}
						<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</motion.a>
					<p className="mt-8 text-white/80 text-sm">
						✓ Sin tarjeta de crédito requerida · ✓ Soporte 24/7 · ✓ Cancelación
						gratuita
					</p>
				</motion.div>
			</div>
		</section>
	);
}
