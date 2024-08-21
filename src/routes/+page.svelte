<script lang="ts">
  import '../styles/app.css';
  import UsernameForm from '$lib/components/UsernameForm.svelte';
  import FeedbackDisplay from '$lib/components/Feedback.svelte';

  let feedback: string = '';
  let username: string = '';
  let loading: boolean = false;
  let error: string = '';

  async function handleSubmit(event: CustomEvent<string>): Promise<void> {
    username = event.detail;
    loading = true;
    try {
      const response = await fetch(`/api/v1/github-feedback/${username}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.error) {
        error = data.error;
        feedback = '';
      } else {
        feedback = data.feedback;
        error = '';
      }
    } catch (err) {
      console.error('Error:', err);
      error = 'An error occurred while fetching feedback';
      feedback = '';
    }
    loading = false;
  }
</script>

<main class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">GitHub Positivity Booster</h1>
  <UsernameForm on:submit={handleSubmit} />
  {#if loading}
    <p>Generating feedback...</p>
  {:else if error}
    <p class="text-red-500">{error}</p>
  {:else if feedback}
    <FeedbackDisplay {feedback} {username} />
  {/if}
</main>
