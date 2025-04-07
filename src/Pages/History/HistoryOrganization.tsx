import { useEffect, useState } from "react";
import api from "../../apiService/useFetch";
import { Dropdown, Select, Space, Table } from "antd";
import { MenuProps } from "antd/lib";
import { DownOutlined } from "@ant-design/icons";

const HistoryOrganization = () => {
  const [stateEvent, setStateEvent] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [stateTransaction, setStateTransaction] = useState<
    {
      accountVolunteerId: number;
      createdDate: Date | string;
      eventId: number;
      eventName: string;
      money: number;
      volunteerImageUrl: string;
      volunteerName: string;
    }[]
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get(`/donate/organization-history`);
      setStateEvent(data.data.events);
      setStateTransaction(data.data.transactions);
    };
    fetchData();
  }, []);

  console.log(stateEvent);
  console.log(stateTransaction);

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  return (
    <div>
      <div className="text-primary-color text-xl font-medium">
        Lịch sử giao dịch
      </div>
      <div>filter</div>
      <div>
        <Table dataSource={dataSource} columns={columns} />;
      </div>
    </div>
  );
};

export default HistoryOrganization;
