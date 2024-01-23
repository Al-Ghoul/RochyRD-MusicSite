import { db } from "@/firebase/app";
import {
  collection,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  type OrderByDirection,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sortBy = searchParams.get("sortBy") as unknown as
    | OrderByDirection
    | undefined;
  const limitBy = parseInt(searchParams.get("limitBy") || "");
  const startAfterDocId = searchParams.get("startAfterDocId");
  const endBeforeDocId = searchParams.get("endBeforeDocId");

  if (sortBy && !["desc", "asc"].includes(sortBy)) {
    return NextResponse.json({
      success: false,
      message: "sortBy can only be either asc or desc",
    }, { status: 400 });
  }

  if (startAfterDocId && !limitBy) {
    return NextResponse.json({
      success: false,
      message: "You must provide limitBy along with startAfterDocId",
    }, { status: 400 });
  }

  if (endBeforeDocId && !limitBy) {
    return NextResponse.json({
      success: false,
      message: "You must provide limitBy along with endBeforeDocId",
    }, { status: 400 });
  }

  if (
    startAfterDocId && startAfterDocId.length && endBeforeDocId &&
    endBeforeDocId.length
  ) {
    return NextResponse.json({
      success: false,
      message: "You can only provide either startAfterDocId or endBeforeDocId",
    });
  }

  if (limitBy && (isNaN(limitBy) || limitBy < 1)) {
    return NextResponse.json({
      success: false,
      message: "limitBy must be a positive number",
    }, { status: 400 });
  }

  const albumsCollection = collection(db, "albums");
  const queryOrderBy = orderBy("createdAt", sortBy || "desc");

  let finalQuery = query(albumsCollection, queryOrderBy);
  let albums;

  if (startAfterDocId && startAfterDocId.length) {
    const startAfterDoc = (await getDocs(
      query(albumsCollection, where("id", "==", startAfterDocId)),
    )).docs[0];
    if (startAfterDoc !== undefined) {
      finalQuery = query(
        albumsCollection,
        queryOrderBy,
        limit(limitBy + 1),
        startAfter(startAfterDoc),
      );
    }
    albums = (await getDocs(finalQuery)).docs.map((album) => album.data());
    let has_next = false;
    if (albums.length > 2) {
      albums.pop();
      has_next = true;
    }
    return Response.json({ success: true, albums, has_next, has_prev: true });
  }

  if (endBeforeDocId && endBeforeDocId.length) {
    const endBeforeDoc = (await getDocs(
      query(albumsCollection, where("id", "==", endBeforeDocId)),
    )).docs[0];
    if (endBeforeDoc !== undefined) {
      finalQuery = query(
        albumsCollection,
        queryOrderBy,
        limitToLast(limitBy + 1),
        endBefore(endBeforeDoc),
      );
    }

    albums = (await getDocs(finalQuery)).docs.map((album) => album.data());
    let has_prev = false;
    if (albums.length > 2) {
      albums.shift();
      has_prev = true;
    }
    return Response.json({ success: true, albums, has_prev, has_next: true });
  }

  if (!isNaN(limitBy)) {
    finalQuery = query(albumsCollection, queryOrderBy, limit(limitBy + 1));
    albums = (await getDocs(finalQuery)).docs.map((album) => album.data());
    let has_next = false;
    if (albums.length > 2) {
      albums.pop();
      has_next = true;
    }
    return Response.json({ success: true, albums, has_next });
  }

  albums = (await getDocs(finalQuery)).docs.map((album) => album.data());
  return Response.json({ success: true, albums });
}
