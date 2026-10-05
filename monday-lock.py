#!/usr/bin/env python3
"""Lock Monday 2026-10-05 to Andre Whitfield + DeWolfe. Thermal at mail and at the lead."""
import json, os, shutil
from pathlib import Path
ROOT = Path(os.environ.get("LAWLAB_ROOT", "/srv/lawlab/corpus"))
PAY = json.loads(r"""{"file": {"id": "285-ANDRE-1005", "caption": "District Court of Maryland for Baltimore City / State of Maryland v. Andre Whitfield", "client": "Andre Whitfield", "chargeLine": "Maryland charge. Initial appearance before a District Court commissioner. No lawyer in the room.", "number": "285-ANDRE-1005", "matter": "Commissioner appearance. Andre asked for a lawyer. None was there. The question is whether that appearance required a lawyer.", "opened": "2026-10-05", "nextAction": "Brief DeWolfe. Compare it to Article 24 and to this appearance. Compare the holding to the appearance.", "facts": ["Andre Whitfield was arrested in Baltimore City on Saturday night.", "Before dawn he stood in front of a District Court commissioner. The commissioner set bail.", "Andre asked for a lawyer. He could not pay. No lawyer was in the room.", "He asks the office whether that was allowed, and what he should do next."], "ethics": "The question on the file is whether Article 24 required a lawyer at that appearance.", "docs": [{"title": "Commissioner note, Baltimore City", "kind": "appearance", "text": "Initial appearance. District Court commissioner. Defendant Andre Whitfield. Counsel: none. Defendant stated he could not pay a lawyer and asked for one. Bail set. Next date to be written on the jacket. This note is the appearance. It is the appearance."}], "objective": "Name the appearance, brief DeWolfe, Then compare the holding to the appearance.", "faces": [{"key": "client", "name": "Andre Whitfield", "role": "client", "path": "/img/clients/andre.jpg"}]}, "memo": {"id": "285-M-2026-10-05-ANDRE", "date": "2026-10-05", "from": "partner", "fromName": "M. Harper, Partner", "subject": "Brief DeWolfe. Andre Whitfield stood before a commissioner.", "body": "Andre Whitfield was arrested in Baltimore City. Before dawn he stood in front of a District Court commissioner. He asked for a lawyer. He could not pay. No lawyer was in the room. Bail was set. The question is whether Maryland had to furnish a lawyer at that appearance. You brief one Maryland case.", "steps": ["Open the library. Search DeWolfe. Read DeWolfe v. Richmond, 434 Md. 444 (2013).", "Brief it: citation, facts, issue, holding.", "Then open Maryland Declaration of Rights, Article 24. Copy the line that governs.", "Compare the holding to Andre's appearance. Do not change the charge to match the case.", "Say what DeWolfe does with a lawyer who shows up the next day."], "task": "One brief of DeWolfe, then Article 24, then Andre's appearance.", "due": "End of the period, 2026-10-05", "fileId": "285-ANDRE-1005", "subjectLine": "DeWolfe Andre Whitfield 2026-10-05"}, "slides": [{"id": "case", "kind": "need", "title": "DeWolfe v. Richmond", "graphic": "callout", "body": ["DeWolfe v. Richmond, 434 Md. 444 (2013).", "An indigent defendant is entitled to state-furnished counsel at the initial appearance before a District Court commissioner.", "The right is Article 24 of the Maryland Declaration of Rights."], "ask": "What did DeWolfe hold?", "assess": {"yes": "A lawyer at the commissioner, if he cannot pay.", "no": "Read the holding again."}}, {"id": "statute", "kind": "need", "title": "Article 24", "graphic": "split3", "body": ["Maryland Declaration of Rights, Article 24.", "Maryland's due-process sentence.", "Gideon was the felony trial. DeWolfe is the earlier door, the commissioner."], "ask": "Which text does DeWolfe use?", "assess": {"yes": "Article 24.", "no": "Not the Sixth Amendment alone."}}, {"id": "file", "kind": "ask", "title": "Andre Whitfield", "graphic": "callout", "body": ["Andre stood before a District Court commissioner.", "He asked for a lawyer. He could not pay. No lawyer was in the room.", "Bail was set. The charge is a Maryland charge."], "ask": "What happened at Andre's appearance?", "assess": {"yes": "Commissioner, no lawyer, bail set.", "no": "Use the file. Do not add facts."}}, {"id": "office", "kind": "do", "title": "The office task", "graphic": "dodont", "body": ["Brief DeWolfe: citation, facts, issue, holding.", "Then Article 24. One line, the code's words.", "Compare the holding to Andre's appearance.", "Then say whether a lawyer the next day cures the commissioner."], "ask": "Does a lawyer the next day cure the commissioner?", "assess": {"yes": "No. DeWolfe says the later hearing does not cure it.", "no": "Read the because. The later hearing does not cure it."}}], "diag": {"prompt": "Before the mail. Mark what you already know. This is not today's case.", "items": ["In a felony case, if the accused cannot pay, the state has to provide a lawyer.", "A Baltimore felony jury trial is usually in Circuit Court.", "Maryland District Court handles many smaller cases and has no jury."]}, "thermal": ["FIRM 285  2026-10-05", "ANDRE WHITFIELD", "COMMISSIONER SET BAIL", "NO LAWYER IN THE ROOM", "BRIEF DEWOLFE", "ARTICLE 24", "COMPARE IT TO THE FILE."], "entry": {"id": "dewolfe", "kind": "case", "cite": "DeWolfe v. Richmond, 434 Md. 444 (2013)", "short": "DeWolfe", "q": ["dewolfe", "richmond", "commissioner", "bail", "article 24", "art. 24", "counsel", "initial appearance"], "good_law": "GOOD", "as_of": "2026-10-05", "good_law_note": "Article 24 holding. Not overruled. Gideon was the felony trial. This case is the earlier door: the District Court commissioner.", "facts": "Quinton Richmond and other people were arrested in Baltimore City. Each said they could not pay a lawyer. Each was brought before a District Court commissioner for the first appearance. Bail could be set. The State's Attorney could be heard. They were not given a lawyer. They sued. The General Assembly then said the Public Defender statute did not require a lawyer at that appearance. The Court of Appeals decided the state constitution anyway.", "issue": "Does Article 24 of the Maryland Declaration of Rights require the State to provide a lawyer for an indigent defendant at the initial appearance before a District Court commissioner?", "holding": "Yes. Under Article 24, an indigent defendant is entitled to state-furnished counsel at an initial appearance before a District Court commissioner.", "because": "That appearance can take liberty. A later hearing with a lawyer does not cure a missing lawyer at the first one.", "plain": "If you cannot pay, Maryland has to give you a lawyer at the commissioner. Not only at the trial.", "classroom": "Monday's file is Andre Whitfield. He stood in front of a commissioner. No lawyer was in the room. Gideon was the felony trial. DeWolfe is the earlier door. Gideon was the felony trial. DeWolfe is the earlier door.", "excerpt": "Under Article 24 of the Maryland Declaration of Rights, an indigent defendant is entitled to state-furnished counsel at an initial hearing before a District Court Commissioner.\n\n— DeWolfe v. Richmond, 434 Md. 444 (2013).", "official": "https://scholarworks.law.ubalt.edu/lf/vol44/iss2/9/", "statutes": ["md-decl-24"], "reads": [{"kind": "news", "about": "the holding", "title": "Another State Recognizes Counsel is Required at First Appearance Where Liberty is at Stake", "source": "National Association of Criminal Defense Lawyers, news release, 25 Sep 2013", "url": "https://www.nacdl.org/newsrelease/NewsRelease-09-25-2013", "summary": "The NACDL release reports the Court of Appeals' 4-3 decision on 25 Sep 2013. The court held that under Article 24 an indigent defendant is entitled to state-furnished counsel at an initial hearing before a District Court commissioner. The release ties the decision to Gideon and to bail. It is a bar association's account of the holding. It is not the opinion."}, {"kind": "article", "title": "Recent Development: DeWolfe v. Richmond", "source": "Kristine L. Dietz, University of Baltimore Law Forum, Vol. 44, Iss. 2 (2014)", "url": "https://scholarworks.law.ubalt.edu/lf/vol44/iss2/9/", "summary": "Dietz reports the holding in one line: under Article 24, an indigent defendant has a right to state-furnished counsel at an initial appearance before a District Court commissioner. She notes the right attaches in a proceeding that may result in incarceration, and that a later hearing in front of a judge does not cure the missing lawyer at the commissioner. The piece is a law-review recent development. It is not the opinion."}]}, "txt": "DEWOLFE v. RICHMOND\n434 Md. 444, 76 A.3d 1019 (2013)\nCourt of Appeals of Maryland\nDecided 25 Sep 2013\n\nFACTS\nQuinton Richmond and other people were arrested in Baltimore City. Each said they could not pay a lawyer. Each was brought before a District Court commissioner for the first appearance. Bail could be set. The State's Attorney could be heard. They were not given a lawyer. They sued. The General Assembly then amended the Public Defender statute to say representation is not required at that appearance. The Court of Appeals decided the state constitution anyway.\n\nISSUE\nDoes Article 24 of the Maryland Declaration of Rights require the State to provide a lawyer for an indigent defendant at the initial appearance before a District Court commissioner?\n\nHOLDING\nYes. Under Article 24, an indigent defendant is entitled to state-furnished counsel at an initial appearance before a District Court commissioner.\n\nBECAUSE\nThat appearance can take liberty. A later hearing with a lawyer does not cure a missing lawyer at the first one.\n\nFROM THE OPINION\nUnder Article 24 of the Maryland Declaration of Rights, an indigent defendant is entitled to state-furnished counsel at an initial hearing before a District Court Commissioner.\n\nIN ENGLISH\nIf you cannot pay, Maryland has to give you a lawyer at the commissioner. Not only at the trial.\n\nIN THIS ROOM\nMonday's file is Andre Whitfield. He stood in front of a commissioner. No lawyer was in the room. Gideon was the felony trial. DeWolfe is the earlier door. Gideon was the felony trial. DeWolfe is the earlier door.\n\nGOOD LAW?\nThe Article 24 holding is the law of this state. Gideon is the felony trial. This case is the earlier door.\n", "charge": "Andre Whitfield stood before a District Court commissioner. No lawyer was in the room. Compare DeWolfe to Article 24 and to that appearance. Gideon was the trial. This case is the earlier door.", "open": "dewolfe"}""")
SKIP = {"node_modules", ".git"}

