<script>
	import { onMount } from 'svelte';
	import { currentQuestionIndex, userAnswers, issueRankings } from '../../store.js'; // Import user's answers from the store
	import questions from '$lib/data/questions.json'; // Import questions
	import Chart from 'chart.js/auto'; // Import Chart.js
	import { goto } from '$app/navigation'; // Import the `goto` function for navigation

	let correlationResults = [];
	let sortedParties = [];

	// Each party and their promises for correlation calculation
	const parties = ['PDM', 'NEFF', 'IPC', 'RP', 'APP', 'SWAPO', 'CoD', 'SWANU', 'NDP'];

	// Function to navigate to the "reveal questions" page
	function revealQuestions() {
		goto('/questions-revealed'); // Replace with the correct path to the page where the questions are revealed
	}

	// Function to reset the data and go back to the landing page
	function startAgain() {
		currentQuestionIndex.set(0);
		userAnswers.set([]); // Clear user answers
		issueRankings.set([]); // Clear issue rankings
		goto('/'); // Navigate back to the landing page (adjust if needed)
	}

	// Calculate the weight for each issue based on user rankings
	function calculateWeights() {
		const rankings = $issueRankings;

		// If no rankings are available, default to equal weights
		if (!rankings || rankings.length === 0) {
			return Array(questions.length).fill(1);
		}

		// Normalize the rankings so that the most important issue has the highest weight
		const maxWeight = 10; // Arbitrary max weight
		const weights = [];
		const totalIssues = rankings.length;

		rankings.forEach((issue, index) => {
			const questionIndex = questions.findIndex((q) => q.issue === issue);
			const weight = maxWeight - index * (maxWeight / totalIssues); // Higher-ranked issues get higher weights
			weights[questionIndex] = weight;
		});
		return weights;
	}

	// Correlate user's answers with each party's promises
	function calculateCorrelation() {
		const partyScores = {};

		// Initialize scores for each party
		parties.forEach((party) => {
			partyScores[party] = 0;
		});

		// Calculate the issue weights based on user rankings
		const weights = calculateWeights();
		console.log('weights: ', weights);

		// Calculate correlation by comparing user's answers with the party promises in each question
		questions.forEach((question, questionIndex) => {
			const userAnswer = $userAnswers[questionIndex]; // User's answer for the question
			const weight = weights[questionIndex] || 1; // Use the calculated weight for this question or 1 if no weight is set

			if (userAnswer !== null) {
				// Skip if the user skipped the question
				question.options.forEach((option) => {
					if (option.parties.includes(parties[userAnswer])) {
						option.parties.forEach((party) => {
							partyScores[party] += weight; // Multiply the score by the weight of the issue
						});
					}
				});
			}
		});

		// Convert scores to percentage and store them
		const maxScore = weights.reduce((sum, w) => sum + w, 0); // The maximum possible weighted score
		console.log('Max Score:', maxScore);
		correlationResults = parties.map((party) => ({
			party,
			percentage: Math.round((partyScores[party] / maxScore) * 100)
		}));
		console.log('Score: ', partyScores);

		// Sort the parties by percentage from highest to lowest
		sortedParties = [...correlationResults].sort((a, b) => b.percentage - a.percentage);
	}

	// Create the chart after the correlation is calculated
	let chart;
	onMount(() => {
		calculateCorrelation();

		const ctx = document.getElementById('resultsChart').getContext('2d');

		chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: sortedParties.map((p) => p.party), // Party names
				datasets: [
					{
						label: 'Correlation (%)',
						data: sortedParties.map((p) => p.percentage), // Correlation percentage
						backgroundColor: 'rgba(54, 162, 235, 0.5)', // Light blue bars
						borderColor: 'rgba(54, 162, 235, 1)', // Border color for the bars
						borderWidth: 1
					}
				]
			},
			options: {
				indexAxis: 'y', // Horizontal bars by switching the axis
				responsive: true,
				scales: {
					x: {
						// This is now the value axis
						beginAtZero: true,
						max: 100, // Maximum 100% correlation
						title: {
							display: true,
							text: 'Correlation (%)'
						}
					},
					y: {
						// This is now the category axis
						title: {
							display: true,
							text: 'Parties'
						}
					}
				},
				plugins: {
					legend: {
						display: false // Hide the legend since it's a single dataset
					}
				}
			}
		});
	});
</script>

<main>
	<h1>Your Results</h1>
	<canvas id="resultsChart" width="400" height="400"></canvas>
	<div style="margin-top: 20px;">
		<button on:click={revealQuestions} style="margin-right: 10px;">Reveal Questions</button>
		<button on:click={startAgain}>Start Again</button>
	</div>
</main>
