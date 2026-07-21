const weddingAudio = document.getElementById("wedding-audio");
const musicToggle = document.getElementById("music-toggle");
const gateIntro = document.getElementById("gate-intro");
const gateEnter = document.getElementById("gate-enter");
let gateHasOpened = false;
let openingStarted = false;
let audioPrimed = false;
let musicFadingStarted = false;

function syncMusicButton() {
  if (!weddingAudio || !musicToggle) return;
  musicToggle.hidden = false;
  musicToggle.classList.toggle("is-playing", !weddingAudio.paused && !weddingAudio.muted);
  musicToggle.setAttribute("aria-label", weddingAudio.paused || weddingAudio.muted ? "Play wedding music" : "Pause wedding music");
}

async function primeWeddingMusic() {
  if (!weddingAudio || audioPrimed) return false;
  weddingAudio.volume = 0;
  weddingAudio.muted = true;
  try {
    await weddingAudio.play();
    audioPrimed = true;
    return true;
  } catch {
    return false;
  }
}

function fadeWeddingMusicIn() {
  if (!weddingAudio) return;
  musicFadingStarted = true;
  weddingAudio.muted = false;
  weddingAudio.volume = 0;
  const targetVolume = 0.6;
  const startedAt = performance.now();

  function step(now) {
    const progress = Math.min((now - startedAt) / 1400, 1);
    weddingAudio.volume = targetVolume * progress;
    if (progress < 1 && !weddingAudio.paused) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
  syncMusicButton();
}

async function playWeddingMusic() {
  if (!weddingAudio) return false;
  try {
    musicFadingStarted = true;
    weddingAudio.muted = false;
    weddingAudio.volume = 0.6;
    await weddingAudio.play();
    syncMusicButton();
    return true;
  } catch {
    syncMusicButton();
    return false;
  }
}

function handleGateOpened() {
  gateHasOpened = true;
  if (musicFadingStarted) return;
  if (audioPrimed && weddingAudio && !weddingAudio.paused) {
    fadeWeddingMusicIn();
  } else {
    playWeddingMusic();
  }
}

async function startGateExperience() {
  if (openingStarted) return;
  openingStarted = true;
  await primeWeddingMusic();
  document.body.classList.remove("gate-waiting");
  document.body.classList.add("gate-playing");

  // Smoothly fade the music in exactly as the doors start to swing open
  setTimeout(() => {
    if (!musicFadingStarted) {
      fadeWeddingMusicIn();
    }
  }, 400);
}

if (gateEnter) {
  gateEnter.addEventListener("click", startGateExperience);
}

if (gateIntro) {
  gateIntro.addEventListener("click", startGateExperience);
}

if (musicToggle && weddingAudio) {
  musicToggle.addEventListener("click", async () => {
    if (weddingAudio.paused || weddingAudio.muted) {
      await playWeddingMusic();
    } else {
      weddingAudio.pause();
      syncMusicButton();
    }
  });
}

if (gateIntro) {
  gateIntro.addEventListener("animationend", event => {
    if (event.animationName === "introVeil") {
      gateIntro.remove();
      document.body.classList.remove("gate-playing", "gate-waiting");
      document.body.classList.add("gate-complete");
      handleGateOpened();
    }
  });
} else {
  gateHasOpened = true;
  syncMusicButton();
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && gateEnter) {
  gateEnter.textContent = "Open Invitation & Music";
}

// Tap/click anywhere on landing page to scroll down
const heroSection = document.getElementById("home");
if (heroSection) {
  heroSection.addEventListener("click", event => {
    if (gateHasOpened && window.scrollY < 50) {
      if (event.target.closest("a, button")) return;
      const target = document.getElementById("countdown");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}
const events = {
  wedding: {
    title: "Sai Surya and HimaBindu Wedding Ceremony",
    start: "2026-08-22T23:57:00+05:30",
    end: "2026-08-23T02:00:00+05:30",
    googleStart: "20260822T182700Z",
    googleEnd: "20260822T203000Z",
    outlookStart: "2026-08-22T18:27:00Z",
    outlookEnd: "2026-08-22T20:30:00Z",
    location: "SR Residency, Annavaram Town Rd, Opp. NAYARA Petrol Bunk",
    map: "https://maps.app.goo.gl/HZ6tkvycLSos47z57",
    details: "Please grace the sacred wedding ceremony with your blessings and presence."
  },
  reception: {
    title: "Sai Surya and HimaBindu Reception",
    start: "2026-08-25T19:00:00+05:30",
    end: "2026-08-25T22:00:00+05:30",
    googleStart: "20260825T133000Z",
    googleEnd: "20260825T163000Z",
    outlookStart: "2026-08-25T13:30:00Z",
    outlookEnd: "2026-08-25T16:30:00Z",
    location: "Varam Residency, Day & Night Area, Srikakulam, Andhra Pradesh",
    map: "https://maps.app.goo.gl/3S2mMN5ranULFRQRA",
    details: "Join us for an evening reception celebrating Sai Surya and HimaBindu."
  }
};

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach(element => {
  const group = element.parentElement ? Array.from(element.parentElement.children).indexOf(element) : 0;
  element.style.transitionDelay = `${Math.max(group, 0) * 70}ms`;
  revealObserver.observe(element);
});

const heroBg = document.querySelector(".hero-bg");
let ticking = false;

function updateHeroParallax() {
  const offset = Math.min(window.scrollY * 0.1, 78);
  heroBg.style.transform = `translate3d(0, ${offset}px, 0) scale(1.055)`;
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(updateHeroParallax);
      ticking = true;
    }
  },
  { passive: true }
);

function updateCountdown() {
  const target = new Date(events.wedding.start).getTime();
  const now = Date.now();
  const distance = Math.max(target - now, 0);
  const units = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000)
  };

  Object.entries(units).forEach(([unit, value]) => {
    const node = document.querySelector(`[data-unit="${unit}"]`);
    node.textContent = unit === "days" ? String(value).padStart(3, "0") : String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

function makeCalendarUrl(eventKey, provider) {
  const event = events[eventKey];
  const text = encodeURIComponent(event.title);
  const details = encodeURIComponent(`${event.details}\n\nLocation: ${event.location}\nMap: ${event.map}`);
  const location = encodeURIComponent(event.location);

  if (provider === "google") {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${event.googleStart}/${event.googleEnd}&details=${details}&location=${location}&ctz=Asia/Kolkata`;
  }

  if (provider === "outlook") {
    return `https://outlook.live.com/calendar/0/action/compose?subject=${text}&startdt=${event.outlookStart}&enddt=${event.outlookEnd}&body=${details}&location=${location}`;
  }

  return null;
}

function downloadIcs(eventKey) {
  const event = events[eventKey];
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sai Surya HimaBindu Wedding//Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${eventKey}-${Date.now()}@saisurya-himabindu`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${event.googleStart}`,
    `DTEND:${event.googleEnd}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.details}\\n\\nMap: ${event.map}`,
    `LOCATION:${event.location}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${eventKey}-sai-surya-himabindu.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

const calendarMenu = document.getElementById("calendar-menu");
let selectedEvent = "wedding";

document.querySelectorAll(".calendar-btn").forEach(button => {
  button.addEventListener("click", event => {
    selectedEvent = button.dataset.event;
    const rect = button.getBoundingClientRect();
    calendarMenu.style.left = `${Math.min(rect.left, window.innerWidth - 220)}px`;
    calendarMenu.style.top = `${rect.bottom + 10}px`;
    calendarMenu.hidden = false;
    event.stopPropagation();
  });
});

calendarMenu.addEventListener("click", event => {
  const provider = event.target.dataset.provider;
  if (!provider) return;
  calendarMenu.hidden = true;
  if (provider === "apple") {
    downloadIcs(selectedEvent);
    return;
  }
  window.open(makeCalendarUrl(selectedEvent, provider), "_blank", "noopener,noreferrer");
});

document.addEventListener("click", () => {
  calendarMenu.hidden = true;
});

function createAmbient() {
  const petalField = document.getElementById("petal-field");
  const particleField = document.getElementById("particle-field");

  for (let i = 0; i < 20; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.setProperty("--x", `${Math.random() * 100}vw`);
    petal.style.setProperty("--drift", `${(Math.random() - 0.5) * 34}vw`);
    petal.style.animationDuration = `${16 + Math.random() * 14}s`;
    petal.style.animationDelay = `${Math.random() * -24}s`;
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    petalField.appendChild(petal);
  }

  for (let i = 0; i < 28; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.setProperty("--x", `${Math.random() * 100}vw`);
    particle.style.setProperty("--drift", `${(Math.random() - 0.5) * 18}vw`);
    particle.style.animationDuration = `${20 + Math.random() * 18}s`;
    particle.style.animationDelay = `${Math.random() * -30}s`;
    particleField.appendChild(particle);
  }
}

createAmbient();

// Stagger reveal animations for place cards
document.querySelectorAll(".place-card").forEach((card, i) => {
  card.style.transitionDelay = `${i * 120}ms`;
});
