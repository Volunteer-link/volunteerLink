import { Button, ConfigProvider, Modal, Pagination } from "antd";
import { useState } from "react";

const ChangeRequestComponent: React.FC<{
  setMode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-12 lg:flex-1">
      <div className="text-2xl mb-4 lg:mb-0">Yêu cầu đổi tên tổ chức</div>
      <div className="mt-8">
        <div className="w-full border-2 border-primary-color rounded-md px-8 py-6 cursor-pointer flex select-none items-center justify-between my-4">
          <div className="text-sm w-80 truncate">
            Đội sinh viên tình nguyện ĐH Bách Khoa
          </div>
          <div
            onClick={showModal}
            className="px-6 py-2 text-white text-sm rounded-md bg-primary-color hover:scale-105 hover:opacity-95 transition-all"
          >
            Xem chi tiết thay đổi
          </div>
        </div>
        <div className="w-full border-2 border-primary-color rounded-md px-8 py-6 cursor-pointer flex select-none items-center justify-between my-4">
          <div className="text-sm w-80 truncate">
            Câu lạc bộ tình nguyện Hà Nội
          </div>
          <div
            onClick={showModal}
            className="px-6 py-2 text-white text-sm rounded-md bg-primary-color hover:scale-105 hover:opacity-95 transition-all"
          >
            Xem chi tiết thay đổi
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
            Modal: {
              colorBgBase: " #3BA769",
            },
          },
        }}
      >
        <>
          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onCancel={handleCancel}
            okButtonProps={{
              style: { backgroundColor: "#3BA769", borderColor: "#3BA769" },
            }}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
        </>
        <Pagination defaultCurrent={1} total={50} className="mt-4" />
      </ConfigProvider>
    </div>
  );
};
export default ChangeRequestComponent;
