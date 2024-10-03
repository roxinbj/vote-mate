<script>
	import { userAnswers, questions, issueRankings } from '../../store.js';

	let partyScores = {};

	$: {
		questions.forEach((q, index) => {
			const selectedOptionIndex = $userAnswers[index];
			const selectedOption = q.options[selectedOptionIndex];
			const weight = $issueRankings[q.issue];

			selectedOption.parties.forEach((party) => {
				if (!partyScores[party]) partyScores[party] = 0;
				partyScores[party] += weight;
			});
		});
	}

	let sortedScores = Object.entries(partyScores).sort((a, b) => b[1] - a[1]);
</script>

<h1>Your Results</h1>
<ul>
	{#each sortedScores as [party, score]}
		<li>{party}: {score} points</li>
	{/each}
</ul>
