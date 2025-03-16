import React from 'react';
import { Image, Typography } from 'antd';
import { color } from 'framer-motion';
const { Paragraph } = Typography;

interface OrganizationsItemProps {
  image: string;
  name: string;
  field: string;
}

const OrganizationsItem = ({ name, image, field }: OrganizationsItemProps) => {
  return (
    <div className="flex mt-4 justify-center rounded-lg border border-[#3BA769] items-start p-4 gap-4">
      <div className="w-32 shrink-0">
        <Image
          style={{ objectFit: 'cover' }}
          width={80}
          height={80}
          preview={false}
          alt="example"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </div>

      <div className="flex-1">
        <Typography.Title
          ellipsis={{ rows: 1, expandable: true, symbol: '' }}
          level={5}
          className="text-[#3BA769]"
          style={{ margin: 0, color: '#3BA769' }}
        >
          {name}
        </Typography.Title>
        {field && (
          <Paragraph
            className="text-[#3BA769]"
            ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
          >
            {'>'} {field}
          </Paragraph>
        )}
      </div>
    </div>
  );
};

export default OrganizationsItem;
