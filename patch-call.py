#!/usr/bin/env python3
"""Patch the live LawLab server and clock label for The Call. Does not replace the server file."""
from pathlib import Path

ROOT = Path("/srv/lawlab/corpus")
NEW = '''    elif kind == "vote-open":
        items = []
        raw_items = op.get("items")
        if isinstance(raw_items, list):
            for i, it in enumerate(raw_items[:4]):
                if not isinstance(it, dict):
                    continue
                text = str(it.get("text") or "").strip()
                if not text:
                    continue
                items.append({
                    "id": str(it.get("id") if it.get("id") is not None else i)[:8],
                    "text": text[:320],
                    "tone": str(it.get("tone") or "")[:12],
                })
        if not items:
            choices = [str(c)[:80] for c in (op.get("choices") or ["HOLD", "FOLD"])][:6]
            items = [{"id": c, "text": c, "tone": ""} for c in choices]
        STATE["poll"] = {
            "id": str(op.get("id") or "")[:80],
            "prompt": str(op.get("prompt") or "")[:400],
            "cite": str(op.get("cite") or "")[:180],
            "items": items,
            "choices": [it["id"] for it in items],
            "votes": {},
            "locked": False,
            "key": "",
            "at": int(__import__("time").time() * 1000),
        }
    elif kind == "vote-lock":
        poll = STATE.get("poll") or {}
        if str(op.get("id") or "") == poll.get("id"):
            poll["locked"] = True
            key = str(op.get("key") or "")[:8]
            if key in (poll.get("choices") or []):
                poll["key"] = key
            STATE["poll"] = poll
    elif kind == "vote":
        poll = STATE.get("poll") or {}
        pid = str(op.get("id") or "")
        choice = str(op.get("choice") or "")[:8]
        device = str(op.get("device") or "")[:40]
        if (
            device
            and pid
            and pid == poll.get("id")
            and not poll.get("locked")
            and choice in (poll.get("choices") or [])
        ):
            votes = dict(poll.get("votes") or {})
            votes[device] = choice
            poll["votes"] = votes
            STATE["poll"] = poll
'''

def main():
    srv = ROOT / "docs" / "lcars-server.py"
    text = srv.read_text()
    if 'elif kind == "vote-lock":' in text:
        print("server already has The Call")
    else:
        start = text.find('    elif kind == "vote-open":')
        end = text.find('    elif kind == "call":', start if start >= 0 else 0)
        if start >= 0 and end > start:
            text = text[:start] + NEW + text[end:]
            print("server patched")
        else:
            needle = '    elif kind == "call":'
            if needle not in text:
                raise SystemExit("server shape not recognized")
            text = text.replace(needle, NEW + needle, 1)
            print("server inserted")
        srv.write_text(text)
    kit = ROOT / "js" / "kit.js"
    kt = kit.read_text()
    kt2 = kt.replace(
        '{ id: "play", start: socEnd, end: len, label: "PHONE VOTE" }',
        '{ id: "play", start: socEnd, end: len, label: "THE CALL" }',
    )
    if kt2 != kt:
        kit.write_text(kt2)
        print("kit label updated")
    elif "THE CALL" in kt:
        print("kit already labeled")
    else:
        print("kit label not found, left as-is")

if __name__ == "__main__":
    main()
