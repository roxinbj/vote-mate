// +server.js
import { error, json } from '@sveltejs/kit';
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery();

export async function POST({ request }) {
	console.log('Entered Backend');

	try {
		console.log('entered backend');
		const payload = await request.json();
		console.log('Received payload:', payload);

		// Replace with your actual dataset and table IDs
		const datasetId = 'vote_mate_responses';
		const tableId = 'public_responses'; //'test'; //
		//const rows = [{ test: 'Hallo' }];
		const rows = [payload];

		// Insert data into BigQuery
		await bigquery.dataset(datasetId).table(tableId).insert(rows);
		console.log(`Inserted ${rows.length} rows into BigQuery`);

		return json({ message: 'Data inserted into BigQuery successfully' });
	} catch (err) {
		console.error('Error in server endpoint:', err);
		throw error(500, 'Failed to insert data into BigQuery');
	}
}
