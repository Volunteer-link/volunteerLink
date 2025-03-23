import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Breadcrumb,
  DatePicker,
  Form,
  Input,
  UploadFile,
  Radio,
  Button,
  Modal,
  Checkbox,
  App as AntdApp,
  DatePickerProps,
  RadioChangeEvent,
} from 'antd';
import api from '../../apiService/useFetch';
import { createEvent } from '../../model/Request/CreateEvent';
import { RangePickerProps } from 'antd/es/date-picker';
import extendUploadFilesToFirebase from '../../ultils/extendUploadFilesToFirebase';
import { dateRulesEvent, nameRules } from '../../ultils/validationRules';
import MapBox from '../Components/MapBox';
import FormAddress from '../Components/FormAddress';
import TextArea from 'antd/es/input/TextArea';
import PreviewImageUpload from '../Components/PreviewImageUpload';
import dayjs from 'dayjs';
import { toISOLocal } from '../../ultils/toISOLocal';
import ErrorSolving from '../../Common/ErrorSolving';

interface UploadFileExtend {
  file: UploadFile[] | undefined;
  type: string;
}

interface MarkerPosition {
  longitude: number;
  latitude: number;
}

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};
const UpdateEvent = () => {
  const { id } = useParams();
  const { message } = AntdApp.useApp();
  const [event, setEvent] = React.useState<any>();
  const [marker, setMarker] = useState<MarkerPosition | null>(null);
  const [listSelectedField, setListSelectedField] = useState<number[]>([]);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/common/get-event-infomation`, {
          params: { eventId: id },
        });
        console.log(data.data);
        const [latitude, longitude] = data.data.location
          .split(';')
          .map((part: string) => part.trim());
        setMarker({
          longitude: parseFloat(longitude),
          latitude: parseFloat(latitude),
        });
        setFileListThumbnail((prev) => {
          return {
            ...prev,
            file: [
              {
                uid: '-1',
                name: 'imageThumbnail',
                status: 'done',
                url: `${data.data?.thumbnail}`,
              },
            ],
          };
        });
        setFileListImage((prev) => {
          return {
            ...prev,
            file: data.data.images.map((item: string, index: number) => ({
              uid: index.toString(),
              name: 'imageThumbnail',
              status: 'done',
              url: item,
            })),
          };
        });
        setListSelectedField(
          data.data.fields?.map((field: any, index: number) => field.id)
        );
        setEvent(data.data);
      } catch (e: any) {
        console.log(e);
      }
    };
    fetchEvent();
  }, []);
  const [fileListThumbnail, setFileListThumbnail] = useState<UploadFileExtend>({
    file: [],
    type: 'thumbnail',
  });
  const [fileListImage, setFileListImage] = useState<UploadFileExtend>({
    file: [],
    type: 'image',
  });
  const [form] = Form.useForm();
  const [value, setValue] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const [listFieldState, setListFieldState] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const partsAddress = event?.address
    .split(',')
    .map((part: string) => part.trim());
  const onFinish = async (values: any) => {
    setLoading(true);
    const address = `${values.ward}, ${values.district}, ${values.province}`;
    let coordinates = await getCoordinates(address);
    let location: string | null = null;
    if (coordinates) {
      location = `${coordinates.lat};${coordinates.lon}`;
    }
    if (marker) {
      location = marker.latitude + ';' + marker.longitude;
    }
    const [startMoment, endMoment] = values.date || [];
    const { images, thumbnails } = await upLoadFileToCloud();

    const dataEvent: createEvent = {
      name: values.nameEvent,
      location: location,
      address: address,
      startTime: toISOLocal(dayjs(startMoment).add(60, 'second').toDate()),
      endTime: toISOLocal(dayjs(endMoment).add(60, 'second').toDate()),
      description: values.description,
      timePublish:
        toISOLocal(dayjs(values.timePublish).add(60, 'second').toDate()) ||
        toISOLocal(dayjs().add(120, 'second').toDate()),
      status: value === 1 ? 0 : -1,
      hasDonate: false,
      imagesEvent: images.length > 0 ? images : event.images,
      thumbnail: thumbnails.length > 0 ? thumbnails[0] : event.thumbnail,
      fieldsEvent: listSelectedField,
    };
    try {
      const { data } = await api.put(`/event/update-an-event`, dataEvent);
      console.log(data);
      message.success('Cập nhật sự kiện thành công!');
    } catch (e: any) {
      message.error('Cập nhật sự kiện thất bại!');
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getCoordinates = async (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Submit thất bại:', errorInfo);
  };

  const upLoadFileToCloud = async () => {
    const listImageFile = extendUploadFilesToFirebase(
      fileListImage?.file,
      fileListImage.type
    );
    const listThumbnailFile = extendUploadFilesToFirebase(
      fileListThumbnail?.file,
      fileListThumbnail.type
    );

    const allPromises = [...listImageFile, ...listThumbnailFile];

    const listFileUrls = await Promise.all(allPromises);

    const images = listFileUrls
      .filter((item) => item.url && item.type === 'image')
      .map((item) => item.url);

    const thumbnails = listFileUrls
      .filter((item) => item.url && item.type === 'thumbnail')
      .map((item) => item.url);

    return { images, thumbnails };
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const onOk = (
    value: DatePickerProps['value'] | RangePickerProps['value']
  ) => {};

  useEffect(() => {
    const fetchField = async () => {
      try {
        const { data } = await api.get(`/common/get-fields`);
        setListFieldState(data.data);
      } catch (e: any) {
      } finally {
      }
    };
    fetchField();
  }, []);
  const currentDateMinusOneDay = dayjs().subtract(1, 'day');
  const isBeforeOneDay = dayjs(event?.startTime).isBefore(
    currentDateMinusOneDay,
    'day'
  );
  // if (event  && isBeforeOneDay  ) {
  //   return <ErrorSolving errCode={300} />;
  // }

  if (!event) {
    return <ErrorSolving errCode={404} />;
  }
  return (
    <div className="container mx-auto px-4">
      <Breadcrumb
        items={[
          {
            title: 'Quản lý sự kiện',
          },
          {
            title: 'Cập nhật sự kiện',
          },
        ]}
      />

      <div className="mt-10 inline-block">
        <h3 className="font-medium text-[24px] text-[#3BA769]">
          Cập nhật sự kiện mới
        </h3>
        <div className="bg-[#3BA769] w-1/2 h-[1px]"></div>
      </div>

      <Form
        name="EventForm"
        className="w-full"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Tên sự kiện
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item
            name="nameEvent"
            initialValue={event?.name}
            className="mb-4 mt-3"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
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
          <Modal
            maskClosable={true}
            footer={null}
            onCancel={handleClose}
            title="Chọn địa điểm"
            centered
            open={isModalOpen}
          >
            <MapBox
              marker={marker}
              initialViewport={marker}
              setMarker={setMarker}
            />
          </Modal>
          <div
            onClick={showModal}
            className="px-3 cursor-pointer hover:opacity-80 py-2 mt-3 rounded-lg border inline-block border-[#515151]"
          >
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
          <FormAddress
            province={partsAddress[2]}
            district={partsAddress[1]}
            ward={partsAddress[0]}
            form={form}
          />
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Ngày diễn ra
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item
            initialValue={[dayjs(event.startTime), dayjs(event.endTime)]}
            name="date"
            className="mb-4 mt-3 "
            rules={dateRulesEvent}
          >
            <DatePicker.RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onOk={onOk}
            />
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
            name="description"
            className="mb-4 mt-3 "
            initialValue={event?.description}
            rules={[{ required: true, message: 'Vui lòng nhập mo ta' }]}
          >
            <TextArea className="mt-3 w-full" rows={5} />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Lĩnh vực
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>
          <div
            className={`bg-stone-100 border-[0.05rem] rounded-md mb-4 mt-3  ${'border-primary-color'} overflow-hidden cursor-pointer px-4 py-2 lg:w-1/2`}
          >
            {listFieldState.map((item, index) => (
              <div
                key={index}
                className="px-1 py-1 flex items-center justify-between gap-1 hover:bg-stone-200 duration-150 hover:rounded-md select-none"
              >
                <div>{item.name}</div>
                <Checkbox
                  checked={listSelectedField.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setListSelectedField([...listSelectedField, item.id]);
                    } else {
                      setListSelectedField(
                        listSelectedField.filter((id) => id !== item.id)
                      );
                    }
                  }}
                ></Checkbox>
              </div>
            ))}
          </div>
          <Form.Item
            name="selectedFields"
            className="mb-0"
            rules={[
              {
                validator: (_, value) => {
                  if (listSelectedField.length === 0) {
                    return Promise.reject(
                      new Error('Please select at least one field.')
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <div></div>
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
              maxCount={10}
            />
          </Form.Item>
        </div>

        <div className="mt-6">
          <Radio.Group
            style={style}
            onChange={onChange}
            value={value}
            defaultValue={value}
            options={[
              { value: 1, label: 'Xuất bản sự kiện ngay lập tức' },
              { value: 2, label: 'Xuất bản sự kiện theo lịch' },
            ]}
          />

          {value === 2 && (
            <Form.Item
              name="timePublish"
              className="mb-4 mt-3"
              initialValue={dayjs(event.timePublish)}
              rules={[
                { required: true, message: 'Vui lòng chọn ngày công bố!' },
                {
                  validator: async (_, value) => {
                    if (!value) return Promise.resolve();
                    const { date } = form.getFieldsValue();
                    const [startDate, endDate] = date || [];

                    const selectedDate = dayjs(value);

                    if (!startDate || !endDate) {
                      return Promise.reject(
                        'Vui lòng chọn ngày bắt đầu và ngày kết thúc trước!'
                      );
                    }

                    if (!selectedDate.isBefore(startDate, 'minute')) {
                      return Promise.reject(
                        'Vui lòng chọn lại ngày công bố!. Ngày công bố cần phải trước ngày bắt đầu'
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder=""
                style={{ width: '30%' }}
              />
            </Form.Item>
          )}
        </div>

        <div className="my-6">
          <Button loading={loading} htmlType="submit">
            Cập nhật sự kiện
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateEvent;
