# Automatically sync data to a Google Sheet

This sample demonstrates how to sync new data written to a Firebase database to a Google Sheet. It uses a service account for auth.

### This was initially based on Google's [starter code](https://github.com/firebase/functions-samples/tree/main/google-sheet-sync).
### This code is also described in this [blog post](https://medium.com/@elon.danziger/fast-flexible-and-free-visualizing-newborn-health-data-with-firebase-nodejs-and-google-sheets-1f73465a18bc).

---

# Configuration

- `firebase init functions --project [PROJECT_ID]`
- Create google cloud service account on project, create keys for it and download json
- Share spreadsheet with the service account email address
- Enable Google Sheets API
- `firebase functions:config:set googleapi.service_account='{paste full json from the downloaded service account key file}'`
- `firebase functions:config:set googleapi.sheet_id="YOUR_SPREADSHEET_ID"`

# Deployment

`firebase deploy --only functions`

---

## Functions Code

See file [functions/google-sheet-sync.js](functions/google-sheet-sync.js) for the Google Sheet sync code.

The trigger function is `appendRecordToSpreadsheet`.

## Trigger rules

The function triggers on when data is added to the DATA_PATH of the active Firebase database.
