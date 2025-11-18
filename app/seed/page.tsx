"use client";

import { useState } from "react";
import { saveLandingContent } from "@/lib/firestore";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Database } from "lucide-react";

export default function SeedPage() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	// Datos de prueba completos
	const seedData = {
		id: "main",
		logo: {
			text: "TechStart",
			showImage: false,
			imageUrl: "",
		},
		banner: {
			title: "Transforma Tu Negocio con Tecnología",
			subtitle:
				"La plataforma todo-en-uno para empresas modernas que quieren crecer más rápido",
			imageUrl:
				"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80",
			ctaText: "Comenzar Gratis",
			ctaLink: "#contacto",
		},
		stats: {
			enabled: true,
			stats: [
				{
					id: "1",
					value: "15K+",
					label: "Clientes Satisfechos",
					icon: "👥",
				},
				{
					id: "2",
					value: "98%",
					label: "Tasa de Éxito",
					icon: "⭐",
				},
				{
					id: "3",
					value: "24/7",
					label: "Soporte Disponible",
					icon: "💬",
				},
				{
					id: "4",
					value: "85+",
					label: "Países Activos",
					icon: "🌍",
				},
			],
		},
		features: [
			{
				id: "1",
				title: "Diseño Intuitivo",
				description:
					"Interfaz moderna y fácil de usar, diseñada pensando en la experiencia del usuario",
				icon: "🎨",
				slug: "diseno-intuitivo",
				imageUrl:
					"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
			},
			{
				id: "2",
				title: "Alto Rendimiento",
				description:
					"Optimizado para velocidad y eficiencia, manejando miles de operaciones por segundo",
				icon: "⚡",
				slug: "alto-rendimiento",
				imageUrl:
					"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
			},
			{
				id: "3",
				title: "Seguridad Avanzada",
				description:
					"Protección de datos de nivel empresarial con encriptación end-to-end",
				icon: "🔒",
				slug: "seguridad-avanzada",
				imageUrl:
					"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
			},
			{
				id: "4",
				title: "Integración Fácil",
				description:
					"Conecta con tus herramientas favoritas mediante APIs potentes y documentadas",
				icon: "🔌",
				slug: "integracion-facil",
			},
			{
				id: "5",
				title: "Analytics en Tiempo Real",
				description:
					"Dashboard completo con métricas y reportes para tomar decisiones informadas",
				icon: "📊",
				slug: "analytics-tiempo-real",
			},
			{
				id: "6",
				title: "Soporte Premium",
				description:
					"Equipo experto disponible 24/7 para ayudarte cuando lo necesites",
				icon: "💪",
				slug: "soporte-premium",
			},
		],
		products: {
			enabled: true,
			title: "Planes Diseñados Para Ti",
			subtitle: "Elige el plan perfecto para tu equipo y empieza hoy mismo",
			products: [
				{
					id: "1",
					name: "Starter",
					description: "Perfecto para emprendedores y pequeños equipos",
					price: "$29/mes",
					features: [
						"Hasta 5 usuarios",
						"10GB de almacenamiento",
						"Soporte por email",
						"Panel de analytics básico",
						"Integraciones básicas",
					],
					imageUrl:
						"https://images.unsplash.com/photo-1557821552-17105176677c?w=400&q=80",
				},
				{
					id: "2",
					name: "Professional",
					description: "Ideal para equipos en crecimiento",
					price: "$79/mes",
					features: [
						"Usuarios ilimitados",
						"100GB de almacenamiento",
						"Soporte prioritario 24/7",
						"Analytics avanzados",
						"Todas las integraciones",
						"API de acceso completo",
						"Reportes personalizados",
					],
					highlighted: true,
					imageUrl:
						"https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80",
				},
				{
					id: "3",
					name: "Enterprise",
					description: "Soluciones a medida para grandes empresas",
					price: "Personalizado",
					features: [
						"Todo del plan Professional",
						"Almacenamiento ilimitado",
						"Gestor de cuenta dedicado",
						"SLA garantizado 99.9%",
						"Onboarding personalizado",
						"Desarrollo de features custom",
						"Auditorías de seguridad",
					],
					imageUrl:
						"https://images.unsplash.com/photo-1552581234-26160f608093?w=400&q=80",
				},
			],
		},
		testimonials: [
			{
				id: "1",
				name: "María García",
				role: "CEO, InnovateTech",
				content:
					"Esta plataforma transformó completamente nuestra forma de trabajar. La productividad aumentó un 300% en solo 3 meses.",
				rating: 5,
				avatarUrl:
					"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
			},
			{
				id: "2",
				name: "Carlos Rodríguez",
				role: "CTO, DataFlow Solutions",
				content:
					"La mejor inversión que hemos hecho. El soporte técnico es excepcional y las funcionalidades superaron nuestras expectativas.",
				rating: 5,
				avatarUrl:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
			},
			{
				id: "3",
				name: "Ana Martínez",
				role: "Product Manager, StartupHub",
				content:
					"Fácil de usar, potente y escalable. Exactamente lo que necesitábamos para llevar nuestro producto al siguiente nivel.",
				rating: 5,
				avatarUrl:
					"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
			},
			{
				id: "4",
				name: "David López",
				role: "Founder, GrowthLab",
				content:
					"La integración con nuestras herramientas existentes fue fluida. Ahora tenemos todo centralizado en un solo lugar.",
				rating: 5,
				avatarUrl:
					"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
			},
			{
				id: "5",
				name: "Laura Fernández",
				role: "COO, CloudVentures",
				content:
					"ROI positivo desde el primer mes. El equipo está más feliz y los clientes han notado la mejora en nuestro servicio.",
				rating: 5,
				avatarUrl:
					"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80",
			},
			{
				id: "6",
				name: "Roberto Sánchez",
				role: "Director, TechScale",
				content:
					"Después de probar varias alternativas, esta es la única que cumple con todos nuestros requisitos. Altamente recomendada.",
				rating: 5,
				avatarUrl:
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
			},
		],
		cta: {
			title: "¿Listo Para Transformar Tu Negocio?",
			description:
				"Únete a más de 15,000 empresas que ya están creciendo con nuestra plataforma. Comienza gratis hoy mismo, sin tarjeta de crédito.",
			buttonText: "Comenzar Ahora - Gratis",
			buttonLink: "#contacto",
			backgroundImageUrl:
				"https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80",
		},
		footer: {
			companyName: "TechStart",
			description:
				"Innovación y tecnología al servicio de tu negocio. Transformamos ideas en realidades digitales.",
			email: "contacto@techstart.com",
			phone: "+34 900 123 456",
			address: "Calle Innovación 123, Madrid, España",
			socialLinks: {
				facebook: "https://facebook.com/techstart",
				twitter: "https://twitter.com/techstart",
				instagram: "https://instagram.com/techstart",
				linkedin: "https://linkedin.com/company/techstart",
			},
		},
	};

	async function handleSeed() {
		setLoading(true);
		setMessage(null);

		try {
			const success = await saveLandingContent(seedData);

			if (success) {
				setMessage({
					type: "success",
					text: "✅ Base de datos poblada exitosamente! Ahora puedes ir a la landing page o al admin panel para ver y editar el contenido.",
				});
			} else {
				setMessage({
					type: "error",
					text: "❌ Error al poblar la base de datos. Verifica tu configuración de Firebase.",
				});
			}
		} catch (error) {
			console.error("Error:", error);
			setMessage({
				type: "error",
				text:
					"❌ Error al poblar la base de datos: " + (error as Error).message,
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="max-w-2xl w-full"
			>
				<div className="bg-card rounded-2xl shadow-modern p-8 border border-border/50">
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-secondary mb-4">
							<Database className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-4xl font-bold mb-2">Seed de Base de Datos</h1>
						<p className="text-muted-foreground">
							Popula Firestore con datos de prueba completos
						</p>
					</div>

					{message && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
								message.type === "success"
									? "bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400"
									: "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
							}`}
						>
							{message.type === "success" ? (
								<CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
							) : (
								<AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
							)}
							<span className="text-sm">{message.text}</span>
						</motion.div>
					)}

					<div className="bg-muted/30 rounded-xl p-6 mb-6">
						<h2 className="font-bold mb-3 flex items-center gap-2">
							📋 Contenido que se creará:
						</h2>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="flex items-center gap-2">
								<span className="text-primary">✓</span> Logo configurado
								(TechStart)
							</li>
							<li className="flex items-center gap-2">
								<span className="text-primary">✓</span> Banner con imagen de
								fondo
							</li>
							<li className="flex items-center gap-2">
								<span className="text-primary">✓</span> 4 estadísticas animadas
							</li>
							<li className="flex items-center gap-2">
								<span className="text-primary">✓</span> 6 características con
								imágenes
							</li>
							<li className="flex items-center gap-2">
								<span className="text-primary">✓</span> 3 planes/productos
								(Starter, Pro, Enterprise)
							</li>
							<li className="flex items-center gap-2">
								<span className="text-primary">✓</span> 6 testimonios de
								clientes
							</li>
							<li className="flex items-center gap-2">
								<span className="text-primary">✓</span> Sección CTA completa
							</li>
							<li className="flex items-center gap-2">
								<span className="text-primary">✓</span> Footer con redes
								sociales
							</li>
						</ul>
					</div>

					<div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
						<p className="text-sm text-yellow-600 dark:text-yellow-400">
							<strong>⚠️ Advertencia:</strong> Esto sobrescribirá cualquier
							contenido existente en Firestore.
						</p>
					</div>

					<button
						onClick={handleSeed}
						disabled={loading}
						className="w-full py-4 rounded-xl bg-linear-to-r from-primary to-secondary hover:from-primary-dark hover:to-primary text-white font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
					>
						{loading ? (
							<>
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								Poblando base de datos...
							</>
						) : (
							<>
								<Database className="w-5 h-5" />
								Poblar Base de Datos
							</>
						)}
					</button>

					<div className="mt-6 flex gap-3">
						<a
							href="/"
							className="flex-1 py-3 rounded-xl bg-muted hover:bg-muted/80 text-center font-semibold transition-colors"
						>
							Ver Landing Page
						</a>
						<a
							href="/admin"
							className="flex-1 py-3 rounded-xl bg-muted hover:bg-muted/80 text-center font-semibold transition-colors"
						>
							Ir al Admin Panel
						</a>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