def found(name):
    out = []
    if not ROOT.is_dir():
        return out
    for p in ROOT.rglob(name):
        if SKIP.intersection(p.parts):
            continue
        out.append(p)
    return out

def lock_kit(path):
    kit = json.loads(path.read_text())
    kit["file"] = PAY["file"]
    kit["file"]["lecture"] = [
        {"h": "THE STORY", "t": "Andre Whitfield was arrested in Baltimore City on Saturday night. Before dawn he stood in front of a District Court commissioner. That room is the first stop. It is not the trial. There is no jury there. He asked for a lawyer. He could not pay. No lawyer stood with him. The commissioner set bail. The State's side can be heard at that stop. Andre's side had nobody."},
        {"h": "THIS MORNING", "t": "He is in this office the next morning. The question on the file is whether Maryland had to furnish a lawyer at that appearance."},
        {"h": "THE LEGAL PROBLEM", "t": "Gideon v. Wainwright already answered a later question. In a felony case, if you cannot pay, the state has to give you a lawyer at the trial. Andre's problem is earlier than the trial. Bail was set while he had no lawyer. The Maryland text on that problem is Article 24, the due-process sentence. The case that reads Article 24 onto this door is the one in the letter. Open it in the library. Brief it: citation, facts, issue, holding."},
    ]
    kit["memo"] = PAY["memo"]
    plan = kit.setdefault("plan", {})
    plan["title"] = "Brief DeWolfe. Andre Whitfield at the commissioner."
    plan["objective"] = "Brief DeWolfe v. Richmond and compare it to Article 24 and to Andre Whitfield's initial appearance."
    plan["collect"] = "One brief: 434 Md. 444. Then Article 24. Then Andre's appearance."
    diag = plan.setdefault("diagnostic", {})
    diag["prompt"] = PAY["diag"].get("prompt")
    diag["items"] = PAY["diag"].get("items")
    day = kit.setdefault("day", {})
    day["title"] = plan["title"]
    day["objective"] = plan["objective"]
    day["task"] = PAY["memo"]["task"]
    day["thermal"] = PAY["thermal"]
    day["exit"] = "Name the court officer Andre stood in front of, and the case that decides that appearance."
    deck = kit.setdefault("deck", {})
    deck["title"] = "DeWolfe and Andre Whitfield"
    deck["slides"] = PAY["slides"]
    notes = kit.setdefault("notes", {})
    notes["opener"] = "One client. Andre Whitfield. One case. DeWolfe v. Richmond."
    notes["closer"] = "Andre stood before a commissioner. DeWolfe says the State furnishes a lawyer if he cannot pay."
    key = kit.setdefault("key", {})
    key["subject"] = PAY["memo"].get("subjectLine")
    key["memo"] = "\n".join(PAY["memo"]["steps"])
    def scrub(o):
        if isinstance(o, dict):
            return {k: scrub(v) for k, v in o.items()}
        if isinstance(o, list):
            return [scrub(v) for v in o]
        if isinstance(o, str):
            s = o
            for a, b in (
                ("Keisha Monroe", "Andre Whitfield"),
                ("Ms. Tanya Brooks", "Andre Whitfield"),
                ("Tanya Brooks", "Andre Whitfield"),
                ("Aisha Rahman", "Andre Whitfield"),
                ("Keisha", "Andre"),
                ("Marcus", "Andre"),
                ("Brooks", "Whitfield"),
                ("Rahman", "Whitfield"),
                ("Aisha", "Andre"),
            ):
                s = s.replace(a, b)
            return s
        return o
    kit = scrub(kit)
    def clean(s):
        import re
        s = re.sub(r"(?i)[^.?!]*\b(never advice|no advice|legal advice|advice question|advice questions|give no advice|do not advise|to the partner|for the partner|route it to the partner)\b[^.?!]*[.?!]?", "", s)
        s = re.sub(r"[ ]{2,}", " ", s)
        s = re.sub(r"\n{3,}", "\n\n", s)
        return s.strip()
    def walk(o):
        if isinstance(o, dict):
            return {k: walk(v) for k, v in o.items()}
        if isinstance(o, list):
            return [walk(v) for v in o]
        if isinstance(o, str):
            return clean(o)
        return o
    kit = walk(kit)
    kit["file"]["client"] = "Andre Whitfield"
    path.write_text(json.dumps(kit, indent=2, ensure_ascii=False) + "\n")
    blob = path.read_text()
    bad = [w for w in ("Rahman", "Keisha", "Marcus", "Brooks") if w in blob]
    print("kit", path, "client", kit["file"]["client"], "bad", bad or "none")

