"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
	LayoutDashboard,
	Image as ImageIcon,
	Star,
	MessageSquare,
	Megaphone,
	Settings,
	Home,
	Menu,
	X,
	Moon,
	Sun,
	Package,
	BarChart3,
	Send,
	Mail,
	Inbox,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface AdminLayoutProps {
	children: React.ReactNode;
	currentSection: string;
	onSectionChange: (section: string) => void;
}

const menuItems = [
	{ id: "logo", label: "Logo", icon: LayoutDashboard },
	{ id: "banner", label: "Banner", icon: ImageIcon },
	{ id: "stats", label: "Estadísticas", icon: BarChart3 },
	{ id: "features", label: "Características", icon: Star },
	{ id: "products", label: "Productos", icon: Package },
	{ id: "testimonials", label: "Testimonios", icon: MessageSquare },
	{ id: "cta", label: "CTA", icon: Megaphone },
	{ id: "footer", label: "Footer", icon: Settings },
	{ id: "mensajes", label: "Mensajes Masivos", icon: Send },
	{ id: "contactForm", label: "Formulario Contacto", icon: Mail },
	{ id: "submissions", label: "Mensajes Recibidos", icon: Inbox },
];

export default function AdminLayout({
	children,
	currentSection,
	onSectionChange,
}: AdminLayoutProps) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="min-h-screen bg-muted/30 dark:bg-background flex">
			{/* Sidebar */}
			<AnimatePresence>
				{isSidebarOpen && (
					<motion.aside
						initial={{ x: -300 }}
						animate={{ x: 0 }}
						exit={{ x: -300 }}
						transition={{ type: "spring", damping: 25 }}
						className="fixed left-0 top-0 h-screen w-72 bg-card dark:bg-card border-r border-border/50 dark:border-border shadow-xl z-50 flex flex-col"
					>
						{/* Logo / Header */}
						<div className="p-6 border-b border-border/50">
							<Link href="/">
								<h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary cursor-pointer hover:scale-105 transition-transform">
									Panel Admin
								</h1>
							</Link>
							<p className="text-sm text-foreground/60 mt-1">
								Gestiona tu landing
							</p>
						</div>

						{/* Menú de navegación */}
						<nav className="flex-1 p-4 overflow-y-auto">
							<div className="space-y-2">
								{menuItems.map((item) => {
									const Icon = item.icon;
									const isActive = currentSection === item.id;

									return (
										<button
											key={item.id}
											onClick={() => onSectionChange(item.id)}
											className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
												isActive
													? "bg-linear-to-r from-primary to-secondary text-white shadow-lg scale-105"
													: "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
											}`}
										>
											<Icon className="w-5 h-5" />
											<span>{item.label}</span>
										</button>
									);
								})}
							</div>
						</nav>

						{/* Acciones inferiores */}
						<div className="p-4 border-t border-border/50 space-y-3">
							<button
								onClick={toggleTheme}
								className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-foreground/70 hover:bg-muted/50 hover:text-foreground transition-all"
							>
								{theme === "dark" ? (
									<Sun className="w-5 h-5" />
								) : (
									<Moon className="w-5 h-5" />
								)}
								<span>{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
							</button>

							<Link
								href="/"
								className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-foreground/70 hover:bg-muted/50 hover:text-foreground transition-all"
							>
								<Home className="w-5 h-5" />
								<span>Ver Landing</span>
							</Link>
						</div>
					</motion.aside>
				)}
			</AnimatePresence>

			{/* Contenido principal */}
			<div
				className={`flex-1 transition-all duration-300 ${
					isSidebarOpen ? "ml-72" : "ml-0"
				}`}
			>
				{/* Header superior */}
				<header className="sticky top-0 z-40 bg-card/80 dark:bg-card/80 backdrop-blur-lg border-b border-border/50">
					<div className="flex items-center justify-between px-6 py-4">
						<button
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
						>
							{isSidebarOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>

						<div className="flex items-center gap-4">
							<div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
								<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
								<span className="text-sm font-medium">En línea</span>
							</div>
						</div>
					</div>
				</header>

				{/* Contenido */}
				<main className="p-6">{children}</main>
			</div>
		</div>
	);
}
