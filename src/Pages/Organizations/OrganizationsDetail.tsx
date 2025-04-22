import { Typography, Image, Tabs, Rate, Tag } from 'antd';
import React, { useEffect } from 'react';
import OrganizationsDetailInformation from './OrganizationsDetailInformation';
import { useParams } from 'react-router-dom';
import { Organization } from '../../model/OrganizationDetail/Organization';
import api from '../../apiService/useFetch';
import ListEventsOrganization from './ListEventsOrganization';

const OrganizationsDetail = () => {
  const { id } = useParams();
  const [organization, setOrganization] = React.useState<Organization>();
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/profile/organization`, {
          params: {
            Id: id,
          },
        });
        setOrganization(data.data);
      } catch (e: any) {
        console.log(e);
      }
    };
    fetchEvent();
  }, []);

  const tagColors = [
    'green',
    'blue',
    'red',
    'purple',
    'orange',
    'cyan',
    'magenta',
    'volcano',
    'gold',
    'lime',
    'green',
    'geekblue',
    'purple',
  ];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * tagColors.length);
    return tagColors[randomIndex];
  };

  const items = [
    {
      label: 'Tổng quan',
      key: 'overview',
      children: <OrganizationsDetailInformation organization={organization} />,
    },
    {
      label: 'Sự kiện',
      key: 'events',
      children: <ListEventsOrganization organizationId={organization?.id} />,
    },
  ];
  return (
    <div className=" py-8">
      <div className="flex mt-4 justify-center flex-col md:flex-row items-start p-4 gap-4">
        <div className="w-[200px] h-[200px]  md:h-[200px]   md:w-[300px] shrink-0">
          <Image
            style={{ objectFit: 'cover', height: '100%' }}
            preview={false}
            className="h-full"
            width={200}
            height={200}
            alt="example"
            onError={(e) =>
              (e.currentTarget.src =
                '/materials/blank-profile-picture-973460_1280.png')
            }
            src={organization?.urlImage}
          />
        </div>

        <div className="flex-1 lg:self-end">
          <Typography.Title level={3}>{organization?.name}</Typography.Title>
          <Rate
            disabled
            className="mb-2"
            allowHalf
            key={organization?.star}
            defaultValue={organization?.star}
          />
          <div className="flex flex-wrap gap-2">
              {organization?.fields.map((field) => (
                <Tag key={field.id} color={getRandomColor()}>
                  {field.name}
                </Tag>
              ))}
            </div>
        </div>
      </div>
      <Tabs
        defaultActiveKey="overview"
        className="my-custom-tabs"
        size="large"
        items={items}
      />
    </div>
  );
};

export default OrganizationsDetail;
