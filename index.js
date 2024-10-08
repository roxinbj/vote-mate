import express from 'express';
import { handler as svelteKitHandler } from './build/handler.js'; // SvelteKit app handler
import { BigQuery } from '@google-cloud/bigquery';
import bodyParser from 'body-parser';

const app = express();
const bigquery = new BigQuery();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Backend API route for BigQuery
app.post('/api/sendResultsToBigQuery', async (req, res) => {
	console.log('IN /api/sendResultsToBigQuery/');
	console.log('req ', req);
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
		console.log(`Data inserted with response_id ${response_id}`);

		res.status(200).send({ success: true, message: 'Data successfully inserted into BigQuery' });
	} catch (error) {
		console.error('Error inserting data into BigQuery:', error);
		res.status(500).send({
			success: false,
			message: 'Failed to insert data into BigQuery',
			error: error.message
		});
	}
});

app.post('/api/hello', async (req, res) => {
	console.log('IN /api/hello/');
});

// Serve the SvelteKit app for all other routes
app.use(svelteKitHandler);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
