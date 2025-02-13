import { ConfigProvider, Pagination } from "antd";
const CreateRequestComponent: React.FC<{
  setMode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setMode }) => {
  const handleChangeMode = () => {
    setMode("detailCreate");
  };
  return (
    <div className="p-12 lg:flex-1">
      <div className="text-2xl mb-4 lg:mb-0">Yêu cầu xác thực tài khoản</div>
      <div className="mt-8">
        <div className="w-full border-2 border-primary-color rounded-md px-8 py-6 cursor-pointer flex select-none items-center justify-between my-4">
          <div className="text-sm w-80 truncate">
            Đội sinh viên tình nguyện ĐH Bách Khoa
          </div>
          <div
            onClick={() => handleChangeMode()}
            className="px-6 py-2 text-white text-sm rounded-md bg-primary-color hover:scale-105 hover:opacity-95 transition-all"
          >
            Xem chi tiết yêu cầu
          </div>
        </div>
        <div className="w-full border-2 border-primary-color rounded-md px-8 py-6 cursor-pointer flex select-none items-center justify-between my-4">
          <div className="text-sm w-80 truncate">
            Câu lạc bộ tình nguyện Hà Nội
          </div>
          <div
            onClick={() => handleChangeMode()}
            className="px-6 py-2 text-white text-sm rounded-md bg-primary-color hover:scale-105 hover:opacity-95 transition-all"
          >
            Xem chi tiết yêu cầu
          </div>
        </div>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#3BA769",
              headerColor: "white",
            },
            Pagination: {
              itemActiveBg: "#3BA769",
              colorPrimary: "white",
              colorPrimaryHover: "white",
              colorPrimaryBorder: "white",
            },
          },
        }}
      >
        <Pagination defaultCurrent={1} total={50} className="mt-4" />
      </ConfigProvider>
    </div>
  );
};

export default CreateRequestComponent;
