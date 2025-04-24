import React, { useEffect, useState } from "react";
import { decodedCookie, getCookie } from "../ultils/cookie";
import api from "../apiService/useFetch";
import { Button, ConfigProvider, Form, Input, App as AntdApp } from "antd";
import {
  confirmPasswordRules,
  nameRules,
  passwordRules,
} from "../ultils/validationRules";

const Profile = () => {
  const [user, setUser] = useState<any>();
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const trimmedValues = {
        oldPassword: values.oldPassword.trim(),
        newConfirmPassword:values.confirmPassword.trim(),
        newPassword: values.password.trim(),
      };
      const { data } = await api.put(`/profile/change-password`, trimmedValues);
      console.log(data);
      message.success("Thay đổi mật khẩu thành công!");
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
          <Form.Item
            label={
              <span style={{ color: "#3BA769" }}>
                {" "}
                {user?.$type == "Organization" ? "Tên tổ chức" : "Họ và tên"} :
              </span>
            }
            name="name"
            className="mb-4"
          >
            <Input placeholder="Nhập tên..." disabled readOnly />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#3BA769" }}> Mật khẩu cũ:</span>}
            name="oldPassword"
            className="mb-4"
            rules={passwordRules}
          >
            <Input.Password placeholder="Mật khẩu cũ..." />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#3BA769" }}> Mật khẩu mới:</span>}
            name="password"
            className="mb-4"
            rules={passwordRules}
          >
            <Input.Password placeholder="Mật khẩu mới..." />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ color: "#3BA769" }}>Xác nhận mật khẩu mới:</span>
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
                Lưu
              </Button>
            </Form.Item>
          </ConfigProvider>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
