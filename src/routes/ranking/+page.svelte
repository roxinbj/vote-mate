<script>
	import { issueRankings } from '../../store'; // Import the store for rankings
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs'; // Import Sortable.js
	import questions from '$lib/data/questions.json'; // Import the questions

	let issues = [];
	let rankedIssues = [];

	onMount(() => {
		issues = [...new Set(questions.map((q) => q.issue))]; // Extract unique issues from questions
		rankedIssues = [...issues]; // Start with the original order of issues

		// Initialize Sortable.js on the list of issues
		const ulElement = document.querySelector('.sortable-list');
		new Sortable(ulElement, {
			animation: 150, // Smooth dragging animation
			ghostClass: 'ghost', // Class added to the item being dragged (for styling)
			onEnd: (evt) => {
				// Rearrange the rankedIssues array based on the new order
				const [movedItem] = rankedIssues.splice(evt.oldIndex, 1);
				rankedIssues.splice(evt.newIndex, 0, movedItem);
			}
		});
	});

	// Submit the rankings and navigate to the results page
	function submitRankings() {
		issueRankings.set(rankedIssues); // Store the final ranking
		console.log('ranking:', rankedIssues);
		goto('/results'); // Navigate to the results page
	}

	function skipRankings() {
		//equalRank = [...Array(questions.length)].map((x) => 1);
		issueRankings.set([]);
		console.log('ranking:', []);
		goto('/results'); // Navigate to the results page
	}
	function backToQuestions() {
		goto('/questions');
	}
</script>

<main>
	<h1>Rank the Issues</h1>
	<p>Drag and drop the issues to rank them by importance to you.</p>

	<div class="rank-container">
		<ul class="sortable-list">
			{#each rankedIssues as issue}
				<li>{issue}</li>
			{/each}
		</ul>
	</div>

	<button class="submit-button" on:click={backToQuestions}>Back</button>
	<button class="submit-button" on:click={skipRankings}>Skip Rankings</button>
	<button class="submit-button" on:click={submitRankings}>Submit Rankings</button>
</main>

<style>
	main {
		padding: 20px;
		background: linear-gradient(135deg, #ffcc33, #ff9933);
		text-align: center;
		font-family: Arial, sans-serif;
	}

	.rank-container {
		background-color: white;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		max-width: 600px;
		margin: 20px auto;
	}

	h1 {
		color: white;
		font-size: 2.5rem;
		margin-bottom: 10px;
	}

	p {
		font-size: 1.2rem;
		color: #333;
		margin-bottom: 20px;
	}

	ul {
		list-style-type: none;
		padding: 0;
		margin: 20px 0;
	}

	li {
		background-color: #fff;
		border: 1px solid #ccc;
		padding: 15px;
		margin-bottom: 10px;
		font-size: 1.1rem;
		color: #333;
		cursor: move;
		border-radius: 5px;
		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	li:hover {
		background-color: #ffcc33;
		color: #fff;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	li:active {
		background-color: #ff9933;
		color: #fff;
	}

	/* Add ghost class for the dragging element */
	.ghost {
		opacity: 0.5;
	}

	.submit-button {
		background-color: #ffcc33;
		border: none;
		padding: 15px 30px;
		font-size: 1.2rem;
		font-weight: bold;
		color: #fff;
		cursor: pointer;
		border-radius: 5px;
		transition: background-color 0.3s ease;
	}

	.submit-button:hover {
		background-color: #ff9933;
	}
</style>
