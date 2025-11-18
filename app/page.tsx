"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";
import CTAModern from "@/components/CTAModern";
import ContactForm from "@/components/ContactForm";
import FooterModern from "@/components/FooterModern";
import {
	getLandingContent,
	defaultLandingContent,
	saveLandingContent,
} from "@/lib/firestore";
import { LandingContent } from "@/lib/types";
import { Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function Home() {
	const [content, setContent] = useState<LandingContent | null>(null);
	const [loading, setLoading] = useState(true);
	const { theme, toggleTheme } = useTheme();

	useEffect(() => {
		async function loadContent() {
			try {
				let landingContent = await getLandingContent();

				// Si no existe contenido, crear uno por defecto
				if (!landingContent) {
					await saveLandingContent(defaultLandingContent);
					landingContent = await getLandingContent();
				}

				setContent(landingContent);
			} catch (error) {
				console.error("Error loading content:", error);
			} finally {
				setLoading(false);
			}
		}

		loadContent();
	}, []);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center"
				>
					<Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
					<p className="text-xl font-semibold text-foreground">Cargando...</p>
				</motion.div>
			</div>
		);
	}

	if (!content) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<div className="text-center">
					<p className="text-2xl font-semibold text-red-600 mb-4">
						Error al cargar el contenido
					</p>
					<button
						onClick={() => window.location.reload()}
						className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
					>
						Reintentar
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Navbar fijo */}
			<Navbar
				key={`${content.logo.text}-${content.logo.imageUrl}-${content.logo.showImage}`}
				logo={content.logo}
			/>

			{/* Botón de tema flotante */}
			<motion.button
				onClick={toggleTheme}
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 1 }}
				className="fixed top-24 right-6 z-50 p-4 rounded-full bg-card dark:bg-card border border-border shadow-lg hover:scale-110 transition-transform"
				aria-label="Toggle theme"
			>
				{theme === "dark" ? (
					<Sun className="w-5 h-5 text-yellow-500" />
				) : (
					<Moon className="w-5 h-5 text-primary" />
				)}
			</motion.button>

			{/* Contenido principal */}
			<Banner content={content.banner} />
			<Stats stats={content.stats} />
			<Features features={content.features} />
			<Products products={content.products} />
			<Testimonials testimonials={content.testimonials} />
			<CTAModern content={content.cta} />
			{content.contactForm && <ContactForm config={content.contactForm} />}
			<FooterModern content={content.footer} />
		</div>
	);
}
