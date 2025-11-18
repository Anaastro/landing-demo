"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	List,
	ListOrdered,
	Quote,
	Undo,
	Redo,
	Link2,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Heading1,
	Heading2,
	Type,
} from "lucide-react";
import { useCallback, useEffect } from "react";

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	minHeight?: string;
}

export default function RichTextEditor({
	content,
	onChange,
	placeholder = "Escribe aquí...",
	minHeight = "200px",
}: RichTextEditorProps) {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Placeholder.configure({
				placeholder,
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-primary underline cursor-pointer",
				},
			}),
			Underline,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			TextStyle,
			Color,
		],
		content,
		editorProps: {
			attributes: {
				class: "prose prose-sm max-w-none focus:outline-none px-4 py-3",
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	const setLink = useCallback(() => {
		if (!editor) return;

		const previousUrl = editor.getAttributes("link").href;
		const url = window.prompt("URL del enlace:", previousUrl);

		if (url === null) return;

		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}

		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
	}, [editor]);

	if (!editor) {
		return null;
	}

	return (
		<div className="border border-border rounded-xl overflow-hidden bg-background">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
				{/* Text Formatting */}
				<div className="flex items-center gap-1 pr-2 border-r border-border">
					<button
						onClick={() => editor.chain().focus().toggleBold().run()}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive("bold") ? "bg-muted text-primary" : ""
						}`}
						title="Negrita"
						type="button"
					>
						<Bold className="w-4 h-4" />
					</button>
					<button
						onClick={() => editor.chain().focus().toggleItalic().run()}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive("italic") ? "bg-muted text-primary" : ""
						}`}
						title="Cursiva"
						type="button"
					>
						<Italic className="w-4 h-4" />
					</button>
					<button
						onClick={() => editor.chain().focus().toggleUnderline().run()}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive("underline") ? "bg-muted text-primary" : ""
						}`}
						title="Subrayado"
						type="button"
					>
						<UnderlineIcon className="w-4 h-4" />
					</button>
				</div>

				{/* Headings */}
				<div className="flex items-center gap-1 pr-2 border-r border-border">
					<button
						onClick={() => editor.chain().focus().setParagraph().run()}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive("paragraph") ? "bg-muted text-primary" : ""
						}`}
						title="Párrafo"
						type="button"
					>
						<Type className="w-4 h-4" />
					</button>
					<button
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive("heading", { level: 1 })
								? "bg-muted text-primary"
								: ""
						}`}
						title="Título 1"
						type="button"
					>
						<Heading1 className="w-4 h-4" />
					</button>
					<button
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive("heading", { level: 2 })
								? "bg-muted text-primary"
								: ""
						}`}
						title="Título 2"
						type="button"
					>
						<Heading2 className="w-4 h-4" />
					</button>
				</div>

				{/* Lists */}
				<div className="flex items-center gap-1 pr-2 border-r border-border">
					<button
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive("bulletList") ? "bg-muted text-primary" : ""
						}`}
						title="Lista con viñetas"
						type="button"
					>
						<List className="w-4 h-4" />
					</button>
					<button
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive("orderedList") ? "bg-muted text-primary" : ""
						}`}
						title="Lista numerada"
						type="button"
					>
						<ListOrdered className="w-4 h-4" />
					</button>
					<button
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive("blockquote") ? "bg-muted text-primary" : ""
						}`}
						title="Cita"
						type="button"
					>
						<Quote className="w-4 h-4" />
					</button>
				</div>

				{/* Text Align */}
				<div className="flex items-center gap-1 pr-2 border-r border-border">
					<button
						onClick={() => editor.chain().focus().setTextAlign("left").run()}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive({ textAlign: "left" })
								? "bg-muted text-primary"
								: ""
						}`}
						title="Alinear izquierda"
						type="button"
					>
						<AlignLeft className="w-4 h-4" />
					</button>
					<button
						onClick={() => editor.chain().focus().setTextAlign("center").run()}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive({ textAlign: "center" })
								? "bg-muted text-primary"
								: ""
						}`}
						title="Centrar"
						type="button"
					>
						<AlignCenter className="w-4 h-4" />
					</button>
					<button
						onClick={() => editor.chain().focus().setTextAlign("right").run()}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive({ textAlign: "right" })
								? "bg-muted text-primary"
								: ""
						}`}
						title="Alinear derecha"
						type="button"
					>
						<AlignRight className="w-4 h-4" />
					</button>
				</div>

				{/* Link */}
				<div className="flex items-center gap-1 pr-2 border-r border-border">
					<button
						onClick={setLink}
						className={`p-2 rounded-lg hover:bg-muted transition-colors ${
							editor.isActive("link") ? "bg-muted text-primary" : ""
						}`}
						title="Insertar enlace"
						type="button"
					>
						<Link2 className="w-4 h-4" />
					</button>
				</div>

				{/* Undo/Redo */}
				<div className="flex items-center gap-1">
					<button
						onClick={() => editor.chain().focus().undo().run()}
						disabled={!editor.can().undo()}
						className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						title="Deshacer"
						type="button"
					>
						<Undo className="w-4 h-4" />
					</button>
					<button
						onClick={() => editor.chain().focus().redo().run()}
						disabled={!editor.can().redo()}
						className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						title="Rehacer"
						type="button"
					>
						<Redo className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Editor Content */}
			<div
				style={{ minHeight }}
				className="overflow-y-auto max-h-96 bg-background"
			>
				<EditorContent editor={editor} />
			</div>
		</div>
	);
}
