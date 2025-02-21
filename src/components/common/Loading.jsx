import { Spin } from 'antd';

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Spin size="large" />
    </div>
  );
};

export default LoadingPage;