import { CTASection } from "@/lib/types";
import Image from "next/image";

interface CTAProps {
	content: CTASection;
}

export default function CTA({ content }: CTAProps) {
	return (
		<section className="relative py-20 overflow-hidden">
			{content.backgroundImageUrl && (
				<>
					<div className="absolute inset-0 z-0">
						<Image
							src={content.backgroundImageUrl}
							alt="CTA Background"
							fill
							className="object-cover"
						/>
					</div>
					<div className="absolute inset-0 bg-blue-900/80 z-0" />
				</>
			)}

			<div
				className={`relative z-10 container mx-auto px-4 text-center ${
					!content.backgroundImageUrl
						? "bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl py-20"
						: ""
				}`}
			>
				<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
					{content.title}
				</h2>
				<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
					{content.description}
				</p>
				<a
					href={content.buttonLink}
					className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg transition-all transform hover:scale-105 shadow-xl"
				>
					{content.buttonText}
				</a>
			</div>
		</section>
	);
}
