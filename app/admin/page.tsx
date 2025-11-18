"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	getLandingContent,
	saveLandingContent,
	uploadImage,
} from "@/lib/firestore";
import { LandingContent, Feature, Testimonial, Product } from "@/lib/types";
import AdminLayout from "@/components/AdminLayout";
import MensajesMasivos from "@/components/MensajesMasivos";
import ContactSubmissions from "@/components/ContactSubmissions";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
	Upload,
	Save,
	Plus,
	Trash2,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";

function AdminPageContent() {
	const [content, setContent] = useState<LandingContent | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const [currentSection, setCurrentSection] = useState("banner");

	useEffect(() => {
		loadContent();
	}, []);

	async function loadContent() {
		const data = await getLandingContent();
		if (data) {
			setContent(data);
		}
		setLoading(false);
	}

	async function handleImageUpload(file: File, path: string): Promise<string> {
		const url = await uploadImage(file, path);
		return url || "";
	}

	async function handleSave() {
		if (!content) return;

		setSaving(true);
		setMessage(null);

		try {
			const { updatedAt, ...contentToSave } = content;
			const success = await saveLandingContent(contentToSave);

			if (success) {
				// Recargar el contenido actualizado desde Firestore
				const updatedContent = await getLandingContent();
				if (updatedContent) {
					setContent(updatedContent);
				}

				setMessage({
					type: "success",
					text: "✓ Cambios guardados exitosamente",
				});
				setTimeout(() => setMessage(null), 4000);
			} else {
				setMessage({ type: "error", text: "✗ Error al guardar los cambios" });
			}
		} catch (error) {
			setMessage({ type: "error", text: "✗ Error al guardar los cambios" });
		} finally {
			setSaving(false);
		}
	}

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<div className="text-2xl font-semibold">Cargando panel...</div>
			</div>
		);
	}

	if (!content) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<div className="text-2xl font-semibold text-red-600">
					Error al cargar el contenido
				</div>
			</div>
		);
	}

	return (
		<AdminLayout
			currentSection={currentSection}
			onSectionChange={setCurrentSection}
		>
			{/* Banner de mensaje */}
			{message && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0 }}
					className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
						message.type === "success"
							? "bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400"
							: "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
					}`}
				>
					{message.type === "success" ? (
						<CheckCircle2 className="w-5 h-5" />
					) : (
						<AlertCircle className="w-5 h-5" />
					)}
					<span className="font-semibold">{message.text}</span>
				</motion.div>
			)}

			{/* Logo Section */}
			{currentSection === "logo" && (
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-card dark:bg-card rounded-2xl shadow-modern p-8 border border-border/50"
				>
					<h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white">
							🏷️
						</div>
						Configuración del Logo
					</h2>

					<div className="space-y-6">
						<div>
							<label className="block font-semibold mb-2 text-card-foreground">
								Texto del Logo
							</label>
							<input
								type="text"
								value={content.logo.text}
								onChange={(e) =>
									setContent({
										...content,
										logo: { ...content.logo, text: e.target.value },
									})
								}
								className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
								placeholder="Nombre de tu empresa..."
							/>
						</div>

						<div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
							<input
								type="checkbox"
								id="showLogoImage"
								checked={content.logo.showImage}
								onChange={(e) =>
									setContent({
										...content,
										logo: { ...content.logo, showImage: e.target.checked },
									})
								}
								className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
							/>
							<label
								htmlFor="showLogoImage"
								className="font-semibold cursor-pointer"
							>
								Mostrar imagen del logo (en lugar del icono)
							</label>
						</div>

						{content.logo.showImage && (
							<div>
								<label className="font-semibold mb-2 text-card-foreground flex items-center gap-2">
									<Upload className="w-4 h-4" />
									Imagen del Logo
								</label>
								<input
									type="file"
									accept="image/*"
									onChange={async (e) => {
										const file = e.target.files?.[0];
										if (file) {
											const url = await handleImageUpload(
												file,
												`logo-${Date.now()}`
											);
											if (url) {
												setContent({
													...content,
													logo: { ...content.logo, imageUrl: url },
												});
											}
										}
									}}
									className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary-dark transition-all"
								/>
								{content.logo.imageUrl && (
									<div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border">
										<p className="text-sm text-muted-foreground mb-2">
											Vista previa:
										</p>
										<img
											src={content.logo.imageUrl}
											alt="Logo preview"
											className="h-16 w-auto object-contain"
										/>
									</div>
								)}
							</div>
						)}
					</div>
				</motion.section>
			)}

			{/* Stats Section */}
			{currentSection === "stats" && (
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-card dark:bg-card rounded-2xl shadow-modern p-8 border border-border/50"
				>
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-3xl font-bold flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white">
								📊
							</div>
							Estadísticas
						</h2>
						<div className="flex items-center gap-3">
							<label className="flex items-center gap-2 font-semibold">
								<input
									type="checkbox"
									checked={content.stats.enabled}
									onChange={(e) =>
										setContent({
											...content,
											stats: { ...content.stats, enabled: e.target.checked },
										})
									}
									className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
								/>
								Mostrar sección
							</label>
						</div>
					</div>

					{content.stats.enabled && (
						<div className="space-y-6">
							{content.stats.stats.map((stat, index) => (
								<div
									key={stat.id}
									className="p-6 bg-muted/30 dark:bg-muted/20 rounded-xl border border-border/50"
								>
									<div className="flex justify-between items-start mb-4">
										<h3 className="text-lg font-bold text-card-foreground">
											Estadística #{index + 1}
										</h3>
										<button
											onClick={() => {
												const newStats = content.stats.stats.filter(
													(_, i) => i !== index
												);
												setContent({
													...content,
													stats: { ...content.stats, stats: newStats },
												});
											}}
											className="p-2 text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
										>
											<Trash2 className="w-5 h-5" />
										</button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div>
											<label className="block text-sm font-medium mb-2">
												Valor
											</label>
											<input
												type="text"
												value={stat.value}
												onChange={(e) => {
													const newStats = [...content.stats.stats];
													newStats[index].value = e.target.value;
													setContent({
														...content,
														stats: { ...content.stats, stats: newStats },
													});
												}}
												className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
												placeholder="ej. 10K+"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium mb-2">
												Etiqueta
											</label>
											<input
												type="text"
												value={stat.label}
												onChange={(e) => {
													const newStats = [...content.stats.stats];
													newStats[index].label = e.target.value;
													setContent({
														...content,
														stats: { ...content.stats, stats: newStats },
													});
												}}
												className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
												placeholder="ej. Clientes"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium mb-2">
												Icono (emoji)
											</label>
											<input
												type="text"
												value={stat.icon}
												onChange={(e) => {
													const newStats = [...content.stats.stats];
													newStats[index].icon = e.target.value;
													setContent({
														...content,
														stats: { ...content.stats, stats: newStats },
													});
												}}
												className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
												placeholder="ej. 👥"
											/>
										</div>
									</div>
								</div>
							))}

							<button
								onClick={() => {
									const newStat = {
										id: Date.now().toString(),
										value: "100+",
										label: "Nueva Estadística",
										icon: "📈",
									};
									setContent({
										...content,
										stats: {
											...content.stats,
											stats: [...content.stats.stats, newStat],
										},
									});
								}}
								className="w-full flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
							>
								<Plus className="w-5 h-5" />
								Agregar Estadística
							</button>
						</div>
					)}
				</motion.section>
			)}

			{/* Products Section */}
			{currentSection === "products" && (
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-card dark:bg-card rounded-2xl shadow-modern p-8 border border-border/50"
				>
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-3xl font-bold flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white">
								📦
							</div>
							Productos / Planes
						</h2>
						<div className="flex items-center gap-3">
							<label className="flex items-center gap-2 font-semibold">
								<input
									type="checkbox"
									checked={content.products.enabled}
									onChange={(e) =>
										setContent({
											...content,
											products: {
												...content.products,
												enabled: e.target.checked,
											},
										})
									}
									className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
								/>
								Mostrar sección
							</label>
						</div>
					</div>

					{content.products.enabled && (
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
								<div>
									<label className="block font-semibold mb-2">
										Título de la Sección
									</label>
									<input
										type="text"
										value={content.products.title}
										onChange={(e) =>
											setContent({
												...content,
												products: {
													...content.products,
													title: e.target.value,
												},
											})
										}
										className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
								<div>
									<label className="block font-semibold mb-2">Subtítulo</label>
									<input
										type="text"
										value={content.products.subtitle}
										onChange={(e) =>
											setContent({
												...content,
												products: {
													...content.products,
													subtitle: e.target.value,
												},
											})
										}
										className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
							</div>

							{content.products.products.map((product, index) => (
								<div
									key={product.id}
									className="p-6 bg-muted/30 dark:bg-muted/20 rounded-xl border border-border/50"
								>
									<div className="flex justify-between items-start mb-4">
										<h3 className="text-lg font-bold text-card-foreground">
											Producto #{index + 1}
										</h3>
										<button
											onClick={() => {
												const newProducts = content.products.products.filter(
													(_, i) => i !== index
												);
												setContent({
													...content,
													products: {
														...content.products,
														products: newProducts,
													},
												});
											}}
											className="p-2 text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
										>
											<Trash2 className="w-5 h-5" />
										</button>
									</div>

									<div className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium mb-2">
													Nombre
												</label>
												<input
													type="text"
													value={product.name}
													onChange={(e) => {
														const newProducts = [...content.products.products];
														newProducts[index].name = e.target.value;
														setContent({
															...content,
															products: {
																...content.products,
																products: newProducts,
															},
														});
													}}
													className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
												/>
											</div>

											<div>
												<label className="block text-sm font-medium mb-2">
													Precio
												</label>
												<input
													type="text"
													value={product.price}
													onChange={(e) => {
														const newProducts = [...content.products.products];
														newProducts[index].price = e.target.value;
														setContent({
															...content,
															products: {
																...content.products,
																products: newProducts,
															},
														});
													}}
													className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
												/>
											</div>
										</div>

										<div>
											<label className="block text-sm font-medium mb-2">
												Descripción
											</label>
											<textarea
												value={product.description}
												onChange={(e) => {
													const newProducts = [...content.products.products];
													newProducts[index].description = e.target.value;
													setContent({
														...content,
														products: {
															...content.products,
															products: newProducts,
														},
													});
												}}
												className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
												rows={2}
											/>
										</div>

										<div className="flex items-center gap-3 p-3 bg-background dark:bg-muted rounded-lg">
											<input
												type="checkbox"
												id={`highlighted-${product.id}`}
												checked={product.highlighted || false}
												onChange={(e) => {
													const newProducts = [...content.products.products];
													newProducts[index].highlighted = e.target.checked;
													setContent({
														...content,
														products: {
															...content.products,
															products: newProducts,
														},
													});
												}}
												className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
											/>
											<label
												htmlFor={`highlighted-${product.id}`}
												className="text-sm font-medium cursor-pointer"
											>
												Destacar este producto
											</label>
										</div>

										<div>
											<label className="block text-sm font-medium mb-2">
												Características (una por línea)
											</label>
											<textarea
												value={product.features.join("\n")}
												onChange={(e) => {
													const newProducts = [...content.products.products];
													newProducts[index].features = e.target.value
														.split("\n")
														.filter((f) => f.trim());
													setContent({
														...content,
														products: {
															...content.products,
															products: newProducts,
														},
													});
												}}
												className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
												rows={4}
												placeholder="Característica 1&#10;Característica 2&#10;Característica 3"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium mb-2">
												Imagen (opcional)
											</label>
											<input
												type="file"
												accept="image/*"
												onChange={async (e) => {
													const file = e.target.files?.[0];
													if (file) {
														const url = await handleImageUpload(
															file,
															`product-${product.id}-${Date.now()}`
														);
														if (url) {
															const newProducts = [
																...content.products.products,
															];
															newProducts[index].imageUrl = url;
															setContent({
																...content,
																products: {
																	...content.products,
																	products: newProducts,
																},
															});
														}
													}
												}}
												className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary-dark"
											/>
											{product.imageUrl && (
												<img
													src={product.imageUrl}
													alt="Product preview"
													className="mt-2 w-full h-48 object-cover rounded-lg border border-border"
												/>
											)}
										</div>
									</div>
								</div>
							))}

							<button
								onClick={() => {
									const newProduct = {
										id: Date.now().toString(),
										name: "Nuevo Plan",
										description: "Descripción del plan",
										price: "$0/mes",
										features: ["Característica 1", "Característica 2"],
									};
									setContent({
										...content,
										products: {
											...content.products,
											products: [...content.products.products, newProduct],
										},
									});
								}}
								className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
							>
								<Plus className="w-5 h-5" />
								Agregar Producto
							</button>
						</div>
					)}
				</motion.section>
			)}

			{/* Banner Section */}
			{currentSection === "banner" && (
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-card dark:bg-card rounded-2xl shadow-modern p-8 border border-border/50"
				>
					<h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white">
							🎨
						</div>
						Banner Principal
					</h2>

					<div className="space-y-6">
						<div>
							<label className="block font-semibold mb-2 text-card-foreground">
								Título
							</label>
							<input
								type="text"
								value={content.banner.title}
								onChange={(e) =>
									setContent({
										...content,
										banner: { ...content.banner, title: e.target.value },
									})
								}
								className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
								placeholder="Título principal..."
							/>
						</div>

						<div>
							<label className="block font-semibold mb-2 text-card-foreground">
								Subtítulo
							</label>
							<textarea
								value={content.banner.subtitle}
								onChange={(e) =>
									setContent({
										...content,
										banner: { ...content.banner, subtitle: e.target.value },
									})
								}
								className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
								rows={3}
								placeholder="Subtítulo descriptivo..."
							/>
						</div>

						<div>
							<label className="font-semibold mb-2 text-card-foreground flex items-center gap-2">
								<Upload className="w-4 h-4" />
								Imagen de Fondo
							</label>
							<input
								type="file"
								accept="image/*"
								onChange={async (e) => {
									const file = e.target.files?.[0];
									if (file) {
										const url = await handleImageUpload(
											file,
											`banner-${Date.now()}`
										);
										if (url) {
											setContent({
												...content,
												banner: { ...content.banner, imageUrl: url },
											});
										}
									}
								}}
								className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary-dark transition-all"
							/>
							{content.banner.imageUrl && (
								<div className="mt-4 relative h-48 rounded-xl overflow-hidden border border-border">
									<img
										src={content.banner.imageUrl}
										alt="Banner preview"
										className="w-full h-full object-cover"
									/>
								</div>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block font-semibold mb-2 text-card-foreground">
									Texto del Botón
								</label>
								<input
									type="text"
									value={content.banner.ctaText}
									onChange={(e) =>
										setContent({
											...content,
											banner: { ...content.banner, ctaText: e.target.value },
										})
									}
									className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
								/>
							</div>
							<div>
								<label className="block font-semibold mb-2 text-card-foreground">
									Enlace del Botón
								</label>
								<input
									type="text"
									value={content.banner.ctaLink}
									onChange={(e) =>
										setContent({
											...content,
											banner: { ...content.banner, ctaLink: e.target.value },
										})
									}
									className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
								/>
							</div>
						</div>
					</div>
				</motion.section>
			)}

			{/* Features Section */}
			{currentSection === "features" && (
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-card dark:bg-card rounded-2xl shadow-modern p-8 border border-border/50"
				>
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-3xl font-bold flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white">
								⭐
							</div>
							Características
						</h2>
						<button
							onClick={() => {
								const newFeature: Feature = {
									id: Date.now().toString(),
									title: "Nueva Característica",
									description: "Descripción de la característica",
									icon: "✨",
								};
								setContent({
									...content,
									features: [...content.features, newFeature],
								});
							}}
							className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
						>
							<Plus className="w-5 h-5" />
							Agregar
						</button>
					</div>

					<div className="space-y-6">
						{content.features.map((feature, index) => (
							<div
								key={feature.id}
								className="p-6 bg-muted/30 dark:bg-muted/20 rounded-xl border border-border/50"
							>
								<div className="flex justify-between items-start mb-4">
									<h3 className="text-lg font-bold text-card-foreground">
										Característica #{index + 1}
									</h3>
									<button
										onClick={() => {
											const newFeatures = content.features.filter(
												(_, i) => i !== index
											);
											setContent({ ...content, features: newFeatures });
										}}
										className="p-2 text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
									>
										<Trash2 className="w-5 h-5" />
									</button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											Título
										</label>
										<input
											type="text"
											value={feature.title}
											onChange={(e) => {
												const newFeatures = [...content.features];
												newFeatures[index].title = e.target.value;
												setContent({ ...content, features: newFeatures });
											}}
											className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">
											Icono (emoji)
										</label>
										<input
											type="text"
											value={feature.icon}
											onChange={(e) => {
												const newFeatures = [...content.features];
												newFeatures[index].icon = e.target.value;
												setContent({ ...content, features: newFeatures });
											}}
											className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>
								</div>

								<div className="mt-4">
									<label className="block text-sm font-medium mb-2">
										Descripción
									</label>
									<textarea
										value={feature.description}
										onChange={(e) => {
											const newFeatures = [...content.features];
											newFeatures[index].description = e.target.value;
											setContent({ ...content, features: newFeatures });
										}}
										className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
										rows={3}
									/>
								</div>

								<div className="mt-4">
									<label className="block text-sm font-medium mb-2">
										Imagen (opcional)
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={async (e) => {
											const file = e.target.files?.[0];
											if (file) {
												const url = await handleImageUpload(
													file,
													`feature-${feature.id}-${Date.now()}`
												);
												if (url) {
													const newFeatures = [...content.features];
													newFeatures[index].imageUrl = url;
													setContent({ ...content, features: newFeatures });
												}
											}
										}}
										className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary-dark"
									/>
									{feature.imageUrl && (
										<img
											src={feature.imageUrl}
											alt="Feature preview"
											className="mt-2 w-32 h-32 object-cover rounded-lg border border-border"
										/>
									)}
								</div>
							</div>
						))}
					</div>
				</motion.section>
			)}

			{/* Testimonials Section */}
			{currentSection === "testimonials" && (
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-card dark:bg-card rounded-2xl shadow-modern p-8 border border-border/50"
				>
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-3xl font-bold flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white">
								💬
							</div>
							Testimonios
						</h2>
						<button
							onClick={() => {
								const newTestimonial: Testimonial = {
									id: Date.now().toString(),
									name: "Nuevo Cliente",
									role: "Empresa",
									content: "Excelente servicio",
									rating: 5,
								};
								setContent({
									...content,
									testimonials: [...content.testimonials, newTestimonial],
								});
							}}
							className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
						>
							<Plus className="w-5 h-5" />
							Agregar
						</button>
					</div>

					<div className="space-y-6">
						{content.testimonials.map((testimonial, index) => (
							<div
								key={testimonial.id}
								className="p-6 bg-muted/30 dark:bg-muted/20 rounded-xl border border-border/50"
							>
								<div className="flex justify-between items-start mb-4">
									<h3 className="text-lg font-bold text-card-foreground">
										Testimonio #{index + 1}
									</h3>
									<button
										onClick={() => {
											const newTestimonials = content.testimonials.filter(
												(_, i) => i !== index
											);
											setContent({
												...content,
												testimonials: newTestimonials,
											});
										}}
										className="p-2 text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
									>
										<Trash2 className="w-5 h-5" />
									</button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											Nombre
										</label>
										<input
											type="text"
											value={testimonial.name}
											onChange={(e) => {
												const newTestimonials = [...content.testimonials];
												newTestimonials[index].name = e.target.value;
												setContent({
													...content,
													testimonials: newTestimonials,
												});
											}}
											className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">
											Rol/Empresa
										</label>
										<input
											type="text"
											value={testimonial.role}
											onChange={(e) => {
												const newTestimonials = [...content.testimonials];
												newTestimonials[index].role = e.target.value;
												setContent({
													...content,
													testimonials: newTestimonials,
												});
											}}
											className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>
								</div>

								<div className="mb-4">
									<label className="block text-sm font-medium mb-2">
										Testimonio
									</label>
									<textarea
										value={testimonial.content}
										onChange={(e) => {
											const newTestimonials = [...content.testimonials];
											newTestimonials[index].content = e.target.value;
											setContent({ ...content, testimonials: newTestimonials });
										}}
										className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
										rows={3}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											Calificación (1-5)
										</label>
										<input
											type="number"
											min="1"
											max="5"
											value={testimonial.rating}
											onChange={(e) => {
												const newTestimonials = [...content.testimonials];
												newTestimonials[index].rating = parseInt(
													e.target.value
												);
												setContent({
													...content,
													testimonials: newTestimonials,
												});
											}}
											className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">
											Avatar (opcional)
										</label>
										<input
											type="file"
											accept="image/*"
											onChange={async (e) => {
												const file = e.target.files?.[0];
												if (file) {
													const url = await handleImageUpload(
														file,
														`testimonial-${testimonial.id}-${Date.now()}`
													);
													if (url) {
														const newTestimonials = [...content.testimonials];
														newTestimonials[index].avatarUrl = url;
														setContent({
															...content,
															testimonials: newTestimonials,
														});
													}
												}
											}}
											className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary-dark"
										/>
										{testimonial.avatarUrl && (
											<img
												src={testimonial.avatarUrl}
												alt="Avatar preview"
												className="mt-2 w-20 h-20 object-cover rounded-full border border-border"
											/>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</motion.section>
			)}

			{/* CTA Section */}
			{currentSection === "cta" && (
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-card dark:bg-card rounded-2xl shadow-modern p-8 border border-border/50"
				>
					<h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white">
							📢
						</div>
						Llamada a la Acción
					</h2>

					<div className="space-y-6">
						<div>
							<label className="block font-semibold mb-2">Título</label>
							<input
								type="text"
								value={content.cta.title}
								onChange={(e) =>
									setContent({
										...content,
										cta: { ...content.cta, title: e.target.value },
									})
								}
								className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>

						<div>
							<label className="block font-semibold mb-2">Descripción</label>
							<textarea
								value={content.cta.description}
								onChange={(e) =>
									setContent({
										...content,
										cta: { ...content.cta, description: e.target.value },
									})
								}
								className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
								rows={3}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block font-semibold mb-2">
									Texto del Botón
								</label>
								<input
									type="text"
									value={content.cta.buttonText}
									onChange={(e) =>
										setContent({
											...content,
											cta: { ...content.cta, buttonText: e.target.value },
										})
									}
									className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
							<div>
								<label className="block font-semibold mb-2">
									Enlace del Botón
								</label>
								<input
									type="text"
									value={content.cta.buttonLink}
									onChange={(e) =>
										setContent({
											...content,
											cta: { ...content.cta, buttonLink: e.target.value },
										})
									}
									className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
						</div>

						<div>
							<label className="font-semibold mb-2 flex items-center gap-2">
								<Upload className="w-4 h-4" />
								Imagen de Fondo (opcional)
							</label>
							<input
								type="file"
								accept="image/*"
								onChange={async (e) => {
									const file = e.target.files?.[0];
									if (file) {
										const url = await handleImageUpload(
											file,
											`cta-${Date.now()}`
										);
										if (url) {
											setContent({
												...content,
												cta: { ...content.cta, backgroundImageUrl: url },
											});
										}
									}
								}}
								className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary-dark"
							/>
							{content.cta.backgroundImageUrl && (
								<div className="mt-4 relative h-48 rounded-xl overflow-hidden border border-border">
									<img
										src={content.cta.backgroundImageUrl}
										alt="CTA background preview"
										className="w-full h-full object-cover"
									/>
								</div>
							)}
						</div>
					</div>
				</motion.section>
			)}

			{/* Footer Section */}
			{currentSection === "footer" && (
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-card dark:bg-card rounded-2xl shadow-modern p-8 border border-border/50"
				>
					<h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white">
							⚙️
						</div>
						Footer
					</h2>

					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block font-semibold mb-2">
									Nombre de la Empresa
								</label>
								<input
									type="text"
									value={content.footer.companyName}
									onChange={(e) =>
										setContent({
											...content,
											footer: {
												...content.footer,
												companyName: e.target.value,
											},
										})
									}
									className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
							<div>
								<label className="block font-semibold mb-2">Descripción</label>
								<input
									type="text"
									value={content.footer.description}
									onChange={(e) =>
										setContent({
											...content,
											footer: {
												...content.footer,
												description: e.target.value,
											},
										})
									}
									className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block font-semibold mb-2">Email</label>
								<input
									type="email"
									value={content.footer.email}
									onChange={(e) =>
										setContent({
											...content,
											footer: { ...content.footer, email: e.target.value },
										})
									}
									className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
							<div>
								<label className="block font-semibold mb-2">Teléfono</label>
								<input
									type="tel"
									value={content.footer.phone}
									onChange={(e) =>
										setContent({
											...content,
											footer: { ...content.footer, phone: e.target.value },
										})
									}
									className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
							<div>
								<label className="block font-semibold mb-2">Dirección</label>
								<input
									type="text"
									value={content.footer.address}
									onChange={(e) =>
										setContent({
											...content,
											footer: { ...content.footer, address: e.target.value },
										})
									}
									className="w-full px-4 py-3 border border-border rounded-xl bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
						</div>

						<div>
							<label className="block font-semibold mb-3">Redes Sociales</label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm mb-1">Facebook</label>
									<input
										type="url"
										placeholder="https://facebook.com/..."
										value={content.footer.socialLinks.facebook || ""}
										onChange={(e) =>
											setContent({
												...content,
												footer: {
													...content.footer,
													socialLinks: {
														...content.footer.socialLinks,
														facebook: e.target.value,
													},
												},
											})
										}
										className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
								<div>
									<label className="block text-sm mb-1">Twitter</label>
									<input
										type="url"
										placeholder="https://twitter.com/..."
										value={content.footer.socialLinks.twitter || ""}
										onChange={(e) =>
											setContent({
												...content,
												footer: {
													...content.footer,
													socialLinks: {
														...content.footer.socialLinks,
														twitter: e.target.value,
													},
												},
											})
										}
										className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
								<div>
									<label className="block text-sm mb-1">Instagram</label>
									<input
										type="url"
										placeholder="https://instagram.com/..."
										value={content.footer.socialLinks.instagram || ""}
										onChange={(e) =>
											setContent({
												...content,
												footer: {
													...content.footer,
													socialLinks: {
														...content.footer.socialLinks,
														instagram: e.target.value,
													},
												},
											})
										}
										className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
								<div>
									<label className="block text-sm mb-1">LinkedIn</label>
									<input
										type="url"
										placeholder="https://linkedin.com/..."
										value={content.footer.socialLinks.linkedin || ""}
										onChange={(e) =>
											setContent({
												...content,
												footer: {
													...content.footer,
													socialLinks: {
														...content.footer.socialLinks,
														linkedin: e.target.value,
													},
												},
											})
										}
										className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
							</div>
						</div>
					</div>
				</motion.section>
			)}

			{/* Sección: Mensajes Masivos */}
			{currentSection === "mensajes" && (
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-card dark:bg-card rounded-3xl p-8 shadow-modern border border-border/50"
				>
					<h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
						Mensajes Masivos
					</h2>
					<MensajesMasivos />
				</motion.section>
			)}

			{/* Sección: Formulario de Contacto */}
			{currentSection === "contactForm" && content && (
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-card dark:bg-card rounded-3xl p-8 shadow-modern border border-border/50"
				>
					<h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
						Configuración del Formulario de Contacto
					</h2>

					<div className="space-y-8">
						{/* Toggle Enabled */}
						<div className="flex items-center gap-3">
							<input
								type="checkbox"
								checked={content.contactForm?.enabled || false}
								onChange={(e) => {
									if (!content.contactForm) return;
									setContent({
										...content,
										contactForm: {
											...content.contactForm,
											enabled: e.target.checked,
										},
									});
								}}
								className="w-5 h-5 rounded border-border"
							/>
							<label className="text-sm font-medium">
								Mostrar formulario de contacto
							</label>
						</div>

						{content.contactForm && (
							<>
								{/* Título */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Título
									</label>
									<input
										type="text"
										value={content.contactForm.title}
										onChange={(e) =>
											setContent({
												...content,
												contactForm: {
													...content.contactForm!,
													title: e.target.value,
												},
											})
										}
										className="w-full px-4 py-3 rounded-xl border border-border bg-background"
									/>
								</div>

								{/* Subtítulo */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Subtítulo
									</label>
									<textarea
										value={content.contactForm.subtitle}
										onChange={(e) =>
											setContent({
												...content,
												contactForm: {
													...content.contactForm!,
													subtitle: e.target.value,
												},
											})
										}
										rows={2}
										className="w-full px-4 py-3 rounded-xl border border-border bg-background"
									/>
								</div>

								{/* Texto del Botón */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Texto del Botón
									</label>
									<input
										type="text"
										value={content.contactForm.buttonText}
										onChange={(e) =>
											setContent({
												...content,
												contactForm: {
													...content.contactForm!,
													buttonText: e.target.value,
												},
											})
										}
										className="w-full px-4 py-3 rounded-xl border border-border bg-background"
									/>
								</div>

								{/* Mensaje de Éxito */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Mensaje de Éxito
									</label>
									<textarea
										value={content.contactForm.successMessage}
										onChange={(e) =>
											setContent({
												...content,
												contactForm: {
													...content.contactForm!,
													successMessage: e.target.value,
												},
											})
										}
										rows={2}
										className="w-full px-4 py-3 rounded-xl border border-border bg-background"
									/>
								</div>

								{/* Campos del Formulario */}
								<div>
									<div className="flex items-center justify-between mb-4">
										<label className="text-sm font-medium">
											Campos del Formulario
										</label>
										<button
											onClick={() => {
												const newField = {
													id: Date.now().toString(),
													name: "nuevo_campo",
													label: "Nuevo Campo",
													type: "text" as const,
													placeholder: "",
													required: false,
													order: content.contactForm!.fields.length + 1,
												};
												setContent({
													...content,
													contactForm: {
														...content.contactForm!,
														fields: [...content.contactForm!.fields, newField],
													},
												});
											}}
											className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:scale-105 transition-transform"
										>
											<Plus className="w-4 h-4" />
											Agregar Campo
										</button>
									</div>

									<div className="space-y-4">
										{content.contactForm.fields.map((field, index) => (
											<div
												key={field.id}
												className="p-6 rounded-xl border border-border bg-muted/30 space-y-4"
											>
												<div className="flex items-center justify-between">
													<h4 className="font-semibold">Campo {index + 1}</h4>
													<button
														onClick={() => {
															setContent({
																...content,
																contactForm: {
																	...content.contactForm!,
																	fields: content.contactForm!.fields.filter(
																		(f) => f.id !== field.id
																	),
																},
															});
														}}
														className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>

												<div className="grid grid-cols-2 gap-4">
													{/* Name (ID) */}
													<div>
														<label className="block text-xs font-medium mb-1">
															Nombre (ID)
														</label>
														<input
															type="text"
															value={field.name}
															onChange={(e) => {
																const updatedFields = [
																	...content.contactForm!.fields,
																];
																updatedFields[index] = {
																	...updatedFields[index],
																	name: e.target.value,
																};
																setContent({
																	...content,
																	contactForm: {
																		...content.contactForm!,
																		fields: updatedFields,
																	},
																});
															}}
															className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
														/>
													</div>

													{/* Label */}
													<div>
														<label className="block text-xs font-medium mb-1">
															Etiqueta
														</label>
														<input
															type="text"
															value={field.label}
															onChange={(e) => {
																const updatedFields = [
																	...content.contactForm!.fields,
																];
																updatedFields[index] = {
																	...updatedFields[index],
																	label: e.target.value,
																};
																setContent({
																	...content,
																	contactForm: {
																		...content.contactForm!,
																		fields: updatedFields,
																	},
																});
															}}
															className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
														/>
													</div>

													{/* Type */}
													<div>
														<label className="block text-xs font-medium mb-1">
															Tipo
														</label>
														<select
															value={field.type}
															onChange={(e) => {
																const updatedFields = [
																	...content.contactForm!.fields,
																];
																updatedFields[index] = {
																	...updatedFields[index],
																	type: e.target.value as any,
																};
																setContent({
																	...content,
																	contactForm: {
																		...content.contactForm!,
																		fields: updatedFields,
																	},
																});
															}}
															className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
														>
															<option value="text">Texto</option>
															<option value="email">Email</option>
															<option value="tel">Teléfono</option>
															<option value="textarea">Área de texto</option>
															<option value="select">Selección</option>
														</select>
													</div>

													{/* Placeholder */}
													<div>
														<label className="block text-xs font-medium mb-1">
															Placeholder
														</label>
														<input
															type="text"
															value={field.placeholder || ""}
															onChange={(e) => {
																const updatedFields = [
																	...content.contactForm!.fields,
																];
																updatedFields[index] = {
																	...updatedFields[index],
																	placeholder: e.target.value,
																};
																setContent({
																	...content,
																	contactForm: {
																		...content.contactForm!,
																		fields: updatedFields,
																	},
																});
															}}
															className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
														/>
													</div>

													{/* Order */}
													<div>
														<label className="block text-xs font-medium mb-1">
															Orden
														</label>
														<input
															type="number"
															value={field.order}
															onChange={(e) => {
																const updatedFields = [
																	...content.contactForm!.fields,
																];
																updatedFields[index] = {
																	...updatedFields[index],
																	order: parseInt(e.target.value) || 0,
																};
																setContent({
																	...content,
																	contactForm: {
																		...content.contactForm!,
																		fields: updatedFields,
																	},
																});
															}}
															className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
														/>
													</div>

													{/* Required */}
													<div className="flex items-center gap-2">
														<input
															type="checkbox"
															checked={field.required}
															onChange={(e) => {
																const updatedFields = [
																	...content.contactForm!.fields,
																];
																updatedFields[index] = {
																	...updatedFields[index],
																	required: e.target.checked,
																};
																setContent({
																	...content,
																	contactForm: {
																		...content.contactForm!,
																		fields: updatedFields,
																	},
																});
															}}
															className="w-4 h-4 rounded border-border"
														/>
														<label className="text-xs font-medium">
															Requerido
														</label>
													</div>
												</div>

												{/* Options para select */}
												{field.type === "select" && (
													<div>
														<label className="block text-xs font-medium mb-1">
															Opciones (una por línea)
														</label>
														<textarea
															value={field.options?.join("\n") || ""}
															onChange={(e) => {
																const updatedFields = [
																	...content.contactForm!.fields,
																];
																updatedFields[index] = {
																	...updatedFields[index],
																	options: e.target.value
																		.split("\n")
																		.filter((o) => o.trim()),
																};
																setContent({
																	...content,
																	contactForm: {
																		...content.contactForm!,
																		fields: updatedFields,
																	},
																});
															}}
															rows={3}
															className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono"
														/>
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							</>
						)}
					</div>
				</motion.section>
			)}

			{/* Sección: Mensajes Recibidos */}
			{currentSection === "submissions" && (
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-card dark:bg-card rounded-3xl p-8 shadow-modern border border-border/50"
				>
					<ContactSubmissions />
				</motion.section>
			)}

			{/* Botón de guardar flotante - solo para secciones de contenido */}
			{currentSection !== "mensajes" && currentSection !== "submissions" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="fixed bottom-8 right-8 z-50"
				>
					<button
						onClick={handleSave}
						disabled={saving}
						className="flex items-center gap-3 bg-linear-to-r from-primary to-secondary hover:from-primary-dark hover:to-primary disabled:from-gray-400 disabled:to-gray-500 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
					>
						{saving ? (
							<>
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								Guardando...
							</>
						) : (
							<>
								<Save className="w-5 h-5" />
								Guardar Cambios
							</>
						)}
					</button>
				</motion.div>
			)}
		</AdminLayout>
	);
}

export default function AdminPage() {
	return (
		<ProtectedRoute>
			<AdminPageContent />
		</ProtectedRoute>
	);
}
