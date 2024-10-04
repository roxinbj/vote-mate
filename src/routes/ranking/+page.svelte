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
		console.log('Item at ', draggedIndex);
		console.log('Dropped at ', index);
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
</script>

<main>
	<h1>Rank the Issues</h1>
	<p>Drag and drop the issues to rank them by importance to you.</p>

	<ul>
		{#each rankedIssues as issue, index}
			<li
				draggable="true"
				on:dragstart={(event) => handleDragStart(event, index)}
				on:dragover={handleDragOver}
				on:dragleave={handleDragLeave}
				on:drop={(event) => handleDrop(event, index)}
				on:dragend={handleDragEnd}
				data-index={index}
				style="border: 1px solid #ccc; padding: 8px; margin: 4px 0; cursor: move;"
			>
				{issue}
			</li>
		{/each}
	</ul>

	<button on:click={submitRankings}>Submit Rankings</button>
</main>
