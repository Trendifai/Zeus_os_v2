#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ZEUS Wiki Compiler - Protocol Karpathy
Genera zeus_context.txt da src/wiki/index/*.md
"""

import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

WIKI_INDEX = "src/wiki/index"
OUTPUT_FILE = "src/zeus_context.txt"
LOG_FILE = "src/wiki/log/maintenance.md"


def lint_markdown(content: str) -> str:
    """Linter: forza H1 obbligatorio, no doppie righe vuote, trim finale."""
    lines = content.split('\n')
    
    if not lines or not lines[0].startswith('# '):
        raise ValueError("H1 obbligatorio in cima al file")
    
    result = []
    prev_empty = False
    for line in lines:
        is_empty = len(line.strip()) == 0
        if is_empty and prev_empty:
            continue
        result.append(line)
        prev_empty = is_empty
    
    return '\n'.join(result).strip() + '\n'


def compile_wiki():
    print("[ZEUS] Wiki Compiler - Protocol Karpathy")
    print("=" * 40)
    
    files = sorted([f for f in os.listdir(WIKI_INDEX) if f.endswith('.md')])
    
    if not files:
        print("[!] No .md files found")
        return
    
    print(f"[+] Found {len(files)} documents")
    
    output = []
    tokens = 0
    
    for fname in files:
        path = os.path.join(WIKI_INDEX, fname)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        cleaned = lint_markdown(content)
        tokens += len(cleaned.split())
        
        doc_tag = f"<document path='wiki/index/{fname}'>\n"
        output.append(f"{doc_tag}{cleaned}</document>\n")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output))
    
    print(f"[OK] Written: {OUTPUT_FILE}")
    print(f"[i] Documents: {len(files)}")
    print(f"[i] Tokens: ~{tokens}")


if __name__ == "__main__":
    compile_wiki()