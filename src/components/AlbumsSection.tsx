"use client";
import { fetcher } from "@/utils/fetchers";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "./global/LoadingSpinner";
import Image from "next/image";

export default function AlbumsSection() {
  const params = useSearchParams();
  const queryLimit = params.get("limitBy") || 8;
  const startAfterDocId = params.get("startAfterDocId") || "";
  const endBeforeDocId = params.get("endBeforeDocId");
  const additionalParam = endBeforeDocId
    ? "&endBeforeDocId=" + endBeforeDocId
    : "&startAfterDocId=" + startAfterDocId;
  const { data, error, isLoading } = useSWR<
    { albums: Array<Album>; has_prev: boolean; has_next: boolean }
  >(`/api/albums?limitBy=${queryLimit}${additionalParam}`, fetcher);
  const lastDocId = data?.albums[data?.albums.length - 1]?.id;
  const firstDocId = data?.albums[0]?.id;

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-4">Albums</h2>

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

      {!isLoading && !data?.albums.length
        ? (
          <div>
            <h3 className="text-2xl font-bold text-red-500">
              No Albums were found.
            </h3>
          </div>
        )
        : null}

      {isLoading ? <LoadingSpinner /> : null}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.albums.map((album) => {
          return (
            <Link key={album.id} href={`/albums/${album.id}`}>
              <div className="bg-white rounded-lg shadow-md dark:bg-gray-800">
                <Image
                  alt={album.description}
                  className="object-cover w-full h-64 rounded-t-lg"
                  height={500}
                  src={album.imageURL || "/images/placeholder.svg"}
                  style={{
                    aspectRatio: "500/500",
                    objectFit: "cover",
                  }}
                  width={500}
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{album.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {album.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {data?.albums.length
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
                    ? `?limitBy=${queryLimit}&endBeforeDocId=${firstDocId}`
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
                    ? `?limitBy=${queryLimit}&startAfterDocId=${lastDocId}`
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
