document.addEventListener("DOMContentLoaded", function () {

  const logoArea = document.getElementById("logoArea");
  const staticLogo = document.getElementById("staticLogo");

  // Lista delle 4 animazioni possibili
  const logoAnimations = [
    "video/logo-anim1.mp4",
    "video/logo-anim2.mp4",
  ];

  logoArea.addEventListener("click", () => {
    
    // Torna alla sezione presentazione
    document.querySelectorAll(".section").forEach(s => s.classList.remove("is-active"));
    document.querySelector("#presentazione").classList.add("is-active");
    window.scrollTo(0, 0);

    // Scegli una animazione casuale
    const randomAnim = logoAnimations[Math.floor(Math.random() * logoAnimations.length)];

    // Nascondi logo statico
    staticLogo.style.opacity = "0";

    // Crea il video dell'animazione
    const animVideo = document.createElement("video");
    animVideo.src = randomAnim;
    animVideo.muted = true;
    animVideo.autoplay = true;
    animVideo.playsInline = true;
    animVideo.style.position = "absolute";
    animVideo.style.inset = "0";
    animVideo.style.width = "100%";
    animVideo.style.height = "100%";
    animVideo.style.objectFit = "contain";
    animVideo.style.pointerEvents = "none";

    // Inserisci animazione sopra al logo
    logoArea.style.position = "relative";
    logoArea.appendChild(animVideo);

    // Quando finisce → rimuovi animazione e torna logo statico
    animVideo.addEventListener("ended", () => {
      animVideo.remove();
      staticLogo.style.opacity = "1";
    });
  });
});




document.addEventListener("DOMContentLoaded", function () {

  const loader = document.getElementById("loader");
  const loaderVideo = document.getElementById("loaderVideo");

  if (!loader || !loaderVideo) return;

  let videoReady = false;
  let pageReady = false;

  // Se il video non parte, lo forziamo in autoplay in modo sicuro
  loaderVideo.muted = true;
  loaderVideo.play().catch(() => {
      // fallback mobile
      loaderVideo.setAttribute("playsinline", "");
      loaderVideo.muted = true;
      loaderVideo.play();
  });

  function hideLoader() {
    loader.classList.add("fade-out");
    setTimeout(() => loader.style.display = "none", 600);
  }

  // Quando il video finisce UNA volta
  loaderVideo.addEventListener("ended", () => {
    videoReady = true;
    if (pageReady) hideLoader();
  });

  // Quando la pagina è caricata
  window.addEventListener("load", () => {
    pageReady = true;

    // Se il video è già finito → chiudi
    if (videoReady) hideLoader();

    // Se il video è molto lungo → timeout di sicurezza
    setTimeout(() => {
      if (!videoReady) hideLoader();
    }, 3000);
  });
});


/* =============. SLIDESHOW HOVEr =============== */
document.querySelectorAll(".progetto-card").forEach(card => {
  const images = card.querySelectorAll("img");
  let current = 0;
  let interval;

  card.addEventListener("mouseenter", () => {
    interval = setInterval(() => {
      images[current].style.opacity = 0;
      current = (current + 1) % images.length;
      images[current].style.opacity = 1;
    }, 650);
  });

  card.addEventListener("mouseleave", () => {
    clearInterval(interval);
    images.forEach((img, i) => {
      img.style.opacity = i === 0 ? 1 : 0;
    });
    current = 0;
  });
});


/* =====================
   FILTRI + INDICATORE
===================== */
const filtroBtns = document.querySelectorAll(".filtro");
const cards = document.querySelectorAll(".progetto-card");
const indicator = document.querySelector(".filtri-indicator");

function moveIndicator(btn) {
  const rect = btn.getBoundingClientRect();
  const parentRect = btn.parentNode.parentNode.getBoundingClientRect();

  const left = rect.left - parentRect.left;

  indicator.style.transform = `translateY(-50%) translateX(${left}px)`;
  indicator.style.width = `${rect.width}px`;
}

filtroBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filtroBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    moveIndicator(btn);

    const filter = btn.dataset.filter;

    cards.forEach(card => {
      card.style.display =
        filter === "all" || card.dataset.category === filter
          ? "block"
          : "none";
    });
  });
});



