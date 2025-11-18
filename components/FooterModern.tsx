"use client";

import { FooterContent } from "@/lib/types";
import { motion } from "framer-motion";
import {
	Mail,
	Phone,
	MapPin,
	Facebook,
	Twitter,
	Instagram,
	Linkedin,
	Heart,
} from "lucide-react";

interface FooterProps {
	content: FooterContent;
}

export default function FooterModern({ content }: FooterProps) {
	const socialIcons = {
		facebook: Facebook,
		twitter: Twitter,
		instagram: Instagram,
		linkedin: Linkedin,
	};

	return (
		<footer className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-950 dark:to-black text-white py-16">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
					{/* Sección de marca */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
							{content.companyName}
						</h3>
						<p className="text-gray-400 mb-6 leading-relaxed">
							{content.description}
						</p>
						<div className="flex gap-3">
							{content.socialLinks.facebook && (
								<a
									href={content.socialLinks.facebook}
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
								>
									<Facebook className="w-5 h-5" />
								</a>
							)}
							{content.socialLinks.twitter && (
								<a
									href={content.socialLinks.twitter}
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
								>
									<Twitter className="w-5 h-5" />
								</a>
							)}
							{content.socialLinks.instagram && (
								<a
									href={content.socialLinks.instagram}
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
								>
									<Instagram className="w-5 h-5" />
								</a>
							)}
							{content.socialLinks.linkedin && (
								<a
									href={content.socialLinks.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
								>
									<Linkedin className="w-5 h-5" />
								</a>
							)}
						</div>
					</motion.div>

					{/* Contacto */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						<h4 className="text-xl font-bold mb-6 text-white">Contacto</h4>
						<div className="space-y-4">
							<a
								href={`mailto:${content.email}`}
								className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors group"
							>
								<div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
									<Mail className="w-5 h-5" />
								</div>
								<span>{content.email}</span>
							</a>
							<a
								href={`tel:${content.phone}`}
								className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors group"
							>
								<div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
									<Phone className="w-5 h-5" />
								</div>
								<span>{content.phone}</span>
							</a>
							<div className="flex items-start gap-3 text-gray-400">
								<div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
									<MapPin className="w-5 h-5" />
								</div>
								<span>{content.address}</span>
							</div>
						</div>
					</motion.div>

					{/* Enlaces rápidos */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<h4 className="text-xl font-bold mb-6 text-white">Enlaces</h4>
						<ul className="space-y-3">
							{[
								"Inicio",
								"Servicios",
								"Sobre Nosotros",
								"Blog",
								"Contacto",
							].map((link) => (
								<li key={link}>
									<a
										href={`#${link.toLowerCase()}`}
										className="text-gray-400 hover:text-primary transition-colors hover:translate-x-1 inline-block"
									>
										{link}
									</a>
								</li>
							))}
						</ul>
					</motion.div>

					{/* Accesos Rápidos */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<h4 className="text-xl font-bold mb-6 text-white">
							Accesos Rápidos
						</h4>
						<div className="space-y-3">
							<a
								href="#features"
								className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 text-white transition-all group"
							>
								<span className="text-primary text-xl">⚡</span>
								<span className="font-semibold group-hover:translate-x-1 transition-transform">
									Ver Características
								</span>
							</a>
							<a
								href="#products"
								className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 text-white transition-all group"
							>
								<span className="text-primary text-xl">💎</span>
								<span className="font-semibold group-hover:translate-x-1 transition-transform">
									Ver Planes
								</span>
							</a>
							<a
								href={`tel:${content.phone?.replace(/\s/g, "") || ""}`}
								className="flex items-center gap-3 px-4 py-3 rounded-lg bg-linear-to-r from-primary to-secondary hover:from-primary-dark hover:to-primary text-white transition-all hover:scale-105 font-bold shadow-lg"
							>
								<span className="text-xl">📞</span>
								<span>Llamar Ahora</span>
							</a>
						</div>
					</motion.div>
				</div>

				{/* Línea divisoria */}
				<div className="border-t border-white/10 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
						<p className="flex items-center gap-2">
							&copy; {new Date().getFullYear()} {content.companyName}. Todos los
							derechos reservados.
						</p>
						<p className="flex items-center gap-2">
							Hecho con <Heart className="w-4 h-4 text-red-500 fill-current" />{" "}
							en España
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
