import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import api from "../../apiService/useFetch";

const Bill = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const amount = queryParams.get("vnp_Amount");
  const orderInfo = queryParams.get("vnp_OrderInfo");
  const responseCode = queryParams.get("vnp_ResponseCode");

  const [eventName, setEventName] = useState<string>("");
  const orderInfoDecoded = orderInfo ? JSON.parse(atob(orderInfo)) : null;

  console.log(amount);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(
          `/common/get-event-infomation?eventId=${orderInfoDecoded?.EventId.toString()}`
        );

        setEventName(data.data.name);

        if (responseCode) {
          throw new Error("Có lỗi giao dịch");
        }
      } catch (e: any) {
        console.log(e);
      } finally {
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-center my-8">
        <FaCheckCircle className=" text-primary-color text-9xl" />
      </div>
      <div className="text-xl">
        <div className="text-center">
          Bạn đã ủng hộ thành công{" "}
          <span className="text-primary-color">
            {new Intl.NumberFormat("vi-VN").format(Number(amount) / 100)} VND
          </span>{" "}
          cho sự kiện
        </div>
        <div className="text-center text-primary-color mt-2 mb-8">
          {eventName}
        </div>
        <div className="text-center text-base mt-2">
          Cảm ơn bạn đã ủng hộ cho sự kiện! 🤗😘🥰
        </div>
      </div>
    </div>
  );
};

export default Bill;
