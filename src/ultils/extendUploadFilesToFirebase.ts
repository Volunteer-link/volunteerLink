import { UploadFile } from "antd";
import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
interface FileUpLoadExtend {
    url: string;
    type: string;
  }
const extendUploadFilesToFirebase = (
    listFile: UploadFile[] | undefined,
    type: string
  ) => {
    if (!listFile || listFile.length === 0) return [];

    try {
      const promises = listFile.map((item) => {
        const file = item.originFileObj as File;

        const storageRef = ref(storage, `images/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<FileUpLoadExtend>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              //  console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ url: downloadURL, type });
            }
          );
        });
      });

      return promises;
    } catch (error) {
      // console.error(error);
      return [];
    } finally {
    }
  };

  export default extendUploadFilesToFirebase;