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
import logo from '../../image/sign_banner.jpg';
const { Title } = Typography;

const SignIn: React.FC = () => {
  return (
    <div>
      <Row className="w-full h-screen">
        <Col span={16}>
          <div className="flex w-full lg:max-w-80 mx-auto flex-col justify-center items-center gap-8 h-full">
            <h4 className="text-[#3BA769] text-[20px] text-center">
              Tham gia cộng đồng của chúng tôi
            </h4>
            <Input className={`max-w-[400px]`} placeholder="Email......." />
            <Input.Password
              className={`max-w-[400px]`}
              placeholder="Password......."
            />
            <Flex className="w-full" justify={`center`} gap="middle" vertical>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#3BA769',
                  },
                }}
              >
                <Button className="w-full" type="primary" block>
                  Đăng nhập
                </Button>
              </ConfigProvider>
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
                <Button className="w-full" type="default" block>
                  Signin With Google
                </Button>
              </ConfigProvider>
            </Flex>
            <p className="text-[14px]">
              Bạn chưa có tài khoản?{' '}
              <a className="text-[#3BA769]">Tạo tài khoản mới </a>
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
};

export default SignIn;
