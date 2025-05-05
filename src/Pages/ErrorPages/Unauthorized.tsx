import { Button, Result } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../../ultils/cookie";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleClickBackHome = () => {
    navigate("/");
  };

  useEffect(() => {
    deleteCookie("accessToken");
  }, []);
  return (
    <div className="">
      <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-100">
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
    </div>
  );
};
export default Unauthorized;
