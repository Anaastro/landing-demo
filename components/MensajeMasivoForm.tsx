"use client";

import React, { useEffect, useMemo, useState } from "react";
import { storage, db } from "@/lib/firebase";
import {
	ref as storageRef,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
	MessageSquare,
	Paperclip,
	X,
	Image as ImageIcon,
	FileText,
	Video,
	Music2,
	Clock,
	Send,
} from "lucide-react";

/* ===== Tipos exportados para el padre ===== */
export type MessageType = "text" | "image" | "video" | "audio" | "document";

export interface Contacto {
	id: string;
	nombre: string;
	apellido: string;
	/** Guardado SIN '+' en Firestore. En UI se muestra con '+' */
	telefono: string;
}

export interface EnvioStatus {
	telefono: string;
	nombre: string;
	estado: "pendiente" | "enviando" | "exitoso" | "error";
	mensaje?: string;
}

/* ===== Tipos y helper para logs en mensajes_whatsapp ===== */
type EstadoEnvioLog = "exitoso" | "error";

interface MensajeWhatsappLog {
	toNumber: string;
	telefonoSinPlus: string;
	nombre: string;
	apellido: string;
	messageType: MessageType;
	content: {
		text?: string;
		mediaUrl?: string;
		mimeType?: string;
		fileName?: string;
	};
	estadoEnvio: EstadoEnvioLog;
	errorMessage?: string;
	delaySegundos: number;
	createdAt: ReturnType<typeof serverTimestamp>;
}

const guardarLogMensajeWhatsapp = async (log: MensajeWhatsappLog) => {
	try {
		// Filtrar campos undefined del objeto content
		const cleanContent: Record<string, string> = {};
		if (log.content.text !== undefined && log.content.text !== null) {
			cleanContent.text = log.content.text;
		}
		if (log.content.mediaUrl !== undefined && log.content.mediaUrl !== null) {
			cleanContent.mediaUrl = log.content.mediaUrl;
		}
		if (log.content.mimeType !== undefined && log.content.mimeType !== null) {
			cleanContent.mimeType = log.content.mimeType;
		}
		if (log.content.fileName !== undefined && log.content.fileName !== null) {
			cleanContent.fileName = log.content.fileName;
		}

		// Crear objeto limpio sin undefined
		const cleanLog: {
			toNumber: string;
			telefonoSinPlus: string;
			nombre: string;
			apellido: string;
			messageType: MessageType;
			content: Record<string, string>;
			estadoEnvio: EstadoEnvioLog;
			delaySegundos: number;
			createdAt: ReturnType<typeof serverTimestamp>;
			errorMessage?: string;
		} = {
			toNumber: log.toNumber,
			telefonoSinPlus: log.telefonoSinPlus,
			nombre: log.nombre,
			apellido: log.apellido,
			messageType: log.messageType,
			content: cleanContent,
			estadoEnvio: log.estadoEnvio,
			delaySegundos: log.delaySegundos,
			createdAt: serverTimestamp(),
		};

		// Solo agregar errorMessage si existe
		if (log.errorMessage !== undefined && log.errorMessage !== null) {
			cleanLog.errorMessage = log.errorMessage;
		}

		await addDoc(collection(db, "mensajes_whatsapp"), cleanLog);
	} catch (e) {
		console.error("No se pudo guardar el log de mensajes_whatsapp", e);
	}
};

/* ===== Utilidades internas ===== */
const EXT_TO_MIME: Record<string, string> = {
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	png: "image/png",
	gif: "image/gif",
	webp: "image/webp",
	mp4: "video/mp4",
	mov: "video/quicktime",
	webm: "video/webm",
	mp3: "audio/mpeg",
	wav: "audio/wav",
	m4a: "audio/mp4",
	ogg: "audio/ogg",
	pdf: "application/pdf",
	doc: "application/msword",
	docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	xls: "application/vnd.ms-excel",
	xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	ppt: "application/vnd.ms-powerpoint",
	pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	txt: "text/plain",
	csv: "text/csv",
	svg: "image/svg+xml",
};

const getExt = (url: string) => {
	try {
		const u = new URL(url);
		const last = u.pathname.split("/").pop() || "";
		const ext = last.split(".").pop() || "";
		return ext.toLowerCase();
	} catch {
		const last = url.split("?")[0].split("#")[0].split("/").pop() || "";
		const ext = last.split(".").pop() || "";
		return ext.toLowerCase();
	}
};

