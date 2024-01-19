import { assertFails, assertSucceeds } from "@firebase/rules-unit-testing";

export const CONFIG = {
  projectId: "test-rochy-rd-music",
  databaseName: "RochyRD_DB",
};

export async function expectFirestorePermissionDenied(promise: Promise<void>) {
  const errorResult = await assertFails(promise);
  expect(errorResult.code).toBe("permission-denied" || "PERMISSION_DENIED");
}

export function expectPermissionGetSucceeds(promise: Promise<void>) {
  expect(assertSucceeds(promise)).not.toBeUndefined();
}
