import * as assert from 'assert';
import * as firebase from '@firebase/testing';
import * as fs from 'fs';

const PROJECT_ID = "gold-wharf-ntgzl";

describe("Velicia AI Chat Rules", () => {
    beforeEach(async () => {
        await firebase.clearFirestoreData({ projectId: PROJECT_ID });
    });
    
    before(async () => {
         await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules: fs.readFileSync('firestore.rules', 'utf8') });
    });

    after(async () => {
        await Promise.all(firebase.apps().map(app => app.delete()));
    });

    const authedApp = (uid: string) => {
        return firebase.initializeTestApp({ projectId: PROJECT_ID, auth: { uid, email: "test@example.com", email_verified: true } }).firestore();
    };

    const unauthedApp = () => {
        return firebase.initializeTestApp({ projectId: PROJECT_ID }).firestore();
    };

    it("requires authentication to read chats", async () => {
        const db = unauthedApp();
        await firebase.assertFails(db.collection("users/alice/chats").doc("chat1").get());
    });

    it("allows a user to read their own chats", async () => {
        const db = authedApp("alice");
        await firebase.assertSucceeds(db.collection("users/alice/chats").doc("chat1").get());
    });
    
    it("denies a user to read another users chats", async () => {
        const db = authedApp("bob");
        await firebase.assertFails(db.collection("users/alice/chats").doc("chat1").get());
    });

    it("allows a user to create a valid chat session", async () => {
        const db = authedApp("alice");
        await firebase.assertSucceeds(db.collection("users/alice/chats").doc("chat1").set({
            id: "chat1",
            title: "New Session",
            messages: [],
            timestamp: 1234567890
        }));
    });
    
    it("denies creating a chat session with long title", async () => {
        const db = authedApp("alice");
        await firebase.assertFails(db.collection("users/alice/chats").doc("chat1").set({
            id: "chat1",
            title: "A".repeat(201),
            messages: [],
            timestamp: 1234567890
        }));
    });
});
