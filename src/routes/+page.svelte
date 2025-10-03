<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { testForm } from './a.remote';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<form enctype="multipart/form-data" {...testForm}>
	<Input type="file" name="files[]" />
	<Input type="text" name={testForm.field('additionalContext')} />
	<Button type="submit">Submit</Button>
</form>

{#if testForm.result?.result}
	{testForm.result.result}
{/if}

{#if testForm.issues}
	{JSON.stringify(testForm.issues)}
{/if}
