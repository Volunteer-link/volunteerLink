import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorSolving: React.FC<{ errCode: number }> = ({ errCode }) => {
  const navigate = useNavigate();
  const handleClickBackHome = () => {
    navigate("/");
  };
  return (
    <>
      {errCode === 403 && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-100">
          <Result
            status="403"
            title="403"
            subTitle="Xin lỗi, bạn không được phép truy cập trang này."
            extra={
              <Button onClick={handleClickBackHome} type="primary">
                Về trang chủ
              </Button>
            }
          />
        </div>
      )}
      {errCode === 500 && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-100">
          <Result
            status="500"
            title="500"
            subTitle="Xin lỗi, có điều gì đó không ổn..."
            extra={
              <Button onClick={handleClickBackHome} type="primary">
                Về trang chủ
              </Button>
            }
          />
        </div>
      )}
      {errCode === 401 && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-100">
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
      )}
    </>
  );
};

export default ErrorSolving;