/* ============================================
   NAVIGAZIONE + INDICATORE GOCCIA + TRANSIZIONE SEZIONI
============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const navList = document.querySelector("header nav ul");
  const navLinks = navList.querySelectorAll("a[href^='#']");
  const sections = document.querySelectorAll(".section");

  let currentSection = document.querySelector(".section.is-active");

  /* CREA INDICATORE GOCCIA */
  const indicator = document.createElement("div");
  indicator.className = "nav-indicator";
  navList.appendChild(indicator);

  function moveIndicator(target) {
    const navRect = navList.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const left = rect.left - navRect.left;
    const width = rect.width;

    indicator.style.opacity = "1";
    indicator.classList.remove("filling", "full");

    indicator.style.width = "10px";
    indicator.style.transform =
      `translateY(-50%) translateX(${left}px) scaleX(1.2)`;

    setTimeout(() => {
      indicator.classList.add("filling");
      indicator.style.width = `${width}px`;
      indicator.style.transform =
        `translateY(-50%) translateX(${left}px) scaleX(1.2)`;
    }, 20);

    setTimeout(() => {
      indicator.classList.remove("filling");
      indicator.classList.add("full");
      indicator.style.transform =
        `translateY(-50%) translateX(${left}px) scaleX(1)`;
    }, 320);
  }

  /* CLICK NAV — CAMBIO SEZIONE + INDICATORE */
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href");
    if (!id.startsWith("#")) return;

    e.preventDefault();

    const target = document.querySelector(id);
    if (!target || target === currentSection) return;

    /* aggiorna stato link */
    navLinks.forEach(l => l.classList.remove("is-active"));
    link.classList.add("is-active");

    /* muovi indicatore */
    moveIndicator(link);

    /* transizione elegante tipo Mouthwash */

    // 1. sezione in uscita
    // currentSection.classList.add("is-exiting");

    setTimeout(() => {
      currentSection.classList.remove("is-active");

      // 2. entra la nuova sezione
      sections.forEach(sec => sec.classList.remove("is-active"));
      target.classList.add("is-active");
      currentSection = target;

      // Gestione footer: aggiungi classe per pagine dettaglio
      if (target.classList.contains("progetto-dettaglio") ||
          target.classList.contains("team-dettaglio")) {
        document.body.classList.add("is-detail");
      } else {
        document.body.classList.remove("is-detail");
      }

      // 3. salta all'inizio senza animazione (no jitter)
      window.scrollTo({ top: 0, behavior: "instant" });

    }, 150); // metà della durata per una dissolvenza più morbida
  });
});

  /* SU AVVIO NON ATTIVARE NESSUN LINK */
    navLinks.forEach(l => l.classList.remove("is-active"));
    indicator.style.opacity = "0";
});




/* Toggle Abstract nelle pubblicazioni */
document.querySelectorAll('.abstract-toggle').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault(); // impedisce click sul link parent

    const content = btn.nextElementSibling;
    const isOpen = btn.classList.contains('active');

    // chiudi tutti gli altri abstract
    document.querySelectorAll('.abstract-toggle').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.abstract-content').forEach(c => c.style.display = 'none');

    if (!isOpen) {
      btn.classList.add('active');
      content.style.display = 'block';
    }
  });
});

/* Slide-down morphing per Abstract */
document.querySelectorAll('.abstract-toggle').forEach(btn => {

  btn.addEventListener('click', e => {
    e.preventDefault(); // evita click sul parent link

    const content = btn.nextElementSibling;
    const isOpen = content.classList.contains("open");

    // Chiudi tutti gli altri abstract
    document.querySelectorAll('.abstract-content').forEach(c => c.classList.remove("open"));
    document.querySelectorAll('.abstract-toggle').forEach(b => b.classList.remove("active"));

    // Se quello cliccato non era aperto → aprilo
    if (!isOpen) {
      btn.classList.add("active");
      content.classList.add("open");
    }
  });

});




/* =======. WORD HOVER HIGHLIGHT — VERSIONE FIX completa (funziona anche con <br>, <span>, e mantiene 1s acceso ============================= */

