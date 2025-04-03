import { Form, Input, Button, ConfigProvider, DatePicker } from "antd";
import { useNavigate } from "react-router";
import type { Rule, FormInstance } from "antd/es/form";

interface SignupVolunterProps {
  onFinish?: (values: any) => void;
  onFinishFailed?: (errorInfo: any) => void;
  nameRules?: Rule[];
  passwordRules?: Rule[];
  confirmPasswordRules?: (form: FormInstance) => Rule[];
  dateRules?: Rule[];
  emailRules?: Rule[];
  loading?: boolean;
}

const SignupVolunter: React.FC<SignupVolunterProps> = ({
  onFinish = (values: any) => {},
  onFinishFailed = (errorInfo: any) => {},
  nameRules = [],
  passwordRules = [],
  confirmPasswordRules = (form: FormInstance): Rule[] => [],
  dateRules = [],
  loading = false,
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
        <Form.Item name="name" className="mb-4" rules={nameRules}>
          <Input placeholder="Tên tình nguyện viên..." />
        </Form.Item>

        <Form.Item name="password" className="mb-4" rules={passwordRules}>
          <Input.Password placeholder="Mật khẩu..." />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          className="mb-4"
          dependencies={["password"]}
          rules={confirmPasswordRules(form)}
        >
          <Input.Password placeholder="Xác nhận mật khẩu..." />
        </Form.Item>

        <Form.Item name="date" className="mb-4" rules={dateRules}>
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Ngày sinh của bạn..."
          />
        </Form.Item>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#3BA769",
            },
          }}
        >
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>
        </ConfigProvider>

        <p className="text-[14px] text-center">
          Bạn đã có tài khoản?{" "}
          <a
            onClick={() => {
              navigate("/authentication/signin");
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
