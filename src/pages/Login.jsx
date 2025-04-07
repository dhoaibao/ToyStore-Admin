import { Form, Input, Button, message } from "antd";
import { authService } from "../services";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getLoggedInUser } from "../redux/thunks/userThunk";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await authService.signInAdmin(values);
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      await dispatch(getLoggedInUser());

      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.message === "User is inactive!") {
        message.error("Tài khoản đang bị khóa");
      } else {
        message.error("Email hoặc mật khẩu không đúng");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between w-3/5 py-14 bg-white p-4 rounded-xl">
      <div className="w-1/2">
        <img src="/login_illustration.jpg" alt="login" />
      </div>
      <div className="flex flex-col items-center justify-center w-1/2">
        <p className="font-semibold text-2xl mb-2">Đăng nhậ</p>
        <Form
          layout="vertical"
          form={loginForm}
          onFinish={handleLogin}
          className="w-full p-2"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
