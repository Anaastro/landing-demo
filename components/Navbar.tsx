"use client";

import { motion, AnimatePresence } from "framer-motion";
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

	useEffect(() => {
		if (showMobileMenu) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
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

	return (
		<>
			<motion.nav
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 sm:h-20">
						<Link href="/" className="flex items-center gap-2 sm:gap-3 group">
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

						<button
							onClick={() => setShowMobileMenu(!showMobileMenu)}
							className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
							aria-label="Toggle menu"
						>
							{showMobileMenu ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>

				<AnimatePresence>
					{showMobileMenu && (
						<>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onClick={closeMobileMenu}
								className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
							/>

							<motion.div
								initial={{ x: "100%" }}
								animate={{ x: 0 }}
								exit={{ x: "100%" }}
								transition={{ type: "spring", damping: 25, stiffness: 200 }}
								className="fixed top-16 sm:top-20 right-0 bottom-0 w-full max-w-sm bg-background border-l border-border z-50 overflow-y-auto md:hidden shadow-2xl"
							>
								<div className="px-6 py-8 space-y-2">
									<Link
										href="#features"
										onClick={closeMobileMenu}
										className="block px-4 py-4 rounded-xl text-base font-medium text-foreground hover:bg-muted transition-colors active:scale-95"
									>
										Características
									</Link>
									<Link
										href="#products"
										onClick={closeMobileMenu}
										className="block px-4 py-4 rounded-xl text-base font-medium text-foreground hover:bg-muted transition-colors active:scale-95"
									>
										Productos
									</Link>
									<Link
										href="#testimonials"
										onClick={closeMobileMenu}
										className="block px-4 py-4 rounded-xl text-base font-medium text-foreground hover:bg-muted transition-colors active:scale-95"
									>
										Testimonios
									</Link>
									<Link
										href="#contacto"
										onClick={closeMobileMenu}
										className="block px-4 py-4 rounded-xl text-base font-medium text-foreground hover:bg-muted transition-colors active:scale-95"
									>
										Contacto
									</Link>

									{user ? (
										<>
											<div className="border-t border-border/50 my-2 pt-2">
												<div className="px-4 py-2 text-sm text-muted-foreground">
													Conectado como{" "}
													<span className="font-semibold text-foreground">
														{user.email?.split("@")[0]}
													</span>
												</div>
											</div>
											<Link
												href="/admin"
												onClick={closeMobileMenu}
												className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-muted transition-colors"
											>
												<Shield className="w-5 h-5" />
												Panel Admin
											</Link>
											<button
												onClick={handleLogout}
												className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-muted transition-colors text-left text-red-600 dark:text-red-400"
											>
												<LogOut className="w-5 h-5" />
												Cerrar Sesión
											</button>
										</>
									) : (
										<button
											onClick={() => {
												setShowAuthModal(true);
												closeMobileMenu();
											}}
											className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-linear-to-r from-primary to-secondary text-white font-semibold hover:scale-105 transition-transform"
										>
											<LogIn className="w-5 h-5" />
											Iniciar Sesión
										</button>
									)}
								</div>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</motion.nav>

			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</>
	);
}
