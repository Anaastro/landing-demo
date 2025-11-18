import { FooterContent } from "@/lib/types";

interface FooterProps {
	content: FooterContent;
}

export default function Footer({ content }: FooterProps) {
	return (
		<footer className="bg-gray-900 text-white py-12">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
					<div>
						<h3 className="text-2xl font-bold mb-4">{content.companyName}</h3>
						<p className="text-gray-400 mb-4">{content.description}</p>
					</div>

					<div>
						<h4 className="text-xl font-semibold mb-4">Contacto</h4>
						<p className="text-gray-400 mb-2">📧 {content.email}</p>
						<p className="text-gray-400 mb-2">📱 {content.phone}</p>
						<p className="text-gray-400">📍 {content.address}</p>
					</div>

					<div>
						<h4 className="text-xl font-semibold mb-4">Redes Sociales</h4>
						<div className="flex space-x-4">
							{content.socialLinks.facebook && (
								<a
									href={content.socialLinks.facebook}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-white transition-colors text-2xl"
								>
									📘
								</a>
							)}
							{content.socialLinks.twitter && (
								<a
									href={content.socialLinks.twitter}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-white transition-colors text-2xl"
								>
									🐦
								</a>
							)}
							{content.socialLinks.instagram && (
								<a
									href={content.socialLinks.instagram}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-white transition-colors text-2xl"
								>
									📷
								</a>
							)}
							{content.socialLinks.linkedin && (
								<a
									href={content.socialLinks.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-white transition-colors text-2xl"
								>
									💼
								</a>
							)}
						</div>
					</div>
				</div>

				<div className="border-t border-gray-800 pt-8 text-center text-gray-400">
					<p>
						&copy; {new Date().getFullYear()} {content.companyName}. Todos los
						derechos reservados.
					</p>
				</div>
			</div>
		</footer>
	);
}
