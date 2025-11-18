"use client";

import { motion } from "framer-motion";
import { StatsSection } from "@/lib/types";

interface StatsProps {
	stats: StatsSection;
}

export default function Stats({ stats }: StatsProps) {
	if (!stats.enabled) return null;

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
			},
		},
	};

	return (
		<section className="relative py-20 overflow-hidden">
			{/* Fondo con gradiente sutil */}
			<div className="absolute inset-0 bg-linear-to-b from-muted/30 to-background" />

			<div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-8"
				>
					{stats.stats.map((stat, index) => (
						<motion.div
							key={stat.id}
							variants={itemVariants}
							whileHover={{ scale: 1.05, y: -5 }}
							className="text-center group"
						>
							<div className="relative inline-block mb-4">
								{/* Glow effect */}
								<div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-all" />
								<div className="relative text-5xl">{stat.icon}</div>
							</div>
							<motion.div
								initial={{ scale: 0 }}
								whileInView={{ scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
								className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-2"
							>
								{stat.value}
							</motion.div>
							<p className="text-sm md:text-base text-muted-foreground font-medium">
								{stat.label}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
