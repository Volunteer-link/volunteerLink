import React, { useEffect, useState } from "react";
import { decodedCookie, getCookie } from "../ultils/cookie";
import api from "../apiService/useFetch";
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  App as AntdApp,
  Modal,
} from "antd";
import {
  confirmPasswordRules,
  nameRules,
  passwordRules,
} from "../ultils/validationRules";
import { FaPencilAlt } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState<any>();
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const trimmedValues = {
        oldPassword: values?.oldPassword?.trim() || null,
        newConfirmPassword: values.confirmPassword.trim(),
        newPassword: values.password.trim(),
      };
      const { data } = await api.put(`/profile/change-password`, trimmedValues);
      console.log(data);
      message.success("Thay đổi mật khẩu thành công!");
      form.resetFields(["oldPassword", "password", "confirmPassword"]);
    } catch (error: any) {
      console.error(error);
      if (error.status == 400) message.error(`${error.response.data.Message}`);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Submit thất bại:", errorInfo);
  };
  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookie("accessToken");
      const user = decodedCookie(token);
      const url =
        user?.role === "Volunteer"
          ? `/profile/volunteer`
          : `/profile/organization`;
      const { data } = await api.get(`${url}`, {
        params: {
          Id: user?.AccId,
        },
      });
      if (user?.role === "Volunteer") {
        const { data: userData } = await api.get(
          "/profile/check-password-exist"
        );
        setHasPassword(userData.data.success);
      } else {
        setHasPassword(true);
      }
      console.log(data.data);
      setUser(data.data);
    };

    if (decodedCookie(getCookie("accessToken"))) {
      fetchUser();
    } else {
      window.location.href = "/unauthorized"; // Chuyển trang khi lỗi 401
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({ name: user?.name });
  }, [user?.name]);

  const [openModalEditName, setOpenModalEditName] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const ShowModalEditName = () => {
    setOpenModalEditName(true);
  };

  const handleCloseEditName = () => {
    setOpenModalEditName(false);
  };

  const [formChangeName] = Form.useForm();

  const handleSubmitChangeName = async (values: any) => {
    formChangeName
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
        setConfirmLoading(false);
        setOpenModalEditName(false);
      });
  };

  return (
    <div className="">
      <div className="mt-10 inline-block">
        <h3 className="font-medium text-[24px] text-[#3BA769]">
          Thông tin tài khoản
        </h3>
        <div className="bg-[#3BA769] w-1/2 h-[1px]"></div>
      </div>
      <div className="mt-10 max-w-[300px]">
        <Form
          name="profile"
          form={form}
          layout="vertical"
          className="w-full"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="flex items-center gap-2">
            <Form.Item
              label={
                <span style={{ color: "#3BA769" }}>
                  {user?.$type == "Organization" ? "Tên tổ chức" : "Họ và tên"}{" "}
                  :
                </span>
              }
              name="name"
              className="mb-4 flex-1"
            >
              <Input placeholder="Nhập tên..." disabled readOnly />
            </Form.Item>
            {user?.$type == "Organization" && (
              <>
                <FaPencilAlt
                  className="w-4 h-4 mt-3 text-primary-color cursor-pointer"
                  onClick={ShowModalEditName}
                />
                <Modal
                  maskClosable={true}
                  footer={null}
                  onCancel={handleCloseEditName}
                  title="Cập nhật tên tổ chức"
                  centered
                  confirmLoading={confirmLoading}
                  open={openModalEditName}
                >
                  <Form
                    form={formChangeName}
                    onFinish={handleSubmitChangeName}
                    layout="vertical"
                  >
                    <Form.Item
                      name="name"
                      label="Tên tổ chức"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên tổ chức!",
                        },
                        {
                          pattern:
                            /^(?!.*\s{2})[A-Za-zÀ-ỹ']{1}[A-Za-zÀ-ỹ\s']{3,48}[A-Za-zÀ-ỹ']{1}$/,
                          message:
                            "Chỉ được nhập chữ, không có số/ký tự đặc biệt [5-50 kí tự]",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <div className="flex items-center justify-between">
                      <Button type="primary" htmlType="submit">
                        Đổi tên
                      </Button>
                    </div>
                  </Form>
                </Modal>
              </>
            )}
          </div>

          {hasPassword && (
            <Form.Item
              label={<span style={{ color: "#3BA769" }}> Mật khẩu cũ:</span>}
              name="oldPassword"
              className="mb-4"
              rules={passwordRules}
            >
              <Input.Password placeholder="Mật khẩu cũ..." />
            </Form.Item>
          )}

          <Form.Item
            label={
              <span style={{ color: "#3BA769" }}>
                {" "}
                {hasPassword ? "Mật khẩu mới:" : "Tạo mật khẩu"}{" "}
              </span>
            }
            name="password"
            className="mb-4"
            rules={passwordRules}
          >
            <Input.Password
              placeholder={hasPassword ? "Mật khẩu mới..." : "Tạo mật khẩu..."}
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ color: "#3BA769" }}>
                {" "}
                {hasPassword
                  ? "Xác nhận mật khẩu mới"
                  : " Xác nhận mật khẩu"}{" "}
              </span>
            }
            name="confirmPassword"
            className="mb-4"
            dependencies={["password"]}
            rules={confirmPasswordRules(form)}
          >
            <Input.Password placeholder="Xác nhận mật khẩu..." />
          </Form.Item>

          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#3BA769",
              },
            }}
          >
            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit" block>
                {hasPassword ? "Lưu" : "Cập nhật mật khẩu"}
              </Button>
            </Form.Item>
          </ConfigProvider>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
