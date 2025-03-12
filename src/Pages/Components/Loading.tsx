import { Flex, Spin } from "antd";

const Loading = () => {
  return (
    <div className="bg-stone-200 bg-opacity-15 fixed top-0 z-10 bottom-0 right-0 left-0 flex items-center justify-center">
      <Flex align="center" gap="middle">
        <Spin size="large" />
      </Flex>
    </div>
  );
};

export default Loading;
