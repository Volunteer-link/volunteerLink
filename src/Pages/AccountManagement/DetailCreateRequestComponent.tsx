import { ConfigProvider, Flex, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import ErrorSolving from "../../Common/ErrorSolving";
import api, { setupInterceptors } from "../../apiService/useFetch";
import DownLoadFile from "../Components/DownloadFile";

const DetailCreateRequestComponent: React.FC<{
  setMode: React.Dispatch<React.SetStateAction<string>>;
  idDetailRequest: number;
}> = ({ setMode, idDetailRequest }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [errCode, setErrCode] = useState<number>(0);
  const [stateModal, setStateModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [dataDisplay, setDataDisplay] = useState<{
    organizationId: number;
    name: string;
    listCertificates: string[];
  }>();
  const handleChangeMode = () => {
    setMode("create");
  };
  // useEffect(() => {
  //   setupInterceptors(setErrCode);
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(
          `/get-an-awaiting-approval-organization-info?organizationId=${idDetailRequest}`
        );
        setDataDisplay(data.data.data);
      } catch (err: any) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClick = (type: string) => {
    setStateModal(type);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleOk = async () => {
    try {
      setIsLoading(true);
      const data = await api.put(`/handle-accept-organization`, {
        organizationId: idDetailRequest,
        approval: stateModal === "yes" ? true : false,
      });
      console.log(data);
    } catch (err: any) {
    } finally {
      setIsLoading(false);
      handleChangeMode();
    }
  };
  console.log(dataDisplay);

  return (
    <div className="p-12 lg:flex-1">
      <div
        onClick={handleChangeMode}
        className="text-sm mb-4 cursor-pointer hover:opacity-100 opacity-80"
      >
        Yêu cầu tạo tài khoản
      </div>
      <div className="text-2xl mb-4 lg:mb-0 max-w-96 truncate">
        {dataDisplay?.name}
      </div>
      <div className="mt-4">Tài liệu liên quan:</div>
      {dataDisplay?.listCertificates.map((item, index) => (
        <DownLoadFile key={index} fileUrl={item} />
      ))}
      <div className="lg:flex lg:gap-2 mt-4">
        <div
          onClick={() => handleClick("yes")}
          className="bg-primary-color text-white lg:w-28 text-base px-2 py-1 text-center rounded-sm mb-2 lg:mb-0 cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
        >
          Xác nhận
        </div>
        <div
          onClick={() => handleClick("no")}
          className="border-2 border-primary-color text-primary-color lg:w-28 text-base px-2 py-1 text-center rounded-sm cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
        >
          Từ chối
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
        {isLoading && (
          <Flex>
            <Spin size="large" fullscreen />
          </Flex>
        )}
        {/* <ErrorSolving errCode={errCode} /> */}
        <Modal
          title="Xác nhận"
          open={openModal}
          onOk={handleOk}
          onCancel={closeModal}
        >
          <p>
            Hành động này đang cố gắng{" "}
            {stateModal === "yes"
              ? "chấp nhận yêu cầu tạo"
              : "từ chối yêu cầu tạo"}{" "}
            tài khoản. Bạn có chắc chắn muốn thực hiện không?
          </p>
          {stateModal === "yes" && (
            <>
              <p className="text-primary-color inline-block mr-1">*Lưu ý:</p>
              <p className="text-primary-color inline-block">
                tài khoản được xác nhận sẽ có thể sử dụng ngay
              </p>
            </>
          )}
          {stateModal === "no" && (
            <>
              <p className="text-primary-color inline-block mr-1">*Lưu ý:</p>
              <p className="text-primary-color inline-block">
                tài khoản không được xác nhận sẽ bị xóa khỏi hệ thống
              </p>
            </>
          )}
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default DetailCreateRequestComponent;
