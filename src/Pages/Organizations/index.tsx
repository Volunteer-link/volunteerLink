import React, { useEffect, useState } from 'react';
import {
  Input,
  Col,
  Row,
  Select,
  Typography,
  Tooltip,
  Pagination,
  Spin,
} from 'antd';
import OrganizationsItem from './OrganizationsItem';
import { Empty, SelectProps } from 'antd';
import api from '../../apiService/useFetch';
import { SearchProps } from 'antd/es/input';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loading from '../Components/Loading';
const { Search } = Input;
const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}
const Organizations = () => {
  const [listFieldState, setListFieldState] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageFromUrl = searchParams.get('page');
  const searchNameFromUrl = searchParams.get('name');
  const initialPage = pageFromUrl ? parseInt(pageFromUrl) : 1;
  const [organizationsList, setOrganizationsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [PageNumber, setPageNumber] = React.useState<number>(initialPage);
  const [searchName, setSearchName] = React.useState<string>(
    searchNameFromUrl || ''
  );
  const [fields, setFields] = React.useState<number>();
  const [totalPage, setTotalPage] = React.useState<number>();
  useEffect(() => {
    const fetchField = async () => {
      try {
        const { data } = await api.get(`/common/get-fields`);
        setListFieldState(() => {
          return data.data.map((item: any) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
        });
      } catch (e: any) {
      } finally {
      }
    };
    fetchField();
  }, []);

  useEffect(() => {
    const fetchField = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/common/organization-list`, {
          params: {
            SearchKey: searchName,
            Fields: fields,
            PageNumber: PageNumber,
            PageSize: 9,
          },
        });
        setTotalPage(data.totalItems);
        setOrganizationsList(data.data.items);
        setLoading(false);
      } catch (e: any) {
      } finally {
      }
    };
    fetchField();
  }, [PageNumber, fields, searchName]);

  const handleChange = (value: string | string[]) => {
    setPageNumber(1);
    setFields(Number(value));
  };

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    setPageNumber(1);
    setSearchName(value);
    navigate(`/organizations?page=${PageNumber}&name=${value}`, {
      replace: true,
    });
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    navigate(`/organizations?page=${page}&name=${searchName}`, {
      replace: true,
    });
  };

  return (
    <div className="my-12 flex flex-col">
      <div className="flex justify-center mb-6 items-center w-full">
        <Search
          placeholder="Tên tổ chức....."
          className="w-1/3"
          enterButton="Tìm kiếm"
          size="large"
          allowClear
          loading={loading}
          onSearch={onSearch}
        />
      </div>
      <div className="container relative mx-auto">
        {loading && (
          <div className="flex absolute z-10 inset-0 justify-center items-center min-h-[300px]">
            <Spin size="large" />
          </div>
        )}
        <Row>
          <Col span={24}>
            <Typography.Text>Lĩnh vực:{'  '}</Typography.Text>
            <Select
              className="max-w-[200px] mb-4"
              maxTagCount="responsive"
              size={'middle'}
              placeholder="Vui lòng chọn lĩnh vực"
              onChange={handleChange}
              style={{ width: '100%' }}
              options={listFieldState}
              maxTagPlaceholder={(omittedValues) => (
                <Tooltip
                  styles={{ root: { pointerEvents: 'none' } }}
                  title={omittedValues.map(({ label }) => label).join(', ')}
                >
                  <span>+ {omittedValues.length}</span>
                </Tooltip>
              )}
            />
          </Col>
        </Row>
        {organizationsList.length === 0 ? (
          <Empty />
        ) : (
          <>
            <Row gutter={16} className={` ${loading ? 'opacity-50' : ''}`}>
              {organizationsList.map((item: any) => {
                return (
                  <Col key={item.id} span={8}>
                    <OrganizationsItem
                      image={item.image}
                      name={item.name}
                      field={item.fields
                        .map((field: any) => field.name)
                        .join(', ')}
                    />
                  </Col>
                );
              })}
            </Row>
            <Pagination
              className="mt-8"
              align="center"
              current={PageNumber}
              total={totalPage}
              pageSize={9}
              onChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Organizations;
