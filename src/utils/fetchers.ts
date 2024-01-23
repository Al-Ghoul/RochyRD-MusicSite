// deno-lint-ignore no-explicit-any
export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    switch (res.status) {
      case 404:
        throw new Error("The requested resource was not found.");
      case 400:
        throw new Error(
          `Please check the following error: ${(await res.json()).message}`,
        );
      case 500:
        throw new Error("Server error, please try again later");
    }
  }

  return res.json();
}
