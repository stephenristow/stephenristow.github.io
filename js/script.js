let currentSection = 0;
const sections = document.querySelectorAll('.page');
const totalSections = sections.length;
const W = window.innerWidth;
const H = window.innerHeight;

(() => {
  const container = document.getElementById('fireflies');
  if (!container) return;

  const MAX_ON_SCREEN = 10;
  const TICK_MS = 1400;
  const SPAWN_PROBABILITY = 0.60;
  const LIFE_MIN_MS = 8000;
  const LIFE_MAX_MS = 18000;

  const vw = () => Math.max(320, window.innerWidth);
  const vh = () => Math.max(380, window.innerHeight);

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function choice(a, b) { return Math.random() < 0.5 ? a : b; }

  function spawn() {
    const el = document.createElement('span');
    el.className = 'firefly';

    const x = rand(5, 95);
    const y = rand(10, 90);

    const size = rand(2, 4);
    const alpha = rand(0.35, 0.65);
    const move = rand(9, 16);
    const twink = rand(4, 8);
    const delay = rand(0, 4);
    const delay2 = rand(0, 6);

    const dx = choice(1, -1) * rand(20, 90);
    const dy = choice(1, -1) * rand(10, 60);

    el.style.setProperty('--x', x + 'vw');
    el.style.setProperty('--y', y + 'vh');
    el.style.setProperty('--s', size + 'px');
    el.style.setProperty('--alpha', alpha.toString());
    el.style.setProperty('--move', move + 's');
    el.style.setProperty('--twinkle', twink + 's');
    el.style.setProperty('--delay', delay + 's');
    el.style.setProperty('--delay2', delay2 + 's');
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');

    container.appendChild(el);

    const life = rand(LIFE_MIN_MS, LIFE_MAX_MS);
    setTimeout(() => {
      el.classList.add('is-fading');
      setTimeout(() => el.remove(), 700);
    }, life);
  }

  function tick() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (container.childElementCount < MAX_ON_SCREEN && Math.random() < SPAWN_PROBABILITY) {
      spawn();
    }
  }

  const startCount = Math.round(rand(1, 2));
  for (let i = 0; i < startCount; i++) spawn();

  setInterval(tick, TICK_MS);
})();


function cursorBlinking(elementId, intervalTime) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID '${elementId}' not found.`);
    return;
  }

  let isVisible = true;
  const blinkInterval = setInterval(() => {
    if (isVisible) {
      element.style.opacity = '0';
    } else {
      element.style.opacity = '1';
    }
    isVisible = !isVisible;
  }, intervalTime);

  return blinkInterval;
}

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function animatingText(el, text, { speed = 55, jitter = 45, startDelay = 0 } = {}) {
  console.log("[animatingText] start!");
  return new Promise(resolve => {
    if (prefersReducedMotion) {
      el.textContent = text;
      console.log("[animatingText] PRM true -> resolve immediately!");
      resolve();
      return;
    }

    let i = 0;
    const tick = () => {
      el.textContent = text.slice(0, i++);
      if (i <= text.length) {
        const delay = speed + Math.floor(Math.random() * jitter);
        setTimeout(tick, delay);
      } else {
        console.log("[animatingText-tick] All done typing!");
        resolve();
      }
    };
    setTimeout(tick, startDelay);
  });
}

function startCursorBlink(cursorEl) {
  cursorEl.classList.remove('solid');
  cursorEl.classList.add('blink');
}

function stopCursorBlink(cursorEl) {
  cursorEl.classList.add('solid');
  cursorEl.classList.remove('blink');
}

(async () => {
  const cmdEl = document.getElementById('typingTop');
  // const cursorTop = document.getElementById('cursorTop');
  const nameEl = document.querySelector('.name-text');
  const taglineEl = document.querySelector('.tagline-text');
  const termEl = document.getElementById('terminalTextStack');
  const cursorBottom = document.getElementById('cursorBottom');

  function setCursorState(state) { typingTop.dataset.cursor = state; }

  setCursorState('solid');

  // stopCursorBlink(cursorTop);

  await animatingText(cmdEl, "me -h", { speed: 60, jitter: 50 });

  await sleep(250);


  const nameText = nameEl.textContent;
  const tagText = taglineEl.textContent;
  nameEl.textContent = '';
  taglineEl.textContent = '';

  await animatingText(nameEl, nameText, { speed: 28, jitter: 18 });
  await animatingText(taglineEl, tagText, { speed: 28, jitter: 14 });

  // cursorTop.style.visibility = 'hidden';
  setCursorState('hidden');

  termEl.classList.remove('hidden');

  startCursorBlink(cursorBottom);
})();

const root = document.documentElement;
let lastX = window.innerWidth / 2, lastY = window.innerHeight / 2;
let raf = null;

function update() {
  raf = null;
  const W = window.innerWidth, H = window.innerHeight;

  // subtle parallax for the vignette center
  const x2 = lastX - 0.12 * W * (lastX / W - 0.5);
  const y2 = lastY - 0.12 * W * (lastY / H - 0.5);

  root.style.setProperty('--cursorX', lastX + 'px');
  root.style.setProperty('--cursorY', lastY + 'px');
  root.style.setProperty('--cursorX2', x2 + 'px');
  root.style.setProperty('--cursorY2', y2 + 'px');
}

function onMove(e) {
  lastX = e.clientX;
  lastY = e.clientY;
  if (!raf) raf = requestAnimationFrame(update);
}

document.addEventListener('mousemove', onMove, { passive: true });
window.addEventListener('resize', () => { if (!raf) raf = requestAnimationFrame(update); });
update(); // initial paint

document.querySelectorAll('.project-card.crt').forEach((el) => {
  const delay = -(Math.random() * 3).toFixed(2) + 's';
  el.style.setProperty('--crt-delay', delay);
});


