<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentQuestionIndex, userAnswers } from '../../store.js'; // Importing the stores for index and answers
	import questions from '$lib/data/questions.json'; // Import the questions

	let currentQuestion;
	let selectedOption = null; // Store the selected option for the current question

	// On mount, set the current question and load the previously selected option if available
	onMount(() => {
		currentQuestion = questions[$currentQuestionIndex];
		selectedOption = $userAnswers[currentQuestionIndex] ?? null; // Load previous answer if available
	});

	// Function to handle option selection
	function selectOption(index) {
		selectedOption = index; // Set the selected option
	}

	// Move to the next question
	function nextQuestion() {
		// Save selected option, or `null` if no option was selected (i.e., treat as skipped)
		$userAnswers[$currentQuestionIndex] = selectedOption;

		if ($currentQuestionIndex < questions.length - 1) {
			currentQuestionIndex.update((n) => n + 1); // Move to the next question
			currentQuestion = questions[$currentQuestionIndex];
			selectedOption = $userAnswers[$currentQuestionIndex] ?? null; // Load previously saved answer or null
		} else {
			console.log('Navigate now to ranking');
			goto('/ranking');
			//alert('You have completed the questionnaire!');
			// You can add code here to navigate to the results or ranking page
		}
	}

	// Move to the previous question
	function previousQuestion() {
		// Prevent moving back if we're on the first question
		if ($currentQuestionIndex === 0) return;

		currentQuestionIndex.update((n) => n - 1); // Move to the previous question
		currentQuestion = questions[$currentQuestionIndex];
		selectedOption = $userAnswers[$currentQuestionIndex] ?? null; // Load previously saved answer or null
	}
</script>

<main>
	<h1>Questionnaire</h1>

	{#if currentQuestion}
		<h2>{currentQuestion.question}</h2>
		<ul>
			{#each currentQuestion.options as option, index}
				<li>
					<input
						type="radio"
						id="option-{index}"
						name="question"
						value={index}
						on:click={() => selectOption(index)}
						checked={selectedOption === index}
					/>
					<label for="option-{index}">{option.answer}</label>
				</li>
			{/each}
		</ul>

		<p>Question {$currentQuestionIndex + 1} of {questions.length}</p>

		<!-- Previous Button: Always visible but does nothing if on the first question -->
		<button on:click={previousQuestion}>Previous Question</button>

		<!-- Next Button: Proceeds to the next question -->
		<button on:click={nextQuestion}>Next Question</button>
	{:else}
		<p>No questions available.</p>
	{/if}
</main>
