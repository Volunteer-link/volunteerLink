import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const ServerError = () => {
  const navigate = useNavigate();
  const handleClickBackHome = () => {
    navigate("/");
  };
  return (
    <div className="">
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
    </div>
  );
};
export default ServerError;
