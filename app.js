/* ════════════════════════════════════════
   PIXEL INVITESS — app.js
   Video Slider + Order Modal + Protection
   ════════════════════════════════════════ */

/* ══════════════════════════════════════
   1. SCREENSHOT & SCREEN-RECORD PROTECTION
══════════════════════════════════════ */
(function initProtection() {
  // Disable right-click
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Disable common screenshot/inspect shortcuts
  document.addEventListener('keydown', function(e) {
    const blocked = (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I','J','C','U','S'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && ['U','S','P'].includes(e.key.toUpperCase())) ||
      (e.metaKey && e.shiftKey && ['3','4','5'].includes(e.key)) || // Mac screenshots
      (e.metaKey && ['S','P'].includes(e.key.toUpperCase())) ||
      e.key === 'PrintScreen'
    );
    if (blocked) { e.preventDefault(); e.stopPropagation(); return false; }
  }, true);

  // PrintScreen key — blank screen momentarily
  document.addEventListener('keyup', function(e) {
    if (e.key === 'PrintScreen') {
      document.body.style.filter = 'blur(20px)';
      setTimeout(() => { document.body.style.filter = ''; }, 1500);
      navigator.clipboard.writeText('').catch(() => {});
    }
  });

  // Visibility change — blur when tab hidden (screen recording)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.style.filter = 'blur(20px)';
    } else {
      setTimeout(() => { document.body.style.filter = ''; }, 300);
    }
  });

  // Block drag of images/videos
  document.addEventListener('dragstart', e => e.preventDefault());

  // DevTools detection (basic)
  let devtoolsOpen = false;
  const threshold = 160;
  setInterval(() => {
    const widthDiff  = window.outerWidth  - window.innerWidth  > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;
    if ((widthDiff || heightDiff) && !devtoolsOpen) {
      devtoolsOpen = true;
      document.body.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100vh;
          background:#faf5f0;font-family:serif;color:#c9906e;text-align:center;padding:2rem;flex-direction:column;gap:1rem">
          <div style="font-size:3rem">🔒</div>
          <div style="font-size:1.5rem;font-style:italic">Content Protected</div>
          <div style="font-size:0.85rem;color:#8a7060">Please close developer tools to view this page.</div>
        </div>`;
    }
    if (!widthDiff && !heightDiff && devtoolsOpen) {
      devtoolsOpen = false;
      location.reload();
    }
  }, 1000);
})();

/* ══════════════════════════════════════
   2. DATA — EVENT CATEGORIES
      Videos: add your actual .mp4 file paths here
      Example: videos: ['videos/wedding/v1.mp4', 'videos/wedding/v2.mp4', ...]
══════════════════════════════════════ */
const EVENTS = [
  {
    id: 'wedding',
    emoji: '💍',
    title: 'Shaadi',
    titleEm: 'Wedding',
    sub: 'Royal • Floral • Mughal • Modern',
    price: '₹299',
    // ↓ Replace these with your actual video paths (5 per category recommended)
    videos: [
      'videos/wedding/wedding 1.mp4', 'videos/wedding/wedding 2.mp4', 'videos/wedding/wedding 3.mp4', 'videos/wedding/wedding 4.mp4', 'videos/wedding/wedding 5.mp4'   // e.g. 'videos/wedding/v1.mp4'
    ],
    orderEvents: ['Shaadi / Wedding', 'Engagement']
  },
  {
    id: 'birthday',
    emoji: '🎂',
    title: 'Birthday',
    titleEm: 'Party',
    sub: 'Kids • Adults • Princess • Neon',
    price: '₹199',
    videos: ['videos/birthday/birthday 1.mp4', 'videos/birthday/birthday 2.mp4', 'videos/birthday/birthday 3.mp4', 'videos/birthday/birthday 4.mp4', 'videos/birthday/birthday 5.mp4'],
    orderEvents: ['Birthday Party', 'Kids Birthday']
  },
  {
    id: 'mehndi',
    emoji: '🌿',
    title: 'Mehndi',
    titleEm: 'Ceremony',
    sub: 'Traditional • Bohemian • Floral',
    price: '₹249',
    videos: ['videos/mehndi/mehndi 1.mp4', 'videos/mehndi/mehndi 2.mp4', 'videos/mehndi/mehndi 3.mp4', 'videos/mehndi/mehndi 4.mp4', 'videos/mehndi/mehndi 5.mp4'],
    orderEvents: ['Mehndi Ceremony']
  },
  {
    id: 'haldi',
    emoji: '🌼',
    title: 'Haldi',
    titleEm: 'Utsav',
    sub: 'Marigold • Festive • Bright',
    price: '₹249',
    videos: ['videos/haldi/haldi 1.mp4', 'videos/haldi/haldi 2.mp4', 'videos/haldi/haldi 3.mp4', 'videos/haldi/haldi 4.mp4', 'videos/haldi/haldi 5.mp4'],
    orderEvents: ['Haldi Ceremony']
  },
  {
    id: 'babyshower',
    emoji: '👶',
    title: 'Baby Shower',
    titleEm: '& Naming',
    sub: 'Pastel • Sweet • Adorable',
    price: '₹229',
    videos: ['videos/babyshower/babyshower 1.mp4', 'videos/babyshower/babyshower 2.mp4', 'videos/babyshower/babyshower 3.mp4', 'videos/babyshower/babyshower 4.mp4', 'videos/babyshower/babyshower 5.mp4'],
    orderEvents: ['Baby Shower', 'Naming Ceremony']
  },
  {
    id: 'other',
    emoji: '✨',
    title: 'Other',
    titleEm: 'Occasions',
    sub: 'Greh Pravesh • Anniversary • Corporate',
    price: '₹199',
    videos: ['videos/other/other 1.mp4', 'videos/other/other 2.mp4', 'videos/other/other 3.mp4', 'videos/other/other 4.mp4', 'videos/other/other 5.mp4'],
    orderEvents: ['Greh Pravesh', 'Anniversary', 'Corporate Event', 'Pooja', 'Other']
  }
];

const WA_NUMBER = '917860142874';
const IG_URL    = 'https://www.instagram.com/pixel_invitess?igsh=YWZ6bTQ0d3U2Yjlk';

/* ══════════════════════════════════════
   3. BUILD COLLECTIONS
══════════════════════════════════════ */
function buildCollections() {
  const container = document.getElementById('collectionsContainer');
  container.innerHTML = '';

  EVENTS.forEach((ev, idx) => {
    const block = document.createElement('div');
    block.className = 'event-block reveal';
    block.style.transitionDelay = `${idx * 0.05}s`;

    block.innerHTML = `
      <div class="eb-header">
        <div class="eb-left">
          <span class="eb-emoji">${ev.emoji}</span>
          <div class="eb-title">${ev.title} <em>${ev.titleEm}</em></div>
          <div class="eb-sub">${ev.sub}</div>
        </div>
        <div class="eb-price-tag">
          <span class="ep-label">Starting at</span>
          <span class="ep-amount">${ev.price}</span>
        </div>
      </div>

      <div class="video-slider-wrap reveal" style="transition-delay:${idx * 0.05 + 0.1}s">
        <div class="vs-viewport" id="vp-${ev.id}">
          <div class="vs-track" id="track-${ev.id}">
            ${buildSlides(ev)}
          </div>
          <div class="vs-counter" id="counter-${ev.id}">1 / ${ev.videos.length + 1}</div>
        </div>

        <button class="vs-arrow prev" id="prev-${ev.id}" onclick="slideMove('${ev.id}', -1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button class="vs-arrow next" id="next-${ev.id}" onclick="slideMove('${ev.id}', 1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <div class="vs-dots" id="dots-${ev.id}">
          ${ev.videos.map((_, i) => `<div class="vs-dot${i===0?' active':''}" onclick="slideTo('${ev.id}', ${i})"></div>`).join('')}
          <div class="vs-dot" onclick="slideTo('${ev.id}', ${ev.videos.length})"></div>
        </div>
      </div>

      <div class="eb-order-area reveal" style="transition-delay:${idx * 0.05 + 0.15}s">
        <button class="eb-order-btn" onclick="openModal('${ev.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.851L.057 23.743a.5.5 0 00.606.63l6.044-1.587A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.953 9.953 0 01-5.127-1.415l-.368-.218-3.812 1.001 1.018-3.718-.239-.383A9.952 9.952 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
          ORDER
        </button>
      </div>
    `;

    container.appendChild(block);
  });

  // Init slider state
  EVENTS.forEach(ev => {
    sliderState[ev.id] = { current: 0, total: ev.videos.length + 1 };
    initVideoSlide(ev);
  });
}

/* Build slide HTML */
function buildSlides(ev) {
  let html = '';

  ev.videos.forEach((src, i) => {
    html += `
      <div class="vs-slide" data-ev="${ev.id}" data-idx="${i}">
        <div class="vs-video-wrap">
          ${src
            ? `<video id="vid-${ev.id}-${i}" src="${src}" preload="none" playsinline webkit-playsinline
                 disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback"
                 oncontextmenu="return false"></video>`
            : `<div class="vs-placeholder">
                <div class="vsp-icon">${ev.emoji}</div>
                <div class="vsp-text">${ev.title} ${ev.titleEm}</div>
                <div class="vsp-sub">Video ${i + 1} • Coming Soon</div>
               </div>`
          }
          <div class="vs-protect"></div>
          <div class="vs-watermark"></div>
          ${src ? `<div class="vs-play-overlay" id="ply-${ev.id}-${i}" onclick="togglePlay('${ev.id}',${i})">
            <div class="vs-play-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9906e" stroke-width="2">
                <polygon points="5,3 19,12 5,21" fill="#c9906e" stroke="none"/>
              </svg>
            </div>
          </div>` : ''}
        </div>
      </div>
    `;
  });

  // End card
  html += `
    <div class="vs-slide">
      <div class="vs-end-card">
        <div class="vec-icon">${ev.emoji}</div>
        <div class="vec-title">Pasand Aaya?</div>
        <div class="vec-sub">Yeh ${ev.title} ${ev.titleEm} collection aapke liye perfect hai!<br/>Order karein ya humse connect karein.</div>
        <div class="vec-btns">
          <a href="${IG_URL}" target="_blank" class="vec-btn vec-ig" onclick="return true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>
            Visit Our Instagram
          </a>
          <a href="https://wa.me/${WA_NUMBER}" target="_blank" class="vec-btn vec-wa" onclick="return true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.851L.057 23.743a.5.5 0 00.606.63l6.044-1.587A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.953 9.953 0 01-5.127-1.415l-.368-.218-3.812 1.001 1.018-3.718-.239-.383A9.952 9.952 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
            Contact on WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;

  return html;
}

/* ══════════════════════════════════════
   4. SLIDER LOGIC
══════════════════════════════════════ */
const sliderState = {};

function initVideoSlide(ev) {
  const viewport = document.getElementById(`vp-${ev.id}`);
  if (!viewport) return;

  // Touch / swipe support
  let startX = 0, startY = 0, isDragging = false;

  viewport.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    if (!isDragging) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      slideMove(ev.id, dx < 0 ? 1 : -1);
    }
    isDragging = false;
  }, { passive: true });

  // Tap to play first video
  viewport.addEventListener('click', () => {
    const state = sliderState[ev.id];
    if (state && state.current < ev.videos.length && ev.videos[state.current]) {
      const vid = document.getElementById(`vid-${ev.id}-${state.current}`);
      if (vid && vid.paused) togglePlay(ev.id, state.current);
    }
  });

  updateSlider(ev.id);
}

