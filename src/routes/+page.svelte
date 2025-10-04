<script lang="ts">
	import { marked, Renderer } from 'marked';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { testForm } from './a.remote';

	$effect(() => {
		const renderer = {
			code({ raw, text }) {
				console.log(raw, text);
				const copy = navigator.clipboard.writeText(text);
				return `
			<button onclick={${() => copy}}>copy!</button>
            <code>
              ${text}
            </code>`;
			}
		} satisfies Partial<Renderer>;

		marked.use({ renderer });
	});
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<form enctype="multipart/form-data" {...testForm}>
	<Input type="file" name="files[]" />
	<Input type="text" name={testForm.field('additionalContext')} />
	<Button type="submit">Submit</Button>
</form>

<div class="prose">
	{#if testForm.result?.result}
		{@html marked.parse(testForm.result.result)}
	{/if}
</div>
