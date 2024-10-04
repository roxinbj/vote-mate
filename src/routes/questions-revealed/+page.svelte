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
</script>

<main>
	<h1>Review Your Answers</h1>
	<ul>
		{#each questions as question, questionIndex}
			<li>
				<h3>Question {questionIndex + 1}: {question.question}</h3>

				<ul>
					{#each question.options as option, optionIndex}
						<li
							style="
                  padding: 10px;
                  border: 1px solid #ccc;
                  background-color: {answers[questionIndex] === optionIndex
								? '#d3f9d8'
								: '#f5f5f5'};
                  margin-bottom: 10px;
                "
						>
							<strong>{option.answer}</strong>

							<!-- Highlight user's choice -->
							{#if answers[questionIndex] === optionIndex}
								<span style="color: green;">(Your Choice)</span>
							{/if}

							<!-- List of parties that agree with this option -->
							<br />
							<small>Parties agreeing: {option.parties.join(', ')}</small>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
	<div style="margin-top: 20px;">
		<button on:click={startAgain}>Home</button>
	</div>
</main>