def lock_briefs(path):
    data = json.loads(path.read_text())
    day = data.get("2026-10-05")
    if not isinstance(day, dict):
        print("brief skip", path)
        return
    day["open"] = PAY["open"]
    day["charge"] = PAY["charge"]
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print("brief", path, day.get("open"), (day.get("case") or {}).get("cite"))

def lock_mc(path):
    data = json.loads(path.read_text())
    entries = [e for e in (data.get("entries") or []) if e.get("id") != "dewolfe"]
    out, placed = [], False
    for e in entries:
        out.append(e)
        if e.get("id") == "gideon" and not placed:
            out.append(PAY["entry"])
            placed = True
    if not placed:
        out.insert(0, PAY["entry"])
    data["entries"] = out
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print("mattcite", path)

def patch_kitjs(path):
    text = path.read_text()
    old = 'statuteBit + " " + (day.charge || "Compare it to the charge on today\'s file.") + wash +'
    new = 'statuteBit + who + " " + (day.charge || "Compare it to the charge on today\'s file.") + wash +'
    who = """    var who = "";
    try {
      var fc = (kit.file && kit.file.client) || "";
      if (fc) who = " The file is " + fc + ".";
    } catch (eW) { who = ""; }
"""
    if "var who = \"\";" in text and "The file is" in text:
        print("kitjs already", path)
        return
    if old not in text:
        print("kitjs shape not found", path)
        return
    anchor = "    var statuteBit = st.cite"
    i = text.find(anchor)
    if i < 0:
        print("kitjs no statuteBit", path)
        return
    line_end = text.find("\n", i)
    text = text[:line_end+1] + who + text[line_end+1:].replace(old, new, 1)
    path.write_text(text)
    print("kitjs patched", path)

