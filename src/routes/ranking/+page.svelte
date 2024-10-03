<script>
	import { questions, issueRankings } from '../../store.js';
	import { goto } from '$app/navigation';

	let issues = [...new Set($questions.map((q) => q.issue))];
	let rankings = [];

	function submitRankings() {
		issues.forEach((issue, index) => {
			issueRankings[issue] = rankings[index];
		});
		goto('/results');
	}
</script>

<h1>Rank the Issues</h1>
<p>Drag and drop the issues to rank their importance to you:</p>

<ul>
	{#each issues as issue, index}
		<li>
			<input type="number" bind:value={rankings[index]} min="1" max={issues.length} />
			<label>{issue}</label>
		</li>
	{/each}
</ul>

<button on:click={submitRankings}>Submit Rankings</button>
