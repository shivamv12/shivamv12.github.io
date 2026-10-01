// Robotic system voice
// ---- Robotic system voice ----
const speakSystemMessage = () => {
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(
    "Shivam's profile initialized. Interface online."
  );

  utterance.rate = 0.78;
  utterance.pitch = 0.45;
  utterance.volume = 0.8;

  const voices = speechSynthesis.getVoices();

  const voice =
    voices.find(
      v =>
        /en/i.test(v.lang) &&
        /male|david|alex|daniel/i.test(v.name)
    ) ||
    voices.find(v => /en/i.test(v.lang));

  if (voice) {
    utterance.voice = voice;
  }

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};

(() => {
  /* ---- Boot sequence (~3.5s, skippable, every page load) ---- */
  const root = document.documentElement;
  const boot = document.getElementById('boot');

  if (root.classList.contains('booting') && boot) {
    const log = document.getElementById('boot-log');
    const lines = [
      '> initialising portfolio…',
      '> mounting modules: horse-watch · skreem · neuralens · rag',
      '> loading interface systems…',
      '> synchronising project telemetry…',
      '> system online'
    ];

    let i = 0, done = false, timer;

    const finish = () => {
      if (done) return;
      done = true;
      clearInterval(timer);
      removeEventListener('keydown', finish);
      removeEventListener('pointerdown', finish);
      boot.classList.add('is-done');
      setTimeout(() => root.classList.remove('booting'), 500);
    };

    timer = setInterval(() => {
      if (i < lines.length) {
        log.textContent += (i ? '\n' : '') + lines[i];
    
        // Speak when the final boot message appears
        if (i === lines.length - 1) {
          speakSystemMessage();
        }
    
        i++;
      } else {
        finish();
      }
    }, 600);

    addEventListener('keydown', finish);
    addEventListener('pointerdown', finish);
    setTimeout(finish, 5000);
  }

  /* ---- Active nav link on scroll ---- */
  const links = [...document.querySelectorAll('.site-nav__links a')];
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
      const a = byId.get(e.target.id);
      if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'location'); }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  byId.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });

  /* ---- Ambient HUD telemetry / subtle pointer parallax ---- */
  const telemetry = document.querySelector('.hud-ambient__telemetry');
  const orbOne = document.querySelector('.hud-ambient__orb--one');
  const orbTwo = document.querySelector('.hud-ambient__orb--two');

  if (telemetry) {
    const messages = [
      'SYS // NODE ONLINE · SIGNAL STABLE',
      'SYS // PORTFOLIO LINK · ACTIVE',
      'SYS // ARCHITECTURE MODE · READY',
      'SYS // 8Y EXPERIENCE · INDEXED'
    ];
    let messageIndex = 0;
    setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      telemetry.textContent = messages[messageIndex];
    }, 4200);
  }

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    addEventListener('pointermove', (event) => {
      const x = (event.clientX / innerWidth - 0.5) * 2;
      const y = (event.clientY / innerHeight - 0.5) * 2;
      if (orbOne) orbOne.style.margin = `${y * 5}px ${x * 5}px`;
      if (orbTwo) orbTwo.style.margin = `${y * -3}px ${x * -3}px`;
    }, { passive: true });
  }
})();