def install_lecture():
    src = Path("/tmp/lecture-monday.html")
    if not src.is_file() or "function callHtml" not in src.read_text() or 'ph.id==="mail") printPackets(false)' not in src.read_text() or "THE LEGAL PROBLEM" not in src.read_text():
        print("LECTURE_SRC_BAD")
        return
    raw = src.read_bytes()
    targets = found("lecture.html")
    if not targets:
        targets = [ROOT / "lecture.html"]
    for p in targets:
        p.parent.mkdir(parents=True, exist_ok=True)
        if p.resolve() == src.resolve():
            continue
        p.write_bytes(raw)
        print("lecture", p)

def install_quiz():
    src = Path("/tmp/quiz-pick.js")
    if not src.is_file() or "2026-10-05" not in src.read_text() or "DeWolfe holds" not in src.read_text():
        print("QUIZ_SRC_BAD")
        return
    raw = src.read_bytes()
    targets = [p for p in found("quiz-pick.js") if p.parent.name == "js"]
    if not targets:
        targets = [ROOT / "js" / "quiz-pick.js"]
    for p in targets:
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(raw)
        print("quiz", p)
    for p in found("pocket.html") + found("lab.html") + found("quiz-dash.html"):
        t = p.read_text()
        n = t.replace("quiz-pick.js?v=22", "quiz-pick.js?v=23").replace("quiz-pick.js?v=20", "quiz-pick.js?v=23")
        if n != t:
            p.write_text(n)
            print("cache", p)

