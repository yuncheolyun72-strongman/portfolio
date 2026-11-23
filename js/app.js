/* Portfolio rendering. Content lives in js/data.js. */
(function () {
  "use strict";

  const UX = "UX/UI Design";
  const CAT_KO = {
    "UX/UI Design": "UX/UI 디자인",
    "Web Design": "웹 디자인",
    "Detail Page Design": "상세페이지",
    "Graphic Design": "그래픽 디자인",
    "Poster Design": "포스터·배너",
    "PPT Design": "PPT 디자인",
    "Motion Graphics": "모션 그래픽",
    "Video Editing": "영상 편집",
    "Branding": "브랜딩",
  };
  const CAT_ORDER = ["Web Design", "Detail Page Design", "Poster Design", "PPT Design", "Motion Graphics", "Video Editing", "Graphic Design", "Branding"];
  // How the main media sits on a project page.
  const KIND = {
    "Graphic Design": "portrait", "Poster Design": "portrait", "Branding": "portrait",
    "Detail Page Design": "tall",
  };
  // Section labels shown on the project page.
  const SEC_KO = {
    "Project Background": "프로젝트 배경",
    "Problem Definition": "문제 정의",
    "Target Users": "타깃 사용자",
    "User Flow": "사용자 흐름",
    "Information Architecture": "정보 구조",
    "Wireframes": "와이어프레임",
    "UI Design": "UI 디자인",
    "Design System": "디자인 시스템",
    "Prototype": "프로토타입",
    "Results & Reflection": "결과와 회고",
  };

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const src = (v) => {
    if (!v) return "";
    if (v.indexOf("seed:") === 0) return SEEDIMG[v.slice(5)] || "";
    if (v.indexOf("./") === 0) return v.slice(2);
    return v;
  };
  const catName = (c) => CAT_KO[c] || c;

  const projects = SEEDS.filter((p) => p.pub !== false && HIDDEN.indexOf(p.id) < 0);
  const uxList = projects.filter((p) => p.cat === UX).sort((a, b) => (b.feat ? 1 : 0) - (a.feat ? 1 : 0));
  const others = projects.filter((p) => p.cat !== UX);
  const link = (p) => "project.html?id=" + encodeURIComponent(p.id);

  // ---------- copy button ----------
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    const text = b.getAttribute("data-copy");
    const done = () => { const t = b.textContent; b.textContent = "복사했습니다"; setTimeout(() => (b.textContent = t), 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => {});
  });

  // ---------- home ----------
  function renderHome() {
    const sel = document.getElementById("selected");
    sel.innerHTML = uxList.map((p) => `
      <a class="sel-item" href="${link(p)}">
        <div class="sel-media"><img src="${esc(src(p.img))}" alt="" loading="lazy"></div>
        <div class="sel-text">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.tagline)}</p>
          <div class="sel-meta">${p.year ? `<span>${esc(p.year)}</span>` : ""}${p.role ? `<span>${esc(p.role)}</span>` : ""}</div>
        </div>
      </a>`).join("");

    const filters = document.getElementById("filters");
    const tiles = document.getElementById("tiles");
    const cats = CAT_ORDER.filter((c) => others.some((p) => p.cat === c));
    let current = cats[0];

    function drawFilters() {
      const btn = (key, label, n) => `<li><button type="button" data-cat="${key}" aria-pressed="${current === key}">${label}<sup>${n}</sup></button></li>`;
      filters.innerHTML = cats.map((c) => btn(c, catName(c), others.filter((p) => p.cat === c).length)).join("");
    }
    function drawTiles() {
      const list = others.filter((p) => p.cat === current);
      tiles.innerHTML = list.length ? list.map((p) => `
        <a class="tile" href="${link(p)}">
          <div class="tile-media"><img src="${esc(src(p.img))}" alt="" loading="lazy"></div>
          <div class="tile-cap"><b>${esc(p.title)}</b><span>${esc(p.year)}</span></div>
          <div class="tile-cat">${esc(catName(p.cat))}</div>
        </a>`).join("") : `<p class="empty">이 분류에 공개된 작업이 없습니다.</p>`;
    }
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-cat]");
      if (!b) return;
      current = b.getAttribute("data-cat");
      drawFilters();
      drawTiles();
    });
    drawFilters();
    drawTiles();
  }

  // ---------- project page ----------
  function heroMedia(p) {
    const img = src(p.img);
    const video = src(p.video);
    if (video) {
      const vertical = p.ar === "9/16";
      return `<div class="p-hero ${vertical ? "vertical" : "wide"}"><video src="${esc(video)}" ${img ? `poster="${esc(img)}"` : ""} controls preload="metadata" playsinline></video></div>`;
    }
    if (!img) return "";
    const kind = p.lay || KIND[p.cat] || "wide";
    const hasDocs = (p.docs && p.docs.length) || p.doc;
    if (hasDocs && kind !== "portrait") return ""; // the document pages below already show the work
    const mw = kind === "portrait" ? ` style="max-width:${esc(p.mw || "640px")}"` : "";
    return `<div class="p-hero ${kind}"><img src="${esc(img)}" alt="${esc(p.title)}"${mw}></div>`;
  }

  function renderProject() {
    const root = document.getElementById("project");
    const id = new URLSearchParams(location.search).get("id");
    const p = projects.find((x) => x.id === id);
    if (!p) {
      root.innerHTML = `<div class="notfound"><a class="back" href="./#work">← 전체 작업</a><h1>찾는 프로젝트가 없습니다.</h1><p class="mute">주소가 바뀌었거나 비공개로 전환된 작업입니다.</p></div>`;
      return;
    }
    document.title = p.title + " — 최윤철";

    const group = p.cat === UX ? uxList : others;
    const i = group.indexOf(p);
    const prev = group[i - 1];
    const next = group[i + 1];

    const meta = [["분야", catName(p.cat)], ["연도", p.year], ["역할", p.role], ["사용 툴", p.tools]]
      .filter((m) => m[1])
      .map((m) => `<div><dt>${m[0]}</dt><dd>${esc(m[1])}</dd></div>`).join("");

    const blocks = [];
    if (p.overview) blocks.push(`<section class="p-block"><h2>개요</h2><div class="body"><p class="big">${esc(p.overview.split("\n\n")[0])}</p>${p.overview.indexOf("\n\n") > 0 ? `<p style="margin-top:24px">${esc(p.overview.split("\n\n").slice(1).join("\n\n"))}</p>` : ""}</div></section>`);
    Object.keys(p.secs || {}).forEach((k) => {
      const text = p.secs[k];
      const im = src((p.simg || {})[k]);
      if (!text && !im) return;
      blocks.push(`<section class="p-block"><h2>${esc(SEC_KO[k] || k)}</h2><div class="body">${text ? `<p>${esc(text)}</p>` : ""}${im ? `<img src="${esc(im)}" alt="" loading="lazy">` : ""}</div></section>`);
    });

    const docs = (p.docs && p.docs.length ? p.docs : p.doc ? [p.doc] : []).map(src).filter(Boolean);
    const extras = (p.extra || "").split("\n").map((s) => src(s.trim())).filter(Boolean);

    root.innerHTML = `
      <div class="p-head">
        <a class="back" href="./${p.cat === UX ? "#work" : "#archive"}">← 전체 작업</a>
        <p class="p-kicker">${esc(catName(p.cat))}${p.year ? " · " + esc(p.year) : ""}</p>
        <h1>${esc(p.title)}</h1>
        ${p.tagline ? `<p class="p-tagline">${esc(p.tagline)}</p>` : ""}
        <dl class="p-meta">${meta}</dl>
      </div>
      ${heroMedia(p)}
      ${blocks.join("")}
      ${docs.length ? `<div class="p-doc">${docs.map((d) => `<a href="${esc(d)}" target="_blank" rel="noopener"><img src="${esc(d)}" alt="" loading="lazy"></a>`).join("")}</div>` : ""}
      ${extras.length ? `<div class="p-gallery">${extras.map((d) => `<a href="${esc(d)}" target="_blank" rel="noopener"><img src="${esc(d)}" alt="" loading="lazy"></a>`).join("")}</div>` : ""}
      <nav class="p-next" aria-label="다른 프로젝트">
        ${prev ? `<a href="${link(prev)}"><small>이전</small><b>${esc(prev.title)}</b></a>` : "<span></span>"}
        ${next ? `<a href="${link(next)}"><small>다음</small><b>${esc(next.title)}</b></a>` : "<span></span>"}
      </nav>`;
  }

  const page = document.body.getAttribute("data-page");
  if (page === "home") renderHome();
  if (page === "project") renderProject();
})();
