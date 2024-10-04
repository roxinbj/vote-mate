import { writable } from 'svelte/store';

// Store for tracking the current question index
export const currentQuestionIndex = writable(0);

// Store for tracking user answers (each element is the index of the selected option or null for skipped questions)
export const userAnswers = writable([]);

// Store for the issue rankings (set by the user during drag-and-drop)
export const issueRankings = writable([]);
