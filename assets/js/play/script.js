(() => {
  const opening = document.querySelector("#opening");
  const title = document.querySelector("#titleCard");
  const profiles = document.querySelector("#profilesScreen");
  const series = document.querySelector("#series");

  const playButton = document.querySelector("#playButton");
  const replayButton = document.querySelector("#replayButton");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const transitionDuration = reduceMotion ? 0 : 700;

  let openingTimer;
  let revealObserver;
  let activeTransition = false;

  document.querySelector("#year").textContent =
    new Date().getFullYear();

  // ---------------------------------------------------------
  // SCREEN HELPERS
  // ---------------------------------------------------------

  function animateScreenIn(screen, animationClass = "screen-enter") {
    screen.hidden = false;

    // Force the browser to register the initial state.
    screen.classList.remove(animationClass);
    void screen.offsetWidth;

    if (!reduceMotion) {
      screen.classList.add(animationClass);

      screen.addEventListener(
        "animationend",
        () => screen.classList.remove(animationClass),
        { once: true }
      );
    }
  }

  function transitionScreens(currentScreen, nextScreen, callback) {
    if (activeTransition) return;

    activeTransition = true;

    if (reduceMotion) {
      currentScreen.hidden = true;
      nextScreen.hidden = false;

      if (callback) callback();

      activeTransition = false;
      return;
    }

    currentScreen.classList.add("screen-exit");

    window.setTimeout(() => {
      currentScreen.hidden = true;
      currentScreen.classList.remove("screen-exit");

      nextScreen.hidden = false;

      // Start the destination screen from its animated initial state.
      nextScreen.classList.remove("screen-enter");
      void nextScreen.offsetWidth;
      nextScreen.classList.add("screen-enter");

      if (callback) callback();

      window.setTimeout(() => {
        nextScreen.classList.remove("screen-enter");
        activeTransition = false;
      }, 1050);
    }, transitionDuration);
  }

  // ---------------------------------------------------------
  // OPENING → TITLE SCREEN
  // ---------------------------------------------------------

  function revealTitle() {
    clearTimeout(openingTimer);

    opening.classList.add("exit");

    window.setTimeout(() => {
      opening.hidden = true;
      title.hidden = false;

      title.classList.remove("screen-enter");
      void title.offsetWidth;

      if (!reduceMotion) {
        title.classList.add("screen-enter");
      }

      document.body.classList.remove("locked");
    }, reduceMotion ? 0 : 650);
  }

  openingTimer = window.setTimeout(
    revealTitle,
    reduceMotion ? 0 : 3000
  );

  // ---------------------------------------------------------
  // TITLE SCREEN → PROFILES
  // ---------------------------------------------------------

  playButton.addEventListener("click", () => {
    transitionScreens(title, profiles, () => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  });

  // ---------------------------------------------------------
  // SCROLL REVEAL SYSTEM
  // ---------------------------------------------------------

  function setupScrollReveals() {
    if (revealObserver) {
      revealObserver.disconnect();
    }

    const revealElements = series.querySelectorAll(
      ".section-heading, " +
      ".episode, " +
      ".experience-card, " +
      ".skill-card, " +
      ".project-card, " +
      ".archive-card, " +
      ".education-card, " +
      ".finale > *"
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => {
        element.classList.add("reveal-visible");
      });

      return;
    }

    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px"
      }
    );

    revealElements.forEach((element) => {
      element.classList.remove("reveal-visible");
      revealObserver.observe(element);
    });
  }

  // ---------------------------------------------------------
  // HERO ENTRANCE
  // ---------------------------------------------------------

  function animateHero() {
    const hero = document.querySelector("#home");

    hero.classList.remove("hero-visible");
    void hero.offsetWidth;

    requestAnimationFrame(() => {
      hero.classList.add("hero-visible");
    });
  }

  // ---------------------------------------------------------
  // ENTER PORTFOLIO
  // ---------------------------------------------------------

  function enterPortfolio(profile) {
    series.dataset.profile = profile;

    const targetSelector =
      profile === "recruiter"
        ? "#experience"
        : profile === "developer"
          ? "#projects"
          : profile === "creative"
            ? "#earlier"
            : "#home";

    transitionScreens(profiles, series, () => {
      window.scrollTo({ top: 0, behavior: "auto" });

      // Set up the reveal observer after the portfolio is visible.
      setupScrollReveals();
      animateHero();

      // Allow the initial entrance to finish before scrolling.
      if (profile !== "all") {
        window.setTimeout(() => {
          document.querySelector(targetSelector)?.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start"
          });
        }, reduceMotion ? 0 : 1100);
      }
    });
  }

  document.querySelectorAll("[data-profile]").forEach((button) => {
    button.addEventListener("click", () => {
      enterPortfolio(button.dataset.profile);
    });
  });

  // ---------------------------------------------------------
  // PROJECT CAROUSEL
  // ---------------------------------------------------------

  document.querySelectorAll(".arrow").forEach((button) => {
    button.addEventListener("click", () => {
      const projectRow = document.querySelector("#projectRow");

      const direction = button.classList.contains("next") ? 1 : -1;

      projectRow.scrollBy({
        left: direction * projectRow.clientWidth * 0.78,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  });

  // Episodes carousel arrow navigation
  document.querySelectorAll(".episodes-carousel").forEach((carousel) => {
    const track = carousel.querySelector(".episodes");
    const prev = carousel.querySelector(".arrow.prev");
    const next = carousel.querySelector(".arrow.next");

    if (!track || !prev || !next) return;

    const scrollAmount = () => {
      const card = track.querySelector(".episode");
      if (!card) return card;

      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap) || 0;

      return card.getBoundingClientRect().width + gap;
    };

    prev.addEventListener("click", () => {
      track.scrollBy({
        left: -scrollAmount(),
        behavior: "smooth",
      });
    });

    next.addEventListener("click", () => {
      track.scrollBy({
        left: scrollAmount(),
        behavior: "smooth",
      });
    });
  });

  // ---------------------------------------------------------
  // REPLAY
  // ---------------------------------------------------------

  replayButton.addEventListener("click", () => {
    clearTimeout(openingTimer);

    if (revealObserver) {
      revealObserver.disconnect();
    }

    activeTransition = false;

    series.hidden = true;
    profiles.hidden = true;
    title.hidden = true;

    opening.hidden = false;
    opening.classList.remove("exit");

    document.body.classList.add("locked");

    window.scrollTo({ top: 0, behavior: "auto" });

    // Restart the opening animations.
    opening
      .querySelectorAll("h1, .kicker, .opening-foot, .progress span")
      .forEach((element) => {
        element.style.animation = "none";
        void element.offsetWidth;
        element.style.animation = "";
      });

    openingTimer = window.setTimeout(
      revealTitle,
      reduceMotion ? 0 : 3000
    );
  });
})();
