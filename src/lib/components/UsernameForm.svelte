<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let username: string = '';
	const dispatch = createEventDispatcher<{submit: string}>();

	function handleSubmit(): void {
		dispatch('submit', username);
		username = '';
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="mb-4">
	<input
		type="text"
		bind:value={username}
		placeholder="Enter GitHub username"
		class="p-2 border rounded mr-2"
	/>
	<button type="submit" class="bg-blue-500 text-white p-2 rounded"> Generate Feedback </button>
</form>
