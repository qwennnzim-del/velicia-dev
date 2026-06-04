# Security Spec

## Data Invariants
- A ChatSession must belong to the user defined in the path variable (`users/{userId}/chats/{chatId}`).
- `userId` must strictly match `request.auth.uid`.

## Dirty Dozen Payloads
We will test various unauthenticated accesses, spoofing identity, poisoning variables, etc.

## Test Runner
Test runner will be in firestore.rules.test.ts.
