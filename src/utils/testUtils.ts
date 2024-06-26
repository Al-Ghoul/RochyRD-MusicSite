import { assertFails, assertSucceeds } from "@firebase/rules-unit-testing";

export const CONFIG = {
  projectId: "test-rochy-rd-music",
  databaseName: "RochyRD_DB",
};

export async function expectFirestorePermissionDenied(promise: Promise<void>) {
  const errorResult = await assertFails(promise);
  expect(errorResult.code).toBe("permission-denied" || "PERMISSION_DENIED");
}

// deno-lint-ignore no-explicit-any
export async function expectPermissionGetSucceeds(promise: Promise<any>) {
  const res = await assertSucceeds(promise);
  expect(res.data()).not.toBeUndefined();
}
