# Firebase setup — make Add & Upload work

## 1. Firestore Rules (required for Add)

Firebase Console → **Firestore Database** → **Rules** → replace all with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Click **Publish**.

## 2. Storage Rules (required for Upload)

Firebase Console → **Storage** → **Rules** → replace all with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 10 * 1024 * 1024
                   && (
                     request.resource.contentType.matches('image/.*')
                     || request.resource.contentType == null
                   );
      allow delete: if true;
    }
  }
}
```

Click **Publish**.

If Storage is not enabled: **Storage → Get started**.

## 3. Admin access

- Use **Guest Admin** on `/admin/login` (works with open rules), or
- Enable **Authentication → Email/Password** and create a user.

## Collections used

- `about` (doc id: `main`)
- `team`
- `skills`
- `projects`

## Note

Open rules are for demo only. Later restrict writes with `request.auth != null`.
