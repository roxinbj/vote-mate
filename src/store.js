// store.js
import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

// Define version of the app/survey
export const version_id = 'v1.0.3'; // Update this as needed

// Generate a unique response ID for each survey session
export const response_id = writable(uuidv4());

// Store for user's answers
export const userAnswers = writable([]);

// Store for rankings
export const issueRankings = writable([]);

// Store for demographic info
export const userInfo = writable({
	gender: '',
	region: '',
	age: '',
	urbanization: ''
});

// Store for tracking current question index
export const currentQuestionIndex = writable(0);
