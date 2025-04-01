import React, { useEffect, useState } from 'react';
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
} from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../../apiService/useFetch';
const AttendanceUI: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');

  const [listUser, setListUser] = useState<any[]>([]);
  const [totalPage, setTotalPage] = React.useState<number>();
  const [PageNumber, setPageNumber] = React.useState<number>(
    parseInt(page!) || 1
  );
  const { message, modal } = AntdApp.useApp();

  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [interact, setInteract] = useState(false);
  const navigate = useNavigate();

  const handleCheck = (checked: boolean, recordId: number): void => {
    const newList = listUser.map((user) =>
      user.id === recordId ? { ...user, attendance: checked } : user
    );
    setInteract(true);
    setListUser(newList);
  };

  useEffect(() => {
    const fetchField = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/attendance/get-attendance-of-event`, {
          params: {
            EvenId: id,
            PageNumber: PageNumber,
            PageSize: 5,
          },
        });
        setTotalPage(data.data.totalItems);
        setListUser(data.data.items);
        setLoading(false);
      } catch (e: any) {
        console.error(e);
      } finally {
      }
    };
    fetchField();
  }, [PageNumber]);

  const handleSave = async () => {
    const checkedUsers = listUser
      .map((user) => {
        if (user.attendance) return user.volunteerId;
        return null;
      })
      .filter((id) => id !== null);
    try {
      setLoadingSubmit(true);
      const { data } = await api.post('/attendance/check-attendance-of-event', {
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

  const handlePageChange = (page: number) => {
    if (interact) {
      modal.confirm({
        title: 'Bạn có chắc chắn muốn chuyển trang?',
        content: 'Bạn sẽ mất tất cả các thay đổi chưa lưu nếu chuyển trang.',
        onOk: () => {
          setPageNumber(page);
          navigate(`/event/attendance/${id}?page=${page}`, { replace: true });
        },
        onCancel: () => {},
      });
    } else {
      setPageNumber(page);
      navigate(`/event/attendance/${id}?page=${page}`, { replace: true });
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Ảnh',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
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
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
    },
    {
      title: 'Điểm Danh',
      dataIndex: 'isChecked',
      key: 'isChecked',
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
      <h2 className="text-[30 px] font-semibold mb-4">
        Điểm danh tình nguyện viên
      </h2>

      <div className={`relative ${loading && 'min-h-[200px]'}`}>
        {loading ? (
          <div className="flex absolute z-10 inset-0 justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {listUser.length === 0 ? (
              <Empty />
            ) : (
              <>
                {' '}
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
                <Pagination
                  className="my-8"
                  align="center"
                  current={PageNumber}
                  total={totalPage}
                  pageSize={5}
                  onChange={handlePageChange}
                  responsive
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
                        prev.map((user) => ({ ...user, attendance: false }))
                      );
                    }}
                  >
                    Reset
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
