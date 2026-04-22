#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ZEUS Autonomous Watcher - GRO Loop
Ogni 30 minuti analizza il contesto e propone ottimizzazioni basate sui GOALS.
"""

import os
import sys
import time
import requests
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

CONTEXT_FILE = "src/zeus_context.txt"
GOALS_FILE = "src/wiki/index/00_GOALS/active_kpis.md"
LOG_FILE = "src/wiki/log/autonomous_suggestions.md"
CHECK_INTERVAL = 30 * 60  # 30 minuti
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")

NOTIFICATION_FILE = "src/wiki/log/.notification_trigger"


def read_file(path):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    return ""


def write_log(message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"\n## {timestamp}\n\n{message}\n"
    
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
    else:
        content = "# Autonomous Suggestions Log\n\n"
    
    content += entry
    
    with open(LOG_FILE, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"[LOG] Suggestion saved to {LOG_FILE}")


def set_notification(goal_id, message):
    os.makedirs(os.path.dirname(NOTIFICATION_FILE), exist_ok=True)
    with open(NOTIFICATION_FILE, 'w', encoding='utf-8') as f:
        f.write(f"GOAL:{goal_id}\nMESSAGE:{message}\nTIMESTAMP:{datetime.now().isoformat()}\n")
    print(f"[NOTIFY] CEO notification triggered: {goal_id}")


def query_llm(context, goals):
    if not OPENROUTER_API_KEY:
        print("[ERROR] OPENROUTER_API_KEY not set")
        return None
    
    prompt = f"""Tu sei ZEUS-GDA, l'agente di ottimizzazione Goal-Driven di Manipura OS.

## CONTESTO ATTUALE (zeus_context.txt):
{context[:3000] if len(context) > 3000 else context}

## GOALS ATTIVI:
{goals}

## TASK:
Analizza il contesto e i GOALS. Identifica:
1. Opportunità di ottimizzazione nel codice
2. Refactoring che potrebbe avvicinarci ai KPI target
3. Debt tecnico da affrontare

Se trovi opportunità significative, rispondi con:
- OPP:YES
- GOAL_ID: [id del goal impattato]
- AREA: [area del codice]
- SUGGESTION: [descrizione della proposta]
- ESTIMATED_IMPACT: [impatto stimato sui KPI]

Se non ci sono opportunità, rispondi:
- OPP:NO
"""

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "google/gemini-2.0-flash-001",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            return data['choices'][0]['message']['content']
        else:
            print(f"[ERROR] API status: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"[ERROR] LLM query failed: {e}")
        return None


def main():
    print("=" * 50)
    print("[ZEUS WATCHER] Autonomous GRO Loop Started")
    print("=" * 50)
    
    while True:
        print(f"\n[CYCLE] {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # 1. Read context
        context = read_file(CONTEXT_FILE)
        if not context:
            print("[SKIP] No context available")
            time.sleep(CHECK_INTERVAL)
            continue
        
        # 2. Read goals
        goals = read_file(GOALS_FILE)
        if not goals:
            print("[SKIP] No active goals")
            time.sleep(CHECK_INTERVAL)
            continue
        
        # 3. Query LLM
        print("[QUERY] Analyzing context against goals...")
        result = query_llm(context, goals)
        
        if result and "OPP:YES" in result:
            print("[FOUND] Opportunity detected!")
            
            # Parse result
            lines = result.split('\n')
            goal_id = "UNKNOWN"
            suggestion = result
            
            for line in lines:
                if line.startswith("GOAL_ID:"):
                    goal_id = line.replace("GOAL_ID:", "").strip()
                elif line.startswith("SUGGESTION:"):
                    suggestion = line.replace("SUGGESTION:", "").strip()
            
            # 4. Write to log
            write_log(f"**Goal:** {goal_id}\n**Suggestion:**\n{suggestion}\n\n---\n{result}")
            
            # 5. Create notification
            set_notification(goal_id, f"Ho trovato un'opportunità per il GOAL {goal_id}. Controlla il Workspace.")
            
            print(f"[DONE] Notification set for {goal_id}")
        else:
            print("[OK] No opportunities found this cycle")
        
        print(f"[SLEEP] Next check in {CHECK_INTERVAL // 60} minutes...")
        time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    main()