{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTE1ZTlhNWRmNGRkYTBhZjA0ZjA1ZWUiLCJlbWFpbCI6Imh1c2tAZ21haWwuY29tIiwidXNlcm5hbWUiOiJodXNrIiwiaWF0IjoxNzc5ODIxNzQ5LCJleHAiOjE3Nzk4Mjg5NDl9.8er5Mxix97dTWbSBhnxfZ_eODAS7t36AAW2aXXzk7xU",
  "user": {
    "_id": "6a15e9a5df4dda0af04f05ee",
    "username": "husk",
    "email": "husk@gmail.com"
  }
}

{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTE1ZjYyMGRmNGRkYTBhZjA0ZjA1ZWYiLCJlbWFpbCI6ImFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJVc2VyQSIsImlhdCI6MTc3OTgyNDE4NSwiZXhwIjoxNzc5ODMxMzg1fQ.63lYcFQAe_13wbL5EzX1GP2uqmOxAb_u1HVIx-jje4U",
  "user": {
    "_id": "6a15f620df4dda0af04f05ef",
    "username": "UserA",
    "email": "a@gmail.com"
  }
}

## Git hub callback o/p

GitHub Callback URL: http://localhost:3005/api/auth/github/callback
Server running on port 3005
MongoDB Connected
callback is hit
User from github: {
  username: 'VidhyaDivakar',
  email: 'VidhyaDivakar@users.noreply.github.com',
  githubId: '131719909',
  _id: new ObjectId('6a1604450c7bca0ccbe334a2'),
  __v: 0
}
REQUEST: GET /favicon.ico



## Report on errors


**Summary**

* You saw a GitHub “Be careful — redirect_uri mismatch” error, connection refused when curling `localhost:3005`, and then runtime errors (passport undefined, schema syntax, missing email, password validation). Below is a concise post‑mortem, the exact fixes I applied, how to reproduce/verify, and a short prevention checklist you can use going forward.

**Root Causes**

* **Redirect URI mismatch:** App routes were mounted at `/api/users` but the OAuth redirect sent `/api/auth/...` (mismatch with GitHub app setting). Also [.env](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) values had leading spaces and an unexpected `client_id`.
* **Server not listening:** Node process wasn’t running (or crashed on startup) so `curl` returned connection refused.
* **Immediate runtime errors discovered while starting:**
  * **[passport](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) not defined** in [authRoutes.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) (missing import) — caused crash at require-time.
  * **Missing comma in schema** in [User.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) (syntax in githubId) — caused Mongoose/schema problems.
  * **Invalid Mongo URI** originally (fixed earlier) caused Mongoose to fail connecting.
  * **GitHub profile emails missing** — code assumed [profile.emails[0]](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) always exists → TypeError.
  * **Password required on OAuth users** — Mongoose validation failed when saving OAuth users with no password.

**Fixes I Applied**

* Route mounting
  * Changed route mount so GitHub OAuth paths match the callback:
    * Edited [server.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html): mounted [authRoutes](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) at `/api` instead of `/api/users`. See [server.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html).
