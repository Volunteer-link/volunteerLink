import React, { useEffect, useState } from "react";

import { Flex, Modal, Spin, Table } from "antd";
import { ConfigProvider } from "antd";
import { Pagination } from "antd";
import SearchComponent from "../../Common/SearchComponent";
import api, { setupInterceptors } from "../../apiService/useFetch";
import ErrorSolving from "../../Common/ErrorSolving";

const AccountComponent: React.FC<{}> = () => {
  const [modeAccount, setModeAccount] = useState<string>("org");
  const [errCode, setErrCode] = useState<number>(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [keyPaging, setKeyPaging] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [displayDataOrg, setDisplayDataOrg] = useState<
    {
      id: Number;
      gmail: string;
      name: string;
      enabled: boolean;
      description: string;
      urlFb: string;
      accountId: number;
    }[]
  >([]);
  const [displayDataVol, setDisplayDataVol] = useState<
    {
      id: Number;
      gmail: string;
      name: string;
      sex: number;
      enabled: boolean;
      accountId: number;
    }[]
  >([]);
  const [sizePage, setSizePage] = useState<number>(5);
  const [valueSearch, setValueSearch] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [stateModal, setStateModal] = useState<string>("");
  const [idUpdate, setIdUpdate] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(false);
  const [keyUpdate, setKeyUpdate] = useState<number>(0);
  const [checkPagination, setCheckPagination] = useState<number>(0);

  const dataSourceOrg = displayDataOrg?.map((item, index) => {
    return {
      key: index,
      gmail: item.gmail,
      name: item.name,
      status: item.enabled,
      idUpdate: item.accountId,
    };
  });
  const columnsOrg = [
    {
      title: "Số thứ tự",
      key: "stt",
      render: (_: any, __: any, index: number) => ++index,
    },
    {
      title: "Email",
      dataIndex: "gmail",
      key: "gmail",
    },
    {
      title: "Tên tổ chức",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng thái tài khoản",
      key: "status",
      render: (_: any, record: any) => (
        <div
          className={`font-medium ${
            record.status === true ? "text-primary-color" : "text-red-500"
          }`}
        >
          {record.status ? "Đang hoạt động" : "Bị vô hiệu hóa"}
        </div>
      ),
    },
    {
      title: "Hoạt động",
      key: "address",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          {record.status === true && (
            <div
              onClick={() =>
                handleClick("disable", record.idUpdate, record.status)
              }
              className="border-2 border-primary-color px-3 rounded-md cursor-pointer hover:scale-105 py-1 transition-all text-primary-color"
            >
              Vô hiệu hóa
            </div>
          )}
          {record.status === false && (
            <div
              onClick={() =>
                handleClick("enable", record.idUpdate, record.status)
              }
              className="bg-primary-color px-3 rounded-md cursor-pointer hover:scale-105 py-1 transition-all text-white"
            >
              Khôi phục
            </div>
          )}
        </div>
      ),
    },
  ];
  const dataSourceVol = displayDataVol?.map((item, index) => {
    return {
      key: index,
      mail: item.gmail,
      name: item.name,
      gender: item.sex === 1 ? "Nam" : item.sex === 2 ? "Nữ" : "Khác",
      status: item.enabled,
      idUpdate: item.accountId,
    };
  });
  const columnsVol = [
    {
      title: "Số thứ tự",
      key: "stt",
      render: (_: any, __: any, index: number) => ++index,
    },
    {
      title: "Email",
      dataIndex: "mail",
      key: "mail",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Trạng thái tài khoản",
      key: "status",
      render: (_: any, record: any) => (
        <div
          className={`font-medium ${
            record.status === true ? "text-primary-color" : "text-red-500"
          }`}
        >
          {record.status ? "Đang hoạt động" : "Bị vô hiệu hóa"}
        </div>
      ),
    },
    {
      title: "Hoạt động",
      key: "address",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          {record.status === true && (
            <div
              onClick={() =>
                handleClick("disable", record.idUpdate, record.status)
              }
              className="border-2 border-primary-color px-3 rounded-md cursor-pointer hover:scale-105 py-1 transition-all text-primary-color"
            >
              Vô hiệu hóa
            </div>
          )}
          {record.status === false && (
            <div
              onClick={() =>
                handleClick("enable", record.idUpdate, record.status)
              }
              className="bg-primary-color px-3 rounded-md cursor-pointer hover:scale-105 py-1 transition-all text-white"
            >
              Khôi phục
            </div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    setupInterceptors(
      setErrCode,
      setPageNumber,
      setTotalItems,
      setCheckPagination
    );
  }, []);
  useEffect(() => {
    const fetchDataOrg = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(
          `/get-all-organizations?PageNumber=${pageNumber}&PageSize=${sizePage}&SearchKey=${valueSearch}`
        );
        console.log(data);

        const listData = data.data.data.items;

        setDisplayDataOrg(listData);
      } catch (err: any) {
      } finally {
        setIsLoading(false);
      }
    };
    const fetchDataVol = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(
          `/get-all-volunteers?PageNumber=${pageNumber}&PageSize=${sizePage}&SearchKey=${valueSearch}`
        );
        const listData = data.data.data.items;

        setDisplayDataVol(listData);
      } catch (err: any) {
      } finally {
        setIsLoading(false);
      }
    };
    if (modeAccount === "org") {
      fetchDataOrg();
    }
    if (modeAccount === "vol") {
      fetchDataVol();
    }
  }, [pageNumber, modeAccount, valueSearch, keyUpdate]);

  const handleClick = (type: string, idUpdate: number, status: boolean) => {
    setOpenModal(true);
    setStateModal(type);
    setIdUpdate(idUpdate);
    setStatus(status);
  };
  const closeModal = () => {
    setOpenModal(false);
    setStateModal("");
    setIdUpdate(0);
    setStatus(false);
  };

  const handleFilterRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setModeAccount(event.target.value);
    if (event.target.value === "vol") {
      dataSourceOrg.length = 0;
    }
    if (event.target.value === "org") {
      dataSourceVol.length = 0;
    }
    setPageNumber(1);
  };
  const handlePaging = (page: number) => {
    setPageNumber(page);
  };
  const handleOk = async () => {
    try {
      setIsLoading(true);
      const data = await api.put(`/edit-enable-status-of-acount`, {
        accountId: idUpdate,
        status: !status,
      });
      setOpenModal(false);
    } catch (err: any) {
    } finally {
      setIsLoading(false);
      setKeyUpdate((prev) => ++prev);
    }
  };

  return (
    <div className="p-12 lg:flex-1">
      <div className="text-2xl mb-4 lg:mb-0">Quản lý tài khoản</div>
      <div className="lg:flex lg:justify-center">
        <SearchComponent
          placeHolder="Tìm kiếm theo email..."
          className=""
          setValueSearch={setValueSearch}
          setPageNumber={setPageNumber}
        />
      </div>
      <div className="flex items-center gap-1 my-4">
        <div className="text-sm">Loại tài khoản:</div>
        <div>
          <select
            onChange={handleFilterRole}
            className="px-2 py-1 border-[0.0625rem] border-stone-400 rounded-md text-base"
          >
            <option value="org">Tổ chức</option>
            <option value="vol">Tình nguyện viên</option>
          </select>
        </div>
      </div>
      <div>
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
          {modeAccount === "org" && (
            <Table
              dataSource={dataSourceOrg}
              columns={columnsOrg}
              pagination={false}
              scroll={{ x: "max-content" }}
            />
          )}
          {modeAccount === "vol" && (
            <Table
              dataSource={dataSourceVol}
              columns={columnsVol}
              pagination={false}
              scroll={{ x: "max-content" }}
            />
          )}

          {checkPagination !== 0 && (
            <Pagination
              defaultCurrent={1}
              current={pageNumber}
              total={totalItems}
              pageSize={sizePage}
              onChange={handlePaging}
              className="mt-4"
            />
          )}
          {isLoading && (
            <Flex>
              <Spin size="large" fullscreen />
            </Flex>
          )}
          <ErrorSolving errCode={errCode} />
          <Modal
            title="Xác nhận"
            open={openModal}
            onOk={handleOk}
            onCancel={closeModal}
          >
            <p>
              Hành động này đang cố gắng{" "}
              {stateModal === "disable" ? "vô hiệu hóa" : "khôi phục"} tài
              khoản. Bạn có chắc chắn muốn thực hiện không?
            </p>
          </Modal>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default AccountComponent;
