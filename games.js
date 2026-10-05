/* Room 285 activity router. The last block is The Call.
   Rocket Docket and mock trial open only on a hearing or trial day. */
(function () {
  var FIRST = "2026-08-24";
  var CONLAW = { 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1 };
  var COURT = {
    days: {
      "2026-09-22": { ILS: { client:"WHITFIELD, TANYA", event:"hearing", id:"mock", case:"whitfield-escrow", href:"hearing.html?case=tanya&go=1", label:"COURTROOM 5 · TANYA HEARING", note:"Whitfield v. Harborview. RP § 8-211." } },
      "2026-09-23": { ILS: { client:"WHITFIELD, ANDRE P.", event:"prep", id:"rocket", case:"10-201", href:"rocket-docket.html?case=10-201&who=WHITFIELD,ANDRE&place=Mondawmin%20Mall", label:"ROCKET · ANDRE TICKET", note:"§ 10-201(c)(2). Trial 14 Oct." } },
      "2026-09-24": {
        ILS: { client:"WHITFIELD, ANDRE P.", event:"prep", id:"rocket", case:"10-201", href:"rocket-docket.html?case=10-201&who=WHITFIELD,ANDRE&place=Mondawmin%20Mall", label:"ROCKET · ANDRE 14 OCT", note:"Speed round. Same charge." },
        LS: { client:"BOONE", event:"first-court", id:"rocket", case:"3-203", href:"rocket-docket.html?case=3-203&who=BOONE,MARCUS&place=the%201800%20block%20of%20E.%20North%20Avenue", label:"ROCKET · BOONE FIRST COURT", note:"Critical stage. Elements." }
      },
      "2026-10-08": { ILS: { client:"BROOKS, KEISHA", event:"hearing", id:"mock", case:"brooks-conversion", href:"mock-trial.html?case=brooks-conversion&mode=script", label:"MOCK TRIAL · BROOKS", note:"Conversion. Brooks v. Greenmount." } },
      "2026-10-13": { ILS: { client:"WHITFIELD, ANDRE P.", event:"trial-prep", id:"rocket", case:"10-201", href:"rocket-docket.html?case=10-201&who=WHITFIELD,ANDRE&place=Mondawmin%20Mall", label:"ROCKET · ANDRE PREP", note:"Tomorrow is trial." } },
      "2026-10-14": { ILS: { client:"WHITFIELD, ANDRE P.", event:"trial", id:"mock", case:"whitfield-disorderly", href:"mock-trial.html?case=whitfield-disorderly&mode=script", label:"MOCK TRIAL · STATE v. WHITFIELD", note:"Trial day. CR § 10-201(c)(2)." } }
    }
  };
  function iso(d) {
    if (window.LawKit && LawKit.iso) return LawKit.iso(d);
    d = d || new Date();
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(d).forEach(function (x) { if (x.type !== "literal") p[x.type] = x.value; });
    return p.year + "-" + p.month + "-" + p.day;
  }
  function weekday(dateIso) {
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(new Date(dateIso + "T12:00:00")).forEach(function (x) { if (x.type !== "literal") p[x.type] = x.value; });
    return p.weekday;
  }
  function weekIndex(dateIso) {
    dateIso = dateIso || iso();
    var a = Date.parse(FIRST + "T12:00:00");
    var b = Date.parse(dateIso + "T12:00:00");
    if (isNaN(a) || isNaN(b)) return 1;
    return Math.floor((b - a) / 86400000 / 7) + 1;
  }
  function lsWeek(dateIso) {
    var w = weekIndex(dateIso);
    return ((w - 1) % 20) + 1;
  }
  function isFriday(dateIso) { return weekday(dateIso || iso()) === "Fri"; }
  function isConLaw(dateIso) { return !!CONLAW[lsWeek(dateIso)]; }
  function courtDay(course, dateIso) {
    dateIso = dateIso || iso();
    course = (course === "LS" || String(course || "").indexOf("LS") === 0) ? "LS" : (course === "ILS" ? "ILS" : "");
    if (!course) return null;
    var row = (COURT && COURT.days && COURT.days[dateIso]) || {};
    return row[course] || null;
  }
  function sitting(course, dateIso) {
    var d = courtDay(course, dateIso);
    if (!d) return null;
    var ev = String(d.event || "").toLowerCase();
    if (ev === "hearing" || ev === "trial" || ev === "first-court") return d;
    return null;
  }
  function choices(course, dateIso) {
    dateIso = dateIso || iso();
    course = course === "LS" ? "LS" : "ILS";
    var day = sitting(course, dateIso);
    if (!day) return [];
    return [{ id: day.id, href: day.href, label: day.label, note: day.note, case: day.case, client: day.client }];
  }
  function loadCourt() {
    return fetch("data/court-days.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.days) COURT = j; return COURT; })
      .catch(function () { return null; });
  }
  loadCourt();
  window.LawGames = {
    iso: iso, weekIndex: weekIndex, lsWeek: lsWeek, isFriday: isFriday, isConLaw: isConLaw,
    choices: choices, courtDay: courtDay, sitting: sitting, loadCourt: loadCourt, CONLAW: CONLAW
  };
})();
