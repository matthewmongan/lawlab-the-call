#!/usr/bin/env python3
import os
from pathlib import Path
ROOT = Path(os.environ.get("LAWLAB_ROOT", "/srv/lawlab/corpus"))
src = Path("/tmp/lecture-mail.html")
raw = src.read_bytes() if src.is_file() else b""
nlec = 0
if b"lawlab.mailshot" in raw:
    for p in ROOT.rglob("lecture.html"):
        if "node_modules" in p.parts:
            continue
        if p.resolve() == src.resolve():
            continue
        p.write_bytes(raw)
        nlec += 1
        print("lecture", p)
else:
    print("LECTURE_SRC_BAD")
old = '''    if not force and TAPE_ONCE.get(key, {}).get("ok") and not TAPE_ONCE.get(key, {}).get("pending"):
        return {"ok": True, "kind": "email", "skipped": True, "printer": TAPE_ONCE[key].get("printer"), "note": "email tape already sent"}
'''
new = '''    if not force and key in TAPE_ONCE:
        prev = TAPE_ONCE.get(key) or {}
        return {"ok": True, "kind": "email", "skipped": True, "printer": prev.get("printer"), "note": "email tape already sent"}
    TAPE_ONCE[key] = {"ok": True, "pending": True, "printer": printer}
'''
nsrv = 0
for p in ROOT.rglob("lcars-server.py"):
    if "node_modules" in p.parts:
        continue
    t = p.read_text(errors="replace")
    if old not in t:
        print("server skip", p)
        continue
    p.write_text(t.replace(old, new, 1))
    nsrv += 1
    print("server", p)
print("lectures", nlec, "servers", nsrv)
