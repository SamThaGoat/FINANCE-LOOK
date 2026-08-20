# Security Specification: Financial Progress Tracker

## 1. Data Invariants
1. All monthly financial records belong to a specific authenticated user located under `/users/{userId}/months/{monthId}`.
2. Users can only read, write, update, and delete their own month records where `request.auth.uid == userId`.
3. Month IDs must follow the format `YYYY-MM` and match the document ID.
4. Month records must contain valid `id`, `monthName`, `incomes` (list), `expenses` (list), and `userId` matching `request.auth.uid`.
5. Global default-deny rule on all documents.

## 2. The Dirty Dozen Attack Payloads
1. **Unauthenticated Read**: Attempting to read `/users/user123/months/2026-08` without authentication -> DENIED.
2. **Cross-User Read**: User `attacker456` attempting to read `/users/victim123/months/2026-08` -> DENIED.
3. **Cross-User Write**: User `attacker456` attempting to write to `/users/victim123/months/2026-08` -> DENIED.
4. **Forged Owner Write**: Authenticated user `user123` attempting to write `userId: 'admin999'` -> DENIED.
5. **ID Mismatch Attack**: Document path `/users/user123/months/2026-08` with payload `id: '2026-09'` -> DENIED.
6. **Path Traversal Attack**: Writing to document ID `../../system/config` -> DENIED by `isValidId`.
7. **Junk Field Injection**: Payload containing unauthorized ghost fields like `isAdmin: true` -> DENIED.
8. **Unbounded Payload Denial of Wallet**: Injecting 2MB payload into `monthName` -> DENIED by size guard.
9. **Unverified Email Modification**: Unverified accounts trying to mutate user finance state -> DENIED.
10. **Array Explosion Attack**: Injecting array exceeding volumetric boundaries -> DENIED.
11. **Type Poisoning**: Sending boolean or number for string fields -> DENIED.
12. **Root Collection Access**: Writing directly to `/months` or `/users` -> DENIED.
