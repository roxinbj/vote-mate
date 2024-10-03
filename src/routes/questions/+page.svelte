<script>
	import { onMount } from 'svelte';
	import { currentQuestionIndex, userAnswers } from '../../store.js'; // Assuming answers are stored in a store
	import questions from '$lib/data/questions.json'; // Import questions from JSON file

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
		if (selectedOption === null) {
			alert('Please select an option before proceeding.');
			return;
		}

		$userAnswers[$currentQuestionIndex] = selectedOption; // Save selected option for the current question

		if ($currentQuestionIndex < questions.length - 1) {
			currentQuestionIndex.update((n) => n + 1); // Move to the next question
			currentQuestion = questions[$currentQuestionIndex];
			selectedOption = $userAnswers[$currentQuestionIndex] ?? null; // Load previously saved answer if available
		} else {
			alert('You have completed the questionnaire!');
			// You can add code here to navigate to the results or ranking page
		}
	}

	// Move to the previous question
	function previousQuestion() {
		if ($currentQuestionIndex > 0) {
			currentQuestionIndex.update((n) => n - 1); // Move to the previous question
			currentQuestion = questions[$currentQuestionIndex];
			selectedOption = $userAnswers[$currentQuestionIndex] ?? null; // Load previously saved answer
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

		<p>Question {$currentQuestionIndex + 1} of {questions.length}</p>

		<!-- Back Button: only show if we're not on the first question -->
		{#if $currentQuestionIndex > 0}
			<button on:click={previousQuestion}>Previous Question</button>
		{/if}

		<button on:click={nextQuestion}>Next Question</button>
	{:else}
		<p>No questions available.</p>
	{/if}
</main>
