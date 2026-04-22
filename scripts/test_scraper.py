#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ZEUS Scraper Test Suite
Testa lo scraper su URL di esempio
"""

import sys
import os
import time

sys.stdout.reconfigure(encoding='utf-8')

def test_imports():
    print("[TEST] Checking Python environment...")
    try:
        import requests
        print(f"  [OK] requests: {requests.__version__}")
    except ImportError:
        print("  [!] requests not installed: pip install requests")
        return False
    return True

def test_scraper(url="https://httpbin.org/html"):
    print(f"\n[TEST] Scraping test URL: {url}")
    try:
        import requests
        print("  [RUN] Fetching HTML...")
        
        response = requests.get(url, timeout=10, headers={
            'User-Agent': 'ZEUS-OS/1.0 (Web Scraper Bot)'
        })
        
        print(f"  [OK] Status: {response.status_code}")
        
        if response.status_code == 200:
            html = response.text
            
            # Clean HTML
            cleaned = html
            for tag in ['<script', '<style', '<nav', '<header', '<footer']:
                cleaned = cleaned.replace(f'<{tag}', f'<!--{tag}')
                cleaned = cleaned.replace(f'</{tag.split()[0]}>', '-->')
            
            # Remove tags
            import re
            cleaned = re.sub(r'<[^>]+>', '', cleaned)
            cleaned = cleaned.replace('&nbsp;', ' ')
            cleaned = cleaned.replace('&amp;', '&')
            cleaned = cleaned.replace('\n\n\n', '\n\n')
            cleaned = cleaned.strip()
            
            # Show first 500 chars
            preview = cleaned[:500]
            print(f"\n  [PREVIEW] First 500 chars:\n{preview}...\n")
            print(f"  [OK] Total cleaned length: {len(cleaned)} chars")
            return True
        else:
            print(f"  [!] HTTP Error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"  [!] Error: {e}")
        return False

def test_karpathy_structure():
    print("\n[TEST] Karpathy Wiki Structure...")
    
    required_dirs = [
        "src/wiki/index",
        "src/wiki/raw",
        "src/wiki/log",
        "src/wiki/index/00_GOALS"
    ]
    
    required_files = [
        "src/wiki/index/prodotti.md",
        "src/wiki/index/fornitori.md",
        "src/wiki/index/00_GOALS/active_kpis.md"
    ]
    
    all_ok = True
    
    for d in required_dirs:
        if os.path.isdir(d):
            print(f"  [OK] {d}/")
        else:
            print(f"  [!] Missing: {d}/")
            all_ok = False
    
    for f in required_files:
        if os.path.isfile(f):
            print(f"  [OK] {f}")
        else:
            print(f"  [!] Missing: {f}")
            all_ok = False
    
    return all_ok

def test_compile_scripts():
    print("\n[TEST] Compile & Lint Scripts...")
    
    scripts = [
        "scripts/compile_wiki.py",
        "scripts/lint_wiki.py"
    ]
    
    all_ok = True
    
    for script in scripts:
        if os.path.isfile(script):
            print(f"  [OK] {script}")
        else:
            print(f"  [!] Missing: {script}")
            all_ok = False
    
    return all_ok

def main():
    print("=" * 60)
    print("ZEUS Scraper Test Suite")
    print("=" * 60)
    
    results = []
    
    results.append(("Imports", test_imports()))
    results.append(("Karpathy Structure", test_karpathy_structure()))
    results.append(("Compile Scripts", test_compile_scripts()))
    results.append(("Scraper Test", test_scraper()))
    
    print("\n" + "=" * 60)
    print("RESULTS")
    print("=" * 60)
    
    for name, passed in results:
        status = "[PASS]" if passed else "[FAIL]"
        print(f"  {status} {name}")
    
    all_passed = all(r[1] for r in results)
    
    if all_passed:
        print("\n[OK] All tests passed! System ready.")
        return 0
    else:
        print("\n[!] Some tests failed. Review output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())