/**
 * MUSHK CAFÉ — LUXURY CINEMATIC INTERACTIVE ENGINE
 * Old Delhi Heritage × Rooftop Night Experience
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================================
     1. PRELOADER
     ======================================================================== */
  const preloader = document.getElementById("preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("fade-out");
      }, 700);
    });

    // Fallback safety timeout if window load took too long
    setTimeout(() => {
      if (!preloader.classList.contains("fade-out")) {
        preloader.classList.add("fade-out");
      }
    }, 1200);
  }

  /* ========================================================================
     2. STICKY NAVIGATION & ACTIVE SCROLL MONITOR
     ======================================================================== */
  const siteHeader = document.getElementById("siteHeader");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header transition on scroll
    if (scrollY > 50) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }

    // Active link highlighting
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });

    // Parallax on View section
    const viewParallaxBg = document.getElementById("viewParallaxBg");
    if (viewParallaxBg) {
      const viewSection = document.getElementById("view");
      const rect = viewSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.12;
        viewParallaxBg.style.transform = `translateY(${offset - 40}px)`;
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ========================================================================
     3. MOBILE NAVIGATION DRAWER
     ======================================================================== */
  const mobileNavToggle = document.getElementById("mobileNavToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (mobileNavToggle && mobileDrawer) {
    const toggleMobileMenu = () => {
      const isOpen = mobileDrawer.classList.toggle("open");
      mobileNavToggle.classList.toggle("open");
      mobileDrawer.setAttribute("aria-hidden", !isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    mobileNavToggle.addEventListener("click", toggleMobileMenu);

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileDrawer.classList.contains("open")) {
          toggleMobileMenu();
        }
      });
    });
  }

  /* ========================================================================
     4. AMBIENT AUDIO ENGINE (Web Audio API Synthesizer)
     Warm harmonic night drone with subtle sitar-like acoustic resonance
     ======================================================================== */
  const audioToggle = document.getElementById("audioToggle");
  const audioLabel = document.getElementById("audioLabel");
  let audioCtx = null;
  let masterGain = null;
  let isAudioPlaying = false;
  let audioNodes = [];

  const initAmbientAudio = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioCtx = new AudioContext();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Warm Tanpura/Sitar Drone Harmonics (A 110Hz, E 165Hz, A 220Hz, C# 277Hz)
    const frequencies = [110.0, 164.81, 220.0, 277.18];
    const gains = [0.035, 0.025, 0.018, 0.012];

    frequencies.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Warm low-pass acoustic filtering
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(420 + idx * 80, audioCtx.currentTime);

      // Subtle LFO shimmer
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.12 + idx * 0.05, audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(15, audioCtx.currentTime);
      lfo.connect(filter.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime(gains[idx], audioCtx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start();
      audioNodes.push(osc, oscGain, filter, lfo, lfoGain);
    });

    // Rooftop Night Breeze generator (Filtered Pinkish Noise)
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.015;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const breezeFilter = audioCtx.createBiquadFilter();
    breezeFilter.type = "bandpass";
    breezeFilter.frequency.setValueAtTime(280, audioCtx.currentTime);
    breezeFilter.Q.setValueAtTime(0.7, audioCtx.currentTime);

    const breezeGain = audioCtx.createGain();
    breezeGain.gain.setValueAtTime(0.015, audioCtx.currentTime);

    whiteNoise.connect(breezeFilter);
    breezeFilter.connect(breezeGain);
    breezeGain.connect(masterGain);
    whiteNoise.start();

    audioNodes.push(whiteNoise, breezeFilter, breezeGain);
  };

  if (audioToggle) {
    audioToggle.addEventListener("click", () => {
      if (!audioCtx) {
        initAmbientAudio();
      }

      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      if (!isAudioPlaying) {
        // Fade in
        masterGain.gain.linearRampToValueAtTime(0.85, audioCtx.currentTime + 1.2);
        isAudioPlaying = true;
        audioToggle.classList.add("playing");
        audioLabel.textContent = "Sound On";
      } else {
        // Fade out
        masterGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        isAudioPlaying = false;
        audioToggle.classList.remove("playing");
        audioLabel.textContent = "Ambience";
      }
    });
  }

  /* ========================================================================
     5. CUISINE TABS & DISH FILTERING
     ======================================================================== */
  const cuisineTabs = document.querySelectorAll(".cuisine-tab");
  const dishCards = document.querySelectorAll(".dish-story-card");

  cuisineTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      cuisineTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.getAttribute("data-category");

      dishCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (category === "all" || cardCategory === category) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 30);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(10px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 250);
        }
      });
    });
  });

  /* ========================================================================
     6. GALLERY FILTERING & LIGHTBOX
     ======================================================================== */
  const galleryFilterBtns = document.querySelectorAll(".gallery-filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      galleryFilterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      galleryItems.forEach((item) => {
        const itemCat = item.getAttribute("data-category");
        if (filter === "all" || itemCat === filter) {
          item.style.display = "block";
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          }, 30);
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.96)";
          setTimeout(() => {
            item.style.display = "none";
          }, 250);
        }
      });
    });
  });

  // Lightbox Modal
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeLightboxModal = document.getElementById("closeLightboxModal");

  const openLightbox = (src, caption) => {
    if (!lightboxModal) return;
    lightboxImage.src = src;
    lightboxCaption.textContent = caption || "";
    lightboxModal.classList.add("open");
    lightboxModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("open");
    lightboxModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      lightboxImage.src = "";
      lightboxCaption.textContent = "";
    }, 300);
  };

  document.querySelectorAll("[data-lightbox]").forEach((el) => {
    el.addEventListener("click", () => {
      const src = el.getAttribute("data-lightbox");
      const caption = el.getAttribute("data-caption");
      openLightbox(src, caption);
    });
  });

  if (closeLightboxModal) {
    closeLightboxModal.addEventListener("click", closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }


  /* ========================================================================
     8. TASTING MENU SLIDEOUT DRAWER
     ======================================================================== */
  const menuDrawer = document.getElementById("menuDrawer");
  const openMenuDrawerBtn = document.getElementById("openMenuDrawerBtn");
  const viewFullMenuBtn = document.getElementById("viewFullMenuBtn");
  const closeMenuDrawer = document.getElementById("closeMenuDrawer");

  const openDrawer = () => {
    if (!menuDrawer) return;
    menuDrawer.classList.add("open");
    menuDrawer.setAttribute("aria-hidden", "false");
  };

  const closeDrawer = () => {
    if (!menuDrawer) return;
    menuDrawer.classList.remove("open");
    menuDrawer.setAttribute("aria-hidden", "true");
  };

  if (openMenuDrawerBtn) openMenuDrawerBtn.addEventListener("click", openDrawer);
  if (viewFullMenuBtn) viewFullMenuBtn.addEventListener("click", openDrawer);
  if (closeMenuDrawer) closeMenuDrawer.addEventListener("click", closeDrawer);

  document.addEventListener("click", (e) => {
    if (
      menuDrawer &&
      menuDrawer.classList.contains("open") &&
      !menuDrawer.contains(e.target) &&
      e.target !== openMenuDrawerBtn &&
      e.target !== viewFullMenuBtn
    ) {
      closeDrawer();
    }
  });

  /* ========================================================================
     9. TABLE RESERVATION MODAL & FORM
     ======================================================================== */
  const reservationModal = document.getElementById("reservationModal");
  const closeReserveModal = document.getElementById("closeReserveModal");
  const reservationForm = document.getElementById("reservationForm");
  const resDateInput = document.getElementById("resDate");

  // Set default minimum date to today
  if (resDateInput) {
    const today = new Date().toISOString().split("T")[0];
    resDateInput.min = today;
    resDateInput.value = today;
  }

  const openReserveModal = () => {
    if (!reservationModal) return;
    reservationModal.classList.add("open");
    reservationModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeReserveModalFunc = () => {
    if (!reservationModal) return;
    reservationModal.classList.remove("open");
    reservationModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  // Bind Reserve buttons
  const reserveTriggers = [
    "navReserveBtn",
    "heroReserveBtn",
    "expReserveBtn",
    "storyReserveBtn",
    "visitReserveBtn",
    "mobileReserveBtn",
  ];

  reserveTriggers.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", openReserveModal);
  });

  if (closeReserveModal) closeReserveModal.addEventListener("click", closeReserveModalFunc);
  if (reservationModal) {
    reservationModal.addEventListener("click", (e) => {
      if (e.target === reservationModal) closeReserveModalFunc();
    });
  }

  // Reservation Form Submission
  if (reservationForm) {
    reservationForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("resName").value;
      const phone = document.getElementById("resPhone").value;
      const date = document.getElementById("resDate").value;
      const time = document.getElementById("resTime").options[document.getElementById("resTime").selectedIndex].text;
      const guests = document.getElementById("resGuests").value;
      const seating = document.getElementById("resSeating").options[document.getElementById("resSeating").selectedIndex].text;

      const bookingRef = "MSHK-" + Math.floor(1000 + Math.random() * 9000);

      // Render confirmation state
      const modalDialog = reservationModal.querySelector(".modal-dialog");
      modalDialog.innerHTML = `
        <button class="modal-close-btn" id="closeConfirmationBtn" aria-label="Close">✕</button>
        <div style="text-align: center; padding: 1.5rem 0;">
          <div style="font-family: var(--font-arabic); font-size: 2.5rem; color: var(--gold-antique); margin-bottom: 0.5rem;">مشک</div>
          <span class="section-label" style="color: var(--gold-soft);">Booking Request Received</span>
          <h3 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-ivory); margin: 0.8rem 0;">See You Under the Sky, ${name}</h3>
          <p style="font-size: 0.92rem; color: var(--text-cream); line-height: 1.7; max-width: 480px; margin: 0 auto 1.8rem;">
            Your rooftop table reservation reference is <strong style="color: var(--gold-soft);">${bookingRef}</strong> for <strong>${guests} guests</strong> on <strong>${date}</strong> (${time}).
          </p>

          <div style="background: rgba(9, 7, 6, 0.7); border: 1px solid var(--gold-border); border-radius: 2px; padding: 1.25rem; max-width: 420px; margin: 0 auto 2rem; text-align: left;">
            <div style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--gold-antique); margin-bottom: 0.3rem;">Seating Allocation</div>
            <div style="font-size: 0.9rem; color: var(--text-ivory);">${seating}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.5rem;">Our host will confirm your rooftop table directly via WhatsApp at ${phone}.</div>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="https://wa.me/919800051110?text=Hello%20Mushk%20Cafe,%20I%20have%20submitted%20reservation%20request%20${bookingRef}%20for%20${name}." target="_blank" rel="noopener" class="btn-gold">
              Message on WhatsApp
            </a>
            <button class="btn-outline-gold" id="doneConfirmationBtn">
              Return to Website
            </button>
          </div>
        </div>
      `;

      document.getElementById("closeConfirmationBtn")?.addEventListener("click", closeReserveModalFunc);
      document.getElementById("doneConfirmationBtn")?.addEventListener("click", closeReserveModalFunc);
    });
  }

  /* ========================================================================
     10. GLOBAL ESCAPE KEY LISTENER
     ======================================================================== */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      closeReserveModalFunc();
      closeDrawer();
    }
  });

  /* ========================================================================
     11. INTERACTIVE DARK MAP (Leaflet.js)
     ======================================================================== */
  const initMap = () => {
    const mapElement = document.getElementById("mushk-map");
    if (!mapElement || typeof L === "undefined") return;

    // Coordinates: Urdu Bazar Road / Jama Masjid, Old Delhi
    const mushkCoords = [28.6507, 77.2334];
    const jamaMasjidCoords = [28.6507, 77.2334];

    const map = L.map("mushk-map", {
      center: [28.6508, 77.2345],
      zoom: 16,
      zoomControl: false,
      scrollWheelZoom: false,
    });

    // Dark CartoDB basemap tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Zoom control in bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Custom Antique Gold SVG Marker Icon for Mushk
    const goldIcon = L.divIcon({
      className: "custom-gold-marker",
      html: `
        <div style="position: relative; transform: translate(-50%, -100%);">
          <div style="width: 32px; height: 32px; border-radius: 50% 50% 50% 0; background: linear-gradient(135deg, #d6b56d, #b8893d); transform: rotate(-45deg); box-shadow: 0 4px 15px rgba(214, 181, 109, 0.5); display: flex; align-items: center; justify-content: center; border: 2px solid #f2e7d0;">
            <span style="transform: rotate(45deg); font-size: 14px; line-height: 1;">✦</span>
          </div>
          <div style="position: absolute; bottom: -8px; left: 8px; width: 16px; height: 4px; background: rgba(0,0,0,0.5); border-radius: 50%; filter: blur(2px);"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -34],
    });

    // Custom Marker for Jama Masjid
    const heritageIcon = L.divIcon({
      className: "custom-heritage-marker",
      html: `
        <div style="position: relative; transform: translate(-50%, -100%);">
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #24140d; border: 2px solid #b8893d; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #d6b56d; box-shadow: 0 4px 12px rgba(0,0,0,0.8);">
            🕌
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -30],
    });

    // Add Mushk Marker with rich popup
    const marker = L.marker([28.6504, 77.2348], { icon: goldIcon }).addTo(map);
    marker.bindPopup(`
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 0.25rem;">
        <span style="font-family: 'Amiri', serif; font-size: 1.2rem; color: #b8893d; display: block; line-height: 1;">مشک</span>
        <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 600; color: #f2e7d0; margin: 0.2rem 0;">MUSHK CAFÉ</h4>
        <p style="font-size: 0.78rem; color: #e2d4bc; margin-bottom: 0.6rem; line-height: 1.4;">
          4179, Urdu Bazar Road · Rooftop<br>Opposite Gate No. 1, Jama Masjid
        </p>
        <a href="https://maps.google.com/?q=Mushk+Cafe+Urdu+Bazar+Old+Delhi+Jama+Masjid" target="_blank" rel="noopener" style="display: inline-block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: #d6b56d; font-weight: 600; text-decoration: underline;">
          Open in Google Maps →
        </a>
      </div>
    `).openPopup();

    // Add Jama Masjid Landmark Marker
    const jamaMarker = L.marker([28.6507, 77.2334], { icon: heritageIcon }).addTo(map);
    jamaMarker.bindPopup(`
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 0.25rem;">
        <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; color: #f2e7d0; margin-bottom: 0.2rem;">Jama Masjid</h4>
        <p style="font-size: 0.76rem; color: #a69885; line-height: 1.4;">
          Monumental 17th-century Mughal Mosque. Elevated rooftop views from Mushk.
        </p>
      </div>
    `);
  };

  // Wait briefly for layout render before map init
  setTimeout(initMap, 400);
});
