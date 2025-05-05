import {
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Flex,
  Form,
  FormInstance,
  Image,
  Input,
  message,
  Modal,
  Radio,
  Result,
  Select,
  Spin,
  Upload,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { decodedCookie, getCookie } from "../../ultils/cookie";
import api, { setupInterceptors } from "../../apiService/useFetch";
import axios from "axios";
import ErrorSolving from "../../Common/ErrorSolving";
import ErrorCards from "../Components/ErrorCards";
import Loading from "../Components/Loading";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import dayjs from "dayjs";
import { storage } from "../../ultils/firebase";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import utc from "dayjs/plugin/utc";
import { data, useNavigate } from "react-router-dom";
import uploadFilesToFirebase from "../../ultils/uploadFilesToFirebase";
import MapBox from "../Components/MapBox";
import { FaPencilAlt } from "react-icons/fa";
dayjs.extend(utc);
interface MarkerPosition {
  longitude: number;
  latitude: number;
}
interface ProfileState {
  $type: string;
  accountId: number;
  address: string;
  dateOfBirth: string | Date;
  enabled: boolean;
  fields: any[];
  gmail: string;
  id: number;
  isAvailable: boolean;
  location: string;
  name: string;
  phoneNumber: string;
  sex: number;
  skill: string;
  urlImage: string;
}

interface FormValuesVolunteer {
  email: string;
  name: string;
  dob: string | Date;
  sex: number;
  province: string;
  district: string;
  ward: string;
  phone: string;
  skill: string;
  fields: number[];
}

const MyProfile = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [radioState, setRadioState] = useState<number>(-2);
  // const [errCode, setErrCode] = useState<number>(0);

  const token = getCookie("accessToken");
  const user = decodedCookie(token);

  const formRef = useRef<FormInstance>(null);
  const [profileState, setProfileState] = useState<ProfileState>();
  const [listFile, setListFile] = useState<UploadFile[]>([]);
  const [listUploadFile, setListUploadFile] = useState<UploadFile>();
  const [errorName, setErrorName] = useState<string>("");
  const [errorSkill, setErrorSkill] = useState<string>("");
  const [errorDob, setErrorDob] = useState<string>("");
  const [errorPhone, setErrorPhone] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [errorField, setErrorField] = useState<boolean>(false);
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [updateState, setUpdateState] = useState<number>(0);
  const [stateKey, setStateKey] = useState<number>(0);
  const [addressState, setAddressState] = useState<string[]>([]);
  const [checkProfile, setCheckProfile] = useState<boolean>(true);
  const [listFieldState, setListFieldState] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [listSelectedField, setListSelectedField] = useState<number[]>([]);

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();
  const [marker, setMarker] = useState<MarkerPosition | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModalEditName, setOpenModalEditName] = useState(false);

  useEffect(() => {
    const fetchCheckPublish = async () => {
      try {
        const { data } = await api.get("/profile/check-publish-profile");
        setIsPublish(data.data.success);
      } catch (e: any) {}
    };
    if (user) {
      fetchCheckPublish();
    }
  }, [user]);

  useEffect(() => {
    const fetchCheckStatus = async () => {
      try {
        const { data } = await api.get(`/profile/check-status-profile`);
        setCheckProfile(data.data.success);
      } catch (e: any) {
      } finally {
      }
    };

    if (user) {
      fetchCheckStatus();
    }
  }, [stateKey]);

  useEffect(() => {
    const fetchField = async () => {
      try {
        const { data } = await api.get(`/common/get-fields`);
        setListFieldState(data.data);
      } catch (e: any) {
      } finally {
      }
    };
    fetchField();
  }, []);

  const handleAvt = (url?: string) => {
    setListFile((prev) => [
      {
        uid: url ? "-1" : "s-20052003",
        name: "avatar.png",
        status: "done",
        url: url ? url : `/materials/blank-profile-picture-973460_1280.png`,
      },
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/profile/volunteer`);
        const data = res.data.data;

        // Kiểm tra nếu data có tồn tại trước khi thao tác
        if (data) {
          setProfileState((prev) => ({
            ...(prev ?? {}),
            ...data,
            dateOfBirth: new Date(data.dateOfBirth), // chuyển đổi ngày sinh
          }));
          setAddress(data.address);

          // Kiểm tra data.location và chia location nếu có
          if (data?.location) {
            const [latitude, longitude] = data.location.split(";").map(Number);
            setMarker({
              longitude,
              latitude,
            });
          }

          setRadioState(data.sex);

          // Mã hóa danh sách các trường
          const selectedFields: number[] = (data?.fields ?? []).map(
            (item: any) => item.id
          );
          setListSelectedField(selectedFields);

          // Kiểm tra và xử lý địa chỉ, chia tách nếu có
          if (data.address) {
            setAddressState(data.address.split(", "));
          }

          // Xử lý ảnh đại diện
          handleAvt(data.urlImage);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err); // Log lỗi để debug
      } finally {
        // Thực thi các hành động nếu cần thiết sau khi fetch
      }
    };
    fetchData();
  }, [updateState]);

  useEffect(() => {
    if (profileState) {
      form.setFieldsValue({
        email: profileState.gmail,
        name: profileState.name,
        dob: profileState?.dateOfBirth
          ? dayjs.utc(profileState.dateOfBirth).local()
          : null,
        sex: radioState,
        province: addressState[2],
        district: addressState[1],
        ward: addressState[0],
        phone: profileState.phoneNumber,
        skill: profileState.skill,
      });
    }
  }, [profileState, form]);

  const handlePreview = async (file: UploadFile) => {
    setPreviewOpen(true);
  };

  const handleSubmit = async (values: FormValuesVolunteer) => {
    if (listSelectedField.length === 0) {
      setErrorField(true);
      messageApi.error(`Hồ sơ của bạn cần đầy đủ thông tin để lưu!`);
    } else {
      setErrorField(false);
      if (listFile[0]?.uid === "s-20052003") {
        messageApi.error(`Hồ sơ của bạn cần ảnh đại diện!`);
      } else {
        try {
          setIsLoading(true);
          Object.assign(values, { address });
          if (marker) {
            Object.assign(values, {
              location: `${marker.latitude};${marker.longitude}`,
            });
          } else {
            Object.assign(values, { location: null }); // Gán giá trị mặc định nếu không lấy được tọa độ
          }
          const { province, district, ward, email, ...sendObject } = values;
          sendObject.dob = dayjs(sendObject.dob).format("YYYY-MM-DD");

          Object.assign(sendObject, { fields: listSelectedField });
          // console.log(listSelectedField);
          let urlNewAvt: string[] | undefined;
          if (listFile[0]?.uid !== "-1") {
            urlNewAvt = await uploadFilesToFirebase(listFile);
          }
          Object.assign(sendObject, { imageUrl: urlNewAvt?.[0] });

          const { dob, phone, ...updatedData } = {
            ...sendObject,
            dateOfBirth: sendObject.dob,
            phoneNumber: sendObject.phone,
          };
          //UPDATE
          try {
            const { data } = await api.put(`/profile/volunteer`, updatedData);
          } catch (e: any) {
            console.log(e);
          } finally {
            messageApi.success(`Hồ sơ của bạn đã được lưu thành công!`);
            window.scrollTo({ top: 0, behavior: "smooth" });

            setUpdateState((prev) => ++prev);
          }
        } catch (e: any) {
        } finally {
          setIsLoading(false);
          setStateKey((prev) => ++prev);
        }
      }
    }
  };

  const finishFailed = () => {
    if (listSelectedField.length === 0) {
      setErrorField(true);
    } else {
      setErrorField(false);
    }
    messageApi.error(`Hồ sơ của bạn cần đầy đủ thông tin để lưu!`);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    let newArray = newFileList as Array<UploadFile>;

    setListFile([newArray[newFileList.length === 1 ? 0 : 1]]);
  };

  const publicProfile = async (value: boolean) => {
    try {
      const { data } = await api.put(`/profile/volunteer-publish`, {
        status: value,
      });
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleChangePublic = () => {
    setOpenModal(true);
  };

  const handleOk = async () => {
    await publicProfile(!isPublish);
    messageApi.success(
      isPublish
        ? `Hồ sơ của bạn đã hủy xuất bản!`
        : "Hồ sơ của bạn đã được xuất bản thành công"
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpenModal(false);
    setIsPublish((prev) => !prev);
    setUpdateState((prev) => ++prev);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchAddress = async () => {
      const data = await api.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${marker?.latitude}&lon=${marker?.longitude}&format=json`
      );
      setAddress(data.data.display_name);
      form.setFieldsValue({
        address: data.data.display_name,
      });
    };

    if (marker?.latitude && marker?.longitude) {
      fetchAddress();
    }
  }, [marker]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const ShowModalEditName = () => {
    setOpenModalEditName(true);
  };

  const handleCloseEditName = () => {
    setOpenModalEditName(false);
  };

  return (
    <div className=" py-4 relative">
      {isLoading && <Loading color="green" />}
      {/* <ErrorCards errCode={errCode} /> */}
      {contextHolder}
      {/* {!currentUser && <ErrorLoginRequired />} */}
      <div className="mb-8 inline-block lg:mt-0 mt-10 before:w-full before:h-[0.125rem] before:absolute relative before:-bottom-2 before:bg-primary-color select-none">
        <span className="text-base mr-1">Hồ sơ của</span>
        <span className="text-xl font-medium text-primary-color">
          {profileState?.name}
        </span>
      </div>
      <div className="lg:w-2/3 w-full mx-auto">
        {!checkProfile && (
          <div className=" mb-4 text-red-500">
            *Lưu ý: Hồ sơ của bạn chưa được cập nhật đầy đủ thông tin
          </div>
        )}
        <div className="lg:flex lg:justify-between">
          <ConfigProvider
            theme={{
              token: {
                controlHeightLG: 60,
              },
            }}
          >
            <Upload
              name="avatar"
              listType="picture-circle"
              fileList={listFile}
              showUploadList={{ showRemoveIcon: false }}
              // customRequest={customUpload}
              beforeUpload={() => false}
              onChange={handleChange}
              onPreview={handlePreview}
            >
              + Update
            </Upload>
          </ConfigProvider>
          <div className="lg:flex items-end mt-4">
            <span className="mr-1">Trạng thái:</span>
            <span className="font-medium text-base text-primary-color">
              {profileState?.isAvailable && "Đã xuất bản"}
            </span>
            <span className="font-medium text-base text-red-500">
              {!profileState?.isAvailable && "Chưa xuất bản"}
            </span>
          </div>
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
            }}
            src={listFile[0]?.url || listFile[0]?.thumbUrl}
          />
        </div>
        <div>
          <Form
            onFinishFailed={finishFailed}
            onFinish={handleSubmit}
            ref={formRef}
            form={form}
          >
            <div className="my-4">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-red-500 inline-block text-lg">*</span>
                <div className="text-base font-medium text-primary-color">
                  Email
                </div>
                <div className="w-20 h-[0.07rem] bg-primary-color"></div>
              </div>
              <Form.Item name="email">
                <Input
                  disabled
                  className="border-[0.1rem] border-stone-300 text-base outline-primary-color px-4 py-2 w-full rounded-lg duration-300"
                />
              </Form.Item>
            </div>
            <div className="my-4">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-red-500 inline-block text-lg">*</span>
                <div className="text-base font-medium text-primary-color">
                  Họ và tên
                </div>
                <div className="w-20 h-[0.07rem] bg-primary-color"></div>
              </div>
              <div className="flex items-center gap-5 justify-between ">
                <Form.Item
                  name="name"
                  className="flex-1 !mb-0"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                    {
                      pattern:
                        /^(?!.*\s{2})[A-Za-zÀ-ỹ']{1}[A-Za-zÀ-ỹ\s']{3,48}[A-Za-zÀ-ỹ']{1}$/,
                      message:
                        "Chỉ được nhập chữ, không có số/ký tự đặc biệt [5-50 kí tự]",
                    },
                  ]}
                >
                  <Input
                    className={`border-[0.1rem] text-base ${
                      errorName !== ""
                        ? "border-2 border-red-500"
                        : "border-stone-300"
                    } outline-primary-color px-4 py-2 w-full rounded-lg duration-300`}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="my-4">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-red-500 inline-block text-lg">*</span>
                <div className="text-base font-medium text-primary-color">
                  Ngày sinh
                </div>
                <div className="w-20 h-[0.07rem] bg-primary-color"></div>
              </div>
              <Form.Item
                name="dob"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày sinh!" },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  className={`border-[0.1rem] text-base outline-primary-color px-4 py-2 w-full rounded-lg duration-300 ${
                    errorDob !== "" ? "border-red-500" : "border-stone-300"
                  }`}
                />
              </Form.Item>
            </div>
            <div className="my-4">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-red-500 inline-block text-lg">*</span>
                <div className="text-base font-medium text-primary-color">
                  Giới tính
                </div>
                <div className="w-20 h-[0.07rem] bg-primary-color"></div>
              </div>
              <Form.Item
                name="sex"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Radio.Group
                  onChange={(e) => setRadioState(e.target.value)}
                  // value={radioState}
                >
                  <Radio value={1}>Nam</Radio>
                  <Radio value={-1}>Nữ</Radio>
                  <Radio value={0}>Khác</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className="my-4">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-red-500 inline-block text-lg">*</span>
                <div className="text-base font-medium text-primary-color">
                  Địa chỉ
                </div>
                <div className="w-20 h-[0.07rem] bg-primary-color"></div>
              </div>
              <div className="mapbox">
                <Modal
                  maskClosable={true}
                  footer={null}
                  onCancel={handleClose}
                  title="Chọn địa điểm"
                  centered
                  open={isModalOpen}
                >
                  <MapBox marker={marker} setMarker={setMarker} />
                </Modal>
                <div
                  onClick={showModal}
                  className="px-3 cursor-pointer hover:opacity-80 py-2 mt-3 rounded-lg border inline-block border-[#515151]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                  >
                    <path
                      d="M1 7.92285C1 12.7747 5.24448 16.7869 7.12319 18.3252C7.39206 18.5454 7.52811 18.6568 7.72871 18.7132C7.88491 18.7572 8.1148 18.7572 8.271 18.7132C8.47197 18.6567 8.60707 18.5463 8.87695 18.3254C10.7557 16.7871 14.9999 12.7751 14.9999 7.9233C14.9999 6.08718 14.2625 4.32605 12.9497 3.02772C11.637 1.72939 9.8566 1 8.00008 1C6.14357 1 4.36301 1.7295 3.05025 3.02783C1.7375 4.32616 1 6.08674 1 7.92285Z"
                      stroke="#3BA769"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 7C6 8.10457 6.89543 9 8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7Z"
                      stroke="#3BA769"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <Form.Item
                  name="address"
                  className=""
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                  <Input hidden />
                </Form.Item>
                {address && <p className="">Địa chỉ: {address}</p>}
              </div>
            </div>
            <div className="my-4">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-red-500 inline-block text-lg">*</span>
                <div className="text-base font-medium text-primary-color">
                  Số điện thoại
                </div>
                <div className="w-20 h-[0.07rem] bg-primary-color"></div>
              </div>
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input
                  type="number"
                  className={`border-[0.1rem] text-base outline-primary-color px-4 py-2 w-full rounded-lg duration-300 no-spinner ${
                    errorPhone !== "" ? "border-red-500" : "border-stone-300"
                  }`}
                  maxLength={10}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.slice(0, 10);
                  }}
                  placeholder="Nhập số điện thoại"
                />
              </Form.Item>
            </div>
            <div className="my-4">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-red-500 inline-block text-lg">*</span>
                <div className="text-base font-medium text-primary-color">
                  Kĩ năng
                </div>
                <div className="w-20 h-[0.07rem] bg-primary-color"></div>
              </div>
              <Form.Item
                name="skill"
                rules={[
                  { required: true, message: "Vui lòng nhập kỹ năng của bạn!" },
                ]}
              >
                <Input.TextArea
                  className={`border-[0.1rem] text-base outline-primary-color px-4 py-2 w-full rounded-lg duration-300 ${
                    errorSkill !== "" ? "border-red-500" : "border-stone-300"
                  }`}
                  placeholder="Nhập kỹ năng của bạn..."
                  autoSize={{ minRows: 3, maxRows: 10 }}
                />
              </Form.Item>
            </div>
            <div className="my-4">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-red-500 inline-block text-lg">*</span>
                <div className="text-base font-medium text-primary-color">
                  Lĩnh vực
                </div>
                <div className="w-20 h-[0.07rem] bg-primary-color"></div>
              </div>
              <div
                className={`bg-stone-100 border-[0.05rem] rounded-md  ${
                  errorField ? "border-red-500" : "border-primary-color"
                } overflow-hidden cursor-pointer px-4 py-2 lg:w-1/2`}
              >
                {listFieldState?.map((item, index) => (
                  <div
                    key={index}
                    className="px-1 py-1 flex items-center justify-between gap-1 hover:bg-stone-200 duration-150 hover:rounded-md select-none"
                  >
                    <div>{item.name}</div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="hidden peer"
                        checked={listSelectedField.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setListSelectedField([
                              ...listSelectedField,
                              item.id,
                            ]); // Thêm vào danh sách
                          } else {
                            setListSelectedField(
                              listSelectedField.filter((id) => id !== item.id)
                            ); // Xóa khỏi danh sách
                          }
                        }}
                      />
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:bg-primary-color peer-checked:border-primary-color"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </Form>
          {/* </form> */}
        </div>
        <div className="flex gap-2 items-center mb-4">
          <div
            onClick={() => formRef.current?.submit()}
            className="bg-white text-primary-color border-primary-color border-2 py-2 px-4 rounded-md cursor-pointer hover:scale-105 duration-300"
          >
            Lưu hồ sơ
          </div>
          {checkProfile && (
            <div
              onClick={handleChangePublic}
              className="bg-primary-color text-white py-2 px-4 rounded-md cursor-pointer hover:scale-105 duration-300"
            >
              {isPublish ? "Hủy xuất bản hồ sơ" : "Xuất bản hồ sơ"}
            </div>
          )}
        </div>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#3BA769",
                headerColor: "white",
              },
              Pagination: {
                itemActiveBg: "#3BA769",
                colorPrimary: "white",
                colorPrimaryHover: "white",
                colorPrimaryBorder: "white",
              },
            },
          }}
        >
          {openModal && (
            <Modal
              title="Xác nhận"
              open={true}
              onOk={handleOk}
              onCancel={closeModal}
            >
              {!isPublish && (
                <>
                  <p>Hành động này đang cố gắng xuất bản hồ sơ của bạn.</p>
                  <p>
                    Khi xuất bản, hồ sơ của bạn sẽ được hiển thị với các tổ chức
                    khác, bạn có thể tương tác với các sự kiện và đồng thời bạn
                    sẽ nhận được các sự kiện gợi ý.
                  </p>
                  <p> Bạn có chắc chắn muốn thực hiện không?</p>
                </>
              )}
              {isPublish && (
                <>
                  <p>Hành động này đang cố gắng hủy xuất bản hồ sơ của bạn.</p>
                  <p>
                    Khi hủy xuất bản, hồ sơ của bạn sẽ không được hiển thị với
                    các tổ chức khác, bạn không thể tương tác với các sự kiện và
                    đồng thời bạn sẽ không nhận được các sự kiện gợi ý.
                  </p>
                  <p> Bạn có chắc chắn muốn thực hiện không?</p>
                </>
              )}
            </Modal>
          )}
        </ConfigProvider>
      </div>
    </div>
  );
};

export default MyProfile;
