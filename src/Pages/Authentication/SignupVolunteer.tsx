import { Form, Input, Button, ConfigProvider, DatePicker } from 'antd';
import { useNavigate } from 'react-router';
import type { Rule, FormInstance } from 'antd/es/form';

interface SignupVolunterProps {
  onFinish?: (values: any) => void;
  onFinishFailed?: (errorInfo: any) => void;
  nameRules?: Rule[];
  passwordRules?: Rule[];
  confirmPasswordRules?: (form: FormInstance) => Rule[];
  dateRules?: Rule[];
}

const SignupVolunter: React.FC<SignupVolunterProps> = ({
  onFinish = (values: any) => {},
  onFinishFailed = (errorInfo: any) => {},
  nameRules = [],
  passwordRules = [],
  confirmPasswordRules = (form: FormInstance):  Rule[] => [],
  dateRules = [],
}) => {
  const navigate = useNavigate();
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
        <Form.Item name="name" rules={nameRules}>
          <Input placeholder="Nhập tên..." />
        </Form.Item>

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

        <Form.Item name="date" rules={dateRules}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#3BA769',
            },
          }}
        >
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>
        </ConfigProvider>

        <p className="text-[14px]">
          Bạn đã có tài khoản?{' '}
          <a
            onClick={() => {
              navigate('/authentication/signin');
            }}
            className="text-[#3BA769]"
          >
            Đăng nhập
          </a>
        </p>
      </Form>
    </div>
  );
};

export default SignupVolunter;
