import { Typography, Carousel, Image, ConfigProvider, Tabs  } from 'antd';
import React from 'react';
const contentStyle: React.CSSProperties = {
  margin: '30px',
  color: '#fff',
  background: '#364d79',
};
const { TabPane } = Tabs;
const OrganizationsDetail = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex mt-4 justify-center items-start p-4 gap-4">
        <div className="w-[300px] shrink-0">
          <Image
            style={{ objectFit: 'cover' }}
            width={300}
            height={300}
            preview={false}
            alt="example"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        </div>

        <div className="flex-1 self-end">
          <Typography.Title level={3}>
            Câu lạc bộ tình nguyện xanh - Trường THPT Xuân Mai
          </Typography.Title>
          <Typography.Paragraph className='px-2  rounded-lg inline-block py-2 leading-none text-white bg-[#3BA769]' style={{ margin: 0 }}>
            Phát triển cộng đồng
          </Typography.Paragraph>
        </div>
      </div>
      <Tabs
      defaultActiveKey="overview"
      // Có thể thay đổi kiểu tab (tabPosition, type) hoặc thêm className để tùy biến CSS
      className="my-custom-tabs"
      size="large"
    >
      <TabPane tab="Tổng quan" key="overview">
        Nội dung tab Tổng quan
      </TabPane>
      <TabPane tab="Sự kiện" key="events">
        Nội dung tab Sự kiện
      </TabPane>
    </Tabs>
      <div className="flex items-center gap-4">
        <Typography.Title style={{ color: '#3BA769', margin: 0 }} level={4}>
          Thông tin liên hệ
        </Typography.Title>
        <div className="flex-1 h-1 bg-[#3BA769] "></div>
      </div>
      <div className="max-w-[800px] mx-auto w-full">
        <div className="flex py-4 flex-col gap-2">
          <Typography.Text>Hotline: 0923443576</Typography.Text>
          <Typography.Text>Facebook: facebook.com/tradao</Typography.Text>
          <Typography.Text>Email: example@gmail.com</Typography.Text>
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam magna
          tellus, blandit sit amet tincidunt vitae, rhoncus in enim. Maecenas
          laoreet elit sed massa imperdiet, eget gravida erat dapibus. Phasellus
          purus nisi, rhoncus ac finibus non, gravida at erat.
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
    </div>
  );
};

export default OrganizationsDetail;
