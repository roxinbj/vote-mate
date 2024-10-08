<script>
	import { issueRankings, userInfo } from '../../store'; // Import the store for rankings and user info
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs'; // Import Sortable.js
	import questions from '$lib/data/questions.json'; // Import the questions

	let issues = [];
	let rankedIssues = [];

	// Fisher-Yates Shuffle Algorithm to randomize the array
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]]; // Swap elements
		}
		return array;
	}

	// Check if rankedIssues is in the original order (same as issues)
	function isOriginalOrder(arr1, arr2) {
		return arr1.every((val, index) => val === arr2[index]);
	}

	onMount(() => {
		// Extract unique issues from questions
		issues = [...new Set(questions.map((q) => q.issue))];

		// Check if issueRankings store already has data or if rankedIssues is in its original order
		if ($issueRankings.length === 0) {
			rankedIssues = [...issues]; // Initialize rankedIssues as the original order of issues

			// Shuffle only if the order hasn't been changed by the user
			if (isOriginalOrder(rankedIssues, issues)) {
				rankedIssues = shuffleArray([...rankedIssues]); // Shuffle if in original order
			}
		} else {
			rankedIssues = [...$issueRankings]; // Use the stored ranking if it exists
		}

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

	// Check if userInfo is filled
	function isUserInfoFilled() {
		console.log('UserInfo ', $userInfo);
		return (
			$userInfo.gender !== '' ||
			$userInfo.region !== '' ||
			$userInfo.age !== '' ||
			$userInfo.urbanization !== ''
		);
	}

	// Submit the rankings and navigate to the appropriate page
	function submitRankings() {
		issueRankings.set(rankedIssues); // Store the final ranking
		console.log('ranking:', rankedIssues);

		// Navigate to userInfo or results depending on if userInfo is filled
		if (isUserInfoFilled()) {
			goto('/results');
		} else {
			goto('/userInfo');
		}
	}

	// Skip the rankings and navigate to the appropriate page
	function skipRankings() {
		issueRankings.set([]); // Clear the ranking
		console.log('ranking skipped');

		// Navigate to userInfo or results depending on if userInfo is filled
		if (isUserInfoFilled()) {
			goto('/results');
		} else {
			goto('/userInfo');
		}
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
		margin-bottom: 10px; /* Add margin for vertical spacing */
	}

	.submit-button:hover {
		background-color: #ff9933;
	}

	/* Media query for small screens */
	@media (max-width: 768px) {
		.submit-button {
			display: block;
			width: 100%;
			margin-bottom: 15px; /* Increased margin for stacked buttons */
		}
	}
</style>
