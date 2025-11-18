/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import {
	collection,
	query,
	getDocs,
	orderBy,
	addDoc,
	serverTimestamp,
} from "firebase/firestore";
import * as XLSX from "xlsx";

import {
	Send,
	Trash2,
	Plus,
	Users,
	AlertCircle,
	FileText,
	Paperclip,
	Search,
} from "lucide-react";

import MensajeMasivoForm, {
	Contacto as FormContacto,
	EnvioStatus,
} from "@/components/MensajeMasivoForm";

/* ===================== Tipos locales ===================== */

interface Contacto {
	id: string;
	nombre: string;
	apellido: string;
	/** Guardado SIN '+' en Firestore. En UI se muestra con '+' */
	telefono: string;
}

/* ===================== Utilidades ===================== */

const normalizePhone = (raw: string): string => {
	if (!raw) return "";
	const trimmed = String(raw).trim();
	if (trimmed.startsWith("+")) {
		const onlyDigits = trimmed.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
		return onlyDigits.replace(/^\+/, "");
	}
	return trimmed.replace(/\D/g, "");
};

/* ======= Plantilla con ejemplo solicitado ======= */
const CONTACTS_TEMPLATE = [
	{ nombre: "Ejemplo", apellido: "Principal", telefono: "+59165258002" },
	{ nombre: "Ana", apellido: "Gutiérrez", telefono: "+59170012345" },
	{ nombre: "Luis", apellido: "Rojas", telefono: "70012346" },
	{ nombre: "María", apellido: "López", telefono: "+54 911 5555 0000" },
	{ nombre: "Carlos", apellido: "", telefono: "70012347" },
];

