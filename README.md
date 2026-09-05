# Zero Device — POS System

Premium single-file Point of Sale system for **Zero Device** (laptops, computers, accessories).

- **Version:** 1.4.0  
- **Stack:** HTML + Tailwind CSS + vanilla JavaScript  
- **Storage:** Browser localStorage + **Firebase Firestore** (full cloud sync)  
- **Hosting:** Works on Vercel / any static HTTPS host  

Live example: `https://ziro-delta.vercel.app/`

---

## Features

| Module | What it does |
|--------|----------------|
| **Dashboard** | Sales, profit, stock overview + charts |
| **Billing** | Cart, invoice (A5 print), payment methods, loan/unpaid |
| **Inventory** | Products, stock, images, categories |
| **Customers** | Customer list & purchase history |
| **Sales History** | Past bills, reprint, status |
| **Warranty** | Per-bill warranty + **QR code** for customers |
| **Settings** | Business info, users, Firebase, backup, reset |

### Extra

- **Mobile responsive** (hamburger menu)
- **Multi-device sync** (A1 laptop ↔ A2 laptop ↔ phone)
- **Warranty QR** — customer scans invoice QR → online warranty page
- **NIC optional** on billing (name + mobile required)
- **Change username / password**
- **Export / import backup** + **Reset local data**

---

## Default login

```
Username: admin
Password: admin123
```

Change this after first login: **Settings → User Management → Change Login**

---

## Quick start

1. Open the HTML file on **HTTPS** (Vercel, Netlify, or your domain).  
   Do **not** rely on `file://` for warranty QR / multi-device.
2. Log in with default credentials.
3. Firebase is **permanently embedded** for project `ziro-devise-s` — it auto-connects on load.
4. Add products → create bills → print invoices.

### Deploy on Vercel

1. Create a new project / upload the HTML as `index.html`.
2. Deploy.
3. Open the URL on every device you use for POS.

---

## Firebase setup

### Project (already linked in app)

| Field | Value |
|-------|--------|
| Project ID | `ziro-devise-s` |
| Auth domain | `ziro-devise-s.firebaseapp.com` |

Config is **built into** the HTML (`BUILTIN_FIREBASE_CONFIG`). No need to paste config in Settings on each PC.

### Enable Firestore

1. [Firebase Console](https://console.firebase.google.com) → project **ziro-devise-s**
2. **Build → Firestore Database → Create database**
3. Prefer **Standard** edition, region e.g. **asia-south1** (Mumbai)
4. Start in test mode, then publish the rules below

### Required security rules

Paste in **Firestore → Rules → Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /warranties/{code} {
      allow read, write: if true;
    }
    match /_meta/{doc} {
      allow read, write: if true;
    }
    match /pos_data/{doc} {
      allow read, write: if true;
    }
    match /products/{id} {
      allow read, write: if true;
    }
    match /customers/{id} {
      allow read, write: if true;
    }
    match /bills/{id} {
      allow read, write: if true;
    }
    match /warranty_items/{id} {
      allow read, write: if true;
    }
  }
}
```

> These rules are open (anyone with the project can read/write). Suitable for a small shop POS with warranty QR. For higher security later, restrict by auth or API keys.

### Collections used

| Collection | Purpose |
|------------|---------|
| `products` | Inventory |
| `customers` | Customers |
| `bills` | Sales / invoices |
| `warranty_items` | Local warranty list |
| `warranties` | Public QR warranty lookup by code |
| `pos_data` | Settings, users, counters |
| `_meta` | Connection test |

---

## Multi-device (A1 / A2 / phone)

1. Same HTML deployed URL on all devices  
2. Firebase rules published (including `bills`, `products`, …)  
3. App auto-connects and:
   - **Merges** cloud + local data
   - **Pushes** on every save
   - **Refreshes** about every 12 seconds and on window focus  
4. After creating a bill on A1, wait a few seconds or open **Sales History** on A2  

If one device is outdated: **Settings → Firebase → Pull from Cloud** or **Sync Now**.

### Bill IDs

Bills use **unique IDs** so two laptops never overwrite each other’s invoices.

---

## Warranty QR

1. Complete a bill → invoice shows a large **Scan for Warranty** QR  
2. Customer scans with phone camera  
3. Opens the hosted POS URL with warranty code → loads report from Firestore  

**Requirements**

- Page must be on **http/https** (not `file://`)
- Firestore rules allow `warranties` read
- Firebase connected when the bill was created  

Print tip: use good ink; QR is enlarged for easier scanning.

---

## Reset data

### Local only (one browser)

**Settings → Data & Backup → Reset All Local Data**

- Clears products, customers, bills, warranties on **this device**
- Keeps login users and Firebase link  

### Full wipe (local + cloud)

1. Export backup if needed (**Export Backup**)  
2. Reset local on **every** device  
3. In Firebase Console → Firestore, delete documents in:
   - `bills`, `products`, `customers`, `warranty_items`, `warranties`, `pos_data` (optional)  
4. Reopen the app → empty start  

> If you only delete cloud `bills` but **not** local data, the next sync may **re-upload** old bills from the laptop.

---

## Backup

- **Export Backup** — JSON download (settings, products, bills, …)  
- **Import Backup** — restore from JSON  
- Do this before major resets or browser clears  

---

## Settings overview

1. **Business Info** — name, address, phone, invoice header  
2. **Billing** — invoice prefix, currency (LKR/USD/EUR), low stock alert  
3. **Warranty** — default months  
4. **Firebase** — status, Sync Now, Pull from Cloud (config is permanent)  
5. **Users** — add staff, change password  
6. **Data & Backup** — export / import / reset  
7. **About** — version  

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Permission denied (403) | Publish Firestore rules (all collections above) |
| QR won’t scan | Use larger print / better light; ensure latest HTML (big QR) |
| QR opens but no warranty | Bill must be synced; check `warranties` collection |
| A2 doesn’t see A1 bills | Same URL + rules; wait ~12s or **Pull from Cloud** |
| Data came back after delete | Local still had data → reset local on all devices |
| file:// issues | Host on Vercel/HTTPS |

---

## File

Use the latest single HTML build (e.g. `Zero_Device_POS_PermanentFirebase.html`) as `index.html` on your host.

---

## Notes

- Product images stored as large base64 may be stripped on cloud sync to stay under Firestore size limits; full images remain in the browser that uploaded them.  
- Open rules mean the Firebase project is shared with anyone who has the public config in the page — keep the project dedicated to this shop.  
- Always keep an **Export Backup** for disaster recovery.

---

**Zero Device POS** · Local + Firebase cloud sync · Mobile ready  
