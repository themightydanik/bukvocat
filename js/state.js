// ============================================================
// STATE
// ============================================================
let lang = 'ru';
let profile = { name:'', age:5, birthday:'', city:'' };
let progress = { stickers:[], dailyScores:{}, bestScores:{}, streak:0, lastPlayDate:'' };
let apiKey = '';

// Game state
let questions = [], current = 0, gameScore = 0, answered = false;
let currentGameType = 'letter'; // 'letter' | 'syllable'
const TOTAL = 8;
