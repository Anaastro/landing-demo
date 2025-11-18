"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getContactSubmissions, markSubmissionAsRead } from "@/lib/firestore";
import { ContactSubmission } from "@/lib/types";
import { Mail, MailOpen, X, Search, CheckCircle } from "lucide-react";

export default function ContactSubmissions() {
	const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSubmission, setSelectedSubmission] =
		useState<ContactSubmission | null>(null);

	const loadSubmissions = useCallback(async () => {
		setLoading(true);
		const data = await getContactSubmissions();
		setSubmissions(data);
		setLoading(false);
	}, []);

	useEffect(() => {
		loadSubmissions();
	}, [loadSubmissions]);

	const handleMarkAsRead = async (submissionId: string) => {
		await markSubmissionAsRead(submissionId);
		await loadSubmissions();
	};

	const filteredSubmissions = submissions
		.filter((sub) => {
			if (filter === "unread") return !sub.read;
			if (filter === "read") return sub.read;
			return true;
		})
		.filter((sub) => {
			if (!searchTerm) return true;
			const searchLower = searchTerm.toLowerCase();
			return Object.values(sub.formData).some((value) =>
				value.toLowerCase().includes(searchLower)
			);
		});

	const unreadCount = submissions.filter((sub) => !sub.read).length;

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-muted-foreground">Cargando mensajes...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold mb-1">Mensajes Recibidos</h2>
					<p className="text-muted-foreground">
						Total: {submissions.length} mensajes
						{unreadCount > 0 && (
							<span className="ml-2 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
								{unreadCount} sin leer
							</span>
						)}
					</p>
				</div>

				{/* Search */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Buscar en mensajes..."
						className="pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
					/>
				</div>
			</div>

			{/* Filters */}
			<div className="flex gap-2">
				<button
					onClick={() => setFilter("all")}
					className={`px-4 py-2 rounded-xl font-medium transition-colors ${
						filter === "all"
							? "bg-primary text-primary-foreground"
							: "bg-muted hover:bg-muted/80"
					}`}
				>
					Todos
				</button>
				<button
					onClick={() => setFilter("unread")}
					className={`px-4 py-2 rounded-xl font-medium transition-colors ${
						filter === "unread"
							? "bg-primary text-primary-foreground"
							: "bg-muted hover:bg-muted/80"
					}`}
				>
					Sin leer
				</button>
				<button
					onClick={() => setFilter("read")}
					className={`px-4 py-2 rounded-xl font-medium transition-colors ${
						filter === "read"
							? "bg-primary text-primary-foreground"
							: "bg-muted hover:bg-muted/80"
					}`}
				>
					Leídos
				</button>
			</div>

			{/* Submissions Grid */}
			{filteredSubmissions.length === 0 ? (
				<div className="text-center py-12 bg-muted/30 rounded-2xl">
					<Mail className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
					<p className="text-lg font-medium mb-2">No hay mensajes</p>
					<p className="text-muted-foreground">
						{searchTerm
							? "No se encontraron mensajes con esos términos"
							: "Los mensajes aparecerán aquí cuando se envíen"}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredSubmissions.map((submission) => (
						<motion.div
							key={submission.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className={`bg-card border rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all ${
								submission.read ? "border-border" : "border-primary"
							}`}
							onClick={() => setSelectedSubmission(submission)}
						>
							<div className="flex items-start justify-between mb-4">
								{submission.read ? (
									<MailOpen className="w-6 h-6 text-muted-foreground" />
								) : (
									<Mail className="w-6 h-6 text-primary" />
								)}
								<span className="text-xs text-muted-foreground">
									{new Date(submission.submittedAt).toLocaleDateString(
										"es-ES",
										{
											day: "2-digit",
											month: "short",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										}
									)}
								</span>
							</div>

							<div className="space-y-2">
								{Object.entries(submission.formData)
									.slice(0, 2)
									.map(([key, value]) => (
										<div key={key}>
											<p className="text-xs text-muted-foreground capitalize">
												{key}
											</p>
											<p className="text-sm font-medium truncate">{value}</p>
										</div>
									))}
							</div>

							{!submission.read && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										if (submission.id) handleMarkAsRead(submission.id);
									}}
									className="mt-4 w-full px-3 py-2 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
								>
									Marcar como leído
								</button>
							)}
						</motion.div>
					))}
				</div>
			)}

			{/* Detail Modal */}
			<AnimatePresence>
				{selectedSubmission && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setSelectedSubmission(null)}
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
						/>

						<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 20 }}
								className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
							>
								<div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
									<h3 className="text-xl font-bold">Detalles del Mensaje</h3>
									<button
										onClick={() => setSelectedSubmission(null)}
										className="p-2 rounded-lg hover:bg-muted transition-colors"
									>
										<X className="w-5 h-5" />
									</button>
								</div>

								<div className="p-6 space-y-6">
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											{new Date(
												selectedSubmission.submittedAt
											).toLocaleDateString("es-ES", {
												weekday: "long",
												day: "numeric",
												month: "long",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
										{selectedSubmission.read && (
											<span className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
												<CheckCircle className="w-4 h-4" />
												Leído
											</span>
										)}
									</div>

									{Object.entries(selectedSubmission.formData).map(
										([key, value]) => (
											<div key={key}>
												<label className="block text-sm font-medium text-muted-foreground mb-2 capitalize">
													{key}
												</label>
												<p className="text-base bg-muted p-4 rounded-xl">
													{value}
												</p>
											</div>
										)
									)}

									{!selectedSubmission.read && selectedSubmission.id && (
										<button
											onClick={() => {
												if (selectedSubmission.id) {
													handleMarkAsRead(selectedSubmission.id);
													setSelectedSubmission(null);
												}
											}}
											className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:scale-105 active:scale-95 transition-transform"
										>
											Marcar como leído
										</button>
									)}
								</div>
							</motion.div>
						</div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