function slideMove(evId, dir) {
  const state = sliderState[evId];
  if (!state) return;

  // Pause current video
  pauseVideo(evId, state.current);

  state.current = Math.max(0, Math.min(state.total - 1, state.current + dir));
  updateSlider(evId);

  // Auto-play next video when sliding
  const ev = EVENTS.find(e => e.id === evId);
  if (ev && state.current < ev.videos.length && ev.videos[state.current]) {
    setTimeout(() => autoPlayVideo(evId, state.current), 400);
  }
}

function slideTo(evId, idx) {
  const state = sliderState[evId];
  if (!state) return;
  pauseVideo(evId, state.current);
  state.current = idx;
  updateSlider(evId);

  const ev = EVENTS.find(e => e.id === evId);
  if (ev && idx < ev.videos.length && ev.videos[idx]) {
    setTimeout(() => autoPlayVideo(evId, idx), 400);
  }
}

function updateSlider(evId) {
  const state = sliderState[evId];
  const track = document.getElementById(`track-${evId}`);
  const counter = document.getElementById(`counter-${evId}`);
  const dots = document.querySelectorAll(`#dots-${evId} .vs-dot`);
  const prevBtn = document.getElementById(`prev-${evId}`);
  const nextBtn = document.getElementById(`next-${evId}`);

  if (!track) return;

  track.style.transform = `translateX(-${state.current * 100}%)`;
  if (counter) counter.textContent = `${state.current + 1} / ${state.total}`;

  dots.forEach((d, i) => d.classList.toggle('active', i === state.current));

  if (prevBtn) prevBtn.disabled = state.current === 0;
  if (nextBtn) nextBtn.disabled = state.current === state.total - 1;
}

