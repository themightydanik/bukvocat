// ============================================================
// STORY GENERATION
// ============================================================
async function generateStory() {
  const u = LANGS[lang].ui;
  document.getElementById('storyBox').style.display='none';
  document.getElementById('storyLoading').style.display='flex';
  document.getElementById('storyLoadingText').textContent = LANGS[lang].ui.loadingText;
  document.getElementById('btnReadStory').style.display='none';
  document.getElementById('btnNewStory').style.display='none';

  if (!apiKey) {
    document.getElementById('storyLoadingText').textContent = u.noApiKey;
    document.getElementById('btnNewStory').style.display='flex';
    return;
  }

  const prompt = LANGS[lang].storyPrompt(
    profile.name || 'Малыш',
    profile.age || 5,
    profile.city || ''
  );

  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 600,
        temperature: 0.9,
        messages: [
          { role: 'system', content: 'Ты добрый автор детских сказок. Пиши просто, тепло и увлекательно.' },
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('empty');

    const lines = text.split('\n');
    const title = lines[0].replace(/^#+\s*/,'').replace(/^\*+|\*+$/g,'').trim();
    const body = lines.slice(1).join('\n').trim();

    document.getElementById('storyTitleText').textContent = title;
    document.getElementById('storyBodyText').textContent = body;
    document.getElementById('storyBox').style.display='block';
    document.getElementById('storyLoading').style.display='none';
    document.getElementById('btnReadStory').style.display='flex';
    document.getElementById('btnNewStory').style.display='flex';
  } catch(e) {
    document.getElementById('storyLoadingText').textContent = '😿 Ошибка. Проверь Groq API-ключ.';
    document.getElementById('btnNewStory').style.display='flex';
  }
}

function readStoryAloud() {
  const title = document.getElementById('storyTitleText').textContent;
  const body = document.getElementById('storyBodyText').textContent;
  speak(title + '. ' + body, LANGS[lang].lang, 0.82, 1.05);
}
