<script>
	import { goto } from '$app/navigation';
	import { userInfo } from '../../store'; // Import the store to save user info

	// Data for the form
	let gender = '';
	let region = '';
	let age = '';
	let urbanization = '';

	const genderOptions = ['male', 'female', 'other', 'disclose'];
	const regionOptions = [
		'Zambezi',
		'Erongo',
		'Hardap',
		'Kavango East',
		'Kavango West',
		'Khomas',
		'Kunene',
		'Ohangwena',
		'Omaheke',
		'Omusati',
		'Oshana',
		'Oshikoto',
		'Otjozondjupa',
		'Karas',
		'||Karas'
	];
	const ageOptions = ['18-30', '31-40', '41-50', '51-60', '60-70', '70+'];
	const urbanizationOptions = ['city', 'rural'];

	// Function to handle form submission and save to store
	function submitUserInfo() {
		// Save the user info in the store
		userInfo.set({
			gender,
			region,
			age,
			urbanization
		});

		// Navigate to the results page after submitting the data
		goto('/results');
	}

	// Function to skip optional information and proceed to results
	function skipUserInfo() {
		goto('/results');
	}
</script>

<main>
	<h1>Optional Information</h1>
	<p>
		Please provide some optional information to help improve the analysis of your survey responses.
		You can also skip this step if you prefer.
	</p>

	<form on:submit|preventDefault={submitUserInfo}>
		<!-- Gender -->
		<label for="gender">Gender</label>
		<select id="gender" bind:value={gender}>
			<option value="" disabled selected>Select your gender</option>
			{#each genderOptions as option}
				<option value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
			{/each}
		</select>

		<!-- Region -->
		<label for="region">Region</label>
		<select id="region" bind:value={region}>
			<option value="" disabled selected>Select your region</option>
			{#each regionOptions as option}
				<option value={option}>{option}</option>
			{/each}
		</select>

		<!-- Age -->
		<label for="age">Age Group</label>
		<select id="age" bind:value={age}>
			<option value="" disabled selected>Select your age group</option>
			{#each ageOptions as option}
				<option value={option}>{option}</option>
			{/each}
		</select>

		<!-- Urbanization -->
		<label for="urbanization">Urbanization</label>
		<select id="urbanization" bind:value={urbanization}>
			<option value="" disabled selected>Select urbanization</option>
			{#each urbanizationOptions as option}
				<option value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
			{/each}
		</select>

		<!-- Submit and Skip Buttons -->
		<div class="button-container">
			<button type="button" class="skip-button" on:click={skipUserInfo}>Skip</button>
			<button type="submit" class="submit-button">Submit Information</button>
		</div>
	</form>
</main>

<style>
	main {
		padding: 20px;
		max-width: 600px;
		margin: 0 auto;
		text-align: center;
		font-family: Arial, sans-serif;
	}

	h1 {
		font-size: 2.5rem;
		color: #ff9933;
		margin-bottom: 20px;
	}

	p {
		font-size: 1.2rem;
		color: #555;
		margin-bottom: 30px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	label {
		font-size: 1.1rem;
		color: #333;
		margin-bottom: 5px;
		text-align: left;
	}

	select {
		padding: 10px;
		font-size: 1.1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	.button-container {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
		gap: 20px;
	}

	.submit-button,
	.skip-button {
		background-color: #ffcc33;
		border: none;
		padding: 15px 30px;
		font-size: 1.2rem;
		font-weight: bold;
		color: #fff;
		cursor: pointer;
		border-radius: 5px;
		transition: background-color 0.3s ease;
	}

	.submit-button:hover,
	.skip-button:hover {
		background-color: #ff9933;
	}
	.submit-button,
	.skip-button {
		flex: 1;
	}
</style>
