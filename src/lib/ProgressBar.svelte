<script>
	import { currentQuestionIndex, questions } from '../store.js';
</script>

<progress value={$currentQuestionIndex + 1} max={$questions.length}></progress>
