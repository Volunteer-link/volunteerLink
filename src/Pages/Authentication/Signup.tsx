import React from 'react';
import { Col, Row, ConfigProvider, Image, Tabs,  App as AntdApp, } from 'antd';
import type { TabsProps } from 'antd';
import logo from '../../image/signup_banner.jpg';
import SignupOrganization from './SignupOrganization';
import SignupVolunter from './SignupVolunteer';
import {
  nameRules,
  passwordRules,
  confirmPasswordRules,
  dateRules,
  emailRules
} from '../../ultils/validationRules';
import api from '../../apiService/useFetch';

const Signup = () => {
  const onChange = (key: string) => {
    setOrganization(key == '1')
  };
    const [loading, setLoading] = React.useState(false);
    const { message } = AntdApp.useApp();
  const [organization, setOrganization] = React.useState(false);
  const onFinish = async (values: any) => {
    const trimmedValues = {
      email: values.email.trim(),
      name: values.name.trim(),
      password: values.password.trim(),
      confirmPassword: values.confirmPassword.trim(),
      date: values.date.format('YYYY-MM-DD'),
    };
    console.log('Submit thành công với dữ liệu:', trimmedValues);
    try {
      setLoading(true);
      const response = await api.post('/register-account', {
        gmail: trimmedValues.email,
        password: trimmedValues.password,
        isOrganization: organization,
        name: trimmedValues.name,
        dateOfBirth: trimmedValues.date,
      });
      // Nếu gọi thành công => hiển thị thông báo
      message.success('signup successful!');
      console.log('Login Response:', response);

      return response;
    } catch (error) {
      console.error(error);
      message.error('signup failed!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Submit thất bại:', errorInfo);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tình nguyện viên ',
      children: (
        <SignupVolunter
          onFinish={onFinish}
          emailRules={emailRules}
          dateRules={dateRules}
          nameRules={nameRules}
          passwordRules={passwordRules}
          confirmPasswordRules={confirmPasswordRules}
          onFinishFailed={onFinishFailed}
          loading={loading}
        />
      ),
    },
    {
      key: '2',
      label: 'Tổ chức từ thiện',
      children: (
        <SignupOrganization
          onFinish={onFinish}
          nameRules={nameRules}
          passwordRules={passwordRules}
          confirmPasswordRules={confirmPasswordRules}
          onFinishFailed={onFinishFailed}
          loading={loading}
        />
      ),
    },
  ];

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
                    inkBarColor: '#3BA769',
                    itemSelectedColor: '#3BA769',
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
            style={{ height: '100vh', width: '100%' }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Signup;
