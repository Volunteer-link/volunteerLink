import { Flex, Input, Button, ConfigProvider, Form, Upload } from 'antd';
import { useNavigate } from 'react-router';
import type { Rule, FormInstance } from 'antd/es/form';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

interface SignupOrganizationProps {
  onFinish?: (values: any) => void;
  onFinishFailed?: (errorInfo: any) => void;
  nameRules?: Rule[];
  passwordRules?: Rule[];
  confirmPasswordRules?: (form: FormInstance) => Rule[];
  loading?: boolean;
  fileList?: UploadFile[];
  setFileList?: (fileList: UploadFile[]) => void;
}

type MultiImageUploadProps = {
  onUploaded?: (urls: string[]) => void;
};

const SignupOrganization: React.FC<SignupOrganizationProps> = ({
  onFinish = (values: any) => {},
  onFinishFailed = (errorInfo: any) => {},
  nameRules = [],
  passwordRules = [],
  loading = false,
  confirmPasswordRules = (form: FormInstance): Rule[] => [],
  fileList = [],
  setFileList = (fileList: UploadFile[]) => {},
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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
        <Form.Item name="name" className='mb-4' rules={nameRules}>
          <Input className={`max-w-[400px]`} placeholder="Tên tổ chức..." />
        </Form.Item>
        <Form.Item name="password" className='mb-4' rules={passwordRules}>
          <Input.Password
            className={`max-w-[400px]`}
            placeholder="Mật khẩu..."
          />
        </Form.Item>
        <Form.Item
        className='mb-4'
          name="confirmPassword"
          dependencies={['password']}
          rules={confirmPasswordRules(form)}
        >
          <Input.Password
            className={`max-w-[400px]`}
            placeholder="Xác nhận mật khẩu..."
          />
        </Form.Item>
        <Form.Item
        className='mb-4'
          name="image"
          rules={[
            {
              validator(_: any, value: string) {
                if (!fileList.length) {
                  return Promise.reject('Bạn cần upload ảnh');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Upload
            accept=".doc,.docx,.pdf"
            multiple
            listType="text" // hiển thị dạng khung ảnh
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={() => false}
          >
             <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
        <Flex className="w-full" justify={`center`} gap="middle" vertical>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#3BA769',
              },
            }}
          >
            <Button
              loading={loading}
              htmlType="submit"
              className="w-full"
              type="primary"
              block
            >
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
