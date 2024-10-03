<script>
	import { onMount } from 'svelte';
	import { currentQuestionIndex, userAnswers } from '../../store.js'; // Assuming you store answers and index in stores
	import questions from '$lib/data/questions.json'; // Import the questions from JSON file

	let currentQuestion;
	let selectedOption = null; // To store the selected option for the current question

	// On mount, set the current question based on the current index
	onMount(() => {
		currentQuestion = questions[$currentQuestionIndex];
		selectedOption = $userAnswers[currentQuestionIndex] ?? null; // Load previous answer if available
	});

	// Function to handle option selection
	function selectOption(index) {
		selectedOption = index; // Set the selected option
	}

	// Function to move to the next question
	function nextQuestion() {
		if (selectedOption === null) {
			alert('Please select an option before proceeding.');
			return;
		}
		$userAnswers[$currentQuestionIndex] = selectedOption; // Save selected option for the current question

		if ($currentQuestionIndex < questions.length - 1) {
			currentQuestionIndex.update((n) => n + 1); // Move to the next question
			currentQuestion = questions[$currentQuestionIndex];
			selectedOption = $userAnswers[$currentQuestionIndex] ?? null; // Reset to the saved answer if available
		} else {
			alert('You have completed the questionnaire!');
			// Navigate to results or ranking
		}
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

		<p>Question {currentQuestionIndex + 1} of {questions.length}</p>
		<button on:click={nextQuestion}>Next Question</button>
	{:else}
		<p>No questions available.</p>
	{/if}
</main>
