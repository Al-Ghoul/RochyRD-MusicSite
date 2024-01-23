import { db } from "@/firebase/app";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { albumId: string } },
) {
  const albumsCollection = collection(db, "albums");
  const album =
    (await getDocs(query(albumsCollection, where("id", "==", params.albumId))))
      .docs[0];
  if (!album) {
    return NextResponse.json({
      success: false,
      message: "Requested album does NOT exist",
    }, { status: 404 });
  }

  const songsCollection = collection(db, "songs");
  const songs = (await getDocs(
    query(songsCollection, where("albumId", "==", params.albumId)),
  )).docs.map((song) => song.data());

  return Response.json({ success: true, songs });
}
