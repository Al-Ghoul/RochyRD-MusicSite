import { CreateAlbumForm, CreateSongForm } from "@/components/forms";
import { getBaseUrl } from "@/utils/helpers";

export const revalidate = 3600;

export default async function UploadPage() {
  const { albums } = await getAlbums();

  return (
    <main className="flex flex-col min-h-screen items-center">
      <CreateAlbumForm />
      <CreateSongForm albums={albums} />
    </main>
  );
}

async function getAlbums() {
  const res = await fetch(`${getBaseUrl()}/api/albums`, {
    next: { tags: ["albumsData"] },
  });

  if (!res.ok) return { albums: [] };

  return res.json() as Promise<{
    albums: Array<Album>;
  }>;
}
