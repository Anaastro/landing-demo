// Script para poblar Firestore con datos de prueba completos
// Ejecutar: node scripts/seed.js

const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // Descarga desde Firebase Console

// Inicializar Firebase Admin
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();

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
			imageUrl:
				"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
		},
		{
			id: "2",
			title: "Alto Rendimiento",
			description:
				"Optimizado para velocidad y eficiencia, manejando miles de operaciones por segundo",
			icon: "⚡",
			imageUrl:
				"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
		},
		{
			id: "3",
			title: "Seguridad Avanzada",
			description:
				"Protección de datos de nivel empresarial con encriptación end-to-end",
			icon: "🔒",
			imageUrl:
				"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
		},
		{
			id: "4",
			title: "Integración Fácil",
			description:
				"Conecta con tus herramientas favoritas mediante APIs potentes y documentadas",
			icon: "🔌",
		},
		{
			id: "5",
			title: "Analytics en Tiempo Real",
			description:
				"Dashboard completo con métricas y reportes para tomar decisiones informadas",
			icon: "📊",
		},
		{
			id: "6",
			title: "Soporte Premium",
			description:
				"Equipo experto disponible 24/7 para ayudarte cuando lo necesites",
			icon: "💪",
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
	updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

// Función principal de seed
async function seedDatabase() {
	try {
		console.log("🌱 Iniciando seed de la base de datos...\n");

		// Subir datos a Firestore
		await db.collection("landing").doc("main").set(seedData);

		console.log("✅ Datos subidos exitosamente a Firestore!\n");
		console.log("📋 Resumen de datos creados:");
		console.log(`   - Logo: ${seedData.logo.text}`);
		console.log(`   - Banner: "${seedData.banner.title}"`);
		console.log(`   - Estadísticas: ${seedData.stats.stats.length} items`);
		console.log(`   - Características: ${seedData.features.length} items`);
		console.log(`   - Productos: ${seedData.products.products.length} planes`);
		console.log(`   - Testimonios: ${seedData.testimonials.length} clientes`);
		console.log(`   - CTA: "${seedData.cta.title}"`);
		console.log(`   - Footer: ${seedData.footer.companyName}\n`);

		console.log("🎉 Seed completado! Ahora puedes:");
		console.log("   1. Ver la landing page en http://localhost:3000");
		console.log("   2. Editar contenido en http://localhost:3000/admin");
		console.log("   3. Probar agregar, modificar y eliminar elementos\n");

		process.exit(0);
	} catch (error) {
		console.error("❌ Error al hacer seed:", error);
		process.exit(1);
	}
}

// Ejecutar seed
seedDatabase();
