import React, { useState } from "react";
import { Col, Row, ConfigProvider, Image, Tabs, App as AntdApp } from "antd";
import type { TabsProps, UploadFile } from "antd";
import logo from "../../image/signup_banner.jpg";
import SignupOrganization from "./SignupOrganization";
import SignupVolunter from "./SignupVolunteer";
import {
  nameRules,
  passwordRules,
  confirmPasswordRules,
  dateRules,
  emailRules,
} from "../../ultils/validationRules";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import api from "../../apiService/useFetch";
import { storage } from "../../ultils/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
const Signup = () => {
  const onChange = (key: string) => {
    setOrganization(key == "2");
  };
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);
  const { message } = AntdApp.useApp();
  const [organization, setOrganization] = React.useState(false);
  

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      let listCertificates: string[] | undefined = [];
      if (organization) {
        listCertificates = await handleUpload();
      }
      if (!values?.date) {
        const today = dayjs();
        values.date = today;
      }
      const trimmedValues = {
        email: location.state?.trim(),
        name: values.name.trim(),
        password: values.password.trim(),
        confirmPassword: values.confirmPassword.trim(),
        date: values.date.format("YYYY-MM-DD"),
      };
      const response = await api.post("/register-account", {
        gmail: trimmedValues.email,
        password: trimmedValues.password,
        isOrganization: organization,
        name: trimmedValues.name,
        dateOfBirth: trimmedValues.date,
        listCertificates: listCertificates,
      });
      // Nếu gọi thành công => hiển thị thông báo
      message.success("Đăng ký thành công!");
      navigate("/authentication/signin");
    } catch (error) {
      console.error(error);
      message.error("Đăng ký thất bại !");
    } finally {
      setLoading(false);
    }
  };
   

  const onFinishFailed = (errorInfo: any) => {
    console.log("Submit thất bại:", errorInfo);
  };

  const handleUpload = async () => {
    try {
      const promises = fileList.map((item) => {
        const file = item.originFileObj as File;

        const storageRef = ref(storage, `file/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<string>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      });

      return await Promise.all(promises);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Tình nguyện viên ",
      children: (
        <SignupVolunter
          onFinish={onFinish}
          dateRules={dateRules}
          nameRules={nameRules}
          passwordRules={passwordRules}
          confirmPasswordRules={confirmPasswordRules}
          onFinishFailed={onFinishFailed}
          loading={loading}
        />
      ),
    },
    {
      key: "2",
      label: "Tổ chức từ thiện",
      children: (
        <SignupOrganization
          onFinish={onFinish}
          nameRules={nameRules}
          passwordRules={passwordRules}
          confirmPasswordRules={confirmPasswordRules}
          onFinishFailed={onFinishFailed}
          loading={loading}
          fileList={fileList}
          setFileList={setFileList}
        />
      ),
    },
  ];

  return (
    <div  className="px-4 md:px-0">
      <Row className="w-full h-screen">
        <Col span={18}>
          <div className="flex w-full lg:max-w-80 mx-auto flex-col justify-center items-center gap-8 h-full">
            <h4 className="text-[#3BA769] text-[20px] text-center">
              Xin chào! Rất vui được gặp bạn
            </h4>

            {!location.state ? (
              <div>
                <p>
                  Bạn cần xác thực Email trước khi đăng ký.
                  <div className="text-center">
                    <a
                      onClick={() => {
                        navigate("/authentication/verify-email");
                      }}
                      className="text-[#3BA769]"
                    >
                      Xác thực Email
                    </a>
                  </div>
                  <NavLink to={"/"}>
                    <FaHome className="mx-auto mt-2 text-xl text-primary-color" />
                  </NavLink>
                </p>
              </div>
            ) : (
              <ConfigProvider
                theme={{
                  components: {
                    Tabs: {
                      inkBarColor: "#3BA769",
                      itemSelectedColor: "#3BA769",
                    },
                  },
                }}
              >
                <Tabs
                  className="w-full"
                  defaultActiveKey="1"
                  items={items}
                  onChange={onChange}
                />
              </ConfigProvider>
            )}
          </div>
        </Col>
        <Col span={6}>
          <Image
            className="w-full h-screen"
            preview={false}
            placeholder={true}
            alt="logo"
            src={logo}
            style={{ height: "100vh", width: "100%" }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Signup;
