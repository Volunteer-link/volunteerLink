import React, { useState } from 'react';
import {
  Breadcrumb,
  DatePicker,
  Form,
  Input,
  UploadFile,
  Radio,
  Button,
} from 'antd';
import { dateRulesEvent, nameRules } from '../../ultils/validationRules';
import type { RadioChangeEvent } from 'antd';
import PreviewImageUpload from '../Components/PreviewImageUpload';
import uploadFilesToFirebase from '../../ultils/uploadFilesToFirebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../ultils/firebase';

const { TextArea } = Input;

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

interface FileUpLoadExtend {
  url: string;
  type: string;
}

interface UploadFileExtend {
  file: UploadFile[] | undefined;
  type: string;
}

const CreateEvent = () => {
  const [fileListThumbnail, setFileListThumbnail] = useState<UploadFileExtend>({
    file: [],
    type: 'thumbnail',
  });
  const [fileListImage, setFileListImage] = useState<UploadFileExtend>({
    file: [],
    type: 'image',
  });
  const [listThumbnail, setListThumbnail] = useState<string[]>([]);
  const [listImage, setListImage] = useState<string[]>([]);

  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const onFinish = () => {};

  const onFinishFailed = () => {};

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

  const upLoadFileToCloud = async () => {
    const listImage = extendUploadFilesToFirebase(
      fileListImage?.file,
      fileListImage.type
    );
    const listThumbnail = extendUploadFilesToFirebase(
      fileListThumbnail?.file,
      fileListThumbnail.type
    );

    const allPromises = [...listImage, ...listThumbnail];

    const listFileUrls = await Promise.all(allPromises);

    console.log(listFileUrls)

    setListImage(
      listFileUrls
        .filter((item) => item.url && item.type === 'image')
        .map((item) => item.url)
    );

    setListThumbnail(
      listFileUrls
        .filter((item) => item.url && item.type === 'thumbnail')
        .map((item) => item.url)
    );
 
  };
  console.log(listImage)
  console.log(listThumbnail)
  
  return (
    <div className="container mx-auto px-4">
      <Breadcrumb
        items={[
          {
            title: 'Quản lý sự kiện',
          },
          {
            title: 'Tạo sự kiện mới',
          },
        ]}
      />

      <div className="mt-10 inline-block">
        <h3 className="font-medium text-[24px] text-[#3BA769]">
          Tạo sự kiện mới
        </h3>
        <div className="bg-[#3BA769] w-1/2 h-[1px]"></div>
      </div>

      <Form
        name="EventForm"
        className="w-full"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Tên sự kiện
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item name="nameEvent" className="mb-4 mt-3" rules={nameRules}>
            <Input />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Địa Điểm
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>
          <div className="px-3 cursor-pointer hover:opacity-80 py-2 mt-3 rounded-lg border inline-block border-[#515151]">
            <Form.Item
              name="location"
              hidden
              className="mb-4 mt-3"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
            >
              <Input type="hidden" />
            </Form.Item>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill="none"
            >
              <path
                d="M1 7.92285C1 12.7747 5.24448 16.7869 7.12319 18.3252C7.39206 18.5454 7.52811 18.6568 7.72871 18.7132C7.88491 18.7572 8.1148 18.7572 8.271 18.7132C8.47197 18.6567 8.60707 18.5463 8.87695 18.3254C10.7557 16.7871 14.9999 12.7751 14.9999 7.9233C14.9999 6.08718 14.2625 4.32605 12.9497 3.02772C11.637 1.72939 9.8566 1 8.00008 1C6.14357 1 4.36301 1.7295 3.05025 3.02783C1.7375 4.32616 1 6.08674 1 7.92285Z"
                stroke="#3BA769"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 7C6 8.10457 6.89543 9 8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7Z"
                stroke="#3BA769"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Ngày diễn ra
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item name="date" className="mb-4 mt-3 " rules={dateRulesEvent}>
            <DatePicker placeholder="" style={{ width: '30%' }} />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Mô tả sự kiện
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>
          <Form.Item
            name="date"
            className="mb-4 mt-3 "
            rules={[{ required: true, message: 'Vui lòng nhập mo ta' }]}
          >
            <TextArea className="mt-3 w-full" rows={5} />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Hình thu nhỏ
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item
            className="mb-4 mt-3"
            name="imageThumbnail"
            rules={[
              {
                validator(_: any, value: string) {
                  if (!fileListThumbnail?.file?.length) {
                    return Promise.reject('Bạn cần upload ảnh');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <PreviewImageUpload
              fileList={fileListThumbnail.file}
              setFileList={(fileList) => {
                setFileListThumbnail({ file: fileList, type: 'thumbnail' });
              }}
            />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Hình anh noi dung
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item
            className="mb-4 mt-3"
            name="imageThumbnail"
            rules={[
              {
                validator(_: any, value: string) {
                  if (!fileListImage?.file?.length) {
                    return Promise.reject('Bạn cần upload ảnh');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <PreviewImageUpload
              fileList={fileListImage.file}
              setFileList={(fileList) => {
                setFileListImage({ file: fileList, type: 'image' });
              }}
            />
          </Form.Item>
        </div>

        <div className="mt-6">
          <Radio.Group
            style={style}
            onChange={onChange}
            value={value}
            options={[
              { value: 1, label: 'Xuất bản sự kiện ngay lập tức' },
              { value: 2, label: 'Xuất bản sự kiện theo lịch' },
            ]}
          />

          {value === 2 && (
            <Form.Item
              name="datePublish"
              className="mb-4 mt-3 "
              rules={dateRulesEvent}
            >
              <DatePicker placeholder="" style={{ width: '30%' }} />
            </Form.Item>
          )}
        </div>

        <div className="mt-6">
          <Button onClick={upLoadFileToCloud}>Send</Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateEvent;
