import React, { useState } from 'react';
import { Input, Col, Row, Select, Typography, Tooltip, Pagination } from 'antd';
import OrganizationsItem from './OrganizationsItem';
import type { SelectProps } from 'antd';
const { Search } = Input;
const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}
const Organizations = () => {
  const handleChange = (value: string | string[]) => {
    console.log(`Selected: ${value}`);
  };
  return (
    <div className="my-12 flex flex-col">
      <div className="flex justify-center items-center w-full">
        <Search
          placeholder="Tên tổ chức....."
          className="w-1/3"
          enterButton="Tìm kiếm"
          size="large"
        />
      </div>
      <div className="container mx-auto">
        <Row>
          <Col span={24}>
            <Typography.Text>Lĩnh vực:{'  '}</Typography.Text>
            <Select
              className="max-w-[200px]"
              mode="multiple"
              maxTagCount="responsive"
              size={'middle'}
              placeholder="Vui lòng chọn lĩnh vực"
              onChange={handleChange}
              style={{ width: '100%' }}
              options={options}
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

        <Row>
          <Col span={8}>
            <OrganizationsItem />
          </Col>
        </Row>
        <Pagination align="center" defaultCurrent={1} total={50} />
      </div>
    </div>
  );
};

export default Organizations;
