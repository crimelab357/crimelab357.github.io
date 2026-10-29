(() => {
  const root = document.documentElement;

  // Year in the footer.
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Hairline under the bar once the page scrolls.
  const bar = document.querySelector(".bar");
  const onScroll = () => bar && bar.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Desktop and iPhone visitors get a short note: the APK only installs on Android.
  const ua = navigator.userAgent || "";
  if (!/Android/i.test(ua)) {
    const note = document.getElementById("device-note");
    if (note) note.hidden = false;
  }

  // Copy the checksum.
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = document.querySelector(btn.getAttribute("data-copy"));
      if (!target) return;
      const text = target.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(target);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand("copy");
        sel.removeAllRanges();
      }
      btn.textContent = "Copied";
      btn.classList.add("done");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("done");
      }, 1600);
    });
  });

  // Gentle reveal as sections enter the screen.
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );
  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 5) * 60}ms`;
    io.observe(el);
  });
  root.classList.remove("no-js");

  // Safety net: anything already on screen at load is shown even if the observer never fires.
  window.addEventListener("load", () => {
    setTimeout(() => {
      items.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
      });
    }, 900);
  });
})();
