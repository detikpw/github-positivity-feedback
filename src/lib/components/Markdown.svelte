<script lang="ts">
	import { marked } from 'marked';
	import type { Renderer, Tokens } from 'marked';

	export let content: string = '';

	let htmlContent: string = '';

	const renderer: Partial<Renderer> = {
		heading({ tokens, depth }: Tokens.Heading): string {
			const sizes: Record<number, string> = {
				1: 'text-4xl',
				2: 'text-3xl',
				3: 'text-2xl',
				4: 'text-xl',
				5: 'text-lg',
				6: 'text-base'
			};
			const text = this.parser?.parseInline(tokens);
			return `<h${depth} class="font-bold ${sizes[depth] || 'text-base'} mt-4 mb-2">${text}</h${depth}>`;
		},

		paragraph(this: Renderer, { tokens }: Tokens.Paragraph): string {
			return `<p class="mb-4">${this.parser.parseInline(tokens)}</p>`;
		},

		link(this: Renderer, { href, title, text }: Tokens.Link): string {
			const titleAttr = title ? ` title="${title}"` : '';
			return `<a href="${href}"${titleAttr} target="_blank" class="text-blue-600 hover:underline">${text}</a>`;
		},

		strong(this: Renderer, { tokens }: Tokens.Strong): string {
			return `<strong class="font-bold">${this.parser.parseInline(tokens)}</strong>`;
		},

		em(this: Renderer, { tokens }: Tokens.Em): string {
			return `<em class="italic">${this.parser.parseInline(tokens)}</em>`;
		}
	};

	marked.use({ renderer, gfm: true, breaks: true });

	$: {
		try {
			const res = marked(content);
			if (res instanceof Promise) {
				res.then((html) => {
					htmlContent = html;
				});
			} else {
				htmlContent = res;
			}
		} catch (error) {
			console.error('Error parsing markdown:', error);
		}
	}
</script>

<div class="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
	{@html htmlContent}
</div>
