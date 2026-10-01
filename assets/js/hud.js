(() => {
    /* ---- Boot sequence (~1.5s, skippable, once per session) ---- */
    const root = document.documentElement;
    const boot = document.getElementById('boot');
  
    if (root.classList.contains('booting') && boot) {
      const log = document.getElementById('boot-log');
      const lines = [
        '> initialising portfolio…',
        '> mounting modules: horse-watch · skreem · neuralens · rag',
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
        setTimeout(() => root.classList.remove('booting'), 380);
        try { sessionStorage.setItem('booted', '1'); } catch (e) {}
      };
  
      timer = setInterval(() => {
        if (i < lines.length) log.textContent += (i ? '\n' : '') + lines[i++];
        else finish();
      }, 380);
      addEventListener('keydown', finish);
      addEventListener('pointerdown', finish);
      setTimeout(finish, 3000); // safety net
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
  })();