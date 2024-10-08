const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const bodyParser = require('body-parser');

const app = express();
const bigquery = new BigQuery();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// POST endpoint to handle data from the frontend
app.post('/api/sendResultsToBigQuery', async (req, res) => {
	try {
		const { response_id, version_id, submission_time, user_answers, issue_rankings, user_info } =
			req.body;

		const rows = [
			{
				response_id,
				version_id,
				submission_time,
				user_answers,
				issue_rankings,
				user_info
			}
		];

		// Insert data into BigQuery
		const datasetId = 'vote_mate_responses';
		const tableId = 'public_responses';

		await bigquery.dataset(datasetId).table(tableId).insert(rows);

		console.log(`Data with response_id ${response_id} inserted into BigQuery`);
		res.status(200).send({ success: true, message: 'Data successfully inserted into BigQuery' });
	} catch (error) {
		console.error('Error inserting data into BigQuery:', error);
		res
			.status(500)
			.send({
				success: false,
				message: 'Failed to insert data into BigQuery',
				error: error.message
			});
	}
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
