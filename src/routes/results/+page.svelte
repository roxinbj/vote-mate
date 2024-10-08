<script>
	import { onMount } from 'svelte';
	import { currentQuestionIndex, userAnswers, issueRankings } from '../../store.js'; // Import user's answers from the store
	import questions from '$lib/data/questions.json'; // Import questions
	import Chart from 'chart.js/auto'; // Import Chart.js
	import { goto } from '$app/navigation'; // Import the `goto` function for navigation

	let correlationResults = [];
	let sortedParties = [];

	const parties = ['PDM', 'NEFF', 'IPC', 'RP', 'APP', 'SWAPO', 'CoD', 'SWANU', 'NDP'];

	function revealQuestions() {
		goto('/questions-revealed'); // Replace with the correct path to the page where the questions are revealed
	}

	function startAgain() {
		currentQuestionIndex.set(0);
		userAnswers.set([]); // Clear user answers
		issueRankings.set([]); // Clear issue rankings
		goto('/'); // Navigate back to the landing page (adjust if needed)
	}

	function backToRankings() {
		goto('/ranking');
	}

	function calculateWeights() {
		const rankings = $issueRankings;

		if (!rankings || rankings.length === 0) {
			return Array(questions.length).fill(1);
		}

		const maxWeight = 10;
		const weights = [];
		const totalIssues = rankings.length;

		rankings.forEach((issue, index) => {
			const questionIndex = questions.findIndex((q) => q.issue === issue);
			const weight = maxWeight - index * (maxWeight / totalIssues);
			weights[questionIndex] = weight;
		});
		return weights;
	}

	function calculateCorrelation() {
		const partyScores = {};

		parties.forEach((party) => {
			partyScores[party] = 0;
		});

		const weights = calculateWeights();
		console.log('weights: ', weights);

		questions.forEach((question, questionIndex) => {
			const userAnswer = $userAnswers[questionIndex];
			const weight = weights[questionIndex] || 1;

			if (userAnswer !== null) {
				question.options.forEach((option) => {
					if (option.parties.includes(parties[userAnswer])) {
						option.parties.forEach((party) => {
							partyScores[party] += weight;
						});
					}
				});
			}
		});

		const maxScore = weights.reduce((sum, w) => sum + w, 0);
		console.log('Max Score:', maxScore);
		correlationResults = parties.map((party) => ({
			party,
			percentage: Math.round((partyScores[party] / maxScore) * 100)
		}));
		console.log('Score: ', partyScores);

		sortedParties = [...correlationResults].sort((a, b) => b.percentage - a.percentage);
	}

	let chart;
	onMount(() => {
		calculateCorrelation();

		const ctx = document.getElementById('resultsChart').getContext('2d');

		chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: sortedParties.map((p) => p.party),
				datasets: [
					{
						label: 'Correlation (%)',
						data: sortedParties.map((p) => p.percentage),
						backgroundColor: 'rgba(54, 162, 235, 0.5)',
						borderColor: 'rgba(54, 162, 235, 1)',
						borderWidth: 1
					}
				]
			},
			options: {
				indexAxis: 'y',
				responsive: true,
				scales: {
					x: {
						beginAtZero: true,
						max: 100,
						title: {
							display: true,
							text: 'Correlation (%)'
						}
					},
					y: {
						title: {
							display: true,
							text: 'Parties'
						}
					}
				},
				plugins: {
					legend: {
						display: false
					}
				}
			}
		});
	});
</script>

<main>
	<h1>Your Results</h1>

	<div class="chart-container">
		<canvas id="resultsChart" width="400" height="400"></canvas>
	</div>

	<div class="button-container">
		<button on:click={backToRankings}>Back</button>
		<button on:click={revealQuestions}>Reveal Questions</button>
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

	.chart-container {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
		background-color: white;
		border-radius: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}

	canvas {
		max-width: 100%;
		margin: 20px auto;
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
