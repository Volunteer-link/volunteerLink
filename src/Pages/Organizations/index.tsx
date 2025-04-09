import React, { useCallback, useEffect, useState } from "react";
import {
  Input,
  Col,
  Row,
  Select,
  Typography,
  Tooltip,
  Pagination,
  Spin,
} from "antd";
import OrganizationsItem from "./OrganizationsItem";
import { Empty, SelectProps } from "antd";
import api from "../../apiService/useFetch";
import { SearchProps } from "antd/es/input";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDebounce } from "../../ultils/useDebounce";
import LineSpacing from "../Components/LineSpacing";
import { FaMedal, FaUsers } from "react-icons/fa";
const { Search } = Input;
const options: SelectProps["options"] = [];

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageFromUrl = searchParams.get("page");
  const searchNameFromUrl = searchParams.get("name");
  const initialPage = pageFromUrl ? parseInt(pageFromUrl) : 1;
  const [organizationsList, setOrganizationsList] = useState([]);
  const [organizationsTopList, setOrganizationsTopList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [PageNumber, setPageNumber] = React.useState<number>(initialPage);
  const [searchName, setSearchName] = React.useState<string>(
    searchNameFromUrl || ""
  );
  const searchDebounce = useDebounce<string>(searchName, 500);
  const [fields, setFields] = React.useState<string>("");
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

  const fetchField = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/common/organization-list`, {
        params: {
          SearchKey: searchDebounce,
          Fields: fields,
          PageNumber: PageNumber,
          PageSize: 9,
        },
      });
      setTotalPage(data.data.totalItems);
      setOrganizationsList(data.data.items);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
    } finally {
    }
  }, [PageNumber, fields, searchDebounce]);

  useEffect(() => {
    fetchField();
  }, [PageNumber, fields, searchDebounce]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/common/top-rated-organization`);
        setOrganizationsTopList(data.data);
      } catch (e: any) {
      } finally {
      }
    };
    fetch();
  }, []);

  const handleChange = (value: string[]) => {
    setPageNumber(1);
    setFields(value.join(", "));
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    navigate(`/organizations?page=${page}&name=${searchDebounce}`, {
      replace: true,
    });
  };

  const handleClickSearch = () => {
    fetchField();
    setPageNumber(1);
    navigate(`/organizations?page=${PageNumber}&name=${searchDebounce}`, {
      replace: true,
    });
  };
  return (
    <div className="flex flex-col">
      <div>
        <img
          src="/materials/environmentalist-volunteers-planting-new-tree-handshaking_931309-4332.jpg"
          className="w-full h-72 object-cover mb-8"
          alt=""
        />
      </div>
      <LineSpacing />
      {organizationsTopList.length > 0 && (
        <div className="mb-6">
          <div className="items-center gap-1 justify-center text-2xl flex mb-6 text-shadow-md">
            <FaMedal className="text-primary-color" />
            <div className="">Tổ chức </div>
            <div className="text-primary-color">hàng đầu</div>
          </div>
          <div>
            <Row gutter={16} className={``}>
              {organizationsTopList.map((item: any) => {
                return (
                  <Col
                    onClick={() => {
                      navigate(`/organizations/profile/${item.accountId}`);
                    }}
                    className="cursor-pointer"
                    key={item.id + "toprate"}
                    xs={24}
                    sm={8}
                    md={8}
                  >
                    <OrganizationsItem
                      image={item.urlImage}
                      name={item.name}
                      field={item.fields
                        .map((field: any) => field.name)
                        .join(", ")}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      )}
      <LineSpacing />
      <div>
        <img
          src="/materials/volunteers-helping-with-food-donations-giving-thumbs-up.jpg"
          className="w-full h-72 object-cover mb-8"
          alt=""
        />
      </div>
      <LineSpacing />
      <div className="items-center gap-1 justify-center text-2xl flex mb-6 text-shadow-md">
        <FaUsers className="text-primary-color" />
        <div className="">Tổ chức </div>
        <div className="text-primary-color">trong hệ thống</div>
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="lg:w-[36rem] mb-8 w-full bg-white rounded-full border border-primary-color flex items-center justify-between mx-auto">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên tổ chức..."
            className="flex-1 outline-none py-3 px-5 rounded-full relative text-base"
            onChange={(e) => setSearchName(e.target.value)}
          />
          <div className="flex pr-2 items-center gap-4 select-none">
            <div
              onClick={handleClickSearch}
              className="bg-primary-color text-white lg:px-4 text-nowrap px-8 py-2 lg:py-2 text-xs lg:text-sm rounded-3xl cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
            >
              Tìm kiếm
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        {loading && (
          <div className="flex absolute z-10 inset-0 justify-center items-center min-h-[300px]">
            <Spin size="large" />
          </div>
        )}
        <Row>
          <Col span={24}>
            <Typography.Text>Lĩnh vực:{"  "}</Typography.Text>
            <Select
              className="max-w-[200px] mb-4 cursor-pointer"
              maxTagCount="responsive"
              mode="multiple"
              size={"middle"}
              placeholder="Vui lòng chọn lĩnh vực"
              onChange={handleChange}
              style={{ width: "100%" }}
              options={listFieldState}
              maxTagPlaceholder={(omittedValues) => (
                <Tooltip
                  styles={{ root: { pointerEvents: "none" } }}
                  title={omittedValues.map(({ label }) => label).join(", ")}
                >
                  <span>+ {omittedValues.length}</span>
                </Tooltip>
              )}
            />
          </Col>
        </Row>
        {organizationsList.length === 0 ? (
          <Empty description="Không có dữ liệu tổ chức" />
        ) : (
          <>
            <Row gutter={16} className={` ${loading ? "opacity-50" : ""}`}>
              {organizationsList.map((item: any) => {
                return (
                  <Col
                    onClick={() => {
                      navigate(`/organizations/profile/${item.accountId}`);
                    }}
                    className="cursor-pointer"
                    key={item.id + "organization"}
                    xs={24}
                    sm={8}
                    md={8}
                  >
                    <OrganizationsItem
                      image={item.urlImage}
                      name={item.name}
                      field={item.fields
                        .map((field: any) => field.name)
                        .join(", ")}
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
