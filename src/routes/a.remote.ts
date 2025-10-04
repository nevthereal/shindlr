import { form } from '$app/server';
import { GW_KEY } from '$env/static/private';
import { createGateway, generateText } from 'ai';
import z from 'zod';

const gateway = createGateway({
	apiKey: GW_KEY
});

export const testForm = form(
	z.object({
		files: z.array(z.file()),
		additionalContext: z.string()
	}),
	async ({ files, additionalContext }) => {
		const { text } = await generateText({
			model: gateway('openai/gpt-5-mini'),
			messages: [
				{
					role: 'user',
					content:
						`Create a quizlet study set from my attachments` +
						`Seperate term and definition with a Tab and seperate flashcards with a new line.` +
						`Give the output in raw text format in a code block and do not miss details.` +
						`Output the flashcards in the language given` +
						additionalContext
				},
				{
					role: 'user',
					content: await Promise.all(
						files.map(async (file) => ({
							type: 'file' as const,
							data: await file.arrayBuffer(),
							mediaType: file.type,
							filename: file.name
						}))
					)
				}
			]
		});

		return { success: true, result: text };
	}
);
