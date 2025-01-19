import React from 'react';
import {
  Col,
  Row,
  Typography,
  Input,
  Flex,
  Button,
  ConfigProvider,
  Image,
} from 'antd';
import logo from '../../image/emai_banner.jpg';

const VerifyEmail = () => {
  return (
    <div>
      <Row className="w-full h-screen">
        <Col span={16}>
          <div className="flex w-full lg:max-w-80 mx-auto flex-col justify-center items-center gap-6 h-full">
            <h4 className="text-[#3BA769] text-[20px] text-center">
              Xác thực email
            </h4>
            <p  className="text-[14px] text-center">
            Chúng tôi sẽ gửi OTP đến email của bạn, hãy sử dụng OTP để xác thực email
            </p>
            <Input className={`max-w-[400px]`} placeholder="Email......." />
            <Flex className="w-full" justify={`center`} gap="middle" vertical>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#3BA769',
                  },
                }}
              >
                <Button className="w-full" type="primary" block>
                  Gửi OTP
                </Button>
              </ConfigProvider>
            </Flex>
            <p className="text-[14px]">
              Bạn đã có tài khoản?
              <a className="text-[#3BA769]">Đăng nhập </a>
            </p>
          </div>
        </Col>
        <Col span={8} >
          <Image
            className='w-full h-screen'
            preview={false}
            placeholder={true}
            alt="logo"
            src={logo}
            style={{ height: '100vh', width: '100%'}}
          />
        </Col>
      </Row>
    </div>
  )
}

export default VerifyEmail
