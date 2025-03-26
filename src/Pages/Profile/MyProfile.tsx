import {
  Button,
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
import { data } from "react-router-dom";
import uploadFilesToFirebase from "../../ultils/uploadFilesToFirebase";
dayjs.extend(utc);

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
  const [errCode, setErrCode] = useState<number>(0);

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
  const [errorAddress, setErrorAddress] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [errorField, setErrorField] = useState<boolean>(false);
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [updateState, setUpdateState] = useState<number>(0);
  const [addressState, setAddressState] = useState<string[]>([]);
  const [checkProfile, setCheckProfile] = useState<boolean>(true);

  const [checkLoadDistrict, setCheckLoadDistrict] = useState<boolean>(false);

  const [listProvinces, setListProvinces] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [listDistrict, setListDistrict] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [listWard, setListWard] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [listFieldState, setListFieldState] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [listSelectedField, setListSelectedField] = useState<number[]>([]);

  // const listField = [
  //   "Email",
  //   "Họ và tên",
  //   "Ngày sinh",
  //   "Giới tính",
  //   "Địa chỉ",
  //   "Vị trí",
  //   "Số điện thoại",
  //   "Kĩ năng",
  //   "Lĩnh vực quan tâm",
  // ];

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    setupInterceptors(setErrCode);
  }, []);

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

  console.log(isPublish);

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
  }, []);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const data = await axios.get(
          "https://open.oapi.vn/location/provinces?page=0&size=1000"
        );
        setListProvinces(data.data.data);
      } catch (e: any) {
      } finally {
      }
    };

    const fetchField = async () => {
      try {
        const { data } = await api.get(`/common/get-fields`);
        setListFieldState(data.data);
      } catch (e: any) {
      } finally {
      }
    };

    fetchProvince();
    fetchField();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/profile`);

        const data = res.data.data;

        setProfileState((prev) => ({
          ...(prev ?? {}),
          ...data,
          dateOfBirth: new Date(data.dateOfBirth),
        }));

        setRadioState(data.sex);
        const selectedFields: number[] = (data?.fields ?? []).map(
          (item: any, index: number) => item.id
        );

        setListSelectedField(selectedFields);

        setAddressState(data.address.split(", "));

        handleAvt(data.urlImage);
      } catch (err: any) {
      } finally {
      }
    };

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

  const fetchDistrict = async (idProvince: number) => {
    try {
      const data = await axios.get(
        `https://open.oapi.vn/location/districts/${idProvince}?page=0&size=1000`
      );
      setListDistrict(data.data.data);
      setCheckLoadDistrict(true);
    } catch (e: any) {
    } finally {
    }
  };

  const fetchWard = async (idProvince: number) => {
    try {
      const data = await axios.get(
        `https://open.oapi.vn/location/wards/${idProvince}?page=0&size=1000`
      );
      setListWard(data.data.data);
    } catch (e: any) {
    } finally {
    }
  };

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
          const address = `${values.ward}, ${values.district}, ${values.province}`;
          Object.assign(values, { address });
          let location = await getCoordinates(address); // Gọi hàm lấy tọa độ
          console.log(location);

          if (location) {
            Object.assign(values, {
              location: `${location.lat};${location.lon}`,
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

  const handleSelectProvinces = (value: string, option: any) => {
    fetchDistrict(Number(option.id));
  };

  const handleSelectDistricts = (value: string, option: any) => {
    fetchWard(Number(option.id));
  };

  const getCoordinates = async (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    let newArray = newFileList as Array<UploadFile>;
    setListFile([newArray[1]]);
  };

  const publicProfile = async (value: boolean) => {
    try {
      const { data } = await api.put(`/profile/volunteer-publish`, {
        status: value,
      });
      console.log(data);
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleChangePublic = () => {
    setOpenModal(true);
  };

  const handleOk = async () => {
    console.log(isPublish);
    await publicProfile(!isPublish);
    console.log(isPublish);
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

  return (
    <div className="container mx-auto py-4 px-12 relative">
      {isLoading && <Loading color="green" />}
      <ErrorCards errCode={errCode} />
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
              <Form.Item
                name="name"
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
              <div className="text-base font-medium text-primary-color my-4">
                Tỉnh/Thành phố
              </div>

              <Form.Item
                name="province"
                rules={[
                  { required: true, message: "Vui lòng chọn tỉnh/thành phố!" },
                ]}
              >
                <Select
                  style={{ width: 300 }}
                  onChange={(value, option) =>
                    handleSelectProvinces(value, option)
                  }
                  options={[
                    ...listProvinces.map((province) => ({
                      value: province.name,
                      label: province.name,
                      id: province.id,
                    })),
                  ]}
                  placeholder="Chọn tỉnh/thành phố"
                />
              </Form.Item>

              <div className="text-base font-medium text-primary-color my-4">
                Quận/Huyện
              </div>

              <Form.Item
                name="district"
                rules={[
                  { required: true, message: "Vui lòng chọn quận/huyện!" },
                ]}
              >
                <Select
                  disabled={!checkLoadDistrict}
                  style={{ width: 300 }}
                  onChange={handleSelectDistricts}
                  options={[
                    ...listDistrict.map((district) => ({
                      value: district.name,
                      label: district.name,
                      id: district.id,
                    })),
                  ]}
                  placeholder="Chọn quận/huyện"
                />
              </Form.Item>

              <div className="text-base font-medium text-primary-color my-4">
                Phường/Xã
              </div>
              <Form.Item
                name="ward"
                rules={[
                  { required: true, message: "Vui lòng chọn phường/xã!" },
                ]}
              >
                <Select
                  disabled={!checkLoadDistrict}
                  style={{ width: 300 }}
                  options={[
                    ...listWard.map((ward) => ({
                      value: ward.name,
                      label: ward.name,
                      id: ward.id,
                    })),
                  ]}
                  placeholder="Chọn phường/xã"
                />
              </Form.Item>
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
                    pattern: /^[0-9]{10,15}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input
                  type="number"
                  className={`border-[0.1rem] text-base outline-primary-color px-4 py-2 w-full rounded-lg duration-300 no-spinner ${
                    errorPhone !== "" ? "border-red-500" : "border-stone-300"
                  }`}
                  maxLength={15}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.slice(0, 15);
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
                {listFieldState.map((item, index) => (
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
                    khác, đồng thời bạn cũng có thể tương tác với các sự kiện.
                  </p>
                  <p> Bạn có chắc chắn muốn thực hiện không?</p>
                </>
              )}
              {isPublish && (
                <>
                  <p>Hành động này đang cố gắng hủy xuất bản hồ sơ của bạn.</p>
                  <p>
                    Khi hủy xuất bản, hồ sơ của bạn sẽ không được hiển thị với
                    các tổ chức khác, đồng thời bạn cũng không thể tương tác với
                    các sự kiện.
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
