// ---- Boot sequence ----
(() => {
  const root = document.documentElement;
  const boot = document.getElementById("boot");

  if (!root.classList.contains("booting") || !boot) return;

  const log = document.getElementById("boot-log");

  const lines = [
    "> initialising portfolio…",
    "> mounting profile modules…",
    "> loading interface systems…",
    "> synchronising project telemetry…",
    "> system online!"
  ];

  let i = 0;
  let done = false;

  const finish = () => {
    if (done) return;

    done = true;
    clearInterval(timer);

    boot.classList.add("is-done");

    setTimeout(() => {
      root.classList.remove("booting");
    }, 500);
  };

  const timer = setInterval(() => {
    if (i < lines.length) {
      log.textContent += (i ? "\n" : "") + lines[i];

      i++;

      // Automatically enter portfolio after final message
      if (i === lines.length) {
        setTimeout(finish, 700);
      }
    }
  }, 350);
})();
