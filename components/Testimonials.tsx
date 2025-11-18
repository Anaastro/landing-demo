"use client";

import { motion } from "framer-motion";
import { Testimonial } from "@/lib/types";
import { Quote, Star } from "lucide-react";
import RichTextViewer from "./RichTextViewer";

interface TestimonialsProps {
	testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.7,
				ease: [0.22, 1, 0.36, 1] as const,
			},
		},
	};

	return (
		<section className="relative py-32 overflow-hidden" id="testimonials">
			{/* Fondo con gradiente */}
			<div className="absolute inset-0 bg-linear-to-b from-background via-muted/30 to-background" />

			{/* Decoraciones de fondo */}
			<div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
			<div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

			<div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
				{/* Título con gradiente */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7 }}
					className="text-center mb-16"
				>
					<motion.div
						initial={{ scale: 0 }}
						whileInView={{ scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-secondary mb-6"
					>
						<Quote className="w-8 h-8 text-white" />
					</motion.div>
					<h2 className="text-5xl md:text-6xl font-bold mb-6">
						<span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
							Lo que dicen
						</span>
						<br />
						<span className="text-foreground">nuestros clientes</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						La confianza de nuestros clientes es nuestro mayor logro
					</p>
				</motion.div>

				{/* Grid de testimonios */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.id}
							variants={itemVariants}
							whileHover={{ y: -10, scale: 1.02 }}
							className="group relative"
						>
							{/* Card con glassmorphism */}
							<div className="relative h-full p-8 rounded-2xl bg-card/80 dark:bg-card/50 backdrop-blur-xl border border-border/50 shadow-modern hover:shadow-modern-hover transition-all duration-500">
								{/* Icono de comillas decorativo */}
								<div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
									<Quote className="w-16 h-16 text-primary" />
								</div>

								{/* Borde brillante en hover */}
								<div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/0 via-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:via-secondary/10 group-hover:to-primary/10 transition-all duration-500" />

								<div className="relative z-10">
									{/* Calificación con estrellas */}
									<div className="flex gap-1 mb-4">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`w-5 h-5 ${
													i < testimonial.rating
														? "text-yellow-400 fill-yellow-400"
														: "text-gray-300 dark:text-gray-600"
												} transition-all duration-300 group-hover:scale-110`}
												style={{
													transitionDelay: `${i * 50}ms`,
												}}
											/>
										))}
									</div>
									{/* Contenido del testimonio */}
									<div className="text-muted-foreground leading-relaxed mb-6 text-base">
										<RichTextViewer content={testimonial.content} />
									</div>{" "}
									{/* Información del cliente */}
									<div className="flex items-center gap-4">
										{testimonial.avatarUrl ? (
											<div className="relative">
												<div className="absolute inset-0 rounded-full bg-linear-to-br from-primary to-secondary blur-md opacity-50" />
												<img
													src={testimonial.avatarUrl}
													alt={testimonial.name}
													className="relative w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-800"
												/>
											</div>
										) : (
											<div className="w-14 h-14 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
												{testimonial.name.charAt(0).toUpperCase()}
											</div>
										)}
										<div>
											<h3 className="font-semibold text-card-foreground text-lg">
												{testimonial.name}
											</h3>
											<p className="text-sm text-muted-foreground">
												{testimonial.role}
											</p>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Decoración inferior */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7, delay: 0.5 }}
					className="mt-16 text-center"
				>
					<div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 border border-border/50">
						<div className="flex -space-x-2">
							{testimonials.slice(0, 3).map((t, i) =>
								t.avatarUrl ? (
									<img
										key={i}
										src={t.avatarUrl}
										alt=""
										className="w-8 h-8 rounded-full border-2 border-background"
									/>
								) : (
									<div
										key={i}
										className="w-8 h-8 rounded-full border-2 border-background bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold"
									>
										{t.name.charAt(0)}
									</div>
								)
							)}
						</div>
						<span className="text-sm font-medium text-muted-foreground">
							+{testimonials.length} clientes satisfechos
						</span>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
