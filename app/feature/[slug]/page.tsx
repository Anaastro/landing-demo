"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getLandingContent } from "@/lib/firestore";
import { Feature } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import RichTextViewer from "@/components/RichTextViewer";

export default function FeatureDetailPage() {
	const params = useParams();
	const slug = params.slug as string;
	const [feature, setFeature] = useState<Feature | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadFeature() {
			const content = await getLandingContent();
			if (content) {
				const foundFeature = content.features.find((f) => f.slug === slug);
				setFeature(foundFeature || null);
			}
			setLoading(false);
		}
		loadFeature();
	}, [slug]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!feature) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<h1 className="text-4xl font-bold mb-4 text-foreground">
						Característica no encontrada
					</h1>
					<Link
						href="/"
						className="text-primary hover:text-primary-dark transition-colors"
					>
						Volver al inicio
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 overflow-hidden">
				<div className="absolute inset-0 bg-linear-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/20 dark:via-secondary/10 dark:to-accent/20" />

				{/* Decorative elements */}
				<motion.div
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 0.1, scale: 1 }}
					transition={{ duration: 1.5 }}
					className="absolute top-20 right-20 w-72 h-72 bg-primary rounded-full blur-3xl"
				/>
				<motion.div
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 0.1, scale: 1 }}
					transition={{ duration: 1.5, delay: 0.2 }}
					className="absolute bottom-20 left-20 w-96 h-96 bg-secondary rounded-full blur-3xl"
				/>

				<div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
					<Link
						href="/#features"
						className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-8 group"
					>
						<ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
						Volver a características
					</Link>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20"
					>
						<Sparkles className="w-4 h-4 text-primary" />
						<span className="text-sm font-medium text-foreground">
							Característica destacada
						</span>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="flex items-center gap-4 mb-6"
					>
						<div className="text-6xl">{feature.icon}</div>
						<h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-accent">
							{feature.title}
						</h1>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-xl text-muted-foreground mb-8"
					>
						<RichTextViewer content={feature.description} />
					</motion.div>
				</div>
			</section>

			{/* Main Content Section */}
			<section className="py-20 bg-muted/30 dark:bg-background">
				<div className="max-w-5xl mx-auto px-6 lg:px-8">
					{feature.imageUrl && (
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="relative w-full h-96 mb-12 rounded-2xl overflow-hidden shadow-2xl"
						>
							<Image
								src={feature.imageUrl}
								alt={feature.title}
								fill
								className="object-cover"
							/>
						</motion.div>
					)}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						<div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border">
							<h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
								Detalles completos
							</h2>
							{feature.detailedContent ? (
								<RichTextViewer content={feature.detailedContent} />
							) : (
								<RichTextViewer content={feature.description} />
							)}
						</div>
					</motion.div>{" "}
					{/* CTA Section */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="mt-16 text-center"
					>
						<div className="bg-linear-to-r from-primary to-secondary p-8 rounded-2xl shadow-2xl">
							<h3 className="text-3xl font-bold text-white mb-4">
								¿Listo para comenzar?
							</h3>
							<p className="text-white/90 text-lg mb-6">
								Descubre cómo esta característica puede transformar tu negocio
							</p>
							<Link
								href="/#contact"
								className="inline-flex items-center gap-2 bg-white text-primary hover:bg-gray-50 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
							>
								Contáctanos ahora
								<ArrowLeft className="w-5 h-5 rotate-180" />
							</Link>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
