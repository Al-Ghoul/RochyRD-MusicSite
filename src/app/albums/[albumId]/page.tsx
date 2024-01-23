import { getBaseUrl } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";

export default async function AlbumPage(
  { params }: { params: { albumId: string } },
) {
  const { songs, error } = await getSongsByAlbumId(params.albumId);

  return (
    <main className="flex min-h-screen flex-col p-24">
      <section>
        <h2 className="text-3xl font-bold mb-4">Songs</h2>
        {error.length ? <p>{error}</p> : null}

        {!songs?.length
          ? (
            <div>
              <h3 className="text-2xl font-bold text-red-500">
                No Songs were found.
              </h3>
            </div>
          )
          : null}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {songs?.map((song) => {
            return (
              <div
                key={song.id}
                className="min-w-80 rounded-lg shadow-md bg-gray-500"
              >
                <div className="flex items-center p-4">
                  <Image
                    alt={song.description}
                    className="object-cover w-16 h-16 rounded-full mr-4"
                    height={100}
                    src={song.imageURL || "/images/placeholder.svg"}
                    style={{
                      aspectRatio: "100/100",
                      objectFit: "cover",
                    }}
                    width={100}
                  />
                  <div>
                    <h3 className="font-bold text-lg">{song.title}</h3>
                    <p className="text-gray-100">{song.description}</p>
                  </div>
                  <Link
                    href={song.url}
                    className="ml-auto bg-green-500 p-1 rounded"
                  >
                    Download
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

async function getSongsByAlbumId(albumId: string) {
  const res = await fetch(`${getBaseUrl()}/api/albums/${albumId}/songs`);

  if (!res.ok) {
    switch (res.status) {
      case 404:
        return { songs: undefined, error: (await res.json()).message };
      case 500:
        throw new Error("Server error, please try again later");
    }
  }
  return res.json() as Promise<{ songs: Array<Song>; error: "" }>;
}
