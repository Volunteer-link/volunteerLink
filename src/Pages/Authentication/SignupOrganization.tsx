import { Flex, Input, Button, ConfigProvider, Form } from 'antd';
import { useNavigate } from 'react-router';
import type { Rule, FormInstance } from 'antd/es/form';

interface SignupOrganizationProps {
  onFinish?: (values: any) => void;
  onFinishFailed?: (errorInfo: any) => void;
  nameRules?: Rule[];
  passwordRules?: Rule[];
  confirmPasswordRules?: (form: FormInstance) => Rule[];
}
const SignupOrganization: React.FC<SignupOrganizationProps> = ({
  onFinish = (values: any) => {},
  onFinishFailed = (errorInfo: any) => {},
  nameRules = [],
  passwordRules = [],
  confirmPasswordRules = (form: FormInstance): Rule[] => [],
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div className="flex w-full flex-col justify-center items-center gap-4 h-full">
      <Form
        name="signup-organization"
        form={form}
        layout="vertical"
        className="w-full"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item name="name" rules={nameRules}>
          <Input className={`max-w-[400px]`} placeholder="Tên tổ chức..." />
        </Form.Item>
        <Form.Item name="password" rules={passwordRules}>
          <Input.Password
            className={`max-w-[400px]`}
            placeholder="Mật khẩu..."
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={confirmPasswordRules(form)}
        >
          <Input.Password
            className={`max-w-[400px]`}
            placeholder="Xác nhận mật khẩu..."
          />
        </Form.Item>
        <Flex className="w-full" justify={`center`} gap="middle" vertical>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#3BA769',
              },
            }}
          >
            <Button className="w-full" type="primary" block>
              Đăng ký
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
          Đăng nhập
        </a>
      </p>
    </div>
  );
};

export default SignupOrganization;
