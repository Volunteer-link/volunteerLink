import { ConfigProvider, Flex, Spin } from "antd";

const Loading: React.FC<{
  color: string;
}> = ({ color }) => {
  return (
    <div className="bg-stone-200 bg-opacity-15 fixed top-0 z-10 bottom-0 right-0 left-0 flex items-center justify-center">
      {/* <div> */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: color === "white" ? "#ffffff" : "3BA769",
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

export default Loading;
