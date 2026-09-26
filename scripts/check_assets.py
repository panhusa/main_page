#!/usr/bin/env python3
"""Report local files referenced by the site's HTML/CSS that don't exist.

Usage: python3 scripts/check_assets.py   (exit code 1 if anything is missing)
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
CSS_URL = re.compile(r"""url\(\s*(['"]?)(.*?)\1\s*\)""")
CSS_ESCAPE = re.compile(r"\\(.)")


def is_local(ref):
    parts = urlsplit(ref)
    # Root-absolute paths (/netdata/...) are proxied by nginx, not files here.
    return ref and not parts.scheme and not parts.netloc and not ref.startswith(("#", "/"))


class RefParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ("src", "href") and value:
                self.refs.append(value)


def refs_in(path):
    text = path.read_text(encoding="utf-8")
    if path.suffix == ".css":
        return [CSS_ESCAPE.sub(r"\1", m.group(2)) for m in CSS_URL.finditer(text)]
    parser = RefParser()
    parser.feed(text)
    return parser.refs


def missing_assets(root=ROOT):
    missing = []
    for path in sorted(root.rglob("*")):
        if path.suffix not in (".html", ".css") or ".git" in path.parts:
            continue
        for ref in refs_in(path):
            if not is_local(ref):
                continue
            target = (path.parent / unquote(urlsplit(ref).path)).resolve()
            if not target.exists():
                missing.append((path.relative_to(root), ref))
    return missing


def main():
    missing = missing_assets()
    for source, ref in missing:
        print(f"{source}: missing {ref}")
    print(f"{len(missing)} missing reference(s)")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
