import React from "react";
import {
  Col,
  Row,
  Typography,
  Input,
  Flex,
  Button,
  ConfigProvider,
  Image,
  Tabs,
  DatePicker,
} from "antd";
import type { TabsProps } from "antd";
import logo from "../../image/signup_banner.jpg";
const { Title } = Typography;

const SignupVolunter = () => {
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div className="flex w-full flex-col justify-center items-center gap-4 h-full">
      <Input className={`max-w-[400px]`} placeholder="Họ và tên..." />
      <Input.Password className={`max-w-[400px]`} placeholder="Mật khẩu..." />
      <Input.Password
        className={`max-w-[400px]`}
        placeholder="Xác nhận mật khẩu..."
      />
      <DatePicker className={`max-w-[400px] w-full`} onChange={onChange} />
      <Flex className="w-full" justify={`center`} gap="middle" vertical>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#3BA769",
            },
          }}
        >
          <Button className="w-full" type="primary" block>
            Đăng ký
          </Button>
        </ConfigProvider>
      </Flex>
      <p className="text-[14px]">
        Bạn đã có tài khoản? <a className="text-[#3BA769]">Đăng nhập</a>
      </p>
    </div>
  );
};

const SignupOrganization = () => {
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div className="flex w-full flex-col justify-center items-center gap-4 h-full">
      <Input className={`max-w-[400px]`} placeholder="Tên tổ chức..." />
      <Input.Password className={`max-w-[400px]`} placeholder="Mật khẩu..." />
      <Input.Password
        className={`max-w-[400px]`}
        placeholder="Xác nhận mật khẩu..."
      />

      <Flex className="w-full" justify={`center`} gap="middle" vertical>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#3BA769",
            },
          }}
        >
          <Button className="w-full" type="primary" block>
            Đăng ký
          </Button>
        </ConfigProvider>
      </Flex>
      <p className="text-[14px]">
        Bạn đã có tài khoản? <a className="text-[#3BA769]">Đăng nhập</a>
      </p>
    </div>
  );
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Tình nguyện viên ",
    children: <SignupVolunter />,
  },
  {
    key: "2",
    label: "Tổ chức từ thiện",
    children: <SignupOrganization />,
  },
];

const Signup = () => {
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div>
      <Row className="w-full h-screen">
        <Col span={18}>
          <div className="flex w-full lg:max-w-80 mx-auto flex-col justify-center items-center gap-8 h-full">
            <h4 className="text-[#3BA769] text-[20px] text-center">
              Xin chào! Rất vui được gặp bạn
            </h4>
            <ConfigProvider
              theme={{
                components: {
                  Tabs: {
                    inkBarColor: "#3BA769",
                    itemSelectedColor: "#3BA769",
                  },
                },
              }}
            >
              <Tabs
                className="w-full"
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
              />
            </ConfigProvider>
          </div>
        </Col>
        <Col span={6}>
          <Image
            className="w-full h-screen"
            preview={false}
            placeholder={true}
            alt="logo"
            src={logo}
            style={{ height: "100vh", width: "100%" }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Signup;
