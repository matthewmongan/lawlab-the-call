/* Adaptive 12-item quiz from the 45-skill baseline + challenge hypos.
   Weak topics get review in new words. Strong students get level-3 hypos.
   Teacher board: quiz-dash.html */
(function () {
  var SEEN = "lawlab.quiz.seen.v1";
  var MASTERY = "lawlab.quiz.mastery.v1";
  var LABELS = {
    upl: "Advice / UPL",
    privilege: "Confidentiality",
    office: "Clerk / calendar",
    file: "File / exhibit",
    process: "Due process / Goss",
    courts: "Courts / caption",
    criminal: "Criminal",
    civil: "Civil",
    search: "Search / 4th",
    sources: "Statute / opinion",
    core: "Core"
  };
  function stemKey(q) {
    return String((q && (q.stem || q.ask)) || "").replace(/\s+/g, " ").trim().toLowerCase();
  }
  function topicOf(q) {
    if (q && q.topic) return q.topic;
    var s = stemKey(q);
    if (/advice|19-305|do i win|unauthorized|paralegal|last line of a student/.test(s)) return "upl";
    if (/confidential|privilege/.test(s)) return "privilege";
    if (/clerk|docket|reminder|calendar|correspondence|conflict/.test(s)) return "office";
    if (/file|exhibit|jacket|tab|intake|witness|pile/.test(s)) return "file";
    if (/goss|due process|notice|heard|suspension|principal/.test(s)) return "process";
    if (/trial|appellate|jury|federal|state court|district court|circuit|caption|summons|voir dire/.test(s)) return "courts";
    if (/crime|element|charge|prosecutor|plea|beyond|indictment|public defender|gideon|miranda/.test(s)) return "criminal";
    if (/civil|plaintiff|negligen|remedy|preponderance|complaint starts/.test(s)) return "civil";
    if (/fourth|search|seizure|mapp/.test(s)) return "search";
    if (/statute|opinion|legislature|constitution|bill of rights|amendment|19-301/.test(s)) return "sources";
    return "core";
  }
  function levelOf(q) {
    var n = Number(q && q.level);
    if (n === 1 || n === 2 || n === 3) return n;
    var s = stemKey(q);
    if (/if the client|if you do not|missing|which is not|hypo/.test(s)) return 3;
    if (/means$|is$|held that|is about/.test(s)) return 1;
    return 2;
  }
  function loadJSON(k) {
    try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch (e) { return {}; }
  }
  function saveJSON(k, d) {
    try { localStorage.setItem(k, JSON.stringify(d)); } catch (e) {}
  }
  function loadSeen() { return loadJSON(SEEN); }
  function seenFor(who) { return (loadSeen()[who] || {}).stems || {}; }
  function remember(who, items, iso) {
    if (!who) return;
    var d = loadSeen();
    if (!d[who]) d[who] = { stems: {} };
    (items || []).forEach(function (q) {
      var k = stemKey(q);
      if (k) d[who].stems[k] = iso || "";
    });
    saveJSON(SEEN, d);
  }
  function masteryStore() { return loadJSON(MASTERY); }
  function rowFor(who) {
    var d = masteryStore();
    if (!d[who]) d[who] = { topics: {}, log: [] };
    if (!d[who].topics) d[who].topics = {};
    if (!d[who].log) d[who].log = [];
    return d[who];
  }
  function record(who, q, ok, iso, course) {
    if (!who || !q) return;
    var d = masteryStore();
    var row = rowFor(who);
    var t = topicOf(q);
    if (!row.topics[t]) row.topics[t] = { n: 0, ok: 0, last: "" };
    row.topics[t].n += 1;
    if (ok) row.topics[t].ok += 1;
    row.topics[t].last = iso || "";
    d[who] = row;
    saveJSON(MASTERY, d);
  }
  function finish(who, rec) {
    if (!who) return;
    var d = masteryStore();
    var row = rowFor(who);
    row.log.push({
      iso: rec.iso || "",
      course: rec.course || "",
      score: rec.score || 0,
      n: rec.n || 0,
      topics: rec.topics || {},
      at: new Date().toISOString()
    });
    if (row.log.length > 40) row.log = row.log.slice(-40);
    d[who] = row;
    saveJSON(MASTERY, d);
  }
  function ratio(cell) {
    if (!cell || !cell.n) return null;
    return cell.ok / cell.n;
  }
  function overall(who) {
    var t = (rowFor(who).topics) || {};
    var n = 0, ok = 0;
    Object.keys(t).forEach(function (k) { n += t[k].n || 0; ok += t[k].ok || 0; });
    return n ? ok / n : null;
  }
  function weakTopics(who) {
    var t = (rowFor(who).topics) || {};
    return Object.keys(t).filter(function (k) {
      return t[k].n >= 2 && (t[k].ok / t[k].n) < 0.65;
    }).sort(function (a, b) { return (t[a].ok / t[a].n) - (t[b].ok / t[b].n); });
  }
  function strongTopics(who) {
    var t = (rowFor(who).topics) || {};
    return Object.keys(t).filter(function (k) {
      return t[k].n >= 3 && (t[k].ok / t[k].n) >= 0.85;
    });
  }
  function shuffle(arr) {
    var a = (arr || []).slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function shuffleChoices(q) {
    var ch = ((q && q.choices) || []).slice();
    if (ch.length < 2) return q;
    var ans = Number(q.answer);
    if (!(ans >= 0 && ans < ch.length)) ans = 0;
    var order = ch.map(function (_, i) { return i; });
    order = shuffle(order);
    var copy = {};
    Object.keys(q || {}).forEach(function (k) { copy[k] = q[k]; });
    copy.choices = order.map(function (i) { return ch[i]; });
    copy.answer = order.indexOf(ans);
    copy.topic = topicOf(q);
    copy.level = levelOf(q);
    return copy;
  }
  function banned(q) {
    var blob = stemKey(q) + " " + ((q && q.choices) || []).join(" ");
    return /tickler|open file|ice-blue|onescreen|hall pass|pin pad|teleprompter|rocket docket|chromebook|lcars|firm 285/.test(blob);
  }
  var POOL = { ILS: null, LS: null };
  var FALLBACK = [
    { stem: "A lawyer's job includes", choices: ["giving the client courtroom advice from a student intern", "keeping the file, meeting deadlines, and not giving legal advice as a clerk", "deciding guilt before the hearing", "posting the file in the hallway"], answer: 1, topic: "office", level: 1 },
    { stem: "Due process, at minimum, is", choices: ["a vibe that the school was fair", "notice of the charge and a chance to be heard", "a jury in every school office", "the principal acting as accuser and judge"], answer: 1, topic: "process", level: 1 },
    { stem: "If a client asks whether they will win, a clerk", choices: ["predicts the outcome", "routes the advice question to the partner", "quotes a statute as advice", "says yes to keep the client calm"], answer: 1, topic: "upl", level: 1 },
    { stem: "Confidentiality means", choices: ["hallway talk is fine if names are skipped", "client information is not hallway talk", "the file may be posted after dismissal", "only the judge may see the file"], answer: 1, topic: "privilege", level: 1 },
    { stem: "Maryland's trial court of general jurisdiction is the", choices: ["District Court", "Circuit Court", "Court of Appeals of the United States", "school board"], answer: 1, topic: "courts", level: 1 },
    { stem: "The Baltimore City State's Attorney", choices: ["defends people who cannot pay", "prosecutes criminal cases for the State", "writes Maryland statutes", "sits as the jury"], answer: 1, topic: "criminal", level: 1 },
    { stem: "A summons tells a person", choices: ["the jury already voted", "they must answer a case or appear", "their lawyer is appointed tonight", "limitations already ran"], answer: 1, topic: "courts", level: 1 },
    { stem: "Evidence from an unlawful search, after Mapp,", choices: ["can still be used in state court", "cannot be used in state court", "is only excluded in federal court", "must go to the jury anyway"], answer: 1, topic: "search", level: 2 },
    { stem: "The Fifth Amendment includes", choices: ["a free lawyer for every office chat", "the right against forced self-incrimination", "a public trial with appointed counsel", "the right to keep a phone a shop is repairing"], answer: 1, topic: "criminal", level: 1 },
    { stem: "Maryland statutes are written by the", choices: ["U.S. Congress sitting in Annapolis", "Maryland General Assembly", "Baltimore City State's Attorney", "Supreme Court of Maryland"], answer: 1, topic: "sources", level: 1 },
    { stem: "A caption on a paper is", choices: ["the lawyer's private nickname for the file", "the court, parties, and case number at the top", "the last paragraph of advice", "the school's room number"], answer: 1, topic: "file", level: 1 },
    { stem: "Goss v. Lopez is about", choices: ["school searches of backpacks", "notice and a chance to be heard before a serious school suspension", "the right to a jury in District Court", "appointed counsel in every civil case"], answer: 1, topic: "process", level: 2 }
  ];
  function nyDate() {
    try {
      var map = {}, parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit"
      }).formatToParts(new Date());
      parts.forEach(function (x) { map[x.type] = x.value; });
      return map.year + "-" + map.month + "-" + map.day;
    } catch (e) { return ""; }
  }
  var WEEK = {
  "2026-10-05": [
    {
      "stem": "A man is charged with a felony in a state court. He asks for a lawyer. He cannot pay. The state refuses. Gideon requires the state to",
      "choices": [
        "provide a lawyer for that felony case",
        "provide a lawyer only if the charge is capital",
        "let the student tell him how to plead",
        "move the case to federal court because he cannot pay"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "That same man asks you, 'So do I plead guilty?' The last line you may write is",
      "choices": [
        "I will give your question to the partner.",
        "Plead not guilty. That is safer.",
        "You will win if you stay quiet.",
        "Waive the lawyer and go faster."
      ],
      "answer": 0,
      "topic": "upl",
      "level": 3
    },
    {
      "stem": "A Baltimore felony is set for a jury. The trial that can hold that jury is usually in",
      "choices": [
        "Circuit Court",
        "District Court",
        "the commissioner's room",
        "a school office"
      ],
      "answer": 0,
      "topic": "courts",
      "level": 3
    },
    {
      "stem": "On a Maryland misdemeanor, District Court usually",
      "choices": [
        "has no jury",
        "is the state's court of last resort",
        "retries every Circuit case from the start",
        "writes the Maryland Code"
      ],
      "answer": 0,
      "topic": "courts",
      "level": 2
    },
    {
      "stem": "The State proves three elements of a four-element crime. The result is",
      "choices": [
        "no crime, because one element is missing",
        "a conviction, because most elements were proved",
        "a civil judgment for the victim",
        "an automatic reversal"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "An appellate court, unlike the trial court,",
      "choices": [
        "checks the law. It does not start over with new witnesses.",
        "hears the witnesses again and picks a new winner",
        "sets bail at the first appearance",
        "writes statutes"
      ],
      "answer": 0,
      "topic": "courts",
      "level": 3
    },
    {
      "stem": "A student is suspended for five days. Nobody states the charge, and nobody lets her speak, before the days start. Goss says the school missed",
      "choices": [
        "notice and a chance to be heard",
        "a jury",
        "a commissioner",
        "federal jurisdiction"
      ],
      "answer": 0,
      "topic": "process",
      "level": 3
    },
    {
      "stem": "Article 24 of the Maryland Declaration of Rights is",
      "choices": [
        "Maryland's due-process sentence",
        "the federal felony-counsel case",
        "a school-suspension form",
        "permission for a student to give advice"
      ],
      "answer": 0,
      "topic": "sources",
      "level": 2
    },
    {
      "stem": "You have a statute and a case opinion. The legislature's rule is in the",
      "choices": [
        "statute",
        "opinion",
        "client's text",
        "hallway summary"
      ],
      "answer": 0,
      "topic": "sources",
      "level": 3
    },
    {
      "stem": "A charge on a charging document is",
      "choices": [
        "an accusation, not a conviction",
        "the jury's verdict",
        "advice from the partner",
        "proof beyond a reasonable doubt by itself"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 2
    },
    {
      "stem": "The client starts repeating a fact from the file in the hallway. You",
      "choices": [
        "stop the talk and take it back to the file",
        "finish the story so the class can help",
        "post it for the next period",
        "text it to a friend who is good at law"
      ],
      "answer": 0,
      "topic": "privilege",
      "level": 3
    },
    {
      "stem": "Federal school funds, and a school officer on scene, make a Maryland disorderly-conduct charge",
      "choices": [
        "still a Maryland case, unless a federal crime is actually charged",
        "a federal criminal case automatically",
        "a civil negligence case",
        "an appeal in the Supreme Court of Maryland"
      ],
      "answer": 0,
      "topic": "courts",
      "level": 3
    }
  ],
  "2026-10-06": [
    {
      "stem": "Andre stood before a District Court commissioner. He could not pay. No lawyer was there. Bail was set. DeWolfe holds that Article 24",
      "choices": [
        "requires the State to furnish a lawyer at that initial appearance",
        "requires a lawyer only at the felony trial",
        "lets you tell him whether to post bail",
        "applies only to school suspensions"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "Gideon and DeWolfe. The commissioner is",
      "choices": [
        "DeWolfe. Gideon was the felony trial.",
        "Gideon. DeWolfe was a school case.",
        "neither. A commissioner is a federal jury.",
        "both. Both cases are about the jury."
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "Andre gets a lawyer the next day, in front of a judge. Under DeWolfe, the missing lawyer at the commissioner",
      "choices": [
        "is not cured by the later hearing",
        "is cured, because he has a lawyer now",
        "turns the case civil",
        "means he must plead guilty"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "Andre asks, 'Should I waive the lawyer so I can go home?' You write",
      "choices": [
        "I will give your question to the partner.",
        "Yes. Waive it.",
        "No. Never waive.",
        "Post the bail. That is not advice."
      ],
      "answer": 0,
      "topic": "upl",
      "level": 3
    },
    {
      "stem": "A commissioner appearance is",
      "choices": [
        "the first stop, where bail can be set. It is not the trial.",
        "the jury trial",
        "the Supreme Court of Maryland",
        "a school suspension hearing"
      ],
      "answer": 0,
      "topic": "courts",
      "level": 3
    },
    {
      "stem": "At a criminal appearance, the State's Attorney represents",
      "choices": [
        "the State",
        "the person who cannot pay",
        "the student clerk",
        "the jury"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 2
    },
    {
      "stem": "When the law requires one, a public defender represents",
      "choices": [
        "the accused who cannot pay",
        "the State",
        "only the victim",
        "the commissioner"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 2
    },
    {
      "stem": "A Baltimore felony jury trial is usually held in",
      "choices": [
        "Circuit Court",
        "the commissioner's room",
        "the General Assembly",
        "District Court, because it has no jury"
      ],
      "answer": 0,
      "topic": "courts",
      "level": 3
    },
    {
      "stem": "Miss one element. The crime",
      "choices": [
        "fails",
        "is proved if the story is sad",
        "becomes a civil complaint",
        "is cured on appeal automatically"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "The opinion is the court's decision. The statute is",
      "choices": [
        "the legislature's written rule",
        "whatever the client remembers",
        "the hallway version",
        "advice"
      ],
      "answer": 0,
      "topic": "sources",
      "level": 3
    },
    {
      "stem": "Five-day suspension. No chance to speak before the days start. That problem is",
      "choices": [
        "Goss, not DeWolfe",
        "DeWolfe, because every loss needs a commissioner",
        "Gideon, because school is a felony",
        "a jury question"
      ],
      "answer": 0,
      "topic": "process",
      "level": 3
    },
    {
      "stem": "A stranger opens the jacket and cannot tell the next step. The file failed because it was not",
      "choices": [
        "named, dated, and housed",
        "read aloud in the hallway",
        "turned into advice",
        "sent to federal court"
      ],
      "answer": 0,
      "topic": "file",
      "level": 3
    }
  ],
  "2026-10-07": [
    {
      "stem": "Wednesday is the textbook. A client still asks what he should do. You",
      "choices": [
        "give the question to the partner. The book does not make it your advice.",
        "answer him, because there is no case brief today",
        "copy a page and hand it to him as the answer",
        "tell him to waive counsel"
      ],
      "answer": 0,
      "topic": "upl",
      "level": 3
    },
    {
      "stem": "A letter that never names the person it is written to",
      "choices": [
        "has not started. Name the recipient before you ask for anything.",
        "is finished if the date is at the top",
        "is legal advice",
        "is a case brief"
      ],
      "answer": 0,
      "topic": "office",
      "level": 3
    },
    {
      "stem": "A bill in this office is",
      "choices": [
        "a record of work. It is not a guess and it is not advice.",
        "the holding of today's case",
        "permission to tell the client what to file",
        "the jury's verdict"
      ],
      "answer": 0,
      "topic": "office",
      "level": 3
    },
    {
      "stem": "You were told to stop at the end of one section. The next heading",
      "choices": [
        "is not today's work",
        "is required if it looks important",
        "is the brief",
        "is advice"
      ],
      "answer": 0,
      "topic": "sources",
      "level": 3
    },
    {
      "stem": "Civil contempt. The person cannot pay a lawyer. The proceeding can put them in jail. Rutherford holds that Maryland must",
      "choices": [
        "provide counsel, because jail is on the table",
        "refuse counsel, because the case is civil",
        "let the student advise the plea",
        "send the case to a school suspension hearing"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "DeWolfe's door, compared with Rutherford's door,",
      "choices": [
        "is the commissioner. Rutherford is jail for civil contempt.",
        "is the felony trial. Rutherford is a school search.",
        "is the same hearing",
        "is a jury in District Court"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "Gideon still means",
      "choices": [
        "a lawyer at the felony trial if the accused cannot pay",
        "a lawyer for every hallway question",
        "no lawyer until after the verdict",
        "a lawyer only in federal court"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "The State proves three of four elements. You mark",
      "choices": [
        "no crime",
        "guilty of most of it",
        "a civil win",
        "cured, because a lawyer showed up later"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "Notice of the charge, and a chance to speak, before a short school suspension, is",
      "choices": [
        "Goss",
        "DeWolfe",
        "a statute the student may enforce by advice",
        "the jury"
      ],
      "answer": 0,
      "topic": "process",
      "level": 3
    },
    {
      "stem": "Article 24 is",
      "choices": [
        "Maryland's due-process sentence",
        "the Sixth Amendment's exact words",
        "a form the commissioner signs",
        "permission to advise"
      ],
      "answer": 0,
      "topic": "sources",
      "level": 2
    },
    {
      "stem": "The client repeats a file fact in the hall. You",
      "choices": [
        "stop it and take it back to the file",
        "let the class workshop it",
        "post the quote",
        "treat it as the holding"
      ],
      "answer": 0,
      "topic": "privilege",
      "level": 3
    },
    {
      "stem": "An appellate court",
      "choices": [
        "reviews the law. It is not a second trial.",
        "sets bail at 3 a.m.",
        "writes the Code",
        "gives the client advice through you"
      ],
      "answer": 0,
      "topic": "courts",
      "level": 3
    }
  ],
  "2026-10-08": [
    {
      "stem": "Today's new case has not been opened. From the Fifth Amendment, what you already know is",
      "choices": [
        "the right against forced self-incrimination",
        "that every police question needs a warrant",
        "that a student may tell the client to talk",
        "that silence is always guilt"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "A person may be jailed for civil contempt and cannot pay a lawyer. Rutherford requires",
      "choices": [
        "state-furnished counsel",
        "no counsel, because the caption says civil",
        "advice from the student on whether to pay",
        "a jury in District Court"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "Andre, the commissioner, no lawyer, bail set. DeWolfe requires",
      "choices": [
        "a lawyer at that appearance if he cannot pay",
        "a lawyer only if the trial is a felony",
        "you to tell him to waive it",
        "a school hearing"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "He asks what to do about the bail. The memo ends",
      "choices": [
        "I will give your question to the partner.",
        "Post it.",
        "Do not post it.",
        "Waive counsel. I checked."
      ],
      "answer": 0,
      "topic": "upl",
      "level": 3
    },
    {
      "stem": "Gideon, DeWolfe, and Rutherford are three doors. The felony trial is",
      "choices": [
        "Gideon",
        "DeWolfe",
        "Rutherford",
        "Goss"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "The commissioner is",
      "choices": [
        "DeWolfe's door",
        "Gideon's jury",
        "a statute",
        "advice"
      ],
      "answer": 0,
      "topic": "courts",
      "level": 3
    },
    {
      "stem": "Jail for civil contempt is",
      "choices": [
        "Rutherford's door",
        "a hallway conversation",
        "District Court with a jury",
        "cured if a lawyer appears the next week"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "A later lawyer does not, under DeWolfe,",
      "choices": [
        "erase the missing lawyer at the commissioner",
        "start a civil complaint",
        "write Article 24",
        "create federal jurisdiction"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "Five days out of school. No notice, no chance to speak, before the days start. Name the case.",
      "choices": [
        "Goss v. Lopez",
        "DeWolfe v. Richmond",
        "Gideon v. Wainwright",
        "Marbury v. Madison"
      ],
      "answer": 0,
      "topic": "process",
      "level": 3
    },
    {
      "stem": "District Court, Maryland misdemeanor.",
      "choices": [
        "No jury.",
        "The court of last resort.",
        "Where the General Assembly sits.",
        "Where you give the plea."
      ],
      "answer": 0,
      "topic": "courts",
      "level": 2
    },
    {
      "stem": "One element is not in the file. You write",
      "choices": [
        "it is not in the file. You do not invent it.",
        "it is close enough",
        "the client probably did it",
        "advice: plead"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "The legislature's words live in the statute. The court's decision on a real dispute is",
      "choices": [
        "the opinion",
        "the client's wish",
        "your last line",
        "the hallway version"
      ],
      "answer": 0,
      "topic": "sources",
      "level": 3
    }
  ],
  "2026-10-09": [
    {
      "stem": "Custody plus interrogation. Miranda requires",
      "choices": [
        "the warnings before the prosecution uses the statement",
        "the warnings for every question any person asks",
        "no warnings, because the Fifth Amendment was repealed",
        "a student to tell the client to talk"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "An officer asks someone's name on the sidewalk. The person is not under arrest. Miranda warnings are",
      "choices": [
        "not required yet. This is not custodial interrogation.",
        "required for every question a police officer asks",
        "required only in federal court",
        "a statute the General Assembly wrote last week"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "The warnings are not a favor. They protect",
      "choices": [
        "the right against forced self-incrimination",
        "the right to a jury in District Court",
        "the student's right to advise",
        "a school suspension"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "The client asks, 'Should I talk to the detective tonight?' You",
      "choices": [
        "give that question to the partner",
        "say yes, cooperation helps",
        "say no, always stay silent",
        "read the warning and tell him which to pick"
      ],
      "answer": 0,
      "topic": "upl",
      "level": 3
    },
    {
      "stem": "DeWolfe's commissioner and Miranda's interrogation are",
      "choices": [
        "different doors. Do not use one case's facts as the other's holding.",
        "the same hearing",
        "both school cases",
        "both cured if a lawyer appears a week later"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "Andre could not pay. No lawyer at the commissioner. Bail was set. The case is",
      "choices": [
        "DeWolfe, under Article 24",
        "Miranda, because bail is a warning",
        "Goss, because the school was involved",
        "advice you may give"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "Civil contempt, jail possible, no money for a lawyer. The case is",
      "choices": [
        "Rutherford",
        "a hallway privilege problem",
        "District Court with a jury by default",
        "cured by a later lawyer"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "Felony trial, cannot pay, state refuses a lawyer. The case is",
      "choices": [
        "Gideon",
        "today's unread Maryland case",
        "a bill for office time",
        "a caption"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "The prosecution wants to use answers from a custodial interrogation. No warnings were given. Miranda says those answers",
      "choices": [
        "may not be used",
        "come in, because he spoke",
        "come in, if the story is true",
        "are advice"
      ],
      "answer": 0,
      "topic": "criminal",
      "level": 3
    },
    {
      "stem": "Article 24 and the Fifth Amendment. Article 24 is",
      "choices": [
        "Maryland's due-process sentence",
        "the warnings script",
        "permission to advise",
        "the jury"
      ],
      "answer": 0,
      "topic": "sources",
      "level": 2
    },
    {
      "stem": "You brief by",
      "choices": [
        "citation, facts, issue, holding. Then you stop. You do not advise.",
        "the holding only, from memory",
        "telling the client which fact to hide",
        "copying a news story over the opinion"
      ],
      "answer": 0,
      "topic": "sources",
      "level": 3
    },
    {
      "stem": "A fact is not on the file. You",
      "choices": [
        "write that it is not on the file",
        "add it so the brief is stronger",
        "ask the client to agree it happened",
        "treat it as an element"
      ],
      "answer": 0,
      "topic": "file",
      "level": 3
    }
  ]
};
  function loadPool() {
    var urls = ["data/quiz-pool.json", "/data/quiz-pool.json", "http://ituxpro.local:8080/data/quiz-pool.json"];
    function one(i) {
      if (i >= urls.length) return Promise.resolve(POOL);
      return fetch(urls[i], { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        if (j && (j.ILS || j.LS)) {
          if (j.ILS) POOL.ILS = j.ILS;
          if (j.LS) POOL.LS = j.LS;
          return POOL;
        }
        return one(i + 1);
      }).catch(function () { return one(i + 1); });
    }
    return one(0);
  }
  loadPool();
  function bankFor(course) {
    var c = String(course || "");
    var ls = c === "LS" || c.indexOf("LS") === 0;
    var pool = ls ? POOL.LS : POOL.ILS;
    if (pool && pool.length) return pool.slice();
    if (POOL.LS && POOL.LS.length) return POOL.LS.slice();
    if (POOL.ILS && POOL.ILS.length) return POOL.ILS.slice();
    return FALLBACK.slice();
  }
  function pick(who, lists) {
    var seen = seenFor(who);
    var used = {};
    var out = [];
    var want = 12;
    var iso = (lists && lists.iso) || nyDate();
    var week = WEEK[iso];
    if (week && week.length) {
      var seenW = seenFor(who);
      var fresh = week.filter(function (q) {
        return q && stemKey(q) && !banned(q) && !seenW[stemKey(q)];
      });
      if (fresh.length < 8) fresh = week.filter(function (q) { return q && stemKey(q) && !banned(q); });
      return shuffle(fresh).slice(0, want).map(shuffleChoices);
    }
    var bank = ((lists && lists.bank) || bankFor((lists && lists.course) || "")).filter(function (q) {
      return q && stemKey(q) && !banned(q);
    });
    function add(list, extra) {
      shuffle(list || []).forEach(function (q) {
        if (out.length >= want) return;
        if (extra && extra.topic && topicOf(q) !== extra.topic) return;
        if (extra && extra.level && levelOf(q) < extra.level) return;
        if (extra && extra.maxLevel && levelOf(q) > extra.maxLevel) return;
        var k = stemKey(q);
        if (!k || used[k] || seen[k]) return;
        used[k] = 1;
        out.push(shuffleChoices(q));
      });
    }
    var weak = weakTopics(who);
    var ov = overall(who);
    if (ov == null) {
      add(bank, { maxLevel: 2 });
      add(bank);
    } else if (ov < 0.6 || weak.length) {
      weak.forEach(function (t) { add(bank, { topic: t, maxLevel: 2 }); });
      add(bank, { maxLevel: 2 });
      add(bank);
    } else if (ov >= 0.85) {
      add(bank, { level: 3 });
      add(bank, { maxLevel: 2 });
      add(bank);
    } else {
      add(bank, { maxLevel: 2 });
      add(bank, { level: 3 });
      add(bank);
    }
    if (out.length < want) {
      seen = {};
      add(bank);
    }
    if (out.length < want) {
      add(FALLBACK);
    }
    if (!out.length) {
      out = FALLBACK.map(shuffleChoices);
    }
    return out.slice(0, want);
  }
  function snapshot(who) {
    var row = rowFor(who);
    var topics = {};
    Object.keys(row.topics || {}).forEach(function (k) {
      var c = row.topics[k];
      topics[k] = { n: c.n, ok: c.ok, pct: c.n ? Math.round(100 * c.ok / c.n) : null, last: c.last };
    });
    return { who: who, overall: overall(who), weak: weakTopics(who), strong: strongTopics(who), topics: topics, log: row.log || [] };
  }
  function courseMatch(have, want) {
    if (!want) return true;
    if (have === want) return true;
    if (want === "LS" && (have === "LS-1" || have === "LS-2" || have === "LS")) return true;
    if ((want === "LS-1" || want === "LS-2") && have === "LS") return true;
    return false;
  }
  function rollup(quizzes, roster, course) {
    var byWho = {};
    Object.keys(quizzes || {}).forEach(function (iso) {
      var day = quizzes[iso] || {};
      Object.keys(day).forEach(function (c) {
        if (!courseMatch(c, course)) return;
        Object.keys(day[c] || {}).forEach(function (who) {
          var rec = day[c][who] || {};
          if (!byWho[who]) byWho[who] = { who: who, n: 0, ok: 0, topics: {}, last: rec, days: 0 };
          byWho[who].n += rec.n || 0;
          byWho[who].ok += rec.score || 0;
          byWho[who].days += 1;
          byWho[who].last = rec;
          var ts = rec.topics || {};
          Object.keys(ts).forEach(function (t) {
            if (!byWho[who].topics[t]) byWho[who].topics[t] = { n: 0, ok: 0 };
            byWho[who].topics[t].n += (ts[t].n || 0);
            byWho[who].topics[t].ok += (ts[t].ok || 0);
          });
        });
      });
    });
    (roster || []).forEach(function (s) {
      var who = s.name || s;
      if (!byWho[who]) byWho[who] = { who: who, n: 0, ok: 0, topics: {}, last: null, days: 0 };
    });
    return Object.keys(byWho).map(function (k) {
      var r = byWho[k];
      r.pct = r.n ? r.ok / r.n : null;
      r.weak = Object.keys(r.topics).filter(function (t) {
        return r.topics[t].n >= 2 && r.topics[t].ok / r.topics[t].n < 0.65;
      });
      r.intervene = (r.pct != null && r.pct < 0.6 && r.n >= 6) || r.weak.length >= 1;
      r.advance = r.pct != null && r.pct >= 0.85 && r.n >= 8 && !r.weak.length;
      return r;
    }).sort(function (a, b) {
      var ap = a.pct == null ? 99 : a.pct;
      var bp = b.pct == null ? 99 : b.pct;
      return ap - bp;
    });
  }
  window.LawQuiz = {
    pick: pick,
    remember: remember,
    record: record,
    finish: finish,
    stemKey: stemKey,
    topicOf: topicOf,
    shuffleChoices: shuffleChoices,
    bankFor: bankFor,
    loadPool: loadPool,
    snapshot: snapshot,
    rollup: rollup,
    labels: LABELS,
    overall: overall,
    weakTopics: weakTopics
  };
})();