* Environment
  * Cleaned [.env](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) entries to remove leading spaces and set the callback to the chosen path:
    * [.env](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) → [GITHUB_CALLBACK_URL=http://localhost:3005/api/auth/github/callback](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) and fixed [GITHUB_CLIENT_ID](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html). See [.env](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html).
  * Trimmed env values at runtime in [passport.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) (use [.trim()](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html)).
* Passport / routes
  * Added [const passport = require(&#39;passport&#39;)](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) into [authRoutes.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) where it was missing. See [authRoutes.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html).
  * Added missing [bookmarkRoutes](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) import in [server.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html).
* Schema / validation
  * Fixed syntax in [User.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) (added missing comma in [githubId](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) field). See [User.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html).
  * Made [password](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) required only when [githubId](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) is not present:
    * [password.required = function() { return !this.githubId; }](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html)
* OAuth profile handling
  * Protected access to [profile.emails](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) and provided fallback:
    * Use [(profile.emails && profile.emails[0].value) || profile._json.email || ](http:// *vscodecontentref* /27)${profile.username}@users.noreply.github.com`` in passport.js.
* Additional: added startup logs showing effective GITHUB_CLIENT_ID and GITHUB_CALLBACK_URL in server.js to verify runtime values.

**Why “site can’t be reached” / connection refused**

* Either:
  * The server process was not running (you must run `node server.js`), or
  * The server crashed on startup due to one of the earlier errors (invalid MONGO_URI, syntax errors, missing imports). I fixed those causes; after fixes the app should start and listen on port 3005.

**Why other errors occurred (short)**

* Missing import / syntax errors cause immediate require-time crashes.
* Assumptions about external data (GitHub profile email) cause runtime TypeErrors when data is absent.
* Schema-level validation throws if required fields are missing (password required for OAuth users until made conditional).

**How to verify (commands)**

* Start server (keep terminal open):

curl -v "http://localhost:3005/api/auth/github"

* []()
* []()
* []()
* []()
* Test the start URL (open in browser or curl):
* []()
* []()
* []()
* []()
* Test registration endpoint (local auth):
* []()
* []()
* []()
* []()

**Postmortem checklist for future**

* **Env hygiene**
  * Keep [.env](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) values trimmed. Add a small startup check to log [process.env](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) values you care about (mask secrets).
* **Route & OAuth mapping**
  * Ensure route mounting and [GITHUB_CALLBACK_URL](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) are exactly consistent (character-for-character) with the GitHub OAuth App settings.
* **Defensive code**
  * Guard against [profile.emails](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) being undefined and provide a fallback email for OAuth users.
  * Make schema [required](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) conditions dynamic when supporting multiple auth methods (local vs OAuth).
* **Startup validation**
  * Add a startup health check that:
    * Validates [MONGO_URI](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) format (must start with `mongodb://` or `mongodb+srv://`).
    * Ensures required env vars exist and are non-empty ([GITHUB_CLIENT_ID](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html), [GITHUB_CALLBACK_URL](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html), `JWT_SECRET`).
    * Logs effective Callback URL and Client ID (non-secret) at startup.
* **Linting / CI**
  * Enable ESLint to catch undefined variables and style/syntax issues early.
  * Add a CI check (or pre-commit hook) that runs `node server.js` or at least `npm test` / `npm run check` so runtime crashes are found quickly.
* **Logging**
  * Keep a global request logger for debugging route paths ([app.use((req,res,next)=&gt;console.log(req.method, req.url); next())](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html)) — you have one already.
* **Local testing**
  * Test OAuth flow with a private browser window (avoid cached / stale tokens).
  * When changing [GITHUB_CLIENT_ID](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html), update the GitHub App or [.env](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) immediately and restart server.

**Files I changed**

* [server.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) — route mount, startup logs
* [authRoutes.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) — added [passport](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) import
* [passport.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) — trim envs, safe email extraction
* [User.js](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) — fixed comma and conditional password required
* [.env](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) — cleaned callback URL and client id

If you want, I can:

* Commit these changes and open a PR, or
* Add a small `startup-check.js` that validates envs and exits with a friendly message when misconfigured.

summary

Redirect-uri mismatch caused by route/env mismatch (leading spaces and wrong client_id); I remounted [authRoutes](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) at `/api`, cleaned/trimed [.env](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html), and set GitHub callback to exactly [http://localhost:3005/api/auth/github/callback](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html).
Connection refused and subsequent errors were from server crashes (missing [passport](vscode-file://vscode-app/c:/Users/Vidnir/AppData/Local/Programs/Microsoft%20VS%20Code/8b640eef5a/resources/app/out/vs/code/electron-browser/workbench/workbench.html) import, schema syntax, invalid MONGO_URI, required password, and unsafe email access); I fixed imports, schema/comma, conditional password, guarded email access, and added env trimming — restart `node server.js` and retry.
