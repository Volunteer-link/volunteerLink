import React, { useState } from 'react';
import {
  Col,
  Row,
  Input,
  Flex,
  Button,
  ConfigProvider,
  Image,
  Form,
  App as AntdApp,
} from 'antd';
import logo from '../../image/emai_banner.jpg';
import { emailRules } from '../../ultils/validationRules';
import api from '../../apiService/useFetch';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import {
  passwordRules,
  confirmPasswordRules,
} from '../../ultils/validationRules';
import ForgotPassword from './ForgotPassword';
const VerifyEmail = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const [emailStatus, setEmailStatus] = useState<string>('VERIFY_EMAIL');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    const trimmedValues = {
      email: values.email.trim(),
      otp: values.otp?.trim(),
    };
    if (trimmedValues.otp) {
      setEmail(trimmedValues.email);
      await VerifyOTP(trimmedValues.email, trimmedValues.otp);
      return;
    }
    await VerifyEmail(trimmedValues.email);
  };
  const VerifyEmail = async (email: string) => {
    try {
      setLoading(true);

      const response = await api.post(
        `${
          location.state == 'FORGOT_PASSWORD'
            ? 'send-otp-for-forgot-password'
            : '/send-otp-for-register'
        } `,
        {
          gmail: email,
        }
      );
      if(response.data.data.isExistEmail){
        message.success('Đã có tài khoản sử dụng email này!');
      }else{
        message.success('Send successful!');
        setEmailStatus('VERIFY_OTP');
      }

    } catch (error) {
      console.error(error);
      message.error('Send failed!');
    } finally {
      setLoading(false);
    }
  };

  const VerifyOTP = async (email: string, otp: string) => {
    try {
      setLoading(true);
      const response = await api.post('/verify-otp', {
        gmail: email,
        otp: otp,
      });
      if (location.state == 'FORGOT_PASSWORD') {
        setEmailStatus('FORGOT_PASSWORD');
      } else {
        message.success('Verify successful!');
        navigate('/authentication/signup', { state: email });
      }
    } catch (error) {
      console.error(error);
      message.error('Send failed!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Submit thất bại:', errorInfo);
  };
  return (
    <div>
      <Row className="w-full h-screen">
        <Col span={18}>
          {emailStatus == 'FORGOT_PASSWORD' ? (
            <div className="w-full mx-auto lg:max-w-80 gap-6 h-full">
              <ForgotPassword
                passwordRules={passwordRules}
                confirmPasswordRules={confirmPasswordRules}
                email={email}
              />
            </div>
          ) : (
            <div className="flex w-full lg:max-w-80 mx-auto flex-col justify-center items-center gap-6 h-full">
              <h4 className="text-[#3BA769] text-[20px] text-center">
                Xác thực email
              </h4>
              <p className="text-[14px] text-center">
                Chúng tôi sẽ gửi OTP đến email của bạn, hãy sử dụng OTP để xác
                thực email
              </p>
              <Form
                name="signup-volunter"
                form={form}
                layout="vertical"
                className="w-full"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  hidden={emailStatus !== 'VERIFY_EMAIL'}
                  name="email"
                  rules={emailRules}
                >
                  <Input
                    className={`max-w-[400px]`}
                    placeholder="Email......."
                  />
                </Form.Item>
                <Form.Item hidden={emailStatus === 'VERIFY_EMAIL'} name="otp">
                  <Input className="max-w-[400px]" placeholder="Mã OTP" />
                </Form.Item>

                <Flex
                  className="w-full"
                  justify={`center`}
                  gap="middle"
                  vertical
                >
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: '#3BA769',
                      },
                    }}
                  >
                    <Button
                      className="w-full"
                      htmlType="submit"
                      type="primary"
                      loading={loading}
                      block
                    >
                      {emailStatus === 'VERIFY_EMAIL'
                        ? ' Gửi OTP'
                        : 'Xác thực OTP'}
                    </Button>
                  </ConfigProvider>
                </Flex>
              </Form>
              <p className="text-[14px]">
                Bạn đã có tài khoản?
                <a
                  onClick={() => {
                    navigate('/authentication/signin');
                  }}
                  className="text-[#3BA769]"
                >
                  Đăng nhập{' '}
                </a>
              </p>
            </div>
          )}
        </Col>
        <Col span={6}>
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

export default VerifyEmail;
