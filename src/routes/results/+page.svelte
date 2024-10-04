<script>
	import { issueRankings, userAnswers } from '../../store'; // Import the rankings and answers stores
	import { onMount } from 'svelte';

	let rankings = [];
	let answers = [];

	// On mount, load the user's rankings and answers
	onMount(() => {
		$issueRankings.subscribe((value) => {
			rankings = value;
		});

		$userAnswers.subscribe((value) => {
			answers = value;
		});
	});
</script>

<main>
	<h1>Your Results</h1>

	<h2>Your Ranked Issues:</h2>
	<ul>
		{#each rankings as issue}
			<li>{issue}</li>
		{/each}
	</ul>

	<h2>Your Selected Answers:</h2>
	<ul>
		{#each answers as answer, index}
			<li>Question {index + 1}: {answer != null ? `Option ${answer + 1}` : 'Skipped'}</li>
		{/each}
	</ul>

	<p>Thank you for completing the questionnaire!</p>
</main>
