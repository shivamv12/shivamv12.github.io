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


// ---- Boot sequence ----
(() => {
  const root = document.documentElement;
  const boot = document.getElementById("boot");
  if (!root.classList.contains("booting") || !boot) return;

  const log = document.getElementById("boot-log");
  const lines = [
    "> initialising portfolio…",
    "> mounting modules: horse-watch · skreem · neuralens · rag",
    "> loading interface systems…",
    "> synchronising project telemetry…",
    "> system online"
  ];

  let i = 0;
  let done = false;
  let bootReady = false;
  let speechStarted = false;
  let timer;

  const finish = () => {
    if (done) return;

    done = true;
    clearInterval(timer);

    removeEventListener("keydown", handleBootInteraction);
    removeEventListener("pointerdown", handleBootInteraction);

    boot.classList.add("is-done");

    setTimeout(() => {
      root.classList.remove("booting");
    }, 500);
  };

  const handleBootInteraction = () => {
    // Don't allow interaction to skip the boot before
    // the system has reached the ONLINE state.
    if (!bootReady || speechStarted) return;

    speechStarted = true;

    speakSystemMessage();

    finish();
  };

  timer = setInterval(() => {
    if (i < lines.length) {
      log.textContent += (i ? "\n" : "") + lines[i];

      // Boot is now ready for real user interaction
      if (i === lines.length - 1) {
        bootReady = true;
        boot.classList.add("is-ready");
      }

      i++;
    } else {
      clearInterval(timer);

      // Keep the boot screen waiting for the user's
      // real interaction instead of automatically closing.
    }
  }, 600);

  // Real user gestures — required by browser autoplay policy
  addEventListener("keydown", handleBootInteraction);
  addEventListener("pointerdown", handleBootInteraction);

})();
