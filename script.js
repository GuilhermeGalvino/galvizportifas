// To add/remove a tool badge in the scrolling strip, edit this list.
const tools = [
  { icon: "Pr", name: "Premiere Pro", css: "tool-pr" },
  { icon: "Ae", name: "After Effects", css: "tool-ae" },
  { icon: "Bl", name: "Blender", css: "tool-bl" },
];

// List of video portfolio items (longform = 16:9, shorts = 9:16)
const videos = [
  {
    id: "Y1zscYOTmJo",
    title: "BearyTrial",
    category: "longform",
  },
  {
    id: "9dokSrm0oe8",
    title: "Trial For Ames",
    category: "longform",
  },
  {
    id: "dn3RTD539ZQ",
    title: "cookINTRO",
    category: "longform",
  },
  {
    id: "655oOFnyJvA",
    title: "The New Minecraft Update Is Amazing! — Editing Intro",
    category: "longform",
  },
  {
    id: "KouMD4aGpJw",
    title: "Minecraft Video Editing Showcase",
    category: "longform",
  },
  {
    id: "SbEP_zR3efc",
    title: "Ain’t No Way He Died Like That",
    category: "shorts",
  },
  {
    id: "JAVaJ467d6c",
    title: "This Toilet Is Cursed... #minecraft",
    category: "shorts",
  },
  {
    id: "HaBprWAUuF4",
    title: "Do Not breath in Minecraft #minecraft",
    category: "shorts",
  },
  {
    id: "XGRrolv9MF4",
    title: "MILK Armor Is the Weirdest Thing in Minecraft #minecraft",
    category: "shorts",
  },
];

function createCardHTML(v) {
  const isShorts = v.category === "shorts";
  const ratioClass = isShorts ? "ratio-9-16" : "ratio-16-9";
  const tagClass = isShorts ? "tag-shorts" : "tag-longform";
  const tagLabel = isShorts ? "Shorts" : "Long-form";

  return `
    <article class="video-card">
      <div class="video-frame ${ratioClass}">
        <iframe
          src="https://www.youtube-nocookie.com/embed/${v.id}"
          title="${v.title}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="video-info">
        <h3 class="video-title">${v.title}</h3>
        <div class="video-footer">
          <span class="video-tag ${tagClass}">${tagLabel}</span>
        </div>
      </div>
    </article>
  `;
}

function renderGallery(filter = "all") {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const longformVideos = videos.filter((v) => v.category === "longform");
  const shortsVideos = videos.filter((v) => v.category === "shorts");

  if (videos.length === 0) {
    gallery.innerHTML = `<div class="gallery-empty">More edits coming soon.</div>`;
    return;
  }

  let html = "";

  if (filter === "all" || filter === "longform") {
    if (longformVideos.length > 0) {
      html += `
        <div class="gallery-section">
          ${
            filter === "all"
              ? `
            <div class="section-tag-heading">
              <span class="icon">🎥</span>
              <span>Long-Form Edits</span>
              <span class="count">${longformVideos.length}</span>
            </div>
          `
              : ""
          }
          <div class="grid-longform">
            ${longformVideos.map(createCardHTML).join("")}
          </div>
        </div>
      `;
    }
  }

  if (filter === "all" || filter === "shorts") {
    if (shortsVideos.length > 0) {
      html += `
        <div class="gallery-section">
          ${
            filter === "all"
              ? `
            <div class="section-tag-heading">
              <span class="icon">⚡</span>
              <span>Shorts & Reels</span>
              <span class="count">${shortsVideos.length}</span>
            </div>
          `
              : ""
          }
          <div class="grid-shorts">
            ${shortsVideos.map(createCardHTML).join("")}
          </div>
        </div>
      `;
    }
  }

  gallery.innerHTML = html;
}

function setupMarquee() {
  const track = document.getElementById("marquee-track");
  if (!track) return;
  const container = track.parentElement;
  const badgeHTML = tools
    .map(
      (t) =>
        `<span class="tool-badge"><span class="tool-icon ${t.css}">${t.icon}</span>${t.name}</span>`
    )
    .join("");

  track.innerHTML = badgeHTML;
  
  while (track.scrollWidth < container.clientWidth) {
    track.insertAdjacentHTML("beforeend", badgeHTML);
  }

  const shiftWidth = track.scrollWidth;
  track.insertAdjacentHTML("beforeend", track.innerHTML);
  Array.from(track.children)
    .slice(Math.round(track.children.length / 2))
    .forEach((el) => el.setAttribute("aria-hidden", "true"));

  const pixelsPerSecond = 50;
  track.style.setProperty("--marquee-shift", `-${shiftWidth}px`);
  track.style.setProperty(
    "--marquee-duration",
    `${shiftWidth / pixelsPerSecond}s`
  );
}

function setupFilters() {
  const tabs = document.querySelectorAll(".filter-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      const filter = tab.dataset.filter;
      renderGallery(filter);
    });
  });
}

function setupCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const originalText = btn.innerHTML;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 1800);
      } catch {
        window.prompt(`Copy ${btn.dataset.label}:`, btn.dataset.copy);
      }
    });
  });
}

function setupBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("is-visible", window.scrollY > 400);
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  renderGallery("all");
  setupMarquee();
  setupFilters();
  setupCopyButtons();
  setupBackToTop();
});
