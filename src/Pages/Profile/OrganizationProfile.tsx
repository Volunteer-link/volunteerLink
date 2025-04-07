import React, { useEffect, useState } from "react";
import {
  DatePicker,
  Form,
  Input,
  UploadFile,
  Button,
  Checkbox,
  App as AntdApp,
  Popconfirm,
} from "antd";
import { nameRules } from "../../ultils/validationRules";
import PreviewImageUpload from "../Components/PreviewImageUpload";
import FormAddress from "../Components/FormAddress";
import type { DatePickerProps, GetProps } from "antd";
import api from "../../apiService/useFetch";
import { decodedCookie, getCookie } from "../../ultils/cookie";
import uploadFilesToFirebase from "../../ultils/uploadFilesToFirebase";
import { PullRequestOutlined } from "@ant-design/icons";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { TextArea } = Input;

const style: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const OrganizationProfile = () => {
  const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [nameRequest, setNameRequest] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [listSelectedField, setListSelectedField] = useState<number[]>([]);
  const [listFieldState, setListFieldState] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [organization, setOrganization] = useState<any>();
  const partsAddress =
    organization?.address?.split(",").map((part: string) => part.trim()) || [];
  useEffect(() => {
    const fetchOrganization = async () => {
      const token = getCookie("accessToken");
      const user = decodedCookie(token);
      const { data } = await api.get(`/profile/organization`, {
        params: {
          Id: user.AccId,
        },
      });
      setListSelectedField(data.data?.fields.map((field: any) => field.id));
      setFileListThumbnail((prev) => {
        return [
          {
            uid: "-1",
            name: "imageThumbnail",
            status: "done",
            url: `${data.data?.urlImage}`,
          },
        ];
      });
      setOrganization(data.data);
    };

    fetchOrganization();
  }, []);

  const { message } = AntdApp.useApp();
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const address = `${values.ward}, ${values.district}, ${values.province}`;
      const image = await uploadFilesToFirebase(fileListThumbnail);
      const dataRequest = {
        description: values.description.trim(),
        phoneNumber: values.phoneNumber.trim(),
        urlFacebook: values.urlFacebook.trim(),
        address: address || organization.address,
        fields: listSelectedField || organization.fields,
        imageUrl: image?.[0] || organization.urlImage,
      };
      const { data } = await api.put("profile/organization", dataRequest);
      message.success("Cập nhật thông tin thành công!");
    } catch (e: any) {
      message.error("Cập nhật thông tin thất bại!");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Submit thất bại:", errorInfo);
  };

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

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields(["name"])
      .then(async (values) => {
        setConfirmLoading(true);
        const { data } = await api.post(`/profile/change-name-request`, {
          newName: values.name,
        });
        message.success("Gửi yêu cầu đổi tên thành công!");
      })
      .catch((errorInfo) => {
        message.success("Gửi yêu cầu đổi tên thất bại!");
        console.log("Validate Failed:", errorInfo);
      })
      .finally(() => {
        setOpen(false);
        setConfirmLoading(false);
      });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="">
      <div className="mt-10 inline-block">
        <h3 className="font-medium text-[24px] text-[#3BA769]">
          Hồ sơ tổ chức
        </h3>
        <div className="bg-[#3BA769] w-1/2 h-[1px]"></div>
      </div>

      <Form
        name="ProfileForm"
        className="w-full"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
      >
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
                  if (!fileListThumbnail?.length) {
                    return Promise.reject("Bạn cần upload ảnh");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <PreviewImageUpload
              fileList={fileListThumbnail}
              setFileList={(fileList) => {
                setFileListThumbnail(fileList);
              }}
            />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Tên tổ chức
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>
          <div className="flex items-center gap-5 justify-between">
            <Form.Item
              name="name"
              initialValue={organization?.name}
              className="mb-4 mt-3 flex-1"
              key={organization?.name}
              rules={nameRules}
            >
              <Input readOnly={!open} />
            </Form.Item>
            <Popconfirm
              title="Yêu cầu"
              description="Gửi yều cầu đổi tên tổ chức"
              open={open}
              onConfirm={handleOk}
              okButtonProps={{ loading: confirmLoading }}
              onCancel={handleCancel}
            >
              <PullRequestOutlined
                className="bg-primary-color rounded-lg p-2 text-white"
                onClick={showPopconfirm}
              />
            </Popconfirm>
          </div>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Lý tưởng & Mục tiêu
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>
          <Form.Item
            name="description"
            className="mb-4 mt-3 "
            initialValue={organization?.description}
            key={organization?.description}
            rules={[{ required: true, message: "Vui lòng nhập mo ta" }]}
          >
            <TextArea className="mt-3 w-full" rows={5} />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Địa chỉ
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
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
              Lĩnh vực
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>
          <div
            className={`bg-stone-100 border-[0.05rem] rounded-md mb-4 mt-3  ${"border-primary-color"} overflow-hidden cursor-pointer px-4 py-2 lg:w-1/2`}
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
                      new Error("Please select at least one field.")
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
              Số điện thoại
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>
          <Form.Item
            name="phoneNumber"
            initialValue={organization?.phoneNumber}
            key={organization?.phoneNumber}
            className="mb-4 mt-3 max-w-60"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại!",
              },
              {
                pattern: /^[0-9]{9,11}$/,
                message:
                  "Số điện thoại không hợp lệ! (chỉ bao gồm số, từ 9 đến 11 ký tự)",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="mt-6 ">
          <div className="flex justify-start items-center gap-1">
            <h4 className="font-normal leading-none text-[18px] text-[#3BA769]">
              Mạng xã hội
            </h4>
            <div className="bg-[#3BA769] w-6 h-[1px]"></div>
          </div>

          <Form.Item
            name="urlFacebook"
            initialValue={organization?.urlFacebook}
            key={organization?.urlFacebook}
            rules={[{ required: true, message: "Vui lòng nhập link facebook" }]}
            className="mb-4 mt-3 max-w-80"
          >
            <Input />
          </Form.Item>
        </div>

        <div className="my-6">
          <Button loading={loading} htmlType="submit">
            Cập nhật
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default OrganizationProfile;
