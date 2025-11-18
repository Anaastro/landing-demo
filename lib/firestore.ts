import { db, storage } from "./firebase";
import {
	doc,
	getDoc,
	setDoc,
	collection,
	DocumentData,
	Timestamp,
	addDoc,
	getDocs,
	query,
	orderBy,
	updateDoc,
} from "firebase/firestore";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { LandingContent, ContactSubmission } from "./types";

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

// Subir imagen a Storage con reintentos
export async function uploadImage(
	file: File,
	path: string,
	retries: number = 3
): Promise<string | null> {
	let lastError: any = null;

	for (let attempt = 0; attempt < retries; attempt++) {
		try {
			// Agregar timestamp único para evitar conflictos
			const uniquePath = `${path}-${Date.now()}`;
			const storageRef = ref(storage, `landing/${uniquePath}`);

			// Crear blob desde el archivo para evitar problemas con AbortController
			const blob = new Blob([await file.arrayBuffer()], { type: file.type });

			// Subir con metadata
			const metadata = {
				contentType: file.type,
				customMetadata: {
					originalName: file.name,
					uploadedAt: new Date().toISOString(),
				},
			};

			await uploadBytes(storageRef, blob, metadata);
			const downloadURL = await getDownloadURL(storageRef);
			return downloadURL;
		} catch (error: any) {
			lastError = error;
			console.warn(
				`Upload attempt ${attempt + 1} failed:`,
				error?.message || error
			);

			// Si es un AbortError, esperar un poco antes de reintentar
			if (error?.name === "AbortError" || error?.code === "ABORT_ERR") {
				if (attempt < retries - 1) {
					await new Promise((resolve) =>
						setTimeout(resolve, 500 * (attempt + 1))
					);
					continue;
				}
			}

			// Para otros errores, fallar inmediatamente
			if (error?.name !== "AbortError" && error?.code !== "ABORT_ERR") {
				break;
			}
		}
	}

	console.error("Error uploading image after retries:", lastError);
	return null;
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
				whatsapp: {
					enabled: false,
					phoneNumber: "",
					message: "Hola, estoy interesado en el plan Básico",
				},
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
				whatsapp: {
					enabled: false,
					phoneNumber: "",
					message: "Hola, estoy interesado en el plan Pro",
				},
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
				whatsapp: {
					enabled: false,
					phoneNumber: "",
					message: "Hola, estoy interesado en el plan Enterprise",
				},
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
	contactForm: {
		enabled: true,
		title: "Contáctanos",
		subtitle:
			"Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.",
		buttonText: "Enviar Mensaje",
		successMessage: "¡Gracias por contactarnos! Te responderemos pronto.",
		fields: [
			{
				id: "1",
				name: "nombre",
				label: "Nombre completo",
				type: "text" as const,
				placeholder: "Juan Pérez",
				required: true,
				order: 1,
			},
			{
				id: "2",
				name: "email",
				label: "Correo electrónico",
				type: "email" as const,
				placeholder: "juan@ejemplo.com",
				required: true,
				order: 2,
			},
			{
				id: "3",
				name: "telefono",
				label: "Teléfono",
				type: "tel" as const,
				placeholder: "+34 600 000 000",
				required: false,
				order: 3,
			},
			{
				id: "4",
				name: "asunto",
				label: "Asunto",
				type: "select" as const,
				placeholder: "Selecciona un asunto",
				required: true,
				options: [
					"Consulta general",
					"Soporte técnico",
					"Ventas",
					"Partnership",
					"Otro",
				],
				order: 4,
			},
			{
				id: "5",
				name: "mensaje",
				label: "Mensaje",
				type: "textarea" as const,
				placeholder: "Escribe tu mensaje aquí...",
				required: true,
				order: 5,
			},
		],
	},
};

// Funciones para formulario de contacto
export async function saveContactSubmission(
	formData: Record<string, string>
): Promise<boolean> {
	try {
		if (!formData || Object.keys(formData).length === 0) {
			console.error("Form data is empty");
			return false;
		}

		const docRef = await addDoc(collection(db, "contact_submissions"), {
			formData,
			submittedAt: Timestamp.now(),
			read: false,
		});

		console.log("Contact submission saved with ID:", docRef.id);
		return true;
	} catch (error) {
		console.error("Error saving contact submission:", error);
		return false;
	}
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
	try {
		const q = query(
			collection(db, "contact_submissions"),
			orderBy("submittedAt", "desc")
		);
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				formData: data.formData,
				submittedAt: data.submittedAt?.toDate() || new Date(),
				read: data.read || false,
			};
		});
	} catch (error) {
		console.error("Error getting contact submissions:", error);
		return [];
	}
}

export async function markSubmissionAsRead(
	submissionId: string
): Promise<boolean> {
	try {
		const docRef = doc(db, "contact_submissions", submissionId);
		await updateDoc(docRef, { read: true });
		return true;
	} catch (error) {
		console.error("Error marking submission as read:", error);
		return false;
	}
}
