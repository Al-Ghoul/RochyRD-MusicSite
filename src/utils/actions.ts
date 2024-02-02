"use server";
import { initFbAdmin } from "@/firebase/app";
import { randomUUID } from "crypto";
import { getFirestore } from "firebase-admin/firestore";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { z } from "zod";
import { revalidateTag } from "next/cache";

const FileType = z.custom<File>((val) => {
  return typeof val === "object";
});

const albumInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  img: FileType,
});

export async function createAlbum(
  _prevState: { message: string; success: boolean },
  formData: FormData,
) {
  const inputFields = albumInputSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    img: formData.get("img"),
  });

  if (!inputFields.success) {
    return {
      message: "Please check all fields",
      success: false,
    };
  }

  let imageURL = null;
  initFbAdmin();
  if (
    inputFields.data.img.name !== "undefined" && inputFields.data.img.size !== 0
  ) {
    const image = inputFields.data.img;
    const imageBuffer = Buffer.from(await image.arrayBuffer());

    const storageBucket = getStorage().bucket();
    const file = storageBucket.file(`public/albums/${image.name}`);
    await file.save(imageBuffer, {
      metadata: {
        contentType: image.type,
      },
    });
    imageURL = await getDownloadURL(file);
  }

  const db = getFirestore();
  const albumRecord = db.collection("albums").doc();
  await albumRecord.set({
    id: randomUUID(),
    title: inputFields.data.title,
    description: inputFields.data.description || "",
    imageURL,
    createdAt: new Date(),
  });

  revalidateTag("albumsData");

  return {
    message: "Album was added successfully.",
    success: true,
  };
}

const songInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  useAlbumImg: z.boolean().nullish(),
  albumId: z.string(),
  img: FileType,
  mp3File: FileType,
}).refine(
  (input) =>
    !(!input.useAlbumImg &&
      (input.img.name === "undefined" && input.img.size === 0)),
  {
    message: "Please provide an image or opt in to use the album's image",
    path: ["img"],
  },
);

export async function createSong(
  _prevState: { message: string; success: boolean },
  formData: FormData,
) {
  const inputFields = songInputSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    useAlbumImg: Boolean(formData.get("useAlbumImg")?.toString()),
    albumId: formData.get("albumId"),
    img: formData.get("img"),
    mp3File: formData.get("mp3File"),
  });

  if (!inputFields.success) {
    return {
      message: "Please check all fields",
      success: false,
    };
  }

  initFbAdmin();
  const db = getFirestore();
  const album =
    (await db.collection("albums").where("id", "==", inputFields.data.albumId)
      .get()).docs[0]?.data() as Album;
  if (inputFields.data.albumId && !album) {
    return {
      message: "Album does NOT exist",
      success: false,
    };
  }

  const storageBucket = getStorage().bucket();
  const mp3File = inputFields.data.mp3File;
  const mp3FileBuffer = Buffer.from(await mp3File.arrayBuffer());
  const mp3FileRef = storageBucket.file(`public/mp3/${mp3File.name}`);
  await mp3FileRef.save(mp3FileBuffer, {
    metadata: {
      contentType: mp3File.type,
    },
  });
  const mp3FileURL = await getDownloadURL(mp3FileRef);

  let imageURL = null;
  if (inputFields.data.useAlbumImg) {
    imageURL = album.imageURL || null;
  } else if (
    inputFields.data.img.name !== "undefined" && inputFields.data.img.size !== 0
  ) {
    const imgFile = inputFields.data.img;
    const imgFileBuffer = Buffer.from(await imgFile?.arrayBuffer());
    const imgFileRef = storageBucket.file(`public/uploads/${imgFile.name}`);
    await imgFileRef.save(imgFileBuffer, {
      metadata: {
        contentType: imgFile.type,
      },
    });
    imageURL = await getDownloadURL(imgFileRef);
  }

  const uploadRecord = db.collection("songs").doc();
  await uploadRecord.set({
    id: randomUUID(),
    title: inputFields.data.title,
    description: inputFields.data.description || "",
    url: mp3FileURL,
    imageURL,
    albumId: inputFields.data.albumId || null,
    createdAt: new Date(),
  });

  return {
    message: "Song was added successfully.",
    success: true,
  };
}
