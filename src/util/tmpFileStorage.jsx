import { useState } from "react";
import { set, get, del } from "idb-keyval";

export function useFileStorage(key = "myFile") {
  const [tmpFile, setTmpFile] = useState(null);

  // Save file
  const saveFile = async (fileObj) => {
    await set(key, fileObj);   // stores File/Blob directly
    setTmpFile(fileObj);
  };

  // Load file
  const loadFile = async () => {
    const storedFile = await get(key);
    setTmpFile(storedFile || null);
    return storedFile;
  };

  // Delete file
  const deleteFile = async () => {
    await del(key);
    setTmpFile(null);
  };

  return { tmpFile, saveFile, loadFile, deleteFile };
}