const guessMimeFromUrl = (url: string): string | undefined => {
	const ext = getExt(url);
	return EXT_TO_MIME[ext];
};

const getFilenameFromUrl = (url: string): string | undefined => {
	try {
		const u = new URL(url);
		const last = u.pathname.split("/").pop() || "";
		return decodeURIComponent(last) || undefined;
	} catch {
		const last = url.split("?")[0].split("#")[0].split("/").pop() || "";
		return last || undefined;
	}
};

const messageTypeFromMime = (mime?: string): MessageType => {
	if (!mime) return "document";
	if (mime.startsWith("image/")) return "image";
	if (mime.startsWith("video/")) return "video";
	if (mime.startsWith("audio/")) return "audio";
	if (mime.startsWith("text/") || mime.startsWith("application/"))
		return "document";
	return "document";
};

const sanitizeName = (name: string) =>
	name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);

/* ===== Props ===== */
type Props = {
	contactosSeleccionados: Contacto[]; // a quiénes enviarás
	onStatusesChange: React.Dispatch<React.SetStateAction<EnvioStatus[]>>; // usa setStatusEnvios del padre
	onFinish?: () => void; // opcional al terminar
	initialDelay?: number; // default 3
};

export default function MensajeMasivoForm({
	contactosSeleccionados,
	onStatusesChange,
	onFinish,
	initialDelay = 3,
}: Props) {
	// caption
	const [mensaje, setMensaje] = useState("");
	// media
	const [mediaFile, setMediaFile] = useState<File | null>(null);
	const [mediaUrl, setMediaUrl] = useState("");
	const [mediaInfo, setMediaInfo] = useState<{
		type?: string;
		name?: string;
	} | null>(null);
	const [objectPreview, setObjectPreview] = useState<string | null>(null);

	// upload a storage
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	// delay + envío
	const [delay, setDelay] = useState(initialDelay);
	const [enviando, setEnviando] = useState(false);

	// inferencias
	const inferredType: MessageType = useMemo(() => {
		if (mediaFile) return messageTypeFromMime(mediaFile.type || undefined);
		if (mediaUrl.trim())
			return messageTypeFromMime(guessMimeFromUrl(mediaUrl.trim()));
		return "text";
	}, [mediaFile, mediaUrl]);

	const inferredMime: string | undefined = useMemo(() => {
		if (mediaFile) return mediaFile.type || undefined;
		if (mediaUrl.trim()) return guessMimeFromUrl(mediaUrl.trim());
		return undefined;
	}, [mediaFile, mediaUrl]);

	const inferredFileName: string | undefined = useMemo(() => {
		if (mediaFile) return mediaFile.name || undefined;
		if (mediaUrl.trim()) return getFilenameFromUrl(mediaUrl.trim());
		return undefined;
	}, [mediaFile, mediaUrl]);

	useEffect(() => {
		return () => {
			if (objectPreview) URL.revokeObjectURL(objectPreview);
		};
	}, [objectPreview]);

	/* ---------- Handlers ---------- */
	const handleSelectFile = (file: File | null) => {
		setMediaUrl("");
		if (objectPreview) {
			URL.revokeObjectURL(objectPreview);
			setObjectPreview(null);
		}
		if (!file) {
			setMediaFile(null);
			setMediaInfo(null);
			return;
		}
		const MAX_BYTES = 25 * 1024 * 1024;
		if (file.size > MAX_BYTES) {
			alert("El archivo excede el límite de 25MB.");
			return;
		}
		setMediaFile(file);
		setMediaInfo({ type: file.type, name: file.name });
		setObjectPreview(URL.createObjectURL(file));
	};

	const uploadToStorageAndGetUrl = async (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const folder = "whatsapp_media";
			const filename = `${Date.now()}-${sanitizeName(file.name || "archivo")}`;
			const fullPath = `${folder}/${filename}`;

			const ref = storageRef(storage, fullPath);
			const metadata = { contentType: file.type || "application/octet-stream" };

			setUploading(true);
			setUploadProgress(0);

			const task = uploadBytesResumable(ref, file, metadata);
			task.on(
				"state_changed",
				(snap) => {
					const pct = Math.round(
						(snap.bytesTransferred / snap.totalBytes) * 100
					);
					setUploadProgress(pct);
				},
				(err) => {
					setUploading(false);
					reject(err);
				},
				async () => {
					try {
						const url = await getDownloadURL(task.snapshot.ref);
						setUploading(false);
						setUploadProgress(100);
						resolve(url);
					} catch (e) {
						setUploading(false);
						reject(e);
					}
				}
			);
		});
	};

	const validateBeforeSend = async (): Promise<boolean> => {
		if (contactosSeleccionados.length === 0) {
			alert("Selecciona al menos un contacto");
			return false;
		}
		if (!mediaFile && !mediaUrl.trim()) {
			if (!mensaje.trim()) {
				const ok = confirm("El mensaje está vacío. ¿Enviar de todas formas?");
				return ok;
			}
			return true;
		}
		return true;
	};

	const reemplazarVariables = (template: string, c: Contacto): string =>
		template
			.replace(/{nombre}/g, c.nombre)
			.replace(/{apellido}/g, c.apellido)
			.replace(/{nombreCompleto}/g, `${c.nombre} ${c.apellido}`.trim());

	const enviarMensajes = async () => {
		const ok = await validateBeforeSend();
		if (!ok) return;

		if (
			!confirm(
				`¿Enviar ${mediaFile || mediaUrl ? "media" : "mensaje"} a ${
					contactosSeleccionados.length
				} contacto(s)?`
			)
		) {
			return;
		}

		setEnviando(true);

		// preparar status base
		onStatusesChange(
			contactosSeleccionados.map((c) => ({
				telefono: c.telefono,
				nombre: `${c.nombre} ${c.apellido}`.trim(),
				estado: "pendiente",
			}))
		);

		const apiUrl = process.env.NEXT_PUBLIC_WHATSAPP_API_URL;
		const apiKey = process.env.NEXT_PUBLIC_WHATSAPP_API_KEY;
		const accountId = process.env.NEXT_PUBLIC_WHATSAPP_ACCOUNT_ID;

		if (!apiUrl || !apiKey || !accountId) {
			alert("Faltan configurar las variables de entorno de WhatsApp");
			setEnviando(false);
			return;
		}

		// subir archivo una sola vez (si hay)
		let sharedMediaUrl: string | null = null;
		if (mediaFile) {
			try {
				sharedMediaUrl = await uploadToStorageAndGetUrl(mediaFile);
				setMediaUrl(sharedMediaUrl);
			} catch (e: unknown) {
				console.error(e);
				alert(
					`No se pudo subir el archivo: ${
						e instanceof Error ? e.message : String(e)
					}`
				);
				setEnviando(false);
				return;
			}
		} else if (mediaUrl.trim()) {
			sharedMediaUrl = mediaUrl.trim();
		}

		// envío secuencial con delay
		for (let i = 0; i < contactosSeleccionados.length; i++) {
			const contacto = contactosSeleccionados[i];
			const mensajePersonalizado = reemplazarVariables(mensaje, contacto);

			onStatusesChange((prev) =>
				prev.map((s) =>
					s.telefono === contacto.telefono ? { ...s, estado: "enviando" } : s
				)
			);

			const toNumber = contacto.telefono.startsWith("+")
				? contacto.telefono
				: `+${contacto.telefono}`;

			// preparamos content una sola vez para usarlo en el fetch y en el log
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const content: any = {};
			if (mensajePersonalizado) content.text = mensajePersonalizado;
			if (sharedMediaUrl) {
				content.mediaUrl = sharedMediaUrl;
				const mime = inferredMime || guessMimeFromUrl(sharedMediaUrl);
				const fname = inferredFileName || getFilenameFromUrl(sharedMediaUrl);
				if (mime) content.mimeType = mime;
				if (fname) content.fileName = fname;
			}

			const finalType: MessageType = sharedMediaUrl ? inferredType : "text";

			try {
				const response = await fetch(
					`${apiUrl}/whatsapp/accounts/${accountId}/messages`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"x-api-key": apiKey,
							"x-account-id": accountId,
						},
						body: JSON.stringify({
							toNumber,
							messageType: finalType,
							content,
						}),
					}
				);

				if (response.ok) {
					onStatusesChange((prev) =>
						prev.map((s) =>
							s.telefono === contacto.telefono
								? { ...s, estado: "exitoso", mensaje: "Enviado correctamente" }
								: s
						)
					);

					// ✅ Guardar log exitoso
					await guardarLogMensajeWhatsapp({
						toNumber,
						telefonoSinPlus: contacto.telefono,
						nombre: contacto.nombre,
						apellido: contacto.apellido,
						messageType: finalType,
						content: {
							text: content.text,
							mediaUrl: content.mediaUrl,
							mimeType: content.mimeType,
							fileName: content.fileName,
						},
						estadoEnvio: "exitoso",
						delaySegundos: delay,
						createdAt: serverTimestamp(),
					});
				} else {
					const error = await response.json().catch(() => null);
					const errorMsg = error?.message || "Error al enviar";

					onStatusesChange((prev) =>
						prev.map((s) =>
							s.telefono === contacto.telefono
								? { ...s, estado: "error", mensaje: errorMsg }
								: s
						)
					);

					// ❌ Guardar log con error de API
					await guardarLogMensajeWhatsapp({
						toNumber,
						telefonoSinPlus: contacto.telefono,
						nombre: contacto.nombre,
						apellido: contacto.apellido,
						messageType: finalType,
						content: {
							text: content.text,
							mediaUrl: content.mediaUrl,
							mimeType: content.mimeType,
							fileName: content.fileName,
						},
						estadoEnvio: "error",
						errorMessage: errorMsg,
						delaySegundos: delay,
						createdAt: serverTimestamp(),
					});
				}
			} catch {
				const errorMsg = "Error de conexión";

				onStatusesChange((prev) =>
					prev.map((s) =>
						s.telefono === contacto.telefono
							? { ...s, estado: "error", mensaje: errorMsg }
							: s
					)
				);

				// ❌ Guardar log con error de conexión
				await guardarLogMensajeWhatsapp({
					toNumber,
					telefonoSinPlus: contacto.telefono,
					nombre: contacto.nombre,
					apellido: contacto.apellido,
					messageType: finalType,
					content: {
						text: content.text,
						mediaUrl: content.mediaUrl,
						mimeType: content.mimeType,
						fileName: content.fileName,
					},
					estadoEnvio: "error",
					errorMessage: errorMsg,
					delaySegundos: delay,
					createdAt: serverTimestamp(),
				});
			}

			if (i < contactosSeleccionados.length - 1) {
				await new Promise((r) => setTimeout(r, delay * 1000));
			}
		}

		setEnviando(false);
		onFinish?.();
		alert("Envío completado");
	};

	/* ---------- UI ---------- */
	const renderPreview = () => {
		const type = inferredType;
		const src = mediaFile ? objectPreview || "" : mediaUrl.trim();
		if (!src) return null;

		if (type === "image") {
			return (
				<img
					src={src}
					alt={inferredFileName || "preview"}
					className="max-h-40 rounded-lg border object-contain"
				/>
			);
		}
		if (type === "video") {
			return (
				<video src={src} controls className="max-h-40 rounded-lg border" />
			);
		}
		if (type === "audio") {
			return <audio src={src} controls className="w-full" />;
		}
		return (
			<div className="flex items-center gap-3">
				<FileText className="w-6 h-6 text-gray-700" />
				<div className="text-sm">
					<p className="font-semibold text-gray-800">
						{inferredFileName || "documento"}
					</p>
					<p className="text-xs text-gray-500">
						{inferredMime || "application/octet-stream"}
					</p>
				</div>
			</div>
		);
	};

	const acceptAll =
		"image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.svg,application/*,text/*";

	return (
		<>
			{/* Texto / Caption */}
			<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
					<MessageSquare className="w-5 h-5" />
					Texto / Caption (opcional)
				</label>
				<textarea
					value={mensaje}
					onChange={(e) => setMensaje(e.target.value)}
					placeholder="Escribe el caption (opcional). Variables: {nombre}, {apellido}, {nombreCompleto}"
					rows={8}
					className="w-full p-4 border-2 border-gray-300 rounded-xl shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none resize-none"
				/>
				{mensaje && contactosSeleccionados[0] && (
					<div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
						<p className="text-xs font-bold text-gray-600 mb-2">
							Vista previa (primer contacto):
						</p>
						<p className="text-sm text-gray-800 whitespace-pre-wrap">
							{mensaje
								.replace(/{nombre}/g, contactosSeleccionados[0].nombre)
								.replace(/{apellido}/g, contactosSeleccionados[0].apellido)
								.replace(
									/{nombreCompleto}/g,
									`${contactosSeleccionados[0].nombre} ${contactosSeleccionados[0].apellido}`.trim()
								)}
						</p>
					</div>
				)}
			</div>

			{/* Adjuntar archivo o URL */}
			<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
					<Paperclip className="w-5 h-5" />
					Adjuntar archivo o URL
				</label>

				<div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
					<label className="inline-flex items-center justify-center px-4 py-2 rounded-xl font-bold shadow border-2 border-gray-300 hover:border-gray-400 cursor-pointer">
						<input
							type="file"
							accept={acceptAll}
							className="hidden"
							onChange={(e) => handleSelectFile(e.target.files?.[0] || null)}
							disabled={enviando}
						/>
						<ImageIcon className="w-5 h-5 mr-2" />
						Seleccionar archivo
					</label>

					<input
						type="url"
						placeholder="...o pega una URL pública de la media"
						value={mediaUrl}
						onChange={(e) => {
							const v = e.target.value;
							setMediaUrl(v);
							if (v) {
								if (objectPreview) {
									URL.revokeObjectURL(objectPreview);
									setObjectPreview(null);
								}
								setMediaFile(null);
								setMediaInfo({
									type: guessMimeFromUrl(v) || undefined,
									name: getFilenameFromUrl(v),
								});
							} else {
								setMediaInfo(null);
							}
						}}
						className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none"
						disabled={enviando}
					/>

					{(mediaFile || mediaUrl) && (
						<button
							onClick={() => {
								setMediaFile(null);
								setMediaUrl("");
								setMediaInfo(null);
								if (objectPreview) {
									URL.revokeObjectURL(objectPreview);
									setObjectPreview(null);
								}
							}}
							className="px-3 py-2 rounded-xl font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
							type="button"
							disabled={enviando}
						>
							<X className="w-4 h-4" /> Quitar
						</button>
					)}
				</div>

				{uploading && (
					<div className="mt-3">
						<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
							<div
								className="h-3 rounded-full transition-all bg-green-600"
								style={{ width: `${uploadProgress}%` }}
							/>
						</div>
						<p className="text-xs text-gray-600 mt-1">
							Subiendo a Firebase Storage... {uploadProgress}%
						</p>
					</div>
				)}

				{(mediaFile || mediaUrl) && (
					<div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
						<div className="flex items-center gap-3">
							{inferredType === "image" && (
								<ImageIcon className="w-5 h-5 text-gray-600" />
							)}
							{inferredType === "video" && (
								<Video className="w-5 h-5 text-gray-600" />
							)}
							{inferredType === "audio" && (
								<Music2 className="w-5 h-5 text-gray-600" />
							)}
							{inferredType === "document" && (
								<FileText className="w-5 h-5 text-gray-600" />
							)}
							<div>
								<p className="text-sm font-bold text-gray-800">
									{mediaFile ? mediaInfo?.name : inferredFileName || "archivo"}
								</p>
								<p className="text-xs text-gray-600">
									{mediaFile ? mediaInfo?.type : inferredMime || "desconocido"}
								</p>
							</div>
						</div>
					</div>
				)}

				{(mediaFile || mediaUrl) && (
					<div className="mt-4">{renderPreview()}</div>
				)}

				<p className="text-xs text-gray-500 mt-2">
					Se enviará como <strong>{inferredType}</strong>. El texto se incluye
					como <em>content.text</em> (caption).
				</p>
			</div>

			{/* Delay */}
			<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
					<Clock className="w-5 h-5" />
					Delay entre mensajes
				</label>
				<div className="flex items-center gap-4">
					<input
						type="range"
						min={1}
						max={10}
						value={delay}
						onChange={(e) => setDelay(Number(e.target.value))}
						className="flex-1"
						disabled={enviando}
					/>
					<span className="text-2xl font-black text-gray-800 min-w-[80px]">
						{delay}s
					</span>
				</div>
				<p className="text-xs text-gray-500 mt-2">
					Tiempo de espera entre cada mensaje para evitar spam.
				</p>
			</div>

			{/* Botón enviar */}
			<div className="flex justify-end">
				<button
					onClick={enviarMensajes}
					disabled={
						enviando || uploading || contactosSeleccionados.length === 0
					}
					className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 rounded-xl font-black shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center gap-3"
					type="button"
				>
					<Send className="w-6 h-6" />
					{enviando
						? "Enviando..."
						: `Enviar a ${contactosSeleccionados.length} contacto(s)`}
				</button>
			</div>
		</>
	);
}
