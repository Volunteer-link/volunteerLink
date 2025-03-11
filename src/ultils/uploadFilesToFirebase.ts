import { UploadFile } from "antd";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

const uploadFilesToFirebase = async (listFile: UploadFile[]) => {
  if (!listFile || listFile.length === 0) return;

  try {
    const promises = listFile.map((item) => {
      const file = item.originFileObj as File;

      const storageRef = ref(storage, `images/${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    });

    return await Promise.all(promises);
  } catch (error) {
    // console.error(error);
  } finally {
  }
};

export default uploadFilesToFirebase;
