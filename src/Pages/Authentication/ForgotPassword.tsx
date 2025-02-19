import React, { useState } from 'react';
import type { Rule, FormInstance } from 'antd/es/form';
import { Form, Input, Button, ConfigProvider, App as AntdApp } from 'antd';
import api from '../../apiService/useFetch';
import Password from 'antd/es/input/Password';
import { useNavigate } from 'react-router';
interface ForgotPasswordProps {
  passwordRules?: Rule[];
  confirmPasswordRules?: (form: FormInstance) => Rule[];
  email?: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  passwordRules = [],
  confirmPasswordRules = (form: FormInstance): Rule[] => [],
  email = '',
}) => {
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const trimmedValues = {
      password: values.password.trim(),
      confirmPassword: values.confirmPassword.trim(),
    };
    if (!email) {
      message.error('Something went wrong!');
      return;
    }
    try {
      setLoading(true);
      const response = await api.put('/change-password', {
        gmail: email,
        password: trimmedValues.password,
      });
      message.success('Reset password successfully!');
      navigate('/authentication/signin');
    } catch (error) {
      console.error(error);
      message.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Submit thất bại:', errorInfo);
  };

  const [form] = Form.useForm();

  return (
    <div className="flex w-full flex-col justify-center items-center gap-4 h-full">
      <Form
        name="signup-volunter"
        form={form}
        layout="vertical"
        className="w-full"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item name="password" rules={passwordRules}>
          <Input.Password placeholder="Mật khẩu..." />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={confirmPasswordRules(form)}
        >
          <Input.Password placeholder="Xác nhận mật khẩu..." />
        </Form.Item>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#3BA769',
            },
          }}
        >
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit" block>
              Xác nhận
            </Button>
          </Form.Item>
        </ConfigProvider>
      </Form>
    </div>
  );
};

export default ForgotPassword;
