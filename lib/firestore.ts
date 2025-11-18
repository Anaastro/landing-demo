import { db, storage } from "./firebase";
import {
	doc,
	getDoc,
	setDoc,
	collection,
	DocumentData,
	Timestamp,
} from "firebase/firestore";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { LandingContent } from "./types";

const LANDING_DOC_ID = "main";

// Obtener el contenido de la landing
export async function getLandingContent(): Promise<LandingContent | null> {
	try {
		const docRef = doc(db, "landing", LANDING_DOC_ID);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data() as DocumentData;
			return {
				...data,
				updatedAt: data.updatedAt?.toDate() || new Date(),
			} as LandingContent;
		}
		return null;
	} catch (error) {
		console.error("Error getting landing content:", error);
		return null;
	}
}

// Guardar el contenido de la landing
export async function saveLandingContent(
	content: Omit<LandingContent, "updatedAt">
): Promise<boolean> {
	try {
		const docRef = doc(db, "landing", LANDING_DOC_ID);
		await setDoc(docRef, {
			...content,
			updatedAt: Timestamp.now(),
		});
		return true;
	} catch (error) {
		console.error("Error saving landing content:", error);
		return false;
	}
}

// Subir imagen a Storage
export async function uploadImage(
	file: File,
	path: string
): Promise<string | null> {
	try {
		const storageRef = ref(storage, `landing/${path}`);
		await uploadBytes(storageRef, file);
		const downloadURL = await getDownloadURL(storageRef);
		return downloadURL;
	} catch (error) {
		console.error("Error uploading image:", error);
		return null;
	}
}

// Eliminar imagen de Storage
export async function deleteImage(imageUrl: string): Promise<boolean> {
	try {
		const imageRef = ref(storage, imageUrl);
		await deleteObject(imageRef);
		return true;
	} catch (error) {
		console.error("Error deleting image:", error);
		return false;
	}
}

// Contenido inicial por defecto
export const defaultLandingContent: Omit<LandingContent, "updatedAt"> = {
	id: LANDING_DOC_ID,
	logo: {
		text: "Mi Empresa",
		showImage: false,
		imageUrl: "",
	},
	banner: {
		title: "Bienvenido a Nuestra Plataforma",
		subtitle: "La solución perfecta para tu negocio",
		imageUrl: "",
		ctaText: "Comenzar Ahora",
		ctaLink: "#contacto",
	},
	stats: {
		enabled: true,
		stats: [
			{ id: "1", value: "10K+", label: "Clientes Felices", icon: "👥" },
			{ id: "2", value: "99%", label: "Satisfacción", icon: "⭐" },
			{ id: "3", value: "24/7", label: "Soporte", icon: "💬" },
			{ id: "4", value: "50+", label: "Países", icon: "🌍" },
		],
	},
	features: [
		{
			id: "1",
			title: "Fácil de Usar",
			description: "Interfaz intuitiva diseñada para todos",
			icon: "🚀",
		},
		{
			id: "2",
			title: "Rápido y Confiable",
			description: "Rendimiento optimizado garantizado",
			icon: "⚡",
		},
		{
			id: "3",
			title: "Soporte 24/7",
			description: "Siempre disponibles para ayudarte",
			icon: "💬",
		},
	],
	products: {
		enabled: false,
		title: "Nuestros Planes",
		subtitle: "Elige el plan perfecto para tu negocio",
		products: [
			{
				id: "1",
				name: "Básico",
				description: "Perfecto para empezar",
				price: "$29/mes",
				features: ["5 Usuarios", "10GB Almacenamiento", "Soporte Email"],
			},
			{
				id: "2",
				name: "Pro",
				description: "Para equipos en crecimiento",
				price: "$79/mes",
				features: [
					"Usuarios Ilimitados",
					"100GB Almacenamiento",
					"Soporte Prioritario",
					"API Access",
				],
				highlighted: true,
			},
			{
				id: "3",
				name: "Enterprise",
				description: "Para grandes empresas",
				price: "Personalizado",
				features: [
					"Todo de Pro",
					"Almacenamiento Ilimitado",
					"Soporte 24/7",
					"Gestor Dedicado",
				],
			},
		],
	},
	testimonials: [
		{
			id: "1",
			name: "Juan Pérez",
			role: "CEO, Empresa XYZ",
			content: "Esta plataforma transformó completamente nuestro negocio.",
			rating: 5,
		},
	],
	cta: {
		title: "¿Listo para empezar?",
		description: "Únete a miles de empresas que ya confían en nosotros",
		buttonText: "Contactar Ahora",
		buttonLink: "#contacto",
	},
	footer: {
		companyName: "Mi Empresa",
		description: "Innovación y excelencia desde 2025",
		email: "info@miempresa.com",
		phone: "+34 900 000 000",
		address: "Calle Principal 123, Madrid, España",
		socialLinks: {
			facebook: "https://facebook.com",
			twitter: "https://twitter.com",
			instagram: "https://instagram.com",
			linkedin: "https://linkedin.com",
		},
	},
};
