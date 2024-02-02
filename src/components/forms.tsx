"use client";
import { createAlbum, createSong } from "@/utils/actions";
import { useFormState } from "react-dom";
import SubmitButton from "./SubmitButton";
import { useEffect, useState } from "react";

const initialState = {
  message: "",
  success: false,
};

export const CreateAlbumForm = () => {
  const [createAlbumState, createAlbumFormAction] = useFormState(
    createAlbum,
    initialState,
  );
  const [image, setImage] = useState<string>();

  useEffect(() => {
    if (createAlbumState.success) {
      setImage("");
    }
  }, [createAlbumState, image]);

  return (
    <div className="my-10 mx-5">
      <form action={createAlbumFormAction}>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          *Album title:
          <input
            type="text"
            name="title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </label>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Album description:
          <input
            name="description"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </label>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Album image:
          <input
            type="file"
            name="img"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => {
              if (e.target?.files?.length) {
                setImage(URL.createObjectURL(e.target.files[0]));
              }
            }}
            accept="image/png, image/jpeg"
          />
        </label>
        <SubmitButton />
      </form>

      {(!createAlbumState.success && createAlbumState?.message.length)
        ? <p className="text-red-500">{createAlbumState.message}</p>
        : null}

      {(createAlbumState.success && createAlbumState.message.length)
        ? <p className="text-green-500">{createAlbumState.message}</p>
        : null}
    </div>
  );
};

export const CreateSongForm = ({ albums }: {
  albums: Array<Album>;
}) => {
  const [createSongState, createSongFormAction] = useFormState(
    createSong,
    initialState,
  );
  const [image, setImage] = useState<string>();

  useEffect(() => {
    if (createSongState.success) {
      setImage("");
    }
  }, [createSongState, image]);

  return (
    <div className="my-10 mx-5">
      <form action={createSongFormAction}>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          *Song title:
          <input
            type="text"
            name="title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </label>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Song description:
          <input
            name="description"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </label>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          *MP3 File:
          <input
            type="file"
            name="mp3File"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            accept="audio/mpeg"
          />
        </label>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Image:
          <input
            type="file"
            name="img"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => {
              if (e.target?.files?.length) {
                setImage(URL.createObjectURL(e.target.files[0]));
              }
            }}
            accept="image/png, image/jpeg"
          />
        </label>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Use album&apos;s image?
          <input
            type="checkbox"
            name="useAlbumImg"
            className="ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </label>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Album:
          <select name="albumId">
            <option value="">Pick an album</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>{album.title}</option>
            ))}
          </select>
        </label>
        <SubmitButton />
      </form>

      {(!createSongState.success && createSongState?.message.length)
        ? <p className="text-red-500">{createSongState.message}</p>
        : null}

      {(createSongState.success && createSongState.message.length)
        ? <p className="text-green-500">{createSongState.message}</p>
        : null}
    </div>
  );
};
