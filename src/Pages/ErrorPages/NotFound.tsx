import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const handleClickBackHome = () => {
    navigate("/");
  };
  return (
    <div className="">
      <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-100">
        <Result
          status="error"
          title="404"
          subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại. Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ."
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
export default NotFound;
