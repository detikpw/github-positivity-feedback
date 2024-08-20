<script lang="ts">
  import Markdown from "./Markdown.svelte";
  export let feedback: string = '';
  export let username: string = '';
</script>

{#if feedback}
  <div class="bg-green-100 p-4 rounded">
    <h2 class="text-xl font-bold mb-2">Feedback for {username}</h2>
    <Markdown content={feedback} />
  </div>
{/if}
