import { ConfigProvider, Empty, Flex, Pagination, Spin } from "antd";
import { useEffect, useState } from "react";
import api, { setupInterceptors } from "../../apiService/useFetch";
import ErrorSolving from "../../Common/ErrorSolving";
const CreateRequestComponent: React.FC<{
  setMode: React.Dispatch<React.SetStateAction<string>>;
  setIdDetailRequest: React.Dispatch<React.SetStateAction<number>>;
}> = ({ setMode, setIdDetailRequest }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  // const [errCode, setErrCode] = useState<number>(0);
  const [sizePage, setSizePage] = useState<number>(5);
  const [dataDisplay, setDataDisplay] = useState<
    {
      id: number;
      name: string;
      isApproval: boolean;
      accountId: number;
      description: string;
      urlFacebook: string;
    }[]
  >([]);

  useEffect(() => {
    setupInterceptors(setPageNumber, setTotalItems);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(
          `/get-awaiting-approval-organizations?PageNumber=${pageNumber}&PageSize=${sizePage}`
        );
        setDataDisplay(data.data.data.items);
      } catch (err: any) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [pageNumber]);

  const handleChangeMode = (id: number) => {
    setIdDetailRequest(id);
    setMode("detailCreate");
  };
  const handlePaging = (page: number) => {
    setPageNumber(page);
  };

  return (
    <div className="p-12 lg:flex-1">
      <div className="text-2xl mb-4 lg:mb-0">Yêu cầu xác thực tài khoản</div>
      <div className="mt-8">
        {dataDisplay.length > 0 &&
          dataDisplay?.map((item, index) => (
            <div
              key={index}
              className="w-full border-2 border-primary-color rounded-md px-8 py-6 cursor-pointer flex select-none items-center justify-between my-4"
            >
              <div className="text-sm w-80 truncate">{item.name}</div>
              <div
                onClick={() => handleChangeMode(item.id)}
                className="px-6 py-2 text-white text-sm rounded-md bg-primary-color hover:scale-105 hover:opacity-95 transition-all"
              >
                Xem chi tiết yêu cầu
              </div>
            </div>
          ))}
        {dataDisplay.length === 0 && (
          <div>
            <Empty description="Không có yêu cầu" />
          </div>
        )}
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
        {dataDisplay.length > 0 && (
          <Pagination
            defaultCurrent={1}
            current={pageNumber}
            total={totalItems}
            pageSize={sizePage}
            onChange={handlePaging}
            className="mt-4"
          />
        )}
      </ConfigProvider>
    </div>
  );
};

export default CreateRequestComponent;