const downloadTemplateCSV = () => {
	const headers = ["nombre", "apellido", "telefono"];
	const escape = (v: any) => {
		const s = (v ?? "").toString();
		const needsQuotes = /[",\n]/.test(s);
		const esc = s.replace(/"/g, '""');
		return needsQuotes ? `"${esc}"` : esc;
	};
	const csvRows = [
		headers.join(","),
		...CONTACTS_TEMPLATE.map((row) =>
			headers.map((h) => escape((row as any)[h])).join(",")
		),
	];
	const blob = new Blob([csvRows.join("\n")], {
		type: "text/csv;charset=utf-8;",
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "plantilla_contactos.csv";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};

const downloadTemplateXLSX = () => {
	const ws = XLSX.utils.json_to_sheet(CONTACTS_TEMPLATE, {
		header: ["nombre", "apellido", "telefono"],
	});
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Contactos");
	XLSX.writeFile(wb, "plantilla_contactos.xlsx");
};

const parseContactsFile = async (file: File): Promise<Contacto[]> => {
	const arrayBuffer = await file.arrayBuffer();
	const wb = XLSX.read(arrayBuffer, { type: "array" });
	const sheetName = wb.SheetNames[0];
	const ws = wb.Sheets[sheetName];
	const rows = XLSX.utils.sheet_to_json<any>(ws, { defval: "" });

	const mapKey = (k: string) =>
		k
			.toString()
			.toLowerCase()
			.normalize("NFD")
			.replace(/\p{Diacritic}/gu, "");

	const normalizedRows: Contacto[] = rows.map((r: any) => {
		const mapped: Record<string, any> = {};
		Object.keys(r).forEach((key) => (mapped[mapKey(key)] = r[key]));

		const nombre =
			mapped["nombre"] ??
			mapped["name"] ??
			mapped["first"] ??
			mapped["nombres"] ??
			"";
		const apellido =
			mapped["apellido"] ??
			mapped["apellidos"] ??
			mapped["last"] ??
			mapped["surname"] ??
			"";
		const telRaw =
			mapped["telefono"] ??
			mapped["tel"] ??
			mapped["phone"] ??
			mapped["celular"] ??
			mapped["whatsapp"] ??
			"";

		const telefono = normalizePhone(String(telRaw || ""));

		return {
			id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
			nombre: String(nombre || "").trim(),
			apellido: String(apellido || "").trim(),
			telefono,
		};
	});

	return normalizedRows.filter((c) => c.telefono);
};

/* ===================== Componente ===================== */

export default function MensajesMasivos() {
	const [contactos, setContactos] = useState<Contacto[]>([]);
	const [contactosSeleccionados, setContactosSeleccionados] = useState<
		string[]
	>([]);

	const [loading, setLoading] = useState(false);

	const [statusEnvios, setStatusEnvios] = useState<EnvioStatus[]>([]);

	const [nuevoContacto, setNuevoContacto] = useState({
		nombre: "",
		apellido: "",
		telefono: "",
	});

	const [bulkUploading, setBulkUploading] = useState(false);
	const [bulkResult, setBulkResult] = useState<{
		totalLeidos: number;
		agregados: number;
		omitidosDuplicadosArchivo: number;
		omitidosDuplicadosBD: number;
		errores: number;
	} | null>(null);

	const [rangeStart, setRangeStart] = useState<string>("");
	const [rangeEnd, setRangeEnd] = useState<string>("");

	const [deletingSelected, setDeletingSelected] = useState(false);

	// 🔹 paginación front
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(50);

	// 🔹 filtro de búsqueda (por número / nombre / apellido)
	const [searchTerm, setSearchTerm] = useState<string>("");

	useEffect(() => {
		cargarContactos();
	}, []);

	const cargarContactos = async () => {
		setLoading(true);
		try {
			// 🔹 IMPORTANTE: aquí SOLO LEEMOS de `formulario`
			const qy = query(collection(db, "formulario"), orderBy("creado", "desc"));
			const snapshot = await getDocs(qy);
			const contactosData: Contacto[] = [];
			snapshot.forEach((d) => {
				const data = d.data() as any;
				contactosData.push({
					id: d.id,
					nombre: data.nombre || "",
					apellido: data.apellido || "",
					telefono: String(data.telefono || ""),
				});
			});
			setContactos(contactosData);
			setCurrentPage(1);
			setContactosSeleccionados(contactosData.map((c) => c.id));
		} catch (error) {
			console.error("Error cargando contactos:", error);
			alert("Error al cargar contactos");
		} finally {
			setLoading(false);
		}
	};

	/* ----------- Filtro de búsqueda ----------- */

	const filteredContactos = useMemo(() => {
		if (!searchTerm.trim()) return contactos;
		const term = searchTerm.trim().toLowerCase();
		const phoneTerm = normalizePhone(term);

		return contactos.filter((c) => {
			const nombre = c.nombre.toLowerCase();
			const apellido = c.apellido.toLowerCase();
			const telefonoFull = `+${c.telefono}`.toLowerCase();
			const telefonoSimple = c.telefono.toLowerCase();

			return (
				nombre.includes(term) ||
				apellido.includes(term) ||
				telefonoFull.includes(term) ||
				telefonoSimple.includes(term) ||
				(phoneTerm && normalizePhone(telefonoFull).includes(phoneTerm))
			);
		});
	}, [contactos, searchTerm]);

	/* ----------- Paginación en memoria (sobre los filtrados) ----------- */

	const totalPages = useMemo(
		() =>
			filteredContactos.length === 0
				? 1
				: Math.ceil(filteredContactos.length / pageSize),
		[filteredContactos.length, pageSize]
	);

	// Asegurar que currentPage esté en rango al cambiar filtro o pageSize
	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages || 1);
		}
	}, [currentPage, totalPages]);

	const visibleContactos = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		const end = start + pageSize;
		return filteredContactos.slice(start, end);
	}, [filteredContactos, currentPage, pageSize]);

	const canGoPrev = currentPage > 1;
	const canGoNext = currentPage < totalPages;

	const handleNextPage = () => {
		if (!canGoNext || loading) return;
		setCurrentPage((p) => p + 1);
	};

	const handlePrevPage = () => {
		if (!canGoPrev || loading) return;
		setCurrentPage((p) => p - 1);
	};

	const handleChangePageSize = (value: number) => {
		setPageSize(value);
		setCurrentPage(1);
	};

	/* ----------- UI helpers ----------- */

	const toggleContacto = (id: string) => {
		setContactosSeleccionados((prev) =>
			prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
		);
	};

	const toggleTodos = () => {
		const visibleIds = visibleContactos.map((c) => c.id);
		const allVisibleSelected =
			visibleIds.length > 0 &&
			visibleIds.every((id) => contactosSeleccionados.includes(id));

		if (allVisibleSelected) {
			setContactosSeleccionados((prev) =>
				prev.filter((id) => !visibleIds.includes(id))
			);
		} else {
			setContactosSeleccionados((prev) =>
				Array.from(new Set([...prev, ...visibleIds]))
			);
		}
	};

	// 🔹 Eliminar contacto SOLO en memoria (no toca Firestore)
	const eliminarContacto = (id: string) => {
		const confirmar = confirm(
			"¿Eliminar este contacto de la lista (solo aquí)?"
		);
		if (!confirmar) return;

		setContactos((prev) => prev.filter((c) => c.id !== id));
		setContactosSeleccionados((prev) => prev.filter((cid) => cid !== id));
	};

	// 🔹 Agregar contacto y guardarlo en Firestore
	const agregarContacto = async () => {
		const nombre = nuevoContacto.nombre.trim();
		const apellido = nuevoContacto.apellido.trim();
		const telRaw = nuevoContacto.telefono.trim();

		if (!nombre || !telRaw) {
			alert("Nombre y teléfono son requeridos");
			return;
		}

		const telefonoSinMas = normalizePhone(telRaw);
		if (!telefonoSinMas) {
			alert("Teléfono inválido");
			return;
		}

		const yaExiste = contactos.some(
			(c) => normalizePhone(c.telefono) === telefonoSinMas
		);
		if (yaExiste) {
			const continuar = confirm(
				"Ese teléfono ya existe en la lista actual. ¿Quieres agregarlo de todas formas?"
			);
			if (!continuar) return;
		}

		try {
			// Guardar en Firestore
			const docRef = await addDoc(collection(db, "formulario"), {
				nombre,
				apellido,
				telefono: telefonoSinMas,
				creado: serverTimestamp(),
			});

			const nuevo: Contacto = {
				id: docRef.id,
				nombre,
				apellido,
				telefono: telefonoSinMas,
			};

			setContactos((prev) => [nuevo, ...prev]);
			setContactosSeleccionados((prev) => [nuevo.id, ...prev]);
			setNuevoContacto({ nombre: "", apellido: "", telefono: "" });
		} catch (error) {
			console.error("Error al guardar contacto:", error);
			alert("Error al guardar el contacto en Firestore");
		}
	};

	/* ----------- Importación masiva y guardado en Firestore ----------- */

	const handleImportContacts = async (file: File | null) => {
		if (!file) return;
		setBulkResult(null);
		setBulkUploading(true);

		try {
			const parsed = await parseContactsFile(file);
			const totalLeidos = parsed.length;

			// Duplicados dentro del archivo
			const seen = new Set<string>();
			const uniqueFromFile: Contacto[] = [];
			let omitidosDuplicadosArchivo = 0;

			for (const c of parsed) {
				const key = c.telefono;
				if (!key || seen.has(key)) {
					omitidosDuplicadosArchivo++;
					continue;
				}
				seen.add(key);
				uniqueFromFile.push(c);
			}

			// Duplicados vs contactos ya existentes (por teléfono normalizado)
			const existingPhones = new Set(
				contactos.map((c) => normalizePhone(c.telefono))
			);

			const toInsert = uniqueFromFile.filter(
				(c) => !existingPhones.has(c.telefono)
			);
			const omitidosDuplicadosBD = uniqueFromFile.length - toInsert.length;

			// 🔹 Guardar cada contacto en Firestore
			let agregados = 0;
			let errores = 0;
			const contactosGuardados: Contacto[] = [];

			for (const contacto of toInsert) {
				try {
					const docRef = await addDoc(collection(db, "formulario"), {
						nombre: contacto.nombre,
						apellido: contacto.apellido,
						telefono: contacto.telefono,
						creado: serverTimestamp(),
					});

					contactosGuardados.push({
						...contacto,
						id: docRef.id,
					});
					agregados++;
				} catch (error) {
					console.error("Error al guardar contacto:", error);
					errores++;
				}
			}

			// Agregar al estado local solo los que se guardaron exitosamente
			setContactos((prev) => [...contactosGuardados, ...prev]);

			setBulkResult({
				totalLeidos,
				agregados,
				omitidosDuplicadosArchivo,
				omitidosDuplicadosBD,
				errores,
			});
		} catch (e) {
			console.error(e);
			alert("No se pudo procesar el archivo. Verifica el formato de columnas.");
			setBulkResult({
				totalLeidos: 0,
				agregados: 0,
				omitidosDuplicadosArchivo: 0,
				omitidosDuplicadosBD: 0,
				errores: 1,
			});
		} finally {
			setBulkUploading(false);
		}
	};

	/* ----------- Selección por rango (página actual) ----------- */

	const getIdsInRange = (start: number, end: number): string[] => {
		const total = visibleContactos.length;
		const s = Math.max(1, Math.min(start, end));
		const e = Math.min(total, Math.max(start, end));
		const slice = visibleContactos.slice(s - 1, e);
		return slice.map((c) => c.id);
	};

	const handleSelectRange = () => {
		const total = visibleContactos.length;
		const s = parseInt(rangeStart, 10);
		const e = parseInt(rangeEnd, 10);
		if (Number.isNaN(s) || Number.isNaN(e)) {
			alert("Coloca los números de rango (desde y hasta).");
			return;
		}
		if (s < 1 || e < 1 || s > total || e > total) {
			alert(`El rango debe estar entre 1 y ${total}.`);
			return;
		}
		const ids = getIdsInRange(s, e);
		setContactosSeleccionados((prev) => Array.from(new Set([...prev, ...ids])));
	};

	const handleDeselectRange = () => {
		const total = visibleContactos.length;
		const s = parseInt(rangeStart, 10);
		const e = parseInt(rangeEnd, 10);
		if (Number.isNaN(s) || Number.isNaN(e)) {
			alert("Coloca los números de rango (desde y hasta).");
			return;
		}
		if (s < 1 || e < 1 || s > total || e > total) {
			alert(`El rango debe estar entre 1 y ${total}.`);
			return;
		}
		const ids = getIdsInRange(s, e);
		setContactosSeleccionados((prev) => prev.filter((id) => !ids.includes(id)));
	};

	/* ----------- Eliminar seleccionados (SOLO memoria) ----------- */

	const handleDeleteSelected = () => {
		if (contactosSeleccionados.length === 0) {
			alert("No hay contactos seleccionados para eliminar.");
			return;
		}

		const total = contactosSeleccionados.length;
		const confirmar = confirm(
			`¿Eliminar ${total} contacto(s) de la lista actual? (no se borran de Firestore)`
		);
		if (!confirmar) return;

		setDeletingSelected(true);
		setContactos((prev) =>
			prev.filter((c) => !contactosSeleccionados.includes(c.id))
		);
		setContactosSeleccionados([]);
		setDeletingSelected(false);
	};

	/* ----------- Derivados ----------- */

	const contactosSeleccionadosData: FormContacto[] = useMemo(
		() =>
			contactos
				.filter((c) => contactosSeleccionados.includes(c.id))
				.map((c) => ({
					id: c.id,
					nombre: c.nombre,
					apellido: c.apellido,
					telefono: c.telefono,
				})),
		[contactos, contactosSeleccionados]
	);

	const allVisibleSelected =
		visibleContactos.length > 0 &&
		visibleContactos.every((c) => contactosSeleccionados.includes(c.id));

	/* ===================== UI ===================== */

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 shadow-xl">
				<h1 className="text-4xl font-black text-white mb-2">
					Mensajes Masivos WhatsApp
				</h1>
				<p className="text-green-100">
					Envía mensajes personalizados a múltiples contactos
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Columna principal */}
				<div className="lg:col-span-2 space-y-6">
					<MensajeMasivoForm
						contactosSeleccionados={contactosSeleccionadosData}
						onStatusesChange={setStatusEnvios}
						onFinish={() => {
							/* opcional */
						}}
						initialDelay={3}
					/>
				</div>

				{/* Lateral derecha */}
				<div className="space-y-6">
					<div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl text-white">
						<Users className="w-12 h-12 mb-4 opacity-80" />
						<p className="text-sm font-bold opacity-90">Contactos totales</p>
						<p className="text-4xl font-black">{contactos.length}</p>
					</div>

					<div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl text-white">
						<Send className="w-12 h-12 mb-4 opacity-80" />
						<p className="text-sm font-bold opacity-90">Seleccionados</p>
						<p className="text-4xl font-black">
							{contactosSeleccionados.length}
						</p>
					</div>

					<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
						<AlertCircle className="w-8 h-8 text-amber-500 mb-3" />
						<p className="text-xs font-bold text-gray-700 mb-2">Importante:</p>
						<ul className="text-xs text-gray-600 space-y-1">
							<li>• Verifica los números antes de enviar</li>
							<li>• No envíes spam</li>
							<li>• Respeta el delay configurado</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Agregar contacto */}
			<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
					<Plus className="w-5 h-5" />
					Agregar contacto manualmente (solo en esta vista)
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<input
						type="text"
						placeholder="Nombre"
						value={nuevoContacto.nombre}
						onChange={(e) =>
							setNuevoContacto({ ...nuevoContacto, nombre: e.target.value })
						}
						className="p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none"
					/>
					<input
						type="text"
						placeholder="Apellido"
						value={nuevoContacto.apellido}
						onChange={(e) =>
							setNuevoContacto({ ...nuevoContacto, apellido: e.target.value })
						}
						className="p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none"
					/>
					<input
						type="text"
						placeholder="Teléfono (con código)"
						value={nuevoContacto.telefono}
						onChange={(e) =>
							setNuevoContacto({ ...nuevoContacto, telefono: e.target.value })
						}
						className="p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none"
					/>
					<button
						onClick={agregarContacto}
						className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
					>
						<Plus className="w-5 h-5" />
						Agregar
					</button>
				</div>
			</div>

			{/* Importar contactos desde Excel/CSV */}
			<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
					<FileText className="w-5 h-5" />
					Importar contactos desde Excel/CSV (solo en memoria)
				</h3>

				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-3">
						<label className="inline-flex items-center justify-center px-4 py-2 rounded-xl font-bold shadow border-2 border-gray-300 hover:border-gray-400 cursor-pointer">
							<input
								type="file"
								accept=".xlsx,.xls,.csv"
								className="hidden"
								onChange={(e) =>
									handleImportContacts(e.target.files?.[0] || null)
								}
								disabled={bulkUploading}
							/>
							<Paperclip className="w-5 h-5 mr-2" />
							{bulkUploading ? "Procesando..." : "Seleccionar archivo"}
						</label>
						<p className="text-xs text-gray-600">
							Columnas recomendadas: <code>nombre</code>, <code>apellido</code>,{" "}
							<code>telefono</code>. Se aceptan variantes como{" "}
							<em>tel, phone, celular, whatsapp</em>.
						</p>
					</div>

					{/* Botones de plantilla */}
					<div className="flex flex-wrap items-center gap-3">
						<button
							type="button"
							onClick={downloadTemplateCSV}
							className="px-4 py-2 rounded-xl font-bold shadow border-2 border-gray-300 hover:border-gray-400"
						>
							Descargar plantilla (CSV)
						</button>

						<button
							type="button"
							onClick={downloadTemplateXLSX}
							className="px-4 py-2 rounded-xl font-bold shadow border-2 border-gray-300 hover:border-gray-400"
						>
							Descargar plantilla (XLSX)
						</button>

						<p className="text-xs text-gray-600">
							La plantilla incluye <code>+59165258002</code> como ejemplo.
						</p>
					</div>
				</div>

				{bulkResult && (
					<div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
						<p className="font-bold text-gray-800 mb-1">
							Resumen de importación
						</p>
						<ul className="text-gray-700 space-y-1">
							<li>Leídos del archivo: {bulkResult.totalLeidos}</li>
							<li>Agregados (solo en esta vista): {bulkResult.agregados}</li>
							<li>
								Omitidos (duplicados en archivo):{" "}
								{bulkResult.omitidosDuplicadosArchivo}
							</li>
							<li>
								Omitidos (ya existían en la lista):{" "}
								{bulkResult.omitidosDuplicadosBD}
							</li>
							{bulkResult.errores > 0 && (
								<li className="text-red-600">Errores: {bulkResult.errores}</li>
							)}
						</ul>
					</div>
				)}
			</div>

			{/* Lista de contactos + búsqueda + selección por rango + paginación */}
			<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				{/* Header de lista */}
				<div className="flex flex-wrap items-center justify-between mb-4 gap-4">
					<div>
						<h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
							<Users className="w-5 h-5" />
							Contactos filtrados ({filteredContactos.length})
						</h3>
						<p className="text-xs text-gray-500">
							Mostrando {visibleContactos.length} en la página {currentPage} de{" "}
							{totalPages}
						</p>
					</div>

					{/* Buscador */}
					<div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 w-full max-w-xs">
						<Search className="w-4 h-4 text-gray-400" />
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setCurrentPage(1);
							}}
							placeholder="Buscar por nombre o teléfono..."
							className="bg-transparent outline-none text-sm flex-1"
						/>
					</div>

					{/* Page size + paginación */}
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-1 text-sm">
							<span className="text-gray-600">Por página:</span>
							<select
								value={pageSize}
								onChange={(e) => handleChangePageSize(Number(e.target.value))}
								className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
							>
								<option value={25}>25</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
								<option value={200}>200</option>
							</select>
						</div>

						<div className="flex items-center gap-2">
							<button
								onClick={handlePrevPage}
								disabled={!canGoPrev || loading}
								className="px-3 py-1 rounded-xl border border-gray-300 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
							>
								Anterior
							</button>
							<span className="text-sm text-gray-600">
								{currentPage}/{totalPages}
							</span>
							<button
								onClick={handleNextPage}
								disabled={!canGoNext || loading}
								className="px-3 py-1 rounded-xl border border-gray-300 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
							>
								Siguiente
							</button>
						</div>

						<button
							onClick={toggleTodos}
							className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
						>
							{allVisibleSelected
								? "Deseleccionar visibles"
								: "Seleccionar visibles"}
						</button>
					</div>
				</div>

				{/* Controles de selección por rango (página actual) */}
				{visibleContactos.length > 0 && (
					<div className="mb-4 flex flex-wrap items-center gap-3">
						<div className="flex items-center gap-2">
							<label className="text-xs text-gray-600">Desde #</label>
							<input
								type="number"
								min={1}
								max={visibleContactos.length}
								value={rangeStart}
								onChange={(e) => setRangeStart(e.target.value)}
								className="w-24 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
								placeholder="1"
							/>
						</div>
						<div className="flex items-center gap-2">
							<label className="text-xs text-gray-600">Hasta #</label>
							<input
								type="number"
								min={1}
								max={visibleContactos.length}
								value={rangeEnd}
								onChange={(e) => setRangeEnd(e.target.value)}
								className="w-24 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
								placeholder={String(visibleContactos.length)}
							/>
						</div>

						<button
							onClick={handleSelectRange}
							className="px-4 py-2 rounded-2xl border border-gray-300 font-semibold hover:bg-green-50 transition"
						>
							Seleccionar rango
						</button>
						<button
							onClick={handleDeselectRange}
							className="px-4 py-2 rounded-2xl border border-gray-300 font-semibold hover:bg-amber-50 transition"
						>
							Quitar selección (rango)
						</button>
						<button
							onClick={handleDeleteSelected}
							disabled={deletingSelected || contactosSeleccionados.length === 0}
							className="px-4 py-2 rounded-2xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{deletingSelected ? "Eliminando..." : "Eliminar seleccionados"}
						</button>

						<span className="text-xs text-gray-500">
							Los números (#1, #2, …) son relativos a la página filtrada actual.
						</span>
					</div>
				)}

				{loading ? (
					<div className="flex justify-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
					</div>
				) : visibleContactos.length === 0 ? (
					<div className="text-center py-12 text-gray-500">
						{searchTerm
							? "No se encontraron contactos con ese criterio."
							: "No hay contactos. Se mostrarán los de Firestore (formulario) si existen, o puedes agregar/importar en esta vista (solo en memoria)."}
					</div>
				) : (
					<div className="space-y-3 max-h-96 overflow-y-auto pr-1">
						{visibleContactos.map((contacto, idx) => {
							const numero = idx + 1;
							const isChecked = contactosSeleccionados.includes(contacto.id);

							return (
								<div
									key={contacto.id}
									className={[
										"group flex items-center gap-4 p-4 rounded-2xl border transition-all",
										"bg-white",
										isChecked
											? "border-emerald-500 ring-2 ring-emerald-200/60 bg-emerald-50"
											: "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30",
									].join(" ")}
								>
									{/* Nº enumerado */}
									<div className="w-10 text-center">
										<span className="inline-block text-xs font-bold text-gray-700 bg-gray-200/70 group-hover:bg-gray-300 rounded-full px-2 py-1">
											#{numero}
										</span>
									</div>

									{/* Checkbox */}
									<input
										type="checkbox"
										checked={isChecked}
										onChange={() => toggleContacto(contacto.id)}
										className="w-5 h-5 accent-emerald-600 rounded-md"
										aria-label={`Seleccionar contacto #${numero}`}
									/>

									{/* Datos */}
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-gray-900 truncate">
											{contacto.nombre} {contacto.apellido}
										</p>
										<p className="text-sm text-gray-600">
											+{contacto.telefono}
										</p>
									</div>

									{/* Eliminar individual (solo local) */}
									<button
										onClick={() => eliminarContacto(contacto.id)}
										className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<Trash2 className="w-5 h-5" />
									</button>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Estado de envíos */}
			{statusEnvios.length > 0 && (
				<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
					<h3 className="text-lg font-bold text-gray-800 mb-4">
						Estado de envíos
					</h3>
					<div className="space-y-2 max-h-96 overflow-y-auto">
						{statusEnvios.map((status, i) => (
							<div
								key={i}
								className={`flex items-center gap-4 p-4 rounded-xl border ${
									status.estado === "exitoso"
										? "bg-green-50 border-green-400"
										: status.estado === "error"
										? "bg-red-50 border-red-400"
										: status.estado === "enviando"
										? "bg-blue-50 border-blue-400"
										: "bg-gray-50 border-gray-300"
								}`}
							>
								<div className="flex-1">
									<p className="font-bold text-gray-800">{status.nombre}</p>
									<p className="text-sm text-gray-600">+{status.telefono}</p>
									{status.mensaje && (
										<p className="text-xs text-gray-500 mt-1">
											{status.mensaje}
										</p>
									)}
								</div>
								<div>
									{status.estado === "pendiente" && (
										<div className="w-6 h-6 rounded-full border-2 border-gray-400" />
									)}
									{status.estado === "enviando" && (
										<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600" />
									)}
									{status.estado === "exitoso" && (
										<div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
											<svg
												className="w-4 h-4 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={3}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
									)}
									{status.estado === "error" && (
										<div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
											<svg
												className="w-4 h-4 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={3}
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
