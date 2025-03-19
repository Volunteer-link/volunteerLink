import { ConfigProvider, Flex, Spin } from "antd";

const SmallLoading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-primary-color">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ffffff",
          },
        }}
      >
        <Flex align="center" gap="middle">
          <Spin size="large" />
        </Flex>
      </ConfigProvider>
    </div>
  );
};

export default SmallLoading;
