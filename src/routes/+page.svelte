<script>
	import { goto } from '$app/navigation';

	function startSurvey() {
		goto('/questions');
	}
</script>

<main>
	<!-- Top Section -->
	<section class="hero-section">
		<nav class="nav">
			<div class="hamburger-menu"></div>
		</nav>
		<div class="hero-content">
			<h1>Vote-Mate</h1>
			<h2>Namibian Parliamentary Elections 2024</h2>
			<p>
				This survey has been created independently from all political parties and is based solely on
				the most recent party manifestos. Its purpose is to help you identify the issues that matter
				most to you and compare your views with the positions of the parties. <br />
				<br />It is not intended as an endorsement or recommendation, but rather as an additional
				resource to inform your decision.
			</p>
			<button class="cta-button" on:click={startSurvey}>Start Survey</button>
		</div>
	</section>

	<!-- Bottom Section (Logos) -->
	<section class="logo-section">
		<h3>This project was proudly sponsored by:</h3>
		<div class="logo-grid">
			<img src="/logos/Sigmotec.png" alt="Sigmotec 1" />
			<img src="/logos/EtoshaApp.png" alt="Etosha App 1" />
			<img src="/logos/HitradioNamibia.jpg" alt="HitradioNamibia 1" />
			<img src="/logos/Sigmotec.png" alt="Sigmotec 1" />
			<img src="/logos/Sigmotec.png" alt="Sigmotec 1" />

			<!-- Add more logos as necessary -->
		</div>
		<h3>Other supporters:</h3>
		<div class="logo-grid">
			<img src="/logos/Sigmotec.png" alt="Supporter 1" />
			<img src="/logos/Sigmotec.png" alt="Supporter 1" />
			<img src="/logos/Sigmotec.png" alt="Supporter 1" />
			<img src="/logos/Sigmotec.png" alt="Supporter 1" />
		</div>
	</section>
</main>

<style>
	/* General Resets */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	body {
		font-family: Arial, sans-serif;
		line-height: 1.6;
		color: #333;
	}
	h2 {
		color: #333;

		font-size: 2.5rem;
		margin-bottom: 10px;
	}

	/* Top Hero Section */
	.hero-section {
		background: linear-gradient(135deg, #ffcc33, #ff9933);
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		position: relative;
		padding: 20px;
	}

	.nav {
		position: absolute;
		top: 20px;
		right: 20px;
	}

	.hamburger-menu {
		width: 30px;
		height: 4px;
		background-color: #333;
		margin: 6px 0;
	}

	.hero-content h1 {
		font-size: 3.5rem;
		font-weight: bold;
	}

	.hero-content h2 {
		font-size: 1.8rem;
		margin-bottom: 1rem;
	}

	.hero-content p {
		max-width: 600px;
		margin: 0 auto;
		font-size: 1.2rem;
		margin-bottom: 2rem;
	}

	.cta-button {
		background-color: #fff;
		border: none;
		padding: 15px 30px;
		font-size: 1.2rem;
		font-weight: bold;
		cursor: pointer;
		transition: background 0.3s;
	}

	.cta-button:hover {
		background-color: #ffcc33;
		color: #333;
	}

	/* Bottom Logo Section */
	.logo-section {
		padding: 50px 20px;
		background-color: #fff;
		text-align: center;
	}

	.logo-section h3 {
		font-size: 1.8rem;
		margin-bottom: 20px;
	}

	.logo-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 20px;
		justify-items: center;
		padding: 20px 0;
	}

	.logo-grid img {
		max-width: 100%;
		height: auto;
		object-fit: contain;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.hero-content h1 {
			font-size: 2.5rem;
		}

		.hero-content h2 {
			font-size: 1.4rem;
		}

		.cta-button {
			font-size: 1rem;
			padding: 10px 20px;
		}

		.logo-grid {
			grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		}
	}
</style>
