import {
  CONFIG,
  expectFirestorePermissionDenied,
  expectPermissionGetSucceeds,
} from "../src/utils/testUtils";
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { serverTimestamp } from "firebase/firestore";
import { readFileSync } from "fs";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  const splittedValues = process.env.FIRESTORE_EMULATOR_HOST!.split(":");
  const { port, host } = {
    host: splittedValues[0],
    port: parseInt(splittedValues[1]),
  };
  testEnv = await initializeTestEnvironment({
    projectId: CONFIG.projectId,
    firestore: {
      host,
      port,
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe("RichyRD-Site Rules Test Suite", () => {
  test("Should NOT be able create a new user", async () => {
    const db = testEnv.authenticatedContext("alghoul").firestore();
    const usersProfile = db.collection("users").doc("alghoul");

    await expectFirestorePermissionDenied(
      usersProfile.set({ name: "alghoul" }),
    );
  });

  test("Should NOT be able to create a new album", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const albumRecord = db.collection("albums").doc("NameDoesNotMatter");

    await expectFirestorePermissionDenied(albumRecord.set({}));
  });

  test("Should NOT be able to create a new upload", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const songRecord = db.collection("songs").doc("NameDoesNotMatter");

    await expectFirestorePermissionDenied(songRecord.set({}));
  });

  test("Anyone should be able to read albums", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const albumRec = db.collection("albums").doc(
      "newAlbumNameDoesNotMatter",
    );
    await testEnv.withSecurityRulesDisabled(async (adminContext) => {
      const db = adminContext.firestore();
      const albumRecord = db.collection("albums").doc(
        "newAlbumNameDoesNotMatter",
      );
      await albumRecord.set({
        id: "albumId",
        title: "newAlbumTitle",
        description: "This is just a simple description",
        imageURL: "http://localhost",
        createdAt: serverTimestamp(),
      });
    });

    await expectPermissionGetSucceeds(albumRec.get());
  });

  test("Anyone should be able to read songs", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const uploadRec = db.collection("songs").doc(
      "newUploadNameDoesNotMatter",
    );
    await testEnv.withSecurityRulesDisabled(async (adminContext) => {
      const db = adminContext.firestore();
      const songRecord = db.collection("songs").doc(
        "newUploadNameDoesNotMatter",
      );
      await songRecord.set({
        id: "uploadId",
        title: "newUploadTitle",
        description: "This is just a simple description",
        url: "http://localhost",
        imageURL: "http://localhost",
        createdAt: serverTimestamp(),
      });
    });

    expectPermissionGetSucceeds(uploadRec.get());
  });
});
