<script>
	import { goto } from '$app/navigation';

	function startSurvey() {
		goto('/questions');
	}
</script>

<main>
	<h1>Political Alignment Survey</h1>
	<p>
		This survey helps you find out which political party aligns with your views based on key issues.
	</p>
	<button on:click={startSurvey}>Start Survey</button>
</main>
