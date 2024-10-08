<script>
	import { onMount } from 'svelte';
	import {
		currentQuestionIndex,
		userAnswers,
		issueRankings,
		userInfo,
		version_id
	} from '../../store.js'; // Import version and store data
	import questions from '$lib/data/questions.json'; // Import questions
	import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
	import Chart from 'chart.js/auto'; // Import Chart.js
	import { goto } from '$app/navigation'; // Import the `goto` function for navigation

	let correlationResults = [];
	let sortedParties = [];
	let response_id = ''; // Initialize response_id

	const parties = ['PDM', 'NEFF', 'IPC', 'RP', 'APP', 'SWAPO', 'CoD', 'SWANU', 'NDP'];

	function revealQuestions() {
		goto('/questions-revealed');
	}

	function startAgain() {
		currentQuestionIndex.set(0);
		userAnswers.set([]); // Clear user answers
		issueRankings.set([]); // Clear issue rankings
		userInfo.set({ age: '', gender: '', region: '', urbanization: '' });
		goto('/');
	}

	function backToRankings() {
		goto('/ranking');
	}

	// Create the list of user answers with the question ID and text answer
	function mapUserAnswers() {
		return questions.map((question, index) => ({
			question_id: question.question_id,
			answer: $userAnswers[index] !== null ? question.options[$userAnswers[index]].answer : null
		}));
	}

	// Create the result list of party correlations
	function mapCorrelationResults() {
		return sortedParties.map((party) => ({
			party_name: party.party,
			correlation: party.percentage
		}));
	}

	// Prepare the issue rankings in the correct format for BigQuery
	function mapIssueRankings() {
		return $issueRankings.map((issue, index) => ({
			issue,
			ranking: index
		}));
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
		correlationResults = parties.map((party) => ({
			party,
			percentage: Math.round((partyScores[party] / maxScore) * 100)
		}));
		sortedParties = [...correlationResults].sort((a, b) => b.percentage - a.percentage);
	}

	// Send results to BigQuery with correct structure
	async function sendResultsToBigQuery() {
		console.log('Send to BG');
		const result = {
			response_id, // Generated UUID
			version_id, // App version
			submission_time: new Date().toISOString(),
			user_answers: mapUserAnswers(), // Map user answers with question ID and actual answer
			issue_rankings: $issueRankings.length ? mapIssueRankings() : null, // Map rankings, or null if skipped
			user_info: $userInfo, // User demographic information
			result: mapCorrelationResults() // Party correlation results
		};
		console.log('Result object ', result);

		try {
			const response = await fetch('/results', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(result)
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Server error:', errorData);
				alert('Failed to send data to the server.');
				return;
			}

			const data = await response.json();
			console.log('Server response:', data);
			alert('Data sent successfully!');
		} catch (err) {
			console.error('Fetch error:', err);
			alert('An error occurred while sending data.');
		}
	}

	let chart;
	onMount(() => {
		// Generate a unique response_id
		response_id = uuidv4();

		// Calculate correlations and render the chart
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

		// Push results to BigQuery after chart calculation
		//sendResultsToBigQuery();
	});
</script>
