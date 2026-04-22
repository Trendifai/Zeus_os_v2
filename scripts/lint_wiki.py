#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ZEUS Wiki Linter - Protocol Karpathy
Verifica: H1 obbligatorio, no doppie righe vuote, trim finale
"""

import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

WIKI_DIR = "src/wiki"


def lint_file(filepath):
    """Linter per singolo file: H1, no doppie righe vuote, trim finale"""
    errors = []
    warnings = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    if not lines or not lines[0].startswith('# '):
        errors.append(f"{filepath}: Missing H1 (must start with '# ')")
    elif not lines[0].startswith('# '):
        errors.append(f"{filepath}: First line must be H1")
    
    prev_empty = False
    for i, line in enumerate(lines[1:], 1):
        is_empty = len(line.strip()) == 0
        if is_empty and prev_empty:
            warnings.append(f"{filepath}:{i+1}: Double empty line")
        prev_empty = is_empty
    
    if content.endswith('\n\n\n'):
        warnings.append(f"{filepath}: Multiple trailing newlines")
    
    if not content.endswith('\n'):
        warnings.append(f"{filepath}: Missing final newline")
    
    return errors, warnings


def lint_all():
    """Lint tutti i file .md nella wiki"""
    print("[ZEUS] Wiki Linter - Protocol Karpathy")
    print("=" * 50)
    
    all_errors = []
    all_warnings = []
    files_checked = 0
    
    for root, dirs, filenames in os.walk(WIKI_DIR):
        for fname in filenames:
            if fname.endswith('.md') and not fname.startswith('.'):
                filepath = os.path.join(root, fname)
                errors, warnings = lint_file(filepath)
                
                all_errors.extend(errors)
                all_warnings.extend(warnings)
                files_checked += 1
    
    print(f"[i] Files checked: {files_checked}")
    print(f"[!] Errors: {len(all_errors)}")
    print(f"[?] Warnings: {len(all_warnings)}")
    
    if all_errors:
        print("\n[ERRORS]:")
        for e in all_errors:
            print(f"  - {e}")
    
    if all_warnings:
        print("\n[WARNINGS]:")
        for w in all_warnings:
            print(f"  - {w}")
    
    if not all_errors and not all_warnings:
        print("\n[OK] All files pass lint!")
    
    return len(all_errors) == 0


def fix_file(filepath):
    """Auto-fix: rimuove doppie righe vuote, aggiunge trim finale"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    result = []
    prev_empty = False
    
    for line in lines:
        is_empty = len(line.strip()) == 0
        if is_empty and prev_empty:
            continue
        result.append(line)
        prev_empty = is_empty
    
    fixed = '\n'.join(result).strip() + '\n'
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed)
    
    print(f"[FIX] {filepath}")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == '--fix':
        print("[FIX MODE] Auto-fixing files...")
        for root, dirs, filenames in os.walk(WIKI_DIR):
            for fname in filenames:
                if fname.endswith('.md') and not fname.startswith('.'):
                    fix_file(os.path.join(root, fname))
        print("[DONE] All files fixed")
    else:
        success = lint_all()
        sys.exit(0 if success else 1)