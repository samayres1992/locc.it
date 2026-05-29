# locc.it

A zero-knowledge web app for sharing one-time secrets safely. The sender encrypts the secret in the browser with a generated passcode, the server stores only the ciphertext on a deadline, and the recipient decrypts it in their own browser before the record is deleted. The passcode never touches the server.

**Live:** [locc.it](https://locc.it)
**Case study:** [5am.dev/work/locc-it](https://5am.dev/work/locc-it)

## Stack

React · Express · MongoDB · CryptoJS · Passport (Google / GitHub / Facebook OAuth)

## How it works

1. **Encrypt.** The sender pastes a secret. The browser generates a random passcode and runs AES (CryptoJS) over the payload before anything is sent. The ciphertext, a URL identifier, and the chosen expiry are POSTed to `/api/encrypt`. MongoDB stores those three things and nothing else.
2. **Share.** Sender shares the URL and the passcode with the recipient out-of-band.
3. **Fetch.** Recipient opens the URL. Client GETs `/api/secret/:url`. The server returns the ciphertext, marks the record as `viewed`, and starts a 60-second grace window. The passcode is *not* sent.
4. **Decrypt.** Client runs `CryptoJS.AES.decrypt(ciphertext, passcode)` in the browser. Plaintext is rendered locally.
5. **Consume.** Client calls `DELETE /api/secret/:url`. Server purges the record. Cron sweeps any records whose grace window elapsed without an explicit DELETE.

## Threat model

- **Server has zero standing ability to read.** No master key, no per-user key, no recovery flow.
- **Passcode never crosses the network.** Encryption and decryption both happen in browsers at the ends of the exchange.
- **One-shot fetch.** The first GET starts a 60-second grace window. After that, the record self-cleans on the next access attempt (cron is a safety net).
- **Mandatory expiry.** Every record carries an expiry; no permanent links possible.
- **Brute-force resistance is structural.** An attacker needs both the URL and the passcode. The URL is one-shot; the passcode is offline-brute-forceable only against a ciphertext they have at most 60 seconds to acquire.
- **Bot defence.** Routes are rate-limited (`/api/encrypt` 10/min, `/api/secret/:url` 10/min). Encrypt form is behind Google reCAPTCHA.
- **Single-use enforced.** `viewed` flag plus grace-window purge plus client-initiated DELETE.

## Run locally

```bash
# client
cd client && npm install && npm start

# server
cd server && npm install && node index.js
```

Server expects a `config/prod.js` (or `dev.js`) with `mongoURI`, `cookieKey`, `localSecret`, and OAuth credentials. See `server/config/keys.js` for the loader.

## Author

[Sam Ayres](https://5am.dev)
