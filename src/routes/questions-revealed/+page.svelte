<script>
	import { onMount } from 'svelte';
	import { userAnswers, currentQuestionIndex, issueRankings } from '../../store'; // Import user's answers from the store
	import questions from '$lib/data/questions.json'; // Import the questions
	import { goto } from '$app/navigation';
	let answers = [];

	// Load the user's answers when the component is mounted
	onMount(() => {
		answers = $userAnswers;
	});

	function startAgain() {
		currentQuestionIndex.set(0);
		userAnswers.set([]); // Clear user answers
		issueRankings.set([]); // Clear issue rankings
		goto('/'); // Navigate back to the landing page (adjust if needed)
	}

	function backToResults() {
		goto('/results'); // Navigate back to the results page
	}
</script>

<main>
	<h1>Review Your Answers</h1>
	<ul>
		{#each questions as question, questionIndex}
			<li class="question-container">
				<h3>Question {questionIndex + 1}: {question.question}</h3>

				<ul>
					{#each question.options as option, optionIndex}
						<li class="option {answers[questionIndex] === optionIndex ? 'selected' : ''}">
							<strong>{option.answer}</strong>

							{#if answers[questionIndex] === optionIndex}
								<span>(Your Choice)</span>
							{/if}

							<small>Parties agreeing: {option.parties.join(', ')}</small>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>

	<div class="button-container">
		<button on:click={backToResults}>Back</button>
		<button on:click={startAgain}>Start Again</button>
	</div>
</main>

<style>
	main {
		padding: 20px;
		text-align: center;
		font-family: Arial, sans-serif;
	}

	h1 {
		color: #ff9933;
		font-size: 2.5rem;
		margin-bottom: 20px;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	.question-container {
		background-color: white;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		margin-bottom: 20px;
	}

	.option {
		padding: 10px;
		border: 1px solid #ccc;
		margin-bottom: 10px;
		border-radius: 5px;
		background-color: #f5f5f5;
		font-size: 1rem;
		text-align: left;
	}

	.option.selected {
		background-color: #d3f9d8;
		color: green;
	}

	.option small {
		display: block;
		color: #666;
	}

	.button-container {
		margin-top: 20px;
	}

	button {
		background-color: #ffcc33;
		border: none;
		padding: 15px 30px;
		font-size: 1.2rem;
		font-weight: bold;
		color: #fff;
		cursor: pointer;
		border-radius: 5px;
		transition: background-color 0.3s ease;
		margin: 0 10px;
	}

	button:hover {
		background-color: #ff9933;
	}
</style>
