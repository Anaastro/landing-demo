export interface LogoConfig {
	imageUrl?: string;
	text: string;
	showImage: boolean;
}

export interface BannerContent {
	title: string;
	subtitle: string;
	imageUrl: string;
	ctaText: string;
	ctaLink: string;
}

export interface Feature {
	id: string;
	title: string;
	description: string;
	icon: string;
	imageUrl?: string;
}

export interface Testimonial {
	id: string;
	name: string;
	role: string;
	content: string;
	avatarUrl?: string;
	rating: number;
}

export interface CTASection {
	title: string;
	description: string;
	buttonText: string;
	buttonLink: string;
	backgroundImageUrl?: string;
}

export interface FooterContent {
	companyName: string;
	description: string;
	email: string;
	phone: string;
	address: string;
	socialLinks: {
		facebook?: string;
		twitter?: string;
		instagram?: string;
		linkedin?: string;
	};
}

export interface Product {
	id: string;
	name: string;
	description: string;
	price: string;
	imageUrl?: string;
	features: string[];
	highlighted?: boolean;
	whatsapp?: {
		enabled: boolean;
		phoneNumber: string;
		message: string;
	};
}

export interface StatsSection {
	enabled: boolean;
	stats: Array<{
		id: string;
		value: string;
		label: string;
		icon: string;
	}>;
}

export interface ProductsSection {
	enabled: boolean;
	title: string;
	subtitle: string;
	products: Product[];
}

export interface ContactFormField {
	id: string;
	name: string;
	label: string;
	type: "text" | "email" | "tel" | "textarea" | "select";
	placeholder?: string;
	required: boolean;
	options?: string[];
	order: number;
}

export interface ContactFormConfig {
	enabled: boolean;
	title: string;
	subtitle: string;
	buttonText: string;
	successMessage: string;
	fields: ContactFormField[];
}

export interface ContactSubmission {
	id?: string;
	formData: Record<string, string>;
	submittedAt: Date;
	read: boolean;
}

export interface LandingContent {
	id: string;
	logo: LogoConfig;
	banner: BannerContent;
	stats: StatsSection;
	features: Feature[];
	products: ProductsSection;
	testimonials: Testimonial[];
	cta: CTASection;
	footer: FooterContent;
	contactForm?: ContactFormConfig;
	updatedAt: Date;
}
