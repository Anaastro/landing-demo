"use client";

import { Feature } from "@/lib/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface FeaturesProps {
	features: Feature[];
}

export default function Features({ features }: FeaturesProps) {
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, y: 50 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<section id="features" className="py-24 bg-muted/30 dark:bg-background">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary mb-4">
						<Zap className="w-4 h-4" />
						<span className="text-sm font-semibold">CARACTERÍSTICAS</span>
					</div>
					<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-foreground to-primary">
						Todo lo que Necesitas
					</h2>
					<p className="text-xl text-foreground/70 dark:text-foreground/80 max-w-2xl mx-auto">
						Herramientas poderosas diseñadas para tu éxito
					</p>
				</motion.div>

				<motion.div
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{features.map((feature, index) => (
						<motion.div
							key={feature.id}
							variants={item}
							whileHover={{ y: -8, transition: { duration: 0.3 } }}
							className="group relative bg-card dark:bg-card rounded-2xl shadow-modern p-8 border border-border/50 dark:border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
						>
							{/* Efecto de brillo al hover */}
							<div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />{" "}
							<div className="relative z-10">
								{feature.imageUrl ? (
									<div className="relative h-48 mb-6 rounded-xl overflow-hidden">
										<Image
											src={feature.imageUrl}
											alt={feature.title}
											fill
											className="object-cover group-hover:scale-110 transition-transform duration-500"
										/>
									</div>
								) : (
									<div className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-linear-to-br from-primary to-secondary text-white text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
										{feature.icon}
									</div>
								)}

								<h3 className="text-2xl font-bold mb-3 text-card-foreground group-hover:text-primary transition-colors">
									{feature.title}
								</h3>
								<p className="text-foreground/70 dark:text-foreground/80 leading-relaxed">
									{feature.description}
								</p>

								{/* Número de feature */}
								<div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
									{index + 1}
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
