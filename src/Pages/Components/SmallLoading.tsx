import { ConfigProvider, Flex, Spin } from "antd";

const SmallLoading: React.FC<{
  size: "small" | "large" | "default";
}> = ({ size }) => {
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
          <Spin size={size} />
        </Flex>
      </ConfigProvider>
    </div>
  );
};

export default SmallLoading;
