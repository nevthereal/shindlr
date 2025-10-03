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
		const fileArrayBuffers = await Promise.all(
			files.map(async (f) => ({
				buffer: await f.arrayBuffer(),
				mimeType: f.type,
				filename: f.name
			}))
		);

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
					content: fileArrayBuffers.map((file) => ({
						type: 'file',
						data: file.buffer,
						mediaType: file.mimeType,
						filename: file.filename
					}))
				}
			]
		});

		return { success: true, result: text };
	}
);
