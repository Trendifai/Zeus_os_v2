#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ZEUS Wiki Compiler - Protocol Karpathy
Legge src/wiki/index/ e genera src/zeus_context.txt con tag XML <document>
"""

import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

WIKI_INDEX = "src/wiki/index"
OUTPUT_FILE = "src/zeus_context.txt"
LOG_FILE = "src/wiki/log/maintenance.md"


def compress(text):
    """Caveman Protocol Compression: rimuove spazi vuoti superflui"""
    lines = text.split('\n')
    result = []
    prev_empty = False
    
    for line in lines:
        is_empty = len(line.strip()) == 0
        if is_empty and prev_empty:
            continue
        result.append(line)
        prev_empty = is_empty
    
    return '\n'.join(result).strip() + '\n'


def compile():
    print("[ZEUS] Wiki Compiler - Protocol Karpathy")
    print("=" * 50)
    
    files = []
    for root, dirs, filenames in os.walk(WIKI_INDEX):
        for fname in sorted(filenames):
            if fname.endswith('.md') and not fname.startswith('.'):
                files.append(os.path.join(root, fname))
    
    if not files:
        print("[!] No .md files found")
        return
    
    print(f"[+] Found {len(files)} documents")
    
    output_parts = []
    tokens = 0
    
    for filepath in files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        compressed = compress(content)
        
        rel_path = os.path.relpath(filepath, 'src/wiki')
        doc_tag = f"<document path='{rel_path.replace(chr(92), '/')}'>\n"
        
        output_parts.append(f"{doc_tag}{compressed}</document>\n")
        tokens += len(compressed.split())
    
    output = '\n'.join(output_parts)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(output)
    
    print(f"[OK] Written: {OUTPUT_FILE}")
    print(f"[i] Documents: {len(files)}")
    print(f"[i] Tokens: ~{tokens}")
    
    if os.path.exists(LOG_FILE):
        timestamp = __import__('datetime').datetime.now().isoformat()
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(f"\n| {timestamp} | compile_wiki | Success | {len(files)} file |\n")


if __name__ == "__main__":
    compile()