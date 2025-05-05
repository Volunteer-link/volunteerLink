import React, { useEffect, useMemo, useState } from 'react';
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
  Tag,
} from 'antd';
import {
  dateRulesEvent,
  nameRules,
  timePublishedRulesEvent,
} from '../../ultils/validationRules';
import type { RadioChangeEvent } from 'antd';
import PreviewImageUpload from '../Components/PreviewImageUpload';
import FormAddress from '../Components/FormAddress';
import extendUploadFilesToFirebase from '../../ultils/extendUploadFilesToFirebase';
import MapBox from '../Components/MapBox';
import type { DatePickerProps, GetProps } from 'antd';
import { createEvent } from '../../model/Request/CreateEvent';
import api from '../../apiService/useFetch';
import dayjs, { Dayjs } from 'dayjs';
import { toISOLocal } from '../../ultils/toISOLocal';
import { useNavigate } from 'react-router-dom';
import { decodedCookie, getCookie } from '../../ultils/cookie';
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { TextArea } = Input;

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

interface UploadFileExtend {
  file: UploadFile[] | undefined;
  type: string;
}

interface MarkerPosition {
  longitude: number;
  latitude: number;
}
const CreateEvent = () => {
  const navigate = useNavigate();
  const [fileListThumbnail, setFileListThumbnail] = useState<UploadFileExtend>({
    file: [],
    type: 'thumbnail',
  });
  const [fileListImage, setFileListImage] = useState<UploadFileExtend>({
    file: [],
    type: 'image',
  });
  const [form] = Form.useForm();
  const [value, setValue] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    setTimePublish(null);
    form.setFieldValue('timePublish', null);
  };

  const [marker, setMarker] = useState<MarkerPosition | null>(null);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const user = decodedCookie(getCookie('accessToken'));
    if (!user) {
      window.location.href = '/unauthorized';
    } else if (user?.role !== 'Organization') {
      window.location.href = '/forbidden';
    }
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      const data = await api.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${marker?.latitude}&lon=${marker?.longitude}&format=json`
      );
      setAddress(data.data.display_name);
      form.setFieldsValue({
        address: data.data.display_name,
      });
    };

    if (marker?.latitude && marker?.longitude) {
      fetchAddress();
    }
  }, [marker]);
  const [listSelectedField, setListSelectedField] = useState<number[]>([]);
  const [listFieldState, setListFieldState] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const { message } = AntdApp.useApp();
  const onFinish = async (values: any) => {
    setLoading(true);
    let location: string | null = null;
    if (marker) {
      location = marker.latitude + ';' + marker.longitude;
    }
    if (!values.timePublish) {
      values.timePublish = dayjs();
    }
    const [startMoment, endMoment] = values.date || [];
    const { images, thumbnails } = await upLoadFileToCloud();
    const dataEvent: createEvent = {
      name: values.nameEvent,
      location: location,
      address: address ?? '',
      startTime: toISOLocal(dayjs(startMoment).add(60, 'second').toDate()),
      endTime: toISOLocal(dayjs(endMoment).add(60, 'second').toDate()),
      description: values.description,
      timePublish:
        value === 1 ? null : toISOLocal(dayjs(values.timePublish).toDate()),
      hasDonate: values.donate,
      imagesEvent: images,
      thumbnail: thumbnails[0],
      fieldsEvent: listSelectedField,
    };
    try {
      const { data } = await api.post(`/event/create-an-event`, dataEvent);
      navigate('/organizations/events');
      message.success('Tạo sự kiện thành công!');
    } catch (e: any) {
      message.error('Tạo sự kiện thất bại!');
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Submit thất bại:', errorInfo);
    message.error(
      'Có một số lỗi trong form của bạn. Vui lòng kiểm tra lại các trường  và sửa lỗi!'
    );
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
      ?.map((item) => item.url);

    const thumbnails = listFileUrls
      .filter((item) => item.url && item.type === 'thumbnail')
      ?.map((item) => item.url);

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
  const [timePublish, setTimePublish] = useState<dayjs.Dayjs | null>(null);
  const handleTimePublishChange = (value: dayjs.Dayjs | null) => {
    setTimePublish(value);
  };
  const disabledDate = (current: any) => {
    if (value === 1) {
      return current.isBefore(dayjs().add(2, 'days'), 'day');
    } else if (value === 2) {
      if (!timePublish) return false;
      const minDate = timePublish.add(2, 'days');
      return current.isBefore(minDate, 'day');
    }
  };

  return (
    <div className="">
      <Breadcrumb
        items={[
          {
            title: 'Quản lý sự kiện',
            href: '/organizations/events',
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
            <MapBox marker={marker} setMarker={setMarker} />
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
          <Form.Item
            name="address"
            className=""
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input hidden />
          </Form.Item>
          {address && <p className="mt-2">Vị trí đã chọn: {address}</p>}
        </div>
        <div className="mt-6">
          <Tag className="mb-2 p-1" color="warning">
            Ghi chú: Tình nguyện viên chỉ có thể đăng ký trước khi sự kiện diễn
            ra 24h
          </Tag>
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
              name="timePublish"
              className="mb-4 mt-3"
              rules={[
                { required: true, message: 'Vui lòng chọn ngày xuất bản!' },
                {
                  validator: (_, value) => {
                    if (value && value.isBefore(dayjs())) {
                      return Promise.reject(
                        new Error('Ngày xuất bản phải lớn hơn ngày hiện tại!')
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
                placeholder="Chọn ngày công bố"
                onChange={handleTimePublishChange}
              />
            </Form.Item>
          )}
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Ngày diễn ra
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item
            name="date"
            className="mb-4 mt-3 "
            rules={[
              {
                required: true,
                message: '',
              },
              {
                validator: async (_, value: [Dayjs, Dayjs]) => {
                  if (!value || value.length < 2) {
                    return Promise.reject(
                      'Hãy chọn cả ngày bắt đầu và ngày kết thúc!'
                    );
                  }

                  const [startDate, endDate] = value;
                  const timePublish = form.getFieldValue('timePublish');
                  const currentDate = dayjs();
                  const minStartDate = currentDate.add(2, 'day');

                  if (!endDate)
                    return Promise.reject('Vui lòng chọn ngày kết thúc!');
                  if (!startDate)
                    return Promise.reject('Vui lòng chọn ngày bắt đầu!');

                  if (
                    timePublish &&
                    startDate?.isBefore(timePublish.add(2, 'day'))
                  ) {
                    return Promise.reject(
                      'Ngày bắt đầu phải lớn hơn ngày xuất bản ít nhất 2 ngày!'
                    );
                  }
                  if (startDate?.isBefore(minStartDate)) {
                    return Promise.reject(
                      'Ngày bắt đầu phải lớn hơn ngày hiện tại ít nhất 2 ngày!'
                    );
                  }
                  if (endDate?.isBefore(currentDate, 'day')) {
                    return Promise.reject(
                      'Ngày kết thúc phải sau ngày hiện tại!'
                    );
                  }

                  if (endDate?.isBefore(startDate)) {
                    return Promise.reject(
                      'Ngày kết thúc phải sau ngày bắt đầu!'
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker.RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onOk={onOk}
              allowEmpty
              disabled={!timePublish && value == 2}
              disabledDate={disabledDate}
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
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
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
            {listFieldState?.map((item, index) => (
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
                      new Error('Vui lòng chọn ít nhất 1 lĩnh vực')
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
              Hình ảnh nội dung
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>
          <Tag className="mb-2 p-1" color="warning">
            Ghi chú: Sự kiện chỉ cho tối đa 5 ảnh
          </Tag>

          <Form.Item
            className="mb-4 mt-3"
            name="imageThumbnail"
            rules={[
              {
                validator(_: any, value: string) {
                  if (!fileListImage?.file?.length) {
                    return Promise.reject('Bạn cần upload ảnh');
                  }
                  if (fileListImage?.file?.length > 5) {
                    return Promise.reject('Sự kiện chỉ được tối đa 5 ảnh');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <PreviewImageUpload
              multiple={true}
              fileList={fileListImage.file}
              setFileList={(fileList) => {
                setFileListImage({ file: fileList, type: 'image' });
              }}
              maxCount={10}
            />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Kêu gọi ủng hộ
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item
            name="donate"
            valuePropName="checked" // Quy định checkbox khi form được submit
            initialValue={true}
            className="mt-2" // Giá trị mặc định của checkbox
          >
            <Checkbox></Checkbox>
          </Form.Item>
        </div>

        <div className="my-6">
          <Button loading={loading} htmlType="submit">
            Tạo sự kiện
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateEvent;
