"use client";

interface RichTextViewerProps {
	content: string;
	className?: string;
}

export default function RichTextViewer({
	content,
	className = "",
}: RichTextViewerProps) {
	// Si el contenido no tiene tags HTML, convertir saltos de línea a <br>
	const processedContent = content.includes("<")
		? content
		: content
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line)
				.join("<br />");

	return (
		<div
			className={`prose prose-lg max-w-none prose-headings:text-foreground prose-h1:text-4xl prose-h1:mb-4 prose-h2:text-3xl prose-h2:mb-3 prose-h3:text-2xl prose-h3:mb-2 prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-primary prose-a:underline prose-a:hover:text-primary-dark prose-strong:text-foreground prose-strong:font-bold prose-em:text-foreground/90 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-foreground/90 prose-li:my-2 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground/80 prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded dark:prose-invert dark:prose-headings:text-foreground dark:prose-p:text-foreground/90 dark:prose-a:text-primary dark:prose-strong:text-foreground dark:prose-code:bg-muted/50 ${className}`}
			dangerouslySetInnerHTML={{ __html: processedContent }}
		/>
	);
}
