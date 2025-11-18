"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ContactFormConfig } from "@/lib/types";
import { saveContactSubmission } from "@/lib/firestore";
import { Send, Mail, Phone, MapPin, CheckCircle, XCircle } from "lucide-react";

interface ContactFormProps {
	config: ContactFormConfig;
}

export default function ContactForm({ config }: ContactFormProps) {
	const [formData, setFormData] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Prevenir doble envío
		if (loading) return;

		setLoading(true);
		setMessage(null);

		// Validar campos requeridos
		const missingFields = config.fields
			.filter((field) => field.required && !formData[field.name]?.trim())
			.map((field) => field.label);

		if (missingFields.length > 0) {
			setMessage({
				type: "error",
				text: `Por favor completa los campos: ${missingFields.join(", ")}`,
			});
			setLoading(false);
			return;
		}

		// Validar que haya al menos un campo con datos
		const hasData = Object.keys(formData).some(
			(key) => formData[key]?.trim().length > 0
		);

		if (!hasData) {
			setMessage({
				type: "error",
				text: "Por favor completa al menos un campo",
			});
			setLoading(false);
			return;
		}

		try {
			console.log("Submitting form data:", formData);
			const success = await saveContactSubmission(formData);

			if (success) {
				setMessage({ type: "success", text: config.successMessage });
				setFormData({});

				// Reset form after 3 seconds
				setTimeout(() => {
					setMessage(null);
				}, 5000);
			} else {
				setMessage({
					type: "error",
					text: "Error al enviar el mensaje. Por favor intenta de nuevo.",
				});
			}
		} catch (error) {
			console.error("Form submission error:", error);
			setMessage({
				type: "error",
				text: "Error al enviar el mensaje. Por favor intenta de nuevo.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const renderField = (field: ContactFormConfig["fields"][0]) => {
		const baseClasses =
			"w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all";

		switch (field.type) {
			case "textarea":
				return (
					<textarea
						name={field.name}
						value={formData[field.name] || ""}
						onChange={(e) => handleChange(field.name, e.target.value)}
						placeholder={field.placeholder}
						required={field.required}
						rows={4}
						className={baseClasses}
					/>
				);

			case "select":
				return (
					<select
						name={field.name}
						value={formData[field.name] || ""}
						onChange={(e) => handleChange(field.name, e.target.value)}
						required={field.required}
						className={baseClasses}
					>
						<option value="">
							{field.placeholder || "Selecciona una opción"}
						</option>
						{field.options?.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				);

			default:
				return (
					<input
						type={field.type}
						name={field.name}
						value={formData[field.name] || ""}
						onChange={(e) => handleChange(field.name, e.target.value)}
						placeholder={field.placeholder}
						required={field.required}
						className={baseClasses}
					/>
				);
		}
	};

	if (!config.enabled) return null;

	const sortedFields = [...config.fields].sort((a, b) => a.order - b.order);

	return (
		<section id="contacto" className="relative py-16 sm:py-24 overflow-hidden">
			{/* Fondo decorativo */}
			<div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />
			<div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
						{config.title}
					</h2>
					<p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
						{config.subtitle}
					</p>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Formulario */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl"
					>
						<form onSubmit={handleSubmit} className="space-y-4">
							{sortedFields.map((field) => (
								<div key={field.id}>
									<label className="block text-sm font-medium mb-2">
										{field.label}
										{field.required && (
											<span className="text-red-500 ml-1">*</span>
										)}
									</label>
									{renderField(field)}
								</div>
							))}

							{message && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className={`flex items-center gap-3 p-4 rounded-xl ${
										message.type === "success"
											? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
											: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
									}`}
								>
									{message.type === "success" ? (
										<CheckCircle className="w-5 h-5 shrink-0" />
									) : (
										<XCircle className="w-5 h-5 shrink-0" />
									)}
									<p className="text-sm">{message.text}</p>
								</motion.div>
							)}

							<button
								type="submit"
								disabled={loading}
								className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-linear-to-r from-primary to-secondary text-white font-semibold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? (
									<>
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										Enviando...
									</>
								) : (
									<>
										<Send className="w-5 h-5" />
										{config.buttonText}
									</>
								)}
							</button>
						</form>
					</motion.div>

					{/* Información de contacto */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="space-y-6"
					>
						<div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0">
									<Mail className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-lg mb-1">Email</h3>
									<p className="text-muted-foreground">info@empresa.com</p>
								</div>
							</div>
						</div>

						<div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0">
									<Phone className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-lg mb-1">Teléfono</h3>
									<p className="text-muted-foreground">+34 900 000 000</p>
								</div>
							</div>
						</div>

						<div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0">
									<MapPin className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-lg mb-1">Ubicación</h3>
									<p className="text-muted-foreground">Madrid, España</p>
								</div>
							</div>
						</div>

						<div className="flex gap-3">
							<div className="flex-1 bg-primary/10 rounded-xl p-4 text-center">
								<div className="text-2xl mb-2">⚡</div>
								<p className="text-sm font-medium">Respuesta Rápida</p>
							</div>
							<div className="flex-1 bg-secondary/10 rounded-xl p-4 text-center">
								<div className="text-2xl mb-2">🔒</div>
								<p className="text-sm font-medium">100% Seguro</p>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
