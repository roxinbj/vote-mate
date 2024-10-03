import { writable } from 'svelte/store';

export const currentQuestionIndex = writable(0);
export const userAnswers = writable([]);
export const issueRankings = writable({});
