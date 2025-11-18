"use client";

import { motion } from "framer-motion";
import { ProductsSection } from "@/lib/types";
import { Check, Sparkles } from "lucide-react";
import RichTextViewer from "./RichTextViewer";

interface ProductsProps {
	products: ProductsSection;
}

export default function Products({ products }: ProductsProps) {
	if (!products.enabled) return null;

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
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
		<section
			id="products"
			className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
		>
			{/* Fondo decorativo */}
			<div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-primary/5 rounded-full blur-3xl" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Título */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7 }}
					className="text-center mb-10 sm:mb-16"
				>
					<motion.div
						initial={{ scale: 0 }}
						whileInView={{ scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-primary to-secondary mb-4 sm:mb-6"
					>
						<Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
					</motion.div>
					<h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 px-2">
						<span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
							{products.title}
						</span>
					</h2>
					<p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
						{products.subtitle}
					</p>
				</motion.div>

				{/* Grid de productos */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
				>
					{products.products.map((product) => (
						<motion.div
							key={product.id}
							variants={itemVariants}
							whileHover={{ y: -10, scale: 1.02 }}
							className={`group relative ${
								product.highlighted ? "md:-mt-8" : ""
							}`}
						>
							{/* Badge de destacado */}
							{product.highlighted && (
								<div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
									<div className="px-4 py-1.5 rounded-full bg-linear-to-r from-primary to-secondary text-white text-sm font-bold shadow-lg">
										Más Popular
									</div>
								</div>
							)}

							{/* Card */}
							<div
								className={`relative h-full p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 ${
									product.highlighted
										? "bg-card dark:bg-card border-primary/50 shadow-2xl shadow-primary/20"
										: "bg-card/60 dark:bg-card/30 border-border/50 shadow-modern hover:shadow-modern-hover"
								}`}
							>
								{/* Borde animado para destacado */}
								{product.highlighted && (
									<div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/20 via-secondary/20 to-primary/20 animate-gradient" />
								)}

								<div className="relative z-10">
									{/* Imagen del producto (opcional) */}
									{product.imageUrl && (
										<div className="mb-6 rounded-2xl overflow-hidden">
											<img
												src={product.imageUrl}
												alt={product.name}
												className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
											/>
										</div>
									)}
									{/* Nombre y descripción */}
									<h3 className="text-2xl font-bold mb-2 text-card-foreground">
										{product.name}
									</h3>
									<div className="text-muted-foreground mb-6">
										<RichTextViewer content={product.description} />
									</div>{" "}
									{/* Precio */}
									<div className="mb-8">
										<div
											className={`text-4xl font-bold ${
												product.highlighted
													? "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent"
													: "text-foreground"
											}`}
										>
											{product.price}
										</div>
									</div>
									{/* Características */}
									<ul className="space-y-4 mb-8">
										{product.features.map((feature, index) => (
											<motion.li
												key={index}
												initial={{ opacity: 0, x: -20 }}
												whileInView={{ opacity: 1, x: 0 }}
												viewport={{ once: true }}
												transition={{ delay: index * 0.1 }}
												className="flex items-start gap-3"
											>
												<div
													className={`mt-1 p-1 rounded-full ${
														product.highlighted ? "bg-primary/20" : "bg-muted"
													}`}
												>
													<Check
														className={`w-4 h-4 ${
															product.highlighted
																? "text-primary"
																: "text-muted-foreground"
														}`}
													/>
												</div>
												<span className="text-card-foreground">{feature}</span>
											</motion.li>
										))}
									</ul>
									{/* Botón de acción */}
									{product.whatsapp?.enabled && product.whatsapp.phoneNumber ? (
										<a
											href={`https://wa.me/${product.whatsapp.phoneNumber.replace(
												/\D/g,
												""
											)}?text=${encodeURIComponent(
												product.whatsapp.message ||
													`Hola, estoy interesado en el plan ${product.name}`
											)}`}
											target="_blank"
											rel="noopener noreferrer"
											className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
												product.highlighted
													? "bg-linear-to-r from-primary to-secondary text-white hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
													: "bg-muted hover:bg-muted/80 text-foreground hover:scale-105"
											}`}
										>
											<svg
												className="w-5 h-5"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
											</svg>
											Contactar por WhatsApp
										</a>
									) : (
										<button
											className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
												product.highlighted
													? "bg-linear-to-r from-primary to-secondary text-white hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
													: "bg-muted hover:bg-muted/80 text-foreground hover:scale-105"
											}`}
										>
											Elegir Plan
										</button>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Mensaje adicional */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.5 }}
					className="mt-16 text-center"
				>
					<p className="text-muted-foreground">
						¿Necesitas un plan personalizado?{" "}
						<a
							href="#contacto"
							className="text-primary hover:text-primary-dark font-semibold underline"
						>
							Contáctanos
						</a>
					</p>
				</motion.div>
			</div>
		</section>
	);
}
