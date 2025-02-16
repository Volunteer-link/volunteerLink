import React, { useEffect, useState } from "react";

import { Button, Flex, Result, Spin, Table } from "antd";
import { ConfigProvider } from "antd";
import { Pagination } from "antd";
import axios from "axios";
import SearchComponent from "../../Common/SearchComponent";
import api, { setupInterceptors } from "../../apiService/useFetch";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";

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
      isAvailable: boolean;
      accountId: number;
    }[]
  >([]);
  const navigate = useNavigate();
  const [sizePage, setSizePage] = useState<number>(1);
  const dataSourceOrg = displayDataOrg?.map((item, index) => {
    return {
      key: index,
      gmail: item.gmail,
      name: item.name,
      status: item.enabled,
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
              onClick={handleClick}
              className="border-2 border-primary-color px-3 rounded-md cursor-pointer hover:scale-105 py-1 transition-all text-primary-color"
            >
              Vô hiệu hóa
            </div>
          )}
          {record.status === false && (
            <div
              onClick={handleClick}
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
      status: item.isAvailable,
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
              onClick={handleClick}
              className="border-2 border-primary-color px-3 rounded-md cursor-pointer hover:scale-105 py-1 transition-all text-primary-color"
            >
              Vô hiệu hóa
            </div>
          )}
          {record.status === false && (
            <div
              onClick={handleClick}
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
    setupInterceptors(setErrCode, setPageNumber, setTotalItems);
  }, []);
  useEffect(() => {
    const fetchDataOrg = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(
          `/get-all-organizations?PageNumber=${pageNumber}&PageSize=${sizePage}`
        );

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
          `/get-all-volunteers?PageNumber=${pageNumber}&PageSize=${sizePage}`
        );

        const listData = data.data.data.items;
        console.log(data);

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
  }, [pageNumber, modeAccount]);

  const handleClick = () => {
    console.log("cút vào knick");
  };
  const handleClickBackHome = () => {
    navigate("/");
  };
  const handleFilterRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setModeAccount(event.target.value);
    setPageNumber(1);
  };
  const handlePaging = (page: number) => {
    setPageNumber(page);
  };

  console.log(keyPaging);

  return (
    <div className="p-12 lg:flex-1">
      <div className="text-2xl mb-4 lg:mb-0">Quản lý tài khoản</div>
      <div className="lg:flex lg:justify-center">
        <SearchComponent placeHolder="Tìm kiếm theo email..." className="" />
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
          {errCode === 403 && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-100">
              <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={
                  <Button onClick={handleClickBackHome} type="primary">
                    Back Home
                  </Button>
                }
              />
            </div>
          )}
          <div key={modeAccount}>
            <Pagination
              defaultCurrent={1}
              total={totalItems}
              pageSize={sizePage}
              onChange={handlePaging}
              className="mt-4"
            />
          </div>
          {isLoading && (
            <Flex>
              <Spin size="large" fullscreen />
            </Flex>
          )}
        </ConfigProvider>
      </div>
    </div>
  );
};

export default AccountComponent;
