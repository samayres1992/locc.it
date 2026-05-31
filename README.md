# locc.it — share secrets safely, share them once

A zero-knowledge web app for sharing one-time secrets. The sender encrypts the secret in the browser with a generated passcode, the server stores only the ciphertext on a deadline, and the recipient decrypts it in their own browser before the record is deleted. The passcode never touches the server.

If you see a problem with it, please raise a pull request.

## Stack

React · Express · SQLite (better-sqlite3) · CryptoJS · Passport (Google / GitHub OAuth)

## How it works

1. **Encrypt.** Sender pastes a secret. The browser generates a random passcode and runs CryptoJS AES over the payload before anything is sent. The ciphertext, a URL identifier, and the chosen expiry are POSTed to `/api/encrypt`. SQLite stores those three things and nothing else.
2. **Share.** Sender shares the URL and the passcode with the recipient out-of-band.
3. **Fetch.** Recipient opens the URL. Client GETs `/api/secret/:url`. The server returns the ciphertext, marks the record as `viewed`, and starts a 60-second grace window. The passcode is not sent.
4. **Decrypt.** Client runs `CryptoJS.AES.decrypt(ciphertext, passcode)` in the browser. Plaintext is rendered locally.
5. **Consume.** Client calls `DELETE /api/secret/:url`. Server purges the record. Cron sweeps any records whose grace window elapsed without an explicit DELETE.

## Config

### client/.env

```
REACT_APP_STRIPE_KEY=
REACT_APP_SITE_URL=
REACT_APP_GOOGLE_SITE_KEY=
```

### server/config/prod.js (or dev.js)

```js
module.exports = {
  // SQLite file location. The directory is created on boot if it doesn't exist.
  // Default if unset: <repo>/data/loccit.db
  dbPath: "/var/lib/loccit/loccit.db",

  siteURL: "",
  cookieKey: "",
  localSecret: "",
  emailUser: "",
  emailPass: "",
  googleClientId: "",
  googleClientSecret: "",
  githubPubKey: "",
  githubSecretKey: "",
  stripePubKey: "",
  stripeSecretKey: ""
};
```

The `mongoURI` field is gone — locc.it no longer talks to MongoDB. One Node process, one SQLite file, zero external services.

## Running locally

```bash
# server
cd server
npm install
npm run dev      # or: node index.js

# client (separate terminal)
cd client
npm install
npm start
```

The SQLite file is created automatically on first boot.

## Backup

Because the schema is small (two tables, a few thousand rows max in a busy week), backup is "copy the .db file." On the VPS:

```bash
# Run from cron, daily
sqlite3 /var/lib/loccit/loccit.db ".backup '/var/backups/loccit/loccit-$(date +\%F).db'"
```

The hourly cleanup cron inside the app sweeps expired locks and stale viewed records, so the file stays small.

## Author

[Sam Ayres](https://5am.dev)