def quiet_servers():
    for p in found("lcars-server.py"):
        t = p.read_text()
        n = t
        n = n.replace('        ctr("Do not advise the client."),\n        ctr("Route advice to the partner."),\n', "")
        n = n.replace('        ctr("Do not advise the client."),\n', "")
        n = n.replace('            "Five labels. One page. Last line is never advice.",\n', '            "Five labels. One page.",\n')
        n = n.replace('        lines += ["", "If the client asks what to do, write: I will give your question to the partner."]\n', "")
        n = n.replace('        "Do not give legal advice. Route advice questions to the partner.",\n', "")
        n = n.replace("Add the model’s last line: questions about what the client should do go to the partner.", "")
        n = n.replace("How will you close so a reader knows advice questions go to the partner?", "")
        n = n.replace("Where will that question live so it is the partner’s, not ours?", "")
        if n != t:
            p.write_text(n)
            print("server", p)

def main():
    kits = [p for p in found("ILS-2026-10-05.json") + found("LS-2026-10-05.json")]
    if not kits:
        print("NO_KITS under", ROOT)
    for p in kits:
        lock_kit(p)
    briefs = found("daily-briefs.json")
    for p in briefs:
        lock_briefs(p)
    mcs = found("mattcite.json")
    for p in mcs:
        lock_mc(p)
        md = p.parent / "md"
        if p.parent.name == "library":
            md.mkdir(parents=True, exist_ok=True)
            (md / "dewolfe.txt").write_text(PAY["txt"])
            print("txt", md / "dewolfe.txt")
    for p in found("kit.js"):
        if "node_modules" in p.parts:
            continue
        if p.parent.name == "js":
            patch_kitjs(p)
    install_lecture()
    install_quiz()
    quiet_servers()
    print("DONE")

if __name__ == "__main__":
    main()
