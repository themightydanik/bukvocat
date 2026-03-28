// ============================================================
// STATE
// ============================================================
let lang = 'ru';
let profile = { name:'', age:5, birthday:'', city:'' };
let progress = {
  stickers:[], dailyScores:{}, bestScores:{}, streak:0, lastPlayDate:'',
  xp: 0,
  subjectXP: { reading: 0, math: 0, languages: 0 }
};
let apiKey = '';

// Game state
let questions = [], current = 0, gameScore = 0, answered = false;
let currentGameType = 'letter';
let currentSubject = 'reading';
const TOTAL = 8;

// XP config
const XP_PER_CORRECT = 10;
const XP_PER_STICKER = 50;

// Level progression
const LEVELS = [
  { min: 0,    emoji: '🐣', ru: 'Птенец',    uk: 'Пташеня',  en: 'Hatchling' },
  { min: 100,  emoji: '🐥', ru: 'Птёнчик',   uk: 'Пташка',   en: 'Chick'     },
  { min: 250,  emoji: '🐱', ru: 'Котёнок',   uk: 'Кошеня',   en: 'Kitten'    },
  { min: 500,  emoji: '🦊', ru: 'Лисёнок',   uk: 'Лисеня',   en: 'Fox Cub'   },
  { min: 900,  emoji: '🦁', ru: 'Лёвушка',   uk: 'Левеня',   en: 'Lion Cub'  },
  { min: 1400, emoji: '🦅', ru: 'Орлёнок',   uk: 'Орленя',   en: 'Eaglet'    },
  { min: 2000, emoji: '🌟', ru: 'Звёздочка', uk: 'Зірочка',  en: 'Star'      },
];

function getLevel(xp) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min) idx = i; else break;
  }
  const lv = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const pct = next
    ? Math.min(100, Math.round((xp - lv.min) / (next.min - lv.min) * 100))
    : 100;
  const name = lang === 'uk' ? lv.uk : lang === 'en' ? lv.en : lv.ru;
  return { emoji: lv.emoji, name, num: idx + 1, pct, xp, nextMin: next?.min ?? lv.min };
}
