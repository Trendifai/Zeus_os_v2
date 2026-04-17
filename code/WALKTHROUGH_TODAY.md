# WALKTHROUGH_TODAY.md
## Restore Guide - Session 2025-04-17

### Context
Full development environment needs recreation from scratch if lost.

---

### Step 1: Project Setup
```bash
cd C:\Users\probook\Desktop\ZEUS_AGENTIA_V2
npx create-next-app@latest code
# Options: TypeScript, ESLint, Tailwind, App Router, No src/
```

### Step 2: GitHub Push
```bash
cd code
git remote add origin https://github.com/Trendifai/Zeus_os_v2.git
git branch -M main
git add . && git commit -m "primo invio"
git push -u origin main
```

### Step 3: Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://glpjcsdzlvhydqgtttsq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<KEY_FROM_SUPABASE>
GOOGLE_CLIENT_ID=738598705459-00ib5v5h89h76a7gciivbjltef1vdspo.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_PROJECT_ID=zeus-os-core-v2
```

### Step 4: Google OAuth (CRITICAL)
1. Install googleapis in separate folder:
```bash
mkdir gdrive-auth && cd gdrive-auth
npm init -y && npm install googleapis
cp ../code/credentials.json .
```
2. Get OAuth code from URL with `drive.file` scope:
```javascript
const oa = new google.auth.OAuth2(client_id, client_secret, 'http://localhost');
const url = oa.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/drive.file'],
  prompt: 'consent'
});
console.log(url);
```
3. Exchange code for token:
```javascript
oa.getToken(code, (err, token) => {
  fs.writeFileSync('./token.json', JSON.stringify(token));
});
```
4. Copy `token.json` to code folder

### Step 5: Supabase SQL
Run in Supabase SQL Editor:
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  npu_balance DECIMAL DEFAULT 100.0
);

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  full_name TEXT,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

INSERT INTO tenants (name, npu_balance) VALUES ('Manipura - Agentia HQ', 999999.9);
```

### Step 6: Drive Sync
Use `gdrive-auth/upload-all.js` with updated token for full scope

### Verification Commands
```bash
cd code && npm run dev
```

---

## Session End State
- GitHub: Synced ✓
- Google OAuth: Token exists (needs scope update)
- Supabase: Schema ready, credentials set
- Local: 50 strategy docs ready for sync