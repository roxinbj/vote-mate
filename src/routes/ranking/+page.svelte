<script>
	import { issueRankings } from '../../store'; // Import the store for rankings
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import questions from '$lib/data/questions.json'; // Import the questions

	let issues = [];
	let rankedIssues = [];
	let draggedIndex = null; // Track the index of the dragged item

	// On mount, initialize the issues array with unique issues from the questions
	onMount(() => {
		issues = [...new Set(questions.map((q) => q.issue))]; // Extract unique issues from questions
		rankedIssues = [...issues]; // Start with the original order of issues
	});

	// Handle when dragging starts
	function handleDragStart(event, index) {
		draggedIndex = index; // Set the dragged item index
		event.target.style.opacity = 0.5; // Set some styling for visual feedback
	}

	// Handle when dragging over another item
	function handleDragOver(event) {
		event.preventDefault(); // Allow dropping
		event.target.style.backgroundColor = '#f0f0f0'; // Highlight potential drop target
	}

	// Handle drag leave to reset the background when not hovering over an item
	function handleDragLeave(event) {
		event.target.style.backgroundColor = ''; // Reset background color
	}

	// Handle when an item is dropped
	function handleDrop(event, index) {
		event.preventDefault();

		// Reorder the rankedIssues array
		const draggedIssue = rankedIssues[draggedIndex];

		// Ensure the dragged item is inserted into the correct position
		rankedIssues.splice(draggedIndex, 1); // Remove the dragged issue from its old position
		rankedIssues.splice(index, 0, draggedIssue); // Insert it at the new index

		// Trigger reactivity by reassigning the array to itself
		rankedIssues = [...rankedIssues]; // This triggers the reactivity in Svelte

		// Reset styling and index
		event.target.style.opacity = 1;
		event.target.style.backgroundColor = ''; // Reset background color
		draggedIndex = null;
	}

	// Handle drag end to reset styling
	function handleDragEnd(event) {
		event.target.style.opacity = 1; // Reset styling
	}

	// Submit the rankings and navigate to the results page
	function submitRankings() {
		issueRankings.set(rankedIssues); // Store the final ranking
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
		<ul>
			{#each rankedIssues as issue, index}
				<li
					draggable="true"
					on:dragstart={(event) => handleDragStart(event, index)}
					on:dragover={handleDragOver}
					on:dragleave={handleDragLeave}
					on:drop={(event) => handleDrop(event, index)}
					on:dragend={handleDragEnd}
				>
					{issue}
				</li>
			{/each}
		</ul>
	</div>
	<button class="submit-button" on:click={backToQuestions}>Back</button>
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
