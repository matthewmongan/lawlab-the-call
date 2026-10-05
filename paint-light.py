#!/usr/bin/env python3
"""Cream page, dark type. Button and graph fills stay the pantone set."""
import os
from pathlib import Path

ROOT = Path(os.environ.get("LAWLAB_ROOT", "/srv/lawlab/corpus"))
LINK = '<link rel="stylesheet" href="/css/palette.css?v=1">'
REPL = [
    ("--bg:#000", "--bg:#f6f1e7"),
    ("--bg: #000", "--bg: #f6f1e7"),
    ("--ink:#000", "--ink:#1a140e"),
    ("--ink: #000", "--ink: #1a140e"),
    ("background:#000", "background:#f6f1e7"),
    ("background: #000", "background: #f6f1e7"),
    ("background:#111", "background:#fff"),
    ("background:#140e08", "background:#efe6d6"),
    ("color:var(--peach)", "color:var(--ink)"),
    ("color: var(--peach)", "color: var(--ink)"),
    ("color:#ffcc99", "color:#1a140e"),
    ("color: #ffcc99", "color: #1a140e"),
    ("color:var(--ice)", "color:#1e3a5f"),
    ("color: var(--ice)", "color: #1e3a5f"),
    ("color:#99ccff", "color:#1e3a5f"),
    ("color: #99ccff", "color: #1e3a5f"),
    ("color:#9cf", "color:#1e3a5f"),
    ("color:var(--gold)", "color:#9a3412"),
    ("color: var(--gold)", "color: #9a3412"),
    ("color:var(--orange)", "color:#9a3412"),
    ("color:#ff9900", "color:#9a3412"),
    ("color: #ff9900", "color: #9a3412"),
    ("color:#f90", "color:#9a3412"),
    ("outline:3px solid #ffcc99", "outline:3px solid #9a3412"),
    ("scrollbar-color:#ff9900 #000", "scrollbar-color:#ff9900 #f6f1e7"),
    ("background:#000;flex-shrink:0;position:relative;z-index:10000",
     "background:#f6f1e7;flex-shrink:0;position:relative;z-index:10000"),
]
n = 0
for p in ROOT.rglob("*"):
    if "node_modules" in p.parts or p.name == "palette.css":
        continue
    if p.suffix not in {".html", ".css", ".js"}:
        continue
    try:
        t = p.read_text(encoding="utf-8")
    except Exception:
        continue
    orig = t
    for a, b in REPL:
        t = t.replace(a, b)
    t = t.replace("background:#f6f1e7c", "background:#000c")
    t = t.replace("background: #f6f1e7c", "background: #000c")
    if p.suffix == ".html" and "palette.css" not in t:
        if "<head>" in t:
            t = t.replace("<head>", "<head>\n" + LINK, 1)
        else:
            t = LINK + "\n" + t
    if t != orig:
        p.write_text(t, encoding="utf-8")
        n += 1
print("painted", n)
