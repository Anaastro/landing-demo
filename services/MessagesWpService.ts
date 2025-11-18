import { messageService } from "./MessageService";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
	addDoc,
	collection,
	getDocs,
	query,
	Timestamp,
	where,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";

interface CreateMessageLogParams {
	phone: string;
	mensaje: string;
	assistant?: string | null;
}

interface CreateMessageLogMediaParams extends CreateMessageLogParams {
	fileUrl: string;
	type?: string;
}

export default class MessagesWpService {
	static async createMessageLog({
		phone,
		mensaje,
		assistant = null,
	}: CreateMessageLogParams) {
		try {
			if (assistant) {
				await messageService.sendMessageAssistant({
					phoneNumber: phone.replace("+", ""),
					message: mensaje,
					assistant,
				});
			} else {
				await messageService.sendWaMessageWaapi({
					phoneNumber: phone.replace("+", ""),
					message: mensaje,
				});
			}

			await addDoc(collection(db, "mensajes_whatsapp"), {
				mensaje,
				para: phone,
				fecha: Timestamp.now(),
			});

			return true;
		} catch (error) {
			console.error("Error creating message log:", (error as Error).message);
			throw new Error("Error creating message log");
		}
	}

	static async createMessageLogMedia({
		phone,
		mensaje,
		fileUrl,
		type,
		assistant = null,
	}: CreateMessageLogMediaParams) {
		try {
			await messageService.sendMedia({
				phoneNumber: phone.replace("+", ""),
				message: mensaje,
				type: type,
				url: fileUrl,
				assistant: assistant,
			});

			await addDoc(collection(db, "mensajes_whatsapp"), {
				mensaje,
				para: phone,
				media: fileUrl,
				fecha: Timestamp.now(),
			});

			return true;
		} catch (error) {
			console.error("Error creating message log:", (error as Error).message);
			throw new Error("Error creating message log");
		}
	}

	static async uploadMedia({ file }: { file: File }): Promise<string> {
		try {
			const storageRef = ref(storage, `mensajes/${file.name}`);
			const snapshot = await uploadBytes(storageRef, file);
			return getDownloadURL(snapshot.ref);
		} catch (error) {
			console.error("Error uploading media:", (error as Error).message);
			throw new Error("Error uploading media");
		}
	}

	static async getWhatsappPorDia(days = 7): Promise<number> {
		const ahora = new Date();

		// Fecha desde la que contamos (ej: últimos 7 días)
		const desde = new Date(
			ahora.getFullYear(),
			ahora.getMonth(),
			ahora.getDate() - (days - 1),
			0,
			0,
			0,
			0
		);

		const colRef = collection(db, "mensajes_whatsapp");
		const q = query(colRef, where("fecha", ">=", Timestamp.fromDate(desde)));

		const snapshot = await getDocs(q);
		const totalMensajes = snapshot.size;

		if (days <= 0) return totalMensajes;

		const promedio = totalMensajes / days;

		// Si quieres número “bonito”
		return Number(promedio.toFixed(1));
	}
}