(function () {

  const SELECTORS = [
    ".presentazione-testo h1",
    ".progetti-sottotitolo",
    ".team-sottotitolo",
    ".pubblicazioni-sottotitolo",
    ".progetto-titolo-specifico",
    ".service-intro",
    ".partner-sottotitolo",
    ".facilities-intro",
  ];

  function wrapTextNodes(el) {
    el.childNodes.forEach(node => {
      if (node.nodeType === 3 && node.textContent.trim() !== "") {
        const words = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();

        words.forEach(w => {
          if (w.trim() === "") {
            frag.appendChild(document.createTextNode(w));
          } else {
            const span = document.createElement("span");
            span.className = "hover-word";
            span.textContent = w;
            frag.appendChild(span);
          }
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1) {
        wrapTextNodes(node);
      }
    });
  }

  // Wrappa tutte le parole
  SELECTORS.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => wrapTextNodes(el));
  });

  let lastTimeouts = new WeakMap();

  document.addEventListener("mousemove", (e) => {
    const words = document.querySelectorAll(".hover-word");

    let closest = null;
    let minDist = Infinity;

    words.forEach(span => {
      const rect = span.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - e.clientX;
      const dy = cy - e.clientY;
      const d2 = dx * dx + dy * dy;

      if (d2 < minDist) {
        minDist = d2;
        closest = span;
      }
    });

    if (!closest) return;

    // attiva highlight
    closest.classList.add("active-highlight");

    // reset timeout precedente
    if (lastTimeouts.has(closest)) {
      clearTimeout(lastTimeouts.get(closest));
    }

    // spegni dopo 1s
    const timeout = setTimeout(() => {
      closest.classList.remove("active-highlight");
    }, 1500);

    lastTimeouts.set(closest, timeout);
  });

})();



/* ======= APERTURA PROGETTI — TRANSIZIONE SEMPLICE E VELOCE ======= */

document.querySelectorAll(".progetto-card").forEach(card => {
  card.addEventListener("click", () => {

    const projectName = card.querySelector(".progetto-tag")?.textContent.trim().toLowerCase();
    if (!projectName) return;

    // Mapping from card tag → section ID
    const projectMap = {
      "aerial": "progetto-aerial",
      "inertial": "progetto-inertial",
      "biopic": "progetto-biopic",
      "materialxdesigni": "progetto-MaterialXdesignI",
      "materialxdesignii": "progetto-MaterialXdesignII",
      "materialxdesigniii": "progetto-MaterialXdesignIII",
      "materialxdesigniv": "progetto-MaterialXdesignIV"
    };

    const targetId = projectMap[projectName];
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    // 1. fade-out immediato della sezione attiva
    const currentSection = document.querySelector(".section.is-active");
    if (currentSection) {
      currentSection.style.opacity = "0";
      currentSection.style.transition = "opacity .25s ease-out";
      currentSection.classList.remove("is-active");
    }

    setTimeout(() => {
      // 2. chiudi tutto
      document.querySelectorAll(".section").forEach(s => s.classList.remove("is-active"));
      document.body.classList.remove("is-detail");
      
      // 3. mostra il progetto
      target.classList.add("is-active");
      document.body.classList.add("is-detail");
      target.style.opacity = "0";
      target.style.position = "relative";
      target.style.zIndex = "5";

      // 4. scroll top
      // window.scrollTo({ top: 0, behavior: "instant" });
      window.scrollTo(0,0);

      // 5. fade-in del progetto
      requestAnimationFrame(() => {
        target.style.transition = "opacity .35s ease-out";
        target.style.opacity = "1";
        setTimeout(() => {
          document.querySelectorAll(".section").forEach(sec => {
            sec.style.opacity = "";
            sec.style.transition = "";
            sec.style.position = "";
            sec.style.zIndex = "";
          });
        }, 400);
      });

    }, 250); // tempo del fade-out
  });
});






/* ======= APERTURA PROFILI TEAM — TRANSIZIONE COME I PROGETTI ======= */

