"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import {
	User,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string) => Promise<void>;
	signInWithGoogle: () => Promise<void>;
	logout: () => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	signIn: async () => {},
	signUp: async () => {},
	signInWithGoogle: async () => {},
	logout: async () => {},
	resetPassword: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const signIn = async (email: string, password: string) => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (error: any) {
			throw new Error(error.message || "Error al iniciar sesión");
		}
	};

	const signUp = async (email: string, password: string) => {
		try {
			await createUserWithEmailAndPassword(auth, email, password);
		} catch (error: any) {
			throw new Error(error.message || "Error al crear la cuenta");
		}
	};

	const signInWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
		} catch (error: any) {
			throw new Error(error.message || "Error al iniciar sesión con Google");
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
		} catch (error: any) {
			throw new Error(error.message || "Error al cerrar sesión");
		}
	};

	const resetPassword = async (email: string) => {
		try {
			await sendPasswordResetEmail(auth, email);
		} catch (error: any) {
			throw new Error(
				error.message || "Error al enviar el email de recuperación"
			);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				signIn,
				signUp,
				signInWithGoogle,
				logout,
				resetPassword,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