/* ── VIDEO PLAY / PAUSE ── */
function togglePlay(evId, idx) {
  const vid = document.getElementById(`vid-${evId}-${idx}`);
  const ply = document.getElementById(`ply-${evId}-${idx}`);
  if (!vid) return;

  if (vid.paused) {
    vid.play().then(() => {
      if (ply) ply.classList.add('hidden');
    }).catch(() => {});
  } else {
    vid.pause();
    if (ply) ply.classList.remove('hidden');
  }

  // Auto-advance to next when video ends
  vid.onended = () => {
    if (ply) ply.classList.remove('hidden');
    setTimeout(() => slideMove(evId, 1), 600);
  };
}

function autoPlayVideo(evId, idx) {
  const vid = document.getElementById(`vid-${evId}-${idx}`);
  const ply = document.getElementById(`ply-${evId}-${idx}`);
  if (!vid) return;
  vid.play().then(() => {
    if (ply) ply.classList.add('hidden');
    vid.onended = () => {
      if (ply) ply.classList.remove('hidden');
      setTimeout(() => slideMove(evId, 1), 600);
    };
  }).catch(() => {});
}

function pauseVideo(evId, idx) {
  const ev = EVENTS.find(e => e.id === evId);
  if (!ev) return;
  const vid = document.getElementById(`vid-${evId}-${idx}`);
  const ply = document.getElementById(`ply-${evId}-${idx}`);
  if (vid && !vid.paused) {
    vid.pause();
    if (ply) ply.classList.remove('hidden');
  }
}

