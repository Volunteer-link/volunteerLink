import { Button, ConfigProvider, Empty, Modal, Pagination } from "antd";
import { useEffect, useState } from "react";
import api from "../../apiService/useFetch";
import { NavLink } from "react-router-dom";

interface ChangeRequest {
  accountId: number;
  createdAt: Date | string;
  id: number;
  newName: string;
  oldName: string;
}

const ChangeRequestComponent: React.FC<{
  setMode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataDisplay, setDataDisplay] = useState<ChangeRequest[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [keyState, setKeyState] = useState<number>(1);

  const pageSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get(
        `/admin/all-change-requests?PageNumber=${currentPage}&PageSize=${pageSize}`
      );
      console.log(data);

      setDataDisplay(data.data.items);
      setTotal(data.data.totalItems);
    };
    fetchData();
  }, [currentPage, keyState]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = async (id: number) => {
    try {
      const { data } = await api.delete(`/admin/change-request`, {
        data: { id },
      });
    } catch (error: any) {
    } finally {
      setIsModalOpen(false);
      setKeyState((prev) => ++prev);
      setCurrentPage(1);
    }
  };

  const handleOk = async (id: number) => {
    try {
      const { data } = await api.post(`/admin/change-request`, {
        id: id,
      });
    } catch (error: any) {
    } finally {
      setIsModalOpen(false);
      setKeyState((prev) => ++prev);
      setCurrentPage(1);
    }
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleHide = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="p-12 lg:flex-1">
      <div className="text-2xl mb-4 lg:mb-0">Yêu cầu đổi tên tổ chức</div>
      <div className="mt-8">
        {dataDisplay.length === 0 && <Empty description="Không có yêu cầu" />}
        {dataDisplay?.map((item, index) => (
          <div
            key={index}
            className="w-full border-2 border-primary-color rounded-md px-8 py-6 cursor-pointer flex select-none items-center justify-between my-4"
          >
            <div className="text-sm w-80 truncate">
              <NavLink to={`/organizations/profile/${item.accountId}`}>
                {item.oldName}
              </NavLink>
              <div>
                Thời gian: {new Date(item.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>
            <div
              onClick={showModal}
              className="px-6 py-2 text-white text-sm rounded-md bg-primary-color hover:scale-105 hover:opacity-95 transition-all hidden lg:block"
            >
              Xem chi tiết thay đổi
            </div>
            <div
              onClick={showModal}
              className="px-6 py-2 text-white text-sm rounded-md bg-primary-color hover:scale-105 hover:opacity-95 transition-all lg:hidden"
            >
              Xem chi tiết
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
                  title="Yêu cầu đổi tên"
                  open={isModalOpen}
                  onCancel={handleHide}
                  okButtonProps={{
                    style: {
                      backgroundColor: "#3BA769",
                      borderColor: "#3BA769",
                    },
                  }}
                  footer={() => {
                    return (
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleCancel(item.id)}
                          type="default"
                        >
                          Từ chối
                        </Button>
                        <Button
                          onClick={() => handleOk(item.id)}
                          type="primary"
                        >
                          Đồng ý
                        </Button>
                      </div>
                    );
                  }}
                  cancelText="Từ chối"
                >
                  <div>
                    Tên cũ:{" "}
                    <span className="font-medium text-primary-color">
                      {item.oldName}
                    </span>
                  </div>
                  <div>
                    Tên mới:{" "}
                    <span className="font-medium text-primary-color">
                      {item.newName}
                    </span>
                  </div>
                </Modal>
              </>
            </ConfigProvider>
          </div>
        ))}
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
        {dataDisplay.length !== 0 && (
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            onChange={handleChangePage}
            pageSize={pageSize}
            total={total}
            className="mt-4"
          />
        )}
      </ConfigProvider>
    </div>
  );
};
export default ChangeRequestComponent;
