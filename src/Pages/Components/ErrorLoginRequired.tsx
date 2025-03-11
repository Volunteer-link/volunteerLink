import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorLoginRequired = () => {
  const navigate = useNavigate();
  const handleClickBackHome = () => {
    navigate("/");
  };
  return (
    <div className="bg-white fixed top-0 z-10 bottom-0 right-0 left-0 flex items-center justify-center">
      <Result
        status="error"
        title="Bạn cần đăng nhập"
        subTitle="Xin lỗi, bạn chưa đăng nhập vào hệ thống của chúng tôi. Hãy đăng nhập để sử dụng chức năng này"
        extra={
          <Button onClick={handleClickBackHome} type="primary">
            Về trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default ErrorLoginRequired;
