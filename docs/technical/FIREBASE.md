# Firebase Setup (Website Forms + Command Center Sign-In)

Without Firebase, every website form opens a pre-filled email to the contact address, and the command center runs in local mode. With Firebase (free Spark plan is enough to start):

- Prayer requests, donations, partner inquiries, volunteer sign-ups, contact messages, and K9 help requests are saved to **Firestore**.
- The command center's **Website Inbox** shows them.
- The command center requires a real **Firebase Authentication** sign-in.

No Firebase SDK is bundled. The site talks to Firebase's REST APIs directly.

## 1. Create the project

1. Go to https://console.firebase.google.com → **Add project** → name it `faith-forward` (Analytics optional).
2. **Build → Firestore Database → Create database** → production mode → region `us-central1` (closest to St. Louis).
3. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable.**

## 2. Register the web app

1. **Project settings (gear) → General → Your apps → Web (`</>`)** → nickname `faith-forward-web` (no hosting).
2. Copy `apiKey`, `authDomain`, and `projectId` into `src/firebase.config.ts`:

```ts
export const FIREBASE = {
  projectId: 'faith-forward-xxxxx',
  apiKey: 'AIza…',            // public web key: safe to commit
  authDomain: 'faith-forward-xxxxx.firebaseapp.com',
};
```

3. In **Authentication → Settings → Authorized domains**, add `paulmmoore3416.github.io` (and your custom domain later).
4. In Google Cloud Console → **APIs & Services → Credentials**, restrict this browser key by **HTTP referrer** to your site's domains.

## 3. Security rules

Paste the contents of [`firestore.rules`](../../firestore.rules) into **Firestore → Rules → Publish**. They allow:

- anyone to **create** documents in `submissions_*` collections (website forms), with a size limit
- only signed-in users listed in `staff/{uid}` to **read, update, or delete** them

## 4. Create your staff account

1. **Authentication → Users → Add user**: your email and a strong password (16+ characters).
2. Copy the new user's **UID**.
3. **Firestore → Start collection** `staff` → Document ID = that UID → field `name` (string) = `The Reverend Deacon Paul Moore`.

Repeat for each staff member who should see submissions.

## 5. Deploy and test

Commit `src/firebase.config.ts` and push. After the deploy:

1. Submit a test prayer request on the website: you should see "A member of our team will follow up soon."
2. Open the command center: it now asks for email + password.
3. Open **Website Inbox**: the test request appears.

## Collections

| Collection | Source form |
|---|---|
| `submissions_contact` | Contact page |
| `submissions_prayer` | Prayer page |
| `submissions_partner` | Partners page |
| `submissions_donation` | Donate page |
| `submissions_volunteer` | Contact page (volunteer form) |
| `submissions_k9-help` | K9 Program page |

## Next steps (optional)

- **App Check** with reCAPTCHA v3 to reduce spam submissions.
- **Email notifications**: the "Trigger Email" Firebase extension can email you when a new submission arrives (requires the Blaze pay-as-you-go plan).
- **Syncing K9 and command-center data** across devices: add Firestore collections per user and write through the same REST pattern used in `src/cc/firebase.ts`.
