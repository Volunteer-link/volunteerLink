import React, { useState } from "react";
import SearchComponent from "../../../Common/SearchComponent";
import { Table } from "antd";
import { ConfigProvider } from "antd";
import { Pagination } from "antd";

const AccountComponent: React.FC<{}> = () => {
  const [modeAccount, setModeAccount] = useState<string>("org");
  const dataSourceOrg = [
    {
      key: "1",
      mail: "mike@example.com",
      name: "Tổ chức A",
      status: "Active",
    },
    {
      key: "2",
      mail: "john@example.com",
      name: "Tổ chức B",
      status: "Inactive",
    },
  ];
  const columnsOrg = [
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
            record.status === "Active" ? "text-primary-color" : "text-red-500"
          }`}
        >
          {record.status}
        </div>
      ),
    },
    {
      title: "Hoạt động",
      key: "address",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          {record.status === "Active" && (
            <div
              onClick={handleClick}
              className="border-2 border-primary-color px-3 rounded-md cursor-pointer hover:scale-105 py-1 transition-all text-primary-color"
            >
              Vô hiệu hóa
            </div>
          )}
          {record.status === "Inactive" && (
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
  const dataSourceVol = [
    {
      key: "1",
      mail: "mike@example.com",
      name: "Lê Anh Sơn",
      gender: "Nam",
      status: "Inactive",
    },
    {
      key: "2",
      mail: "john@example.com",
      name: "Lê Thị Sơn",
      gender: "Nữ",
      status: "Active",
    },
  ];
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
            record.status === "Active" ? "text-primary-color" : "text-red-500"
          }`}
        >
          {record.status}
        </div>
      ),
    },
    {
      title: "Hoạt động",
      key: "address",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          {record.status === "Active" && (
            <div
              onClick={handleClick}
              className="border-2 border-primary-color px-3 rounded-md cursor-pointer hover:scale-105 py-1 transition-all text-primary-color"
            >
              Vô hiệu hóa
            </div>
          )}
          {record.status === "Inactive" && (
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
  const handleClick = () => {
    console.log("cút vào knick");
  };
  const handleFilterRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setModeAccount(event.target.value);
  };
  console.log(modeAccount);

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
          <Pagination defaultCurrent={1} total={50} className="mt-4" />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default AccountComponent;
