"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Chrome, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
	const [mode, setMode] = useState<"login" | "register" | "reset">("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			if (mode === "login") {
				await signIn(email, password);
				onClose();
			} else if (mode === "register") {
				await signUp(email, password);
				onClose();
			} else if (mode === "reset") {
				await resetPassword(email);
				setSuccess(
					"Email de recuperación enviado. Revisa tu bandeja de entrada."
				);
				setEmail("");
			}
		} catch (err: any) {
			setError(err.message || "Ocurrió un error");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setError("");
		setLoading(true);

		try {
			await signInWithGoogle();
			onClose();
		} catch (err: any) {
			setError(err.message || "Error al iniciar sesión con Google");
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setEmail("");
		setPassword("");
		setError("");
		setSuccess("");
	};

	const switchMode = (newMode: "login" | "register" | "reset") => {
		setMode(newMode);
		resetForm();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
						>
							{/* Header */}
							<div className="flex items-center justify-between p-6 border-b border-border">
								<h2 className="text-2xl font-bold">
									{mode === "login" && "Iniciar Sesión"}
									{mode === "register" && "Crear Cuenta"}
									{mode === "reset" && "Recuperar Contraseña"}
								</h2>
								<button
									onClick={onClose}
									className="p-2 rounded-lg hover:bg-muted transition-colors"
								>
									<X className="w-5 h-5" />
								</button>
							</div>

							{/* Body */}
							<div className="p-6 space-y-4">
								{error && (
									<div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
										<AlertCircle className="w-5 h-5 flex-shrink-0" />
										<p className="text-sm">{error}</p>
									</div>
								)}

								{success && (
									<div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
										<AlertCircle className="w-5 h-5 flex-shrink-0" />
										<p className="text-sm">{success}</p>
									</div>
								)}

								<form onSubmit={handleSubmit} className="space-y-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											Correo electrónico
										</label>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
											<input
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												placeholder="tu@email.com"
												required
												className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
											/>
										</div>
									</div>

									{mode !== "reset" && (
										<div>
											<label className="block text-sm font-medium mb-2">
												Contraseña
											</label>
											<div className="relative">
												<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
												<input
													type="password"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
													placeholder="••••••••"
													required
													minLength={6}
													className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
												/>
											</div>
										</div>
									)}

									<button
										type="submit"
										disabled={loading}
										className="w-full py-3 rounded-xl bg-linear-to-r from-primary to-secondary text-white font-semibold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{loading ? (
											<span className="flex items-center justify-center gap-2">
												<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
												Procesando...
											</span>
										) : (
											<>
												{mode === "login" && "Iniciar Sesión"}
												{mode === "register" && "Crear Cuenta"}
												{mode === "reset" && "Enviar Email"}
											</>
										)}
									</button>
								</form>

								{mode !== "reset" && (
									<>
										<div className="relative">
											<div className="absolute inset-0 flex items-center">
												<div className="w-full border-t border-border"></div>
											</div>
											<div className="relative flex justify-center text-sm">
												<span className="px-4 bg-card text-muted-foreground">
													O continuar con
												</span>
											</div>
										</div>

										<button
											onClick={handleGoogleSignIn}
											disabled={loading}
											className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<Chrome className="w-5 h-5" />
											<span className="font-medium">Google</span>
										</button>
									</>
								)}

								{/* Footer Links */}
								<div className="text-center text-sm space-y-2">
									{mode === "login" && (
										<>
											<button
												onClick={() => switchMode("reset")}
												className="text-primary hover:underline"
											>
												¿Olvidaste tu contraseña?
											</button>
											<div>
												<span className="text-muted-foreground">
													¿No tienes cuenta?{" "}
												</span>
												<button
													onClick={() => switchMode("register")}
													className="text-primary hover:underline font-medium"
												>
													Regístrate
												</button>
											</div>
										</>
									)}

									{mode === "register" && (
										<div>
											<span className="text-muted-foreground">
												¿Ya tienes cuenta?{" "}
											</span>
											<button
												onClick={() => switchMode("login")}
												className="text-primary hover:underline font-medium"
											>
												Inicia sesión
											</button>
										</div>
									)}

									{mode === "reset" && (
										<button
											onClick={() => switchMode("login")}
											className="text-primary hover:underline"
										>
											Volver al inicio de sesión
										</button>
									)}
								</div>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}
