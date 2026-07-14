/**
 * Shubham Logistic Services — Website Enquiry Handler
 * ----------------------------------------------------
 * Receives POST submissions from the quote/enquiry forms on the website
 * (index.html and contact.html) and appends each one as a new row in a
 * Google Sheet, in a tab called "Enquiries".
 *
 * WHICH SHEET DOES DATA GO TO?
 * By default this script writes to whichever spreadsheet it is bound to —
 * i.e. the Sheet you open Extensions > Apps Script from. If you want it to
 * always write to one specific spreadsheet no matter where the script is
 * deployed from, paste that spreadsheet's ID into SPREADSHEET_ID below
 * (find the ID in the sheet's URL: .../spreadsheets/d/THIS_PART/edit).
 *
 * SETUP
 * 1. Open the Google Sheet you want enquiries to land in (or create a new
 *    blank one).
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any starter code in the editor and paste this entire file in.
 * 4. Click the "Deploy" button (top right) > New deployment.
 *      - Click the gear icon next to "Select type" and choose "Web app".
 *      - Description: anything, e.g. "SLS enquiry form"
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Click "Deploy". The first time, Google will ask you to authorize the
 *    script — click through the permission screens (it will warn the app
 *    is unverified; click "Advanced" > "Go to project (unsafe)" — this is
 *    normal for a script you wrote yourself).
 * 6. Copy the "Web app URL" shown after deployment. It looks like:
 *      https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec
 * 7. Open assets/js/main.js on the website and replace the value of
 *    SLS_SCRIPT_URL with this new URL.
 * 8. Submit a test enquiry on the live site and confirm a new row appears
 *    in the "Enquiries" tab of this sheet.
 *
 * IF YOU EDIT THIS SCRIPT LATER
 * Any code change requires a new deployment (Deploy > Manage deployments >
 * pencil icon > New version) — editing the code alone does not update the
 * live URL's behaviour.
 */

// Leave blank ('') to use whichever spreadsheet this script is bound to.
// Or paste a spreadsheet ID here to always target that exact file.
const SPREADSHEET_ID = '';

// Name of the tab (sheet) inside the spreadsheet where rows are written.
const SHEET_NAME = 'Enquiries';

function getSheet_() {
  const ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    const headers = [
      'Timestamp', 'Name', 'Phone', 'Email', 'Company',
      'Service Required', 'City / Location', 'Origin', 'Destination',
      'Cargo Description', 'Page', 'Source Title'
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    const sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      p.name || '',
      p.phone || '',
      p.email || '',
      p.company || '',
      p.service || '',
      p.city || '',
      p.origin || '',
      p.destination || '',
      p.cargo || '',
      p.pageUrl || '',
      p.source || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you sanity-check the deployment URL by opening it directly in a
// browser tab — you should see a small JSON status message, not an error.
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Shubham Logistics enquiry endpoint is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}
