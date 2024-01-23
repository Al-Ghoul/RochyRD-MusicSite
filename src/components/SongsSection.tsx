"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import LoadingSpinner from "./global/LoadingSpinner";
import { fetcher } from "@/utils/fetchers";
import Link from "next/link";
import Image from "next/image";

export default function SongsSection() {
  const params = useSearchParams();
  const queryLimit = params.get("limitBy") || 2;
  const startAfterDocId = params.get("startAfterDocId") || "";
  const endBeforeDocId = params.get("endBeforeDocId");
  const additionalParam = endBeforeDocId
    ? "&endBeforeDocId=" + endBeforeDocId
    : "&startAfterDocId=" + startAfterDocId;
  const { data, error, isLoading } = useSWR<
    { songs: Array<Song>; has_prev: boolean; has_next: boolean }
  >(`/api/songs?limitBy=${queryLimit}${additionalParam}`, fetcher);
  const lastDocId = data?.songs[data?.songs.length - 1]?.id;
  const firstDocId = data?.songs[0]?.id;

  return (
    <section>
      <h2 className="text-3xl font-bold mb-4">Songs</h2>
      {error
        ? (
          <div>
            <h3 className="text-2xl font-bold text-red-500">
              An error occurred
            </h3>
            <p>Please try again later</p>
          </div>
        )
        : null}

      {!isLoading && !data?.songs.length
        ? (
          <div>
            <h3 className="text-2xl font-bold text-red-500">
              No Songs were found.
            </h3>
          </div>
        )
        : null}

      {isLoading ? <LoadingSpinner /> : null}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.songs.map((song) => {
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

      {data?.songs.length
        ? (
          <nav
            aria-label="Page navigation example"
            className="flex justify-center my-5"
          >
            <ul className="list-style-none flex gap-3">
              <li>
                <Link
                  aria-disabled={!data?.has_prev}
                  href={data?.has_prev
                    ? `/?limitBy=${queryLimit}&endBeforeDocId=${firstDocId}`
                    : "#"}
                >
                  <button
                    className="relative block rounded px-2 py-1 text-sm text-white transition-all duration-300 hover:text-blue-600 hover:bg-neutral-100 bg-blue-950 disabled:bg-transparent disabled:text-gray-950"
                    disabled={!data?.has_prev}
                  >
                    Previous
                  </button>
                </Link>
              </li>

              <li>
                <Link
                  aria-disabled={!data?.has_next}
                  href={data?.has_next
                    ? `/?limitBy=${queryLimit}&startAfterDocId=${lastDocId}`
                    : "#"}
                >
                  <button
                    className="relative block rounded px-2 py-1 text-sm text-white transition-all duration-300 hover:text-blue-600 hover:bg-neutral-100 bg-blue-950 disabled:bg-transparent disabled:text-gray-950"
                    disabled={!data?.has_next}
                  >
                    Next
                  </button>
                </Link>
              </li>
            </ul>
          </nav>
        )
        : null}
    </section>
  );
}
