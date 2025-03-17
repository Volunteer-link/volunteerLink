import { Carousel, ConfigProvider, Image, Typography } from 'antd';
import React from 'react';
import { Organization } from '../../model/OrganizationDetail/Organization';
const contentStyle: React.CSSProperties = {
  margin: '30px',
  color: '#fff',
  background: '#364d79',
};

const OrganizationsDetailInformation = ({ organization }: { organization: Organization | undefined}) => {
  return (
    <>
      <div className="flex items-center gap-4">
        <Typography.Title style={{ color: '#3BA769', margin: 0 }} level={4}>
          Thông tin liên hệ
        </Typography.Title>
        <div className="flex-1 h-1 bg-[#3BA769] "></div>
      </div>
      <div className="max-w-[800px] mx-auto w-full">
        <div className="flex py-4 flex-col gap-2">
          <Typography.Text>Hotline: {organization?.phoneNumber}</Typography.Text>
          <Typography.Link target='_blank'>Facebook:  {organization?.urlFacebook}</Typography.Link>
          <Typography.Text>Email:  {organization?.gmail}</Typography.Text>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Typography.Title style={{ color: '#3BA769', margin: 0 }} level={4}>
          Lý tưởng & mục tiêu
        </Typography.Title>
        <div className="flex-1 h-1 bg-[#3BA769] "></div>
      </div>
      <div className="max-w-[800px] mx-auto w-full">
        <Typography.Paragraph className="py-4">
        {organization?.description}
        </Typography.Paragraph>
      </div>

      <div className="flex items-center gap-4">
        <Typography.Title style={{ color: '#3BA769', margin: 0 }} level={4}>
          Ảnh nổi bật
        </Typography.Title>
        <div className="flex-1 h-1 bg-[#3BA769] "></div>
      </div>

      <div style={{ padding: '20px' }}>
        <ConfigProvider
          theme={{
            components: {
              Carousel: {
                arrowSize: 35,
                arrowOffset: 0,
              },
            },
          }}
        >
          <Carousel
            slidesToShow={3}
            centerMode={true}
            centerPadding="0px"
            slidesToScroll={1}
            draggable
            dots={false}
            arrows
            infinite={true}
          >
            <div>
              <div style={contentStyle}>
                <Image
                  style={{ objectFit: 'cover' }}
                  width={80}
                  preview={false}
                  alt="example"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </div>
            </div>
            <div>
              <div style={contentStyle}>
                <Image
                  style={{ objectFit: 'cover' }}
                  width={80}
                  preview={false}
                  alt="example"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </div>
            </div>
            <div>
              <div style={contentStyle}>
                <Image
                  style={{ objectFit: 'cover' }}
                  width={80}
                  preview={false}
                  alt="example"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </div>
            </div>
            <div>
              <div style={contentStyle}>
                <Image
                  style={{ objectFit: 'cover' }}
                  width={80}
                  preview={false}
                  alt="example"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </div>
            </div>
          </Carousel>
        </ConfigProvider>
      </div>
    </>
  );
};

export default OrganizationsDetailInformation;
