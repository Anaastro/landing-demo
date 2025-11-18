"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { LogoConfig } from "@/lib/types";
import Link from "next/link";
import { Menu, X, LogIn, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";

interface NavbarProps {
	logo: LogoConfig;
}

export default function Navbar({ logo }: NavbarProps) {
	const { user, logout } = useAuth();
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setShowMobileMenu(false);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Bloquear scroll del BODY cuando el menú móvil está abierto
	useEffect(() => {
		if (showMobileMenu) {
			document.body.style.overflow = "hidden";
			document.body.style.position = "fixed"; // Asegura que no se mueva en iOS
			document.body.style.width = "100%";
		} else {
			document.body.style.overflow = "unset";
			document.body.style.position = "static";
		}
		return () => {
			document.body.style.overflow = "unset";
			document.body.style.position = "static";
		};
	}, [showMobileMenu]);

	const handleLogout = async () => {
		try {
			await logout();
			setShowUserMenu(false);
			setShowMobileMenu(false);
		} catch {
			// Error handled by context
		}
	};

	const closeMobileMenu = () => {
		setShowMobileMenu(false);
	};

	// Variantes de animación
	const mobileMenuVariants: Variants = {
		hidden: { opacity: 0, y: "-100%" }, // Empieza arriba fuera de pantalla
		visible: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", stiffness: 300, damping: 30 },
		},
		exit: {
			opacity: 0,
			y: "-100%",
			transition: { duration: 0.3 },
		},
	};

	const containerVariants: Variants = {
		visible: {
			transition: { staggerChildren: 0.1, delayChildren: 0.2 },
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<>
			{/* NAVBAR DESKTOP / BARRA SUPERIOR (z-40) */}
			<motion.nav
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 h-16 sm:h-20"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
					<div className="flex items-center justify-between h-full">
						{/* LOGO */}
						<Link
							href="/"
							className="flex items-center gap-2 sm:gap-3 group relative z-50"
						>
							{logo.showImage && logo.imageUrl ? (
								<img
									src={logo.imageUrl}
									alt={logo.text}
									className="h-8 sm:h-10 w-auto object-contain group-hover:scale-110 transition-transform"
								/>
							) : (
								<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg sm:text-xl group-hover:scale-110 transition-transform">
									{logo.text.charAt(0).toUpperCase()}
								</div>
							)}
							<span className="text-lg sm:text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
								{logo.text}
							</span>
						</Link>

						{/* ENLACES DESKTOP */}
						<div className="hidden md:flex items-center gap-6">
							<Link
								href="#features"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Características
							</Link>
							<Link
								href="#products"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Productos
							</Link>
							<Link
								href="#testimonials"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Testimonios
							</Link>

							{user ? (
								<div className="relative">
									<button
										onClick={() => setShowUserMenu(!showUserMenu)}
										className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors"
									>
										<User className="w-4 h-4" />
										<span className="text-sm font-medium">
											{user.email?.split("@")[0]}
										</span>
									</button>

									{showUserMenu && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
										>
											<Link
												href="/admin"
												className="flex items-center gap-2 px-4 py-3 hover:bg-muted transition-colors"
												onClick={() => setShowUserMenu(false)}
											>
												<Shield className="w-4 h-4" />
												<span className="text-sm font-medium">Panel Admin</span>
											</Link>
											<button
												onClick={handleLogout}
												className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted transition-colors text-left"
											>
												<LogOut className="w-4 h-4" />
												<span className="text-sm font-medium">
													Cerrar Sesión
												</span>
											</button>
										</motion.div>
									)}
								</div>
							) : (
								<button
									onClick={() => setShowAuthModal(true)}
									className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-primary to-secondary text-white font-semibold hover:scale-105 transition-transform text-sm"
								>
									<LogIn className="w-4 h-4" />
									Iniciar Sesión
								</button>
							)}
						</div>

						{/* BOTÓN HAMBURGUESA MOBILE */}
						<button
							onClick={() => setShowMobileMenu(true)}
							className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors active:scale-95 z-50"
							aria-label="Open menu"
						>
							<Menu className="w-6 h-6" />
						</button>
					</div>
				</div>
			</motion.nav>

			{/* MENÚ MÓVIL (SEPARADO Y PANTALLA COMPLETA z-50) */}
			<AnimatePresence>
				{showMobileMenu && (
					<motion.div
						variants={mobileMenuVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						// CAMBIO IMPORTANTE: fixed inset-0 y h-[100dvh] asegura que ocupe todo
						className="fixed inset-0 z-50 bg-background flex flex-col h-[100dvh] overflow-hidden"
					>
						{/* CABECERA DEL MENÚ MÓVIL */}
						<div className="flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20 border-b border-border/50 shrink-0">
							<div className="flex items-center gap-2">
								{logo.showImage && logo.imageUrl ? (
									<img
										src={logo.imageUrl}
										alt={logo.text}
										className="h-8 w-auto"
									/>
								) : (
									<div className="w-8 h-8 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
										{logo.text.charAt(0).toUpperCase()}
									</div>
								)}
								<span className="text-lg font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
									{logo.text}
								</span>
							</div>
							<button
								onClick={closeMobileMenu}
								className="p-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
							>
								<X className="w-8 h-8" />
							</button>
						</div>

						{/* CONTENIDO SCROLLEABLE */}
						<motion.div
							variants={containerVariants}
							className="flex-1 overflow-y-auto py-8 px-6 flex flex-col items-center"
						>
							<div className="w-full max-w-sm space-y-6 text-center">
								<motion.div variants={itemVariants}>
									<Link
										href="#features"
										onClick={closeMobileMenu}
										className="block text-2xl font-semibold py-2 text-foreground hover:text-primary transition-colors"
									>
										Características
									</Link>
								</motion.div>
								<motion.div variants={itemVariants}>
									<Link
										href="#products"
										onClick={closeMobileMenu}
										className="block text-2xl font-semibold py-2 text-foreground hover:text-primary transition-colors"
									>
										Productos
									</Link>
								</motion.div>
								<motion.div variants={itemVariants}>
									<Link
										href="#testimonials"
										onClick={closeMobileMenu}
										className="block text-2xl font-semibold py-2 text-foreground hover:text-primary transition-colors"
									>
										Testimonios
									</Link>
								</motion.div>
								<motion.div variants={itemVariants}>
									<Link
										href="#contacto"
										onClick={closeMobileMenu}
										className="block text-2xl font-semibold py-2 text-foreground hover:text-primary transition-colors"
									>
										Contacto
									</Link>
								</motion.div>

								{/* SEPARADOR */}
								<motion.div variants={itemVariants} className="pt-8 pb-4">
									<div className="h-px w-full bg-border/50" />
								</motion.div>

								{/* SECCIÓN DE USUARIO EN MÓVIL */}
								<motion.div variants={itemVariants}>
									{user ? (
										<div className="space-y-4">
											<div className="text-center text-muted-foreground mb-4">
												Hola,{" "}
												<span className="font-semibold text-foreground">
													{user.email?.split("@")[0]}
												</span>
											</div>
											<Link
												href="/admin"
												onClick={closeMobileMenu}
												className="flex items-center justify-center gap-2 w-full px-4 py-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors font-medium"
											>
												<Shield className="w-5 h-5" />
												Panel Admin
											</Link>
											<button
												onClick={handleLogout}
												className="flex items-center justify-center gap-2 w-full px-4 py-4 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/10 transition-colors font-medium"
											>
												<LogOut className="w-5 h-5" />
												Cerrar Sesión
											</button>
										</div>
									) : (
										<button
											onClick={() => {
												setShowAuthModal(true);
												closeMobileMenu();
											}}
											className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-linear-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
										>
											<LogIn className="w-6 h-6" />
											Iniciar Sesión
										</button>
									)}
								</motion.div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</>
	);
}
