import { Spin } from 'antd';
const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Spin size="large" />
    </div>
  );
};

export default LoadingPage;