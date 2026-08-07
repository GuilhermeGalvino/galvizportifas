// To add/remove a tool badge in the scrolling strip, edit this list.
const tools = [
  { icon: "Pr", name: "Premiere Pro", css: "tool-pr" },
  { icon: "Ae", name: "After Effects", css: "tool-ae" },
  { icon: "Bl", name: "Blender", css: "tool-bl" },
];

// To add a video: get the YouTube video ID (the part after v= or /shorts/)
// and add a line below. category: "longform" or "shorts".
const videos = [
  {
    id: "655oOFnyJvA",
    title: "The New Minecraft Update Is Amazing! — Editing Intro",
    category: "longform",
  },
  {
    id: "XGRrolv9MF4",
    title: "MILK Armor Is the Weirdest Thing in Minecraft #minecraft",
    category: "shorts",
  },
  {
    id: "KouMD4aGpJw",
    title: "Minecraft Video Editing Showcase", // Pode alterar para o título que preferir
    category: "longform",
  },
];

function renderGallery() {
  const gallery = document.getElementById("gallery");

  if (videos.length === 0) {
    gallery.innerHTML = `<div class="gallery-empty">More edits coming soon.</div>`;
    return;
  }

  gallery.innerHTML = videos
    .map((v) => {
      const ratioClass = v.category === "shorts" ? "ratio-9-16" : "ratio-16-9";
      const tag = v.category === "shorts" ? "Shorts" : "Long-form";
      return `
      <div class="video-card" data-category="${v.category}">
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
          <div class="video-title">${v.title}</div>
          <span class="video-tag">${tag}</span>
        </div>
      </div>
    `;
    })
    .join("");
}

function setupMarquee() {
  const track = document.getElementById("marquee-track");
  const container = track.parentElement;
  const badgeHTML = tools
    .map(
      (t) =>
        `<span class="tool-badge"><span class="tool-icon ${t.css}">${t.icon}</span>${t.name}</span>`
    )
    .join("");

  track.innerHTML = badgeHTML;
  const unitWidth = track.scrollWidth;

  // Keep adding copies until the track is at least as wide as its container,
  // so the loop never runs out of content before it wraps around.
  while (track.scrollWidth < container.clientWidth) {
    track.insertAdjacentHTML("beforeend", badgeHTML);
  }

  // Duplicate the whole thing once more: the animation shifts by exactly
  // this width, so the second half seamlessly replaces the first.
  const shiftWidth = track.scrollWidth;
  track.insertAdjacentHTML("beforeend", track.innerHTML);
  Array.from(track.children)
    .slice(Math.round(track.children.length / 2))
    .forEach((el) => el.setAttribute("aria-hidden", "true"));

  const pixelsPerSecond = 60;
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
      document.querySelectorAll(".video-card").forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });
}

function setupCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const originalText = btn.textContent;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      } catch {
        window.prompt(`Copy ${btn.dataset.label}:`, btn.dataset.copy);
      }
    });
  });
}

function setupBackToTop() {
  const btn = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    btn.classList.toggle("is-visible", window.scrollY > 480);
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

renderGallery();
setupMarquee();
setupFilters();
setupCopyButtons();
setupBackToTop();