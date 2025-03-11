import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorCards: React.FC<{ errCode: number }> = ({ errCode }) => {
  const navigate = useNavigate();
  const handleClickBackHome = () => {
    navigate("/");
  };
  return (
    <>
      {errCode === 403 && (
        <div className="bg-white fixed top-0 z-10 bottom-0 right-0 left-0 flex items-center justify-center">
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
        <div className="bg-white fixed top-0 z-10 bottom-0 right-0 left-0 flex items-center justify-center">
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
      )}
    </>
  );
};

export default ErrorCards;
