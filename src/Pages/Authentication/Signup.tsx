import React from 'react';
import { Col, Row, ConfigProvider, Image, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import logo from '../../image/signup_banner.jpg';
import SignupOrganization from './SignupOrganization';
import SignupVolunter from './SignupVolunteer';
import {
  nameRules,
  passwordRules,
  confirmPasswordRules,
  dateRules,
} from '../../ultils/validationRules';

const Signup = () => {
  const onChange = (key: string) => {
    console.log(key);
  };
  const onFinish = (values: any) => {
    const trimmedValues = {
      name: values.name.trim(),
      password: values.password.trim(),
      confirmPassword: values.confirmPassword.trim(),
      date: values.date,
    };
    console.log('Submit thành công với dữ liệu:', trimmedValues);
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
          dateRules={dateRules}
          nameRules={nameRules}
          passwordRules={passwordRules}
          confirmPasswordRules={confirmPasswordRules}
          onFinishFailed={onFinishFailed}
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
