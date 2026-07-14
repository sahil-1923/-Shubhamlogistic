# Where does the form data go, and how to control it

## Why I can't tell you where the current one goes
`assets/js/main.js` currently points at:
```
https://script.google.com/macros/s/AKfycbzPSOHWiHgpjLVk16ZTEbprpoVjxJnqbWqNu5dO1Kn0cz4MO01DU-SwE8WzE48053pL/exec
```
That's a link to a script running in **your** Google account. I only have the website's code, not access to your Google account or Apps Script projects, so I can't see what that script does or which sheet it writes to. Only whoever created that deployment can check it directly.

## How to check the existing one yourself
1. Go to [script.google.com](https://script.google.com) while signed into the Google account that manages Shubham Logistics' forms.
2. Look through the project list for one that matches the deployment ID above (`AKfycbz...`) — click **Deploy > Manage deployments** on each candidate to compare the web app URL.
3. Once you find it, open the code — near the top there's usually either `SpreadsheetApp.getActiveSpreadsheet()` (meaning it writes to whichever sheet the script is bound to — check **File > See document** in the Apps Script editor) or a hardcoded spreadsheet ID/URL.
4. If you can't find it or don't have access to that account anymore, easiest path: use the fresh script below and repoint the site at it.

## Using the new script (`Code.gs`) included here
This gives you full, visible control over exactly which sheet receives enquiries.

1. Open (or create) the Google Sheet you want enquiries saved into.
2. **Extensions > Apps Script**, delete the placeholder code, paste in `Code.gs`.
3. **Deploy > New deployment > Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Deploy, authorize the permissions (click "Advanced" → "Go to project (unsafe)" — normal for your own script).
5. Copy the web app URL it gives you (ends in `/exec`).
6. In `assets/js/main.js`, find:
   ```js
   const SLS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
   ```
   and replace the URL with your new one.
7. Re-upload/deploy the updated `main.js` to your live site.
8. Submit one test enquiry from the live site (both the homepage form and the Contact page form) and confirm a row appears in the **Enquiries** tab.

## What each submission writes
Timestamp, Name, Phone, Email, Company, Service Required, City/Location, Origin, Destination, Cargo Description, Page URL, Source (page title) — one row per submission, headers added automatically on first run.

## If you ever edit Code.gs again
Code changes alone don't update the live URL. You must go to **Deploy > Manage deployments > (pencil/edit icon) > New version > Deploy** each time.
