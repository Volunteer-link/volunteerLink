import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();
  const handleClickBackHome = () => {
    navigate("/");
  };
  return (
    <>
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
    </>
  );
};

export default Forbidden;
