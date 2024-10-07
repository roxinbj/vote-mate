<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentQuestionIndex, userAnswers } from '../../store.js'; // Importing the stores for index and answers
	import questions from '$lib/data/questions.json'; // Import the questions

	let currentQuestion;
	let selectedOption = null; // Store the selected option for the current question

	// On mount, set the current question and load the previously selected option if available
	onMount(() => {
		loadQuestion();
	});

	function loadQuestion() {
		currentQuestion = questions[$currentQuestionIndex];
		selectedOption = $userAnswers[$currentQuestionIndex] ?? null; // Load previously saved answer if available
	}

	// Function to handle option selection
	function selectOption(index) {
		selectedOption = index; // Set the selected option
		$userAnswers[$currentQuestionIndex] = selectedOption;

		// Automatically go to the next question after selecting an option
		nextQuestion();
	}

	// Move to the next question
	function nextQuestion() {
		// If no option is selected, save as null (skipped)
		if (selectedOption === null) {
			$userAnswers[$currentQuestionIndex] = null;
		}

		if ($currentQuestionIndex < questions.length - 1) {
			currentQuestionIndex.update((n) => n + 1); // Move to the next question
			loadQuestion(); // Reload the question and options
		} else {
			goto('/ranking'); // Navigate to the ranking page once all questions are answered
		}
	}

	// Move to the previous question
	function previousQuestion() {
		// Prevent moving back if we're on the first question
		if ($currentQuestionIndex === 0) {
			goto('/');
		} else {
			currentQuestionIndex.update((n) => n - 1); // Move to the previous question
			loadQuestion(); // Reload the question and options
		}
	}
</script>

<main>
	<h1>Vote-Mate</h1>

	{#if currentQuestion}
		<div class="question-container">
			<h2>{currentQuestion.question}</h2>

			<div class="options">
				{#each currentQuestion.options as option, index}
					<button on:click={() => selectOption(index)} class:selected={selectedOption === index}>
						{option.answer}
					</button>
				{/each}
			</div>

			<p>Question {$currentQuestionIndex + 1} of {questions.length}</p>

			<!-- Skip Button (Right corner) -->
			<!--<div class="skip" on:click={nextQuestion}>Skip question →</div> -->

			<!-- Navigation Buttons -->
			<div class="navigation">
				<button on:click={previousQuestion}>Previous</button>
				<button on:click={nextQuestion}>Next</button>
			</div>

			<!-- Progress Indicator -->
			<div class="progress">
				{#each Array(questions.length) as _, i}
					<div class="progress-dot {i === $currentQuestionIndex ? 'active' : ''}"></div>
				{/each}
			</div>
		</div>
	{:else}
		<p>No questions available.</p>
	{/if}
</main>

<style>
	main {
		padding: 20px;
		background: linear-gradient(135deg, #ffcc33, #ff9933);
		text-align: center;
		font-family: Arial, sans-serif;
	}

	.question-container {
		background-color: white;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		max-width: 600px;
		margin: 20px auto;
		position: relative;
	}

	h1 {
		color: white;
		font-size: 2.5rem;
		margin-bottom: 10px;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 20px;
		color: #333;
	}

	.options {
		display: flex;
		flex-direction: column; /* Align options vertically */
		gap: 10px;
		margin-bottom: 20px;
	}

	.options button {
		background-color: #ff9933;
		border: none;
		padding: 15px;
		font-size: 1.1rem;
		font-weight: bold;
		color: #fff;
		cursor: pointer;
		border-radius: 5px;
		transition: background-color 0.3s ease;
	}

	.options button:hover {
		background-color: #ffcc33;
	}

	.options button.selected {
		background-color: #ffcc33; /* Highlight selected option */
	}

	.skip {
		position: absolute;
		bottom: 20px;
		right: 20px;
		color: #333;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.navigation {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
	}

	.navigation button {
		background-color: #ffcc33;
		border: none;
		padding: 10px 20px;
		font-size: 1rem;
		color: #fff;
		cursor: pointer;
		border-radius: 5px;
	}

	.progress {
		margin-top: 20px;
		display: flex;
		justify-content: center;
	}

	.progress-dot {
		width: 12px;
		height: 12px;
		background-color: #ccc;
		border-radius: 50%;
		margin: 0 5px;
	}

	.progress-dot.active {
		background-color: #ffcc33;
	}
</style>
