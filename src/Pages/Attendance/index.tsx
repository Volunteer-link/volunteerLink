import React, { useEffect, useState } from "react";
import {
  Table,
  Checkbox,
  Button,
  Space,
  message,
  Pagination,
  Avatar,
  App as AntdApp,
  Spin,
  Empty,
} from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../apiService/useFetch";
const AttendanceUI: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  const [listUser, setListUser] = useState<any[]>([]);
  const { message, modal } = AntdApp.useApp();

  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigate = useNavigate();
  const [status, setStatus] = useState<boolean>(false);

  const handleCheck = (checked: boolean, recordId: number): void => {
    const newList = listUser?.map((user) =>
      user.id === recordId ? { ...user, attendance: checked } : user
    );
    setListUser(newList);
  };
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await api.get(`/event/check-owner?eventId=${id}`);

        if (data.data.success) {
          setStatus(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchField = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/attendance/get-attendance-of-event`, {
          params: {
            EvenId: id,
            PageNumber: 1,
            PageSize: 9999,
          },
        });
        setListUser(data.data);
        setLoading(false);
      } catch (e: any) {
        console.error(e);
      } finally {
      }
    };
    if (status) {
      fetchField();
    }
  }, [status]);

  const handleSave = async () => {
    const checkedUsers = listUser
      ?.map((user) => {
        if (user.attendance) return user.volunteerId;
        return null;
      })
      .filter((id) => id !== null);
    try {
      setLoadingSubmit(true);
      const { data } = await api.post("/attendance/check-attendance-of-event", {
        eventId: id,
        listVolunteerId: checkedUsers,
      });
      message.success(`Lưu điểm danh thành công.`);
      setLoadingSubmit(false);
    } catch (err: any) {
      setLoadingSubmit(false);
      if (err.status == 400) message.error(`${err.response.data.Message}`);
      console.log(err);
    }
  };


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Ảnh",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      render: (value: any, record: any) => {
        return (
          <Avatar
            src={record.pictureProfile}
            size={40}
            shape="circle"
            style={{ marginRight: 8 }}
          />
        );
      },
    },
    {
      title: "Họ và Tên",
      dataIndex: "name",
      key: "name",
      width: "50%",
    },
    {
      title: "Điểm Danh",
      dataIndex: "isChecked",
      key: "isChecked",
      render: (value: boolean, record: any) => (
        <Checkbox
          checked={record.attendance}
          onChange={(e) => {
            e.stopPropagation();
            handleCheck(e.target.checked, record.id);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 className="text-[20px] font-semibold mb-4">
        Điểm danh tình nguyện viên
      </h2>

      <div className={`relative ${loading && "min-h-[200px]"}`}>
        {loading ? (
          <div className="flex absolute z-10 inset-0 justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {listUser?.length === 0 ? (
              <Empty description="Không có tình nguyện viên" />
            ) : (
              <>
                {" "}
                <Table
                  rowKey="id"
                  columns={columns}
                  dataSource={listUser}
                  pagination={false}
                  style={{ marginBottom: 16 }}
                  onRow={(record) => ({
                    onClick: () => {
                      navigate(`/volunteerProfile/${record.accountId}`);
                    },
                  })}
                />
                <Space>
                  <Button
                    loading={loadingSubmit}
                    type="primary"
                    onClick={handleSave}
                  >
                    Lưu
                  </Button>
                  <Button
                    onClick={() => {
                      setListUser((prev) =>
                        prev?.map((user) => ({ ...user, attendance: false }))
                      );
                    }}
                  >
                   Huỷ điểm danh toàn bộ 
                  </Button>
                </Space>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceUI;