/* ══════════════════════════════════════
   5. ORDER MODAL
══════════════════════════════════════ */
let activeEvId = null;
let selectedEvent = null;

function openModal(evId) {
  activeEvId = evId;
  selectedEvent = null;
  const ev = EVENTS.find(e => e.id === evId);

  document.getElementById('mhIcon').textContent = ev.emoji;
  document.getElementById('modalTitle').textContent = `${ev.title} ${ev.titleEm} — Order`;

  // Populate event options
  const opts = document.getElementById('evOpts');
  opts.innerHTML = ev.orderEvents.map(o =>
    `<button class="ev-opt" onclick="selectEvent('${o}')">${o}</button>`
  ).join('');

  // Reset form
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none';
  ['hostName','eventDate','eventTime','venue','specialMsg','clientPhone'].forEach(id => {
    document.getElementById(id).value = '';
  });

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function selectEvent(evName) {
  selectedEvent = evName;
  document.querySelectorAll('.ev-opt').forEach(b => {
    b.classList.toggle('selected', b.textContent.trim() === evName);
  });
  setTimeout(() => {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
  }, 200);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  activeEvId = null; selectedEvent = null;
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.getElementById('backBtn').addEventListener('click', () => {
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step1').style.display = 'block';
});

document.getElementById('sendBtn').addEventListener('click', function() {
  const hostName   = document.getElementById('hostName').value.trim();
  const eventDate  = document.getElementById('eventDate').value;
  const eventTime  = document.getElementById('eventTime').value;
  const venue      = document.getElementById('venue').value.trim();
  const specialMsg = document.getElementById('specialMsg').value.trim();
  const clientPhone= document.getElementById('clientPhone').value.trim();

  if (!hostName)                            { alert('Naam bharna zaroori hai!'); return; }
  if (!eventDate)                           { alert('Event ki tarikh bharo!'); return; }
  if (!venue)                               { alert('Venue bharo!'); return; }
  if (!clientPhone || clientPhone.length !== 10) { alert('Sahi WhatsApp number bharo (10 digits)!'); return; }

  const ev = EVENTS.find(e => e.id === activeEvId);
  const fmtDate = new Date(eventDate).toLocaleDateString('hi-IN', { day:'numeric', month:'long', year:'numeric' });
  const fmtTime = eventTime
    ? new Date(`2000-01-01T${eventTime}`).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })
    : 'Not specified';

  const msg = `
🌸 *PIXEL INVITESS — New Order* 🌸

📋 *Category:* ${ev.title} ${ev.titleEm}
🎉 *Event:* ${selectedEvent}
💰 *Price:* ${ev.price}

━━━━━━━━━━━━━━
👤 *Host Name:* ${hostName}
📆 *Date:* ${fmtDate}
⏰ *Time:* ${fmtTime}
📍 *Venue:* ${venue}
${specialMsg ? `\n💬 *Special Message:*\n${specialMsg}\n` : ''}
━━━━━━━━━━━━━━
📱 *Client WhatsApp:* +91 ${clientPhone}

Kindly confirm this order. Thank you! 🙏
  `.trim();

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  closeModal();
});

/* ══════════════════════════════════════
   6. HERO PETALS ANIMATION
══════════════════════════════════════ */
function initPetals() {
  const container = document.getElementById('heroPetals');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${5 + Math.random() * 8}px;
      height: ${5 + Math.random() * 8}px;
      animation-duration: ${6 + Math.random() * 10}s;
      animation-delay: ${-Math.random() * 12}s;
      opacity: ${0.2 + Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
}

/* ══════════════════════════════════════
   7. SCROLL REVEAL
══════════════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════
   8. NAV SCROLL
══════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ══════════════════════════════════════
   9. INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildCollections();
  initPetals();
  initNav();
  setTimeout(initReveal, 150);
});