document.querySelectorAll(".team-card").forEach(card => {
  card.addEventListener("click", () => {

    const member = card.dataset.member?.trim().toLowerCase();
    if (!member) return;

    const targetId = "team-" + member;
    const target = document.getElementById(targetId);
    if (!target) return;

    // 1. fade-out immediato della sezione attiva
    const currentSection = document.querySelector(".section.is-active");
    if (currentSection) {
      currentSection.style.opacity = "0";
      currentSection.style.transition = "opacity .25s ease-out";
      currentSection.classList.remove("is-active");
    }

    setTimeout(() => {
      // 2. chiudi tutto
      document.querySelectorAll(".section").forEach(s =>
        s.classList.remove("is-active")
      );
      document.body.classList.remove("is-detail");

      // 3. mostra la sezione del membro
      target.classList.add("is-active");
      document.body.classList.add("is-detail");
      target.style.opacity = "0";
      target.style.position = "relative";
      target.style.zIndex = "5";

      // 4. scroll top immediato
      // window.scrollTo({ top: 0, behavior: "instant" });
      window.scrollTo(0,0);

      // 5. fade-in elegante
      requestAnimationFrame(() => {
        target.style.transition = "opacity .35s ease-out";
        target.style.opacity = "1";

        setTimeout(() => {
          // reset stile
          document.querySelectorAll(".section").forEach(sec => {
            sec.style.opacity = "";
            sec.style.transition = "";
            sec.style.position = "";
            sec.style.zIndex = "";
          });
        }, 400);
      });

    }, 250); // tempo del fade-out
  });
});





/* =========== SLIDESHOW PREVIEW-BOX =================== */

const previewBox = document.querySelector(".preview-box");
const slides = previewBox?.querySelectorAll(".preview-slide");
let previewIndex = 0;
let previewInterval = null;

// Funzione per cambiare immagine
function startPreviewSlideshow() {
  if (!slides) return;

  if (previewInterval !== null) return; // evita doppi timer

  previewInterval = setInterval(() => {
    slides[previewIndex].classList.remove("active");
    previewIndex = (previewIndex + 1) % slides.length;
    slides[previewIndex].classList.add("active");
  }, 1600); // cambio ogni 1.6s
}

function stopPreviewSlideshow() {
  clearInterval(previewInterval);
  previewInterval = null;
}

// Intersection Observer ➜ parte solo quando appare a schermo
const previewObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startPreviewSlideshow();
    } else {
      stopPreviewSlideshow();
    }
  });
}, { threshold: 0.5 });

// Attiva il controllo SOLO se esiste la preview
if (previewBox) previewObserver.observe(previewBox);



/* ==============  AUTO-SCROLL FACILITIES SLIDER ===================== */

function initFacilitySliders() {
  const sliders = document.querySelectorAll(".facility-slider");

  sliders.forEach(slider => {
    const images = slider.querySelectorAll("img");
    let index = 0;

    setInterval(() => {
      index = (index + 1) % images.length;
      slider.style.transform = `translateX(-${index * 100}%)`;
    }, 4000); // cambia ogni 4 secondi
  });
}

document.addEventListener("DOMContentLoaded", initFacilitySliders);




/* ===============OBJECTIVES CAROUSEL====================== */

function initObjectivesSlider() {
  const track = document.querySelector('.obiettivi-track');
  const prevBtn = document.querySelector('.obiettivi-arrow.prev');
  const nextBtn = document.querySelector('.obiettivi-arrow.next');
  if (!track || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.querySelectorAll('.obiettivo-slide'));
  const total = slides.length;
  let index = 0;
  let autoTimer = null;

  function goTo(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function startAuto() {
    autoTimer = setInterval(next, 6000); // cambia ogni 6s
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }

  // Eventi frecce
  nextBtn.addEventListener('click', () => {
    next();
    resetAuto();
  });

  prevBtn.addEventListener('click', () => {
    prev();
    resetAuto();
  });

  // Pausa autoplay quando il mouse è sopra la sezione
  const section = document.querySelector('.obiettivi-section');
  if (section) {
    section.addEventListener('mouseenter', stopAuto);
    section.addEventListener('mouseleave', resetAuto);
  }

  // Init
  goTo(0);
  startAuto();
}

document.addEventListener('DOMContentLoaded', initObjectivesSlider);