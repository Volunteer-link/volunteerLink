// src/pages/SignIn.tsx
import React, { useState } from 'react';
import {
  Col,
  Row,
  Typography,
  Input,
  Flex,
  Button,
  ConfigProvider,
  Image,
  Form,
  App as AntdApp,
} from 'antd';
import { useGoogleLogin } from '@react-oauth/google';
import logo from '../../image/sign_banner.jpg';

// Import hàm login
import api from '../../apiService/useFetch';

interface AccountPayload {
  gmail: string;
  password: string;
}

const SignIn: React.FC = () => {
  // State lưu gmail, password
  const [loading, setLoading] = useState(false);
  const { message } = AntdApp.useApp();

  const loginGG = useGoogleLogin({
    onSuccess: async (credentialResponse: any) => {
      const token = credentialResponse.access_token;
      const { email } = await fetchUserInfo(token);
      if (!email) return;
      try {
        const response = await api.post('/login-using-email-only', {
          gmail: email,
        });
        console.log(response);
      } catch (err) {
        console.error(err);
      }
    },
    onError: () => {
      console.log('Error khi đăng nhập');
    },
  });

  const fetchUserInfo = async (accessToken: any) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        message.error('Login failed!');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const onFinish = async (values: any) => {
    const { gmail, password } = values;
    try {
      setLoading(true);
      const dataToSend: AccountPayload = {
        gmail,
        password,
      };
      const response = await api.post('/login-using-password', dataToSend);
      // Nếu gọi thành công => hiển thị thông báo
      message.success('Login successful!');
      console.log('Login Response:', response);

      return response;
    } catch (error) {
      console.error(error);
      message.error('Login failed!');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi có lỗi
  const onFinishFailed = (errorInfo: any) => {
    console.log('Lỗi:', errorInfo);
  };

  return (
    <div>
      <Row className="w-full h-screen">
        <Col span={16}>
          <div className="flex w-full lg:max-w-80 mx-auto flex-col justify-center items-center gap-8 h-full">
            <h4 className="text-[#3BA769] text-[20px] text-center">
              Tham gia cộng đồng của chúng tôi
            </h4>

            <Form
              name="loginForm"
              className="max-w-[400px] w-full"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                name="gmail"
                rules={[
                  { required: true, message: 'Vui lòng nhập gmail!' },
                  { type: 'email', message: 'Email không đúng định dạng!' },
                ]}
              >
                <Input className="max-w-[400px]" placeholder="Email......." />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập password!' }]}
              >
                <Input.Password
                  className="max-w-[400px]"
                  placeholder="Password......."
                />
              </Form.Item>
              <Flex className="w-full" justify="center" gap="middle" vertical>
                <Form.Item className="mb-0">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: '#3BA769',
                      },
                    }}
                  >
                    <Button
                      className="w-full"
                      type="primary"
                      block
                      htmlType="submit"
                      loading={loading}
                    >
                      Đăng nhập
                    </Button>
                  </ConfigProvider>
                </Form.Item>
                <span className="text-center"> hoặc</span>

                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#fff',
                      colorPrimaryText: '#111',
                      colorPrimaryTextHover: '#111',
                    },
                    components: {
                      Button: {
                        colorPrimaryHover: '#111',
                      },
                    },
                  }}
                >
                  <Button
                    className="w-full"
                    onClick={() => {
                      loginGG();
                    }}
                    type="default"
                    block
                  >
                    Sign in With Google
                  </Button>
                </ConfigProvider>
              </Flex>
            </Form>

            <p className="text-[14px]">
              Bạn chưa có tài khoản?{' '}
              <a className="text-[#3BA769]">Tạo tài khoản mới </a>
            </p>
          </div>
        </Col>

        <Col span={8}>
          <Image
            className="w-full h-screen"
            preview={false}
            placeholder={true}
            alt="logo"
            src={logo}
            style={{ height: '100vh', width: '100%' }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default SignIn;
