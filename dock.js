/* One dock: Menu · Lecture · Library · Classwork · Office · Hall pass · Attendance · Operations
   Relative hrefs so it works at / and /public/ and /lcars/. Never injects a second layout. */
(function () {
  var inLcars = /\/lcars\//.test(location.pathname);
  var prefix = inLcars ? "../" : "";
  var ITEMS = [
    { href: prefix + "menu.html", label: "MENU", color: "c-sand", on: ["menu", "index", ""] },
    { href: prefix + "lecture.html", label: "LECTURE", color: "c-gold", on: ["kiosk", "share", "lecture", "present", "slides", "prompter"] },
    { href: prefix + "library.html", label: "LIBRARY", color: "c-ice", on: ["library", "library-phone", "research", "reader"] },
    { href: prefix + "lab.html", label: "CLASSWORK", color: "c-lilac", on: ["lab", "lesson", "resume", "rocket-docket", "docket-rush", "objection", "firm-285", "mock-trial"] },
    { href: prefix + "office.html", label: "OFFICE", color: "c-ok", on: ["office"] },
    { href: prefix + "hall-pass.html?v=14", label: "HALL PASS", color: "c-rose", on: ["hall-pass", "pass"] },
    { href: prefix + "attendance.html?v=7", label: "ATTENDANCE", color: "c-violet", on: ["attendance", "attend"] },
    { href: prefix + "ops.html", label: "OPERATIONS", color: "c-orange", on: ["ops", "year", "bell-test", "clock-walk", "week-packet", "wed-handout", "plans", "grades", "night-clerk", "handbook", "map", "desk", "best-memos", "quiz-dash"] }
  ];
  var SCROLL = ["week-packet", "wed-handout", "plans", "grades", "handbook", "print", "map", "syllabus", "best-memos", "quiz-dash", "kit-audit"];
  var me = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/i, "") || "index";
  if (SCROLL.indexOf(me) >= 0) {
    document.documentElement.classList.add("print-ok");
    if (document.body) document.body.classList.add("print-ok");
    else document.addEventListener("DOMContentLoaded", function () { document.body.classList.add("print-ok"); });
  }
  if (!document.getElementById("lawlab-dock-css")) {
    var s = document.createElement("style");
    s.id = "lawlab-dock-css";
    s.textContent =
      "html,body{height:100dvh;min-height:100dvh;margin:0;overflow:hidden}" +
      "html.print-ok,html.print-ok body,body.print-ok{height:auto!important;min-height:100dvh;overflow:auto!important}" +
      "@media print{html,body,html.print-ok,body.print-ok{height:auto!important;overflow:visible!important;min-height:0!important}}" +
      "html,body,button,input,select,textarea,a,nav.lab-dock a{font-family:'Arial Narrow','Helvetica Neue Condensed',Antonio,sans-serif}" +
      "main,#main{min-height:42vh}" +
      "nav.lab-dock,nav.dock,#dock{display:flex;flex-wrap:nowrap;gap:6px;padding:6px 12px 10px 40px;width:100%;box-sizing:border-box;background:#f6f1e7;flex-shrink:0;position:relative;z-index:10000}" +
      "nav.lab-dock a,nav.dock a,#dock a{flex:1 1 0;min-width:0;min-height:48px;text-decoration:none;color:#000;display:flex;align-items:flex-end;justify-content:flex-end;padding:8px 10px;font-weight:700;font-size:clamp(10px,1.05vw,13px);letter-spacing:.05em;border-radius:0 0 22px 22px;text-align:right;line-height:1.15}" +
      ".c-sand{background:#cccc9a}.c-gold{background:#ff9900}.c-ice{background:#99ccff}.c-lilac{background:#cc99cc}.c-rose{background:#cc6666}.c-violet{background:#9999ff}.c-orange{background:#f7ae45}.c-ok{background:#99cc99}" +
      "nav.lab-dock a.on,nav.dock a.on,#dock a.on{outline:3px solid #9a3412;outline-offset:-3px}" +
      "html{color-scheme:dark}" +
      "*{scrollbar-width:thin;scrollbar-color:#9a3412 #f6f1e7}" +
      "*::-webkit-scrollbar{width:18px;height:18px;background:#f6f1e7}" +
      "*::-webkit-scrollbar-track{background:#f6f1e7;border-left:3px solid #cc99cc;margin:6px 0}" +
      "*::-webkit-scrollbar-thumb{background:#ff9900;border:3px solid #f6f1e7;border-radius:0 16px 16px 0;min-height:56px}" +
      "*::-webkit-scrollbar-thumb:hover{background:#ffcc99}" +
      "*::-webkit-scrollbar-corner{background:#f6f1e7}";
    document.head.appendChild(s);
  }
  function here() {
    var file = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/i, "") || "index";
    if (SCROLL.indexOf(file) >= 0) {
      document.documentElement.classList.add("print-ok");
      document.body.classList.add("print-ok");
    }
    if (file === "index" || file === "") return (location.hash || "").replace("#", "") || "menu";
    return file;
  }
  function framed() {
    try { return window.self !== window.top; } catch (e) { return true; }
  }
  function paint() {
    if (framed()) {
      document.querySelectorAll("nav.lab-dock, nav.dock, #dock").forEach(function (n) { n.style.display = "none"; });
      return;
    }
    var navs = document.querySelectorAll("nav.lab-dock, nav.dock, #dock");
    var nav = navs[0];
    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "lab-dock";
      document.body.appendChild(nav);
    }
    for (var i = 1; i < navs.length; i++) navs[i].style.display = "none";
    var cur = here();
    nav.innerHTML = ITEMS.map(function (it) {
      return '<a class="' + it.color + (it.on.indexOf(cur) >= 0 ? " on" : "") + '" href="' + it.href + '">' + it.label + "</a>";
    }).join("");
  }
  window.LawLabDock = { paint: paint, items: ITEMS };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paint);
  else paint();
  window.addEventListener("hashchange", paint);

  function imacFlip() {
    var q = new URLSearchParams(location.search);
    if ((q.get("role") || "").toLowerCase() !== "imac") return;
    if (!window.LawPeriod || !LawPeriod.kioskPage || !LawPeriod.snapshot) return;
    var snap = LawPeriod.snapshot();
    var want = LawPeriod.kioskPage(snap);
    var file = (location.pathname.split("/").pop() || "").replace(/\.html$/i, "");
    var have = "";
    if (file === "attendance" || file === "attend") have = "attend";
    else if (file === "hall-pass" || file === "pass") have = "pass";
    else if (file === "office") have = "office";
    else if (file === "menu" || file === "index" || file === "") have = "menu";
    else return;
    if (!want || want === have) return;
    var im = "role=imac";
    var path = want === "pass" ? "hall-pass.html?v=14&" + im
      : want === "attend" ? "attendance.html?v=7&" + im
      : want === "office" ? "office.html?" + im
      : "menu.html?" + im;
    location.replace(path);
  }
  setTimeout(imacFlip, 500);
  setInterval(imacFlip, 1000);
})();
