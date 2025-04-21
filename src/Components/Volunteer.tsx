import React, { useRef, useState } from "react";
import { Button, message, Modal, Rate } from "antd";
import { volunteerProps } from "../model/ShowEventModel/volunteerProps";
import SmallLoading from "../Pages/Components/SmallLoading";
import api from "../apiService/useFetch";
import { useNavigate } from "react-router-dom";
import { decodedCookie, getCookie } from "../ultils/cookie";
import TextArea from "antd/es/input/TextArea";

const Volunteer: React.FC<{
  objectVolunteer: volunteerProps;
  setResetState?: React.Dispatch<React.SetStateAction<number>>;
  setResetStateAll?: React.Dispatch<React.SetStateAction<number>>;
  eventId?: number;
  checkDateDelete?: boolean;
  checkDateRate?: boolean;
}> = ({
  objectVolunteer,
  setResetState,
  setResetStateAll,
  eventId,
  checkDateDelete,
  checkDateRate,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();

  const user = decodedCookie(getCookie("accessToken"));

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalRating, setOpenModalRating] = useState<boolean>(false);
  const [openModalViewRated, setOpenModalViewRated] = useState<boolean>(false);
  const [ratingValue, setRatingValue] = useState<number>(
    objectVolunteer.feedback?.star || 0
  );
  const [displayName, setDisplayName] = useState<string>("");
  const textAreaRef = useRef<any>(null);
  const textAreaRefUpdate = useRef<any>(null);

  const calculateAge = (birthDate: Date | string): number => {
    const currentDate = new Date();
    const birth = new Date(birthDate);

    let age = currentDate.getFullYear() - birth.getFullYear();
    const monthDiff = currentDate.getMonth() - birth.getMonth();

    // Kiểm tra nếu ngày tháng hiện tại chưa đến ngày sinh trong năm
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleClickName = () => {
    window.open(`/volunteerProfile/${objectVolunteer.accountId}`);
  };

  const handleClickBtn = async (type: string) => {
    try {
      setIsLoading(true);

      const { data } = await api.post(`/event/handle-request`, {
        requestId: objectVolunteer.requestId,
        accept: type === "yes" ? true : false,
      });

      messageApi.success(
        type === "yes"
          ? "Yêu cầu của tình nguyện viên đã được chấp nhận!"
          : "Yêu cầu của tình nguyện viên đã bị từ chối!"
      );
      setTimeout(() => {
        if (setResetState) {
          setIsLoading(false);
          setResetState((prev) => ++prev);
        }
        if (setResetStateAll) {
          setIsLoading(false);
          setResetStateAll((prev) => ++prev);
        }
      }, 1000);
    } catch (e: any) {
      console.log(e);

      if (
        e.response.data.Message ===
        "Event has to start after 0.5 days to adding more people or this event has not been published"
      ) {
        messageApi.error(
          "Không thể xử lý yêu cầu vì sự kiện còn chưa đầy 12 tiếng nữa sẽ diễn ra hoặc sự kiện này chưa được công bố!"
        );
      }

      if (e.response.data.Message === "Request is not exist") {
        messageApi.error("Yêu cầu tham gia không tồn tại!");
        setTimeout(() => {
          if (setResetState) {
            setIsLoading(false);
            setResetState((prev) => ++prev);
          }
          if (setResetStateAll) {
            setIsLoading(false);
            setResetStateAll((prev) => ++prev);
          }
        }, 1000);
      }
      setIsLoading(false);
    } finally {
    }
  };

  const handleClickInvite = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/event/invite-volunteer`, {
        eventId: eventId,
        volunteerId: objectVolunteer.id,
      });

      messageApi.success("Lời mời của bạn đã được gửi!");
      setTimeout(() => {
        if (setResetState) {
          setResetState((prev) => ++prev);
        }
        if (setResetStateAll) {
          setIsLoading(false);
          setResetStateAll((prev) => ++prev);
        }
        setIsLoading(false);
      }, 1000);
    } catch (e: any) {
      if (
        e.response.data.Message ===
        "Start time has to greater than now 1 day to invite anyone or this event has not been published"
      ) {
        messageApi.error(
          "Không thể mời tình nguyện viên vì sự kiện còn chưa đầy 24 tiếng nữa sẽ diễn ra hoặc sự kiện này chưa được công bố!"
        );
      }
      setIsLoading(false);
    } finally {
    }
  };

  const handleRemoveVolunteer = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.delete(`/event/remove-volunteer`, {
        data: {
          idRecord: objectVolunteer.id,
        },
      });
      messageApi.success("Tình nguyện viên đã bị xóa khỏi sự kiện!");
    } catch (e: any) {
      if (
        e.response.data.Message ===
        "Event will start after 1 day or this event has not been published. Can't remove volunteer."
      ) {
        messageApi.error(
          "Không thể xóa tình nguyện viên vì sự kiện còn chưa đầy 24 tiếng nữa sẽ diễn ra!"
        );
      }
      setIsLoading(false);
    } finally {
      setTimeout(() => {
        if (setResetState) {
          setResetState((prev) => ++prev);
        }
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenRating = (name?: string) => {
    setOpenModalRating(true);
    if (name) {
      setDisplayName(name);
    }
  };

  const handleCloseRating = () => {
    setOpenModalRating(false);
  };

  const handleOpenViewRated = () => {
    setOpenModalViewRated(true);
  };

  const handleCloseViewRated = () => {
    setOpenModalViewRated(false);
  };

  const handleRating = (value: number) => {
    setRatingValue(value);
  };

  const handleRatingVolunteer = async () => {
    if (ratingValue === 0) {
      messageApi.error("Vui lòng đánh giá số sao trước khi gửi nhận xét!");
    } else {
      try {
        const { data } = await api.post(
          `/feedback/feedback-volunteer-of-organization`,
          {
            volunteerId: objectVolunteer.volunteerId,
            eventId: eventId,
            star: ratingValue,
            feedback:
              textAreaRef.current?.resizableTextArea?.textArea.value || "",
          }
        );
        messageApi.success("Đánh giá tình nguyện viên thành công!");
        setTimeout(() => {
          if (setResetState) {
            setResetState((prev) => ++prev);
          }
          setIsLoading(false);
          setOpenModalRating(false);
        }, 1000);
      } catch (e: any) {
        if (e.response.data.Message === "Feedback time is over") {
          messageApi.error("Quá hạn đánh giá tình nguyện viên!");
        }
      } finally {
      }
    }
  };

  const handleUpdateRating = async () => {
    try {
      const { data } = await api.put(`/feedback/update-feedback-volunteer`, {
        feedbackId: objectVolunteer.feedback?.id,
        star: ratingValue,
        feedback:
          textAreaRefUpdate.current?.resizableTextArea?.textArea.value || "",
      });
      messageApi.success("Cập nhật đánh giá tình nguyện viên thành công!");
      setTimeout(() => {
        setIsLoading(false);
        setOpenModalViewRated(false);
      }, 1000);
    } catch (e: any) {
      if (e.response.data.Message === "Update feedback time is over") {
        messageApi.error("Quá hạn cập nhật đánh giá!");
      }
    } finally {
    }
  };

  return (
    <div className="bg-white px-14 select-none hover:scale-105 transition-all w-4/5 mx-auto flex justify-between items-center border-2 border-[#3BA769] rounded-2xl my-4 py-4 shadow-md">
      {contextHolder}
      <div className="flex gap-8 items-center">
        <div className="relative rounded-full overflow-hidden">
          {isLoading && <SmallLoading size="small" />}
          <img
            src={objectVolunteer.pictureProfile}
            // src={objectVolunteer.image || objectVolunteer.pictureProfile}
            alt=""
            className="w-20 h-20 rounded-full object-cover bg-primary-color"
            onLoad={() => setIsLoading(false)}
            onError={(e) =>
              (e.currentTarget.src =
                "/materials/blank-profile-picture-973460_1280.png")
            }
          />
        </div>
        <div className="flex text-[#3BA769] leading-none gap-2 flex-col">
          <span
            onClick={handleClickName}
            className="text-[20px] cursor-pointer transition-all max-w-60 truncate"
          >
            {objectVolunteer.name}
          </span>
          <span className="text-[14px] font-medium text-stone-700">
            {objectVolunteer.dob
              ? `${calculateAge(new Date(objectVolunteer.dob))} tuổi`
              : ""}
          </span>
          <span className="text-[14px] font-medium text-stone-700 max-w-60 truncate">
            {objectVolunteer.address}
          </span>
        </div>
      </div>

      {objectVolunteer.volunteerDisplayType === "SUGGESTION" && (
        <Button onClick={handleClickInvite} size="large" type="primary">
          Mời tham gia
        </Button>
      )}
      {objectVolunteer.volunteerDisplayType === "REQUEST" && (
        <div className="flex justify-center gap-2 items-start">
          <Button
            onClick={() => handleClickBtn("yes")}
            size="large"
            type="primary"
          >
            Chấp nhận
          </Button>
          <Button
            onClick={() => handleClickBtn("no")}
            size="large"
            type="default"
          >
            Từ chối
          </Button>
        </div>
      )}
      {user?.role === "Organization" &&
        objectVolunteer.volunteerDisplayType === "PARTICIPATED" &&
        checkDateDelete && (
          <Button onClick={handleOpenModal} size="large" type="primary">
            Xóa tình nguyện viên
          </Button>
        )}
      {user?.role === "Organization" &&
        checkDateRate &&
        !objectVolunteer.feedback && (
          <Button
            onClick={() => handleOpenRating(objectVolunteer?.name)}
            size="large"
            type="primary"
          >
            Đánh giá tình nguyện viên
          </Button>
        )}
      {user?.role === "Organization" &&
        checkDateRate &&
        objectVolunteer.feedback && (
          <Button onClick={handleOpenViewRated} size="large" type="primary">
            Xem đánh giá
          </Button>
        )}
      <Modal
        title="Thông báo"
        open={openModal}
        onOk={handleRemoveVolunteer}
        onCancel={handleCloseModal}
      >
        <p>Bạn có chắc muốn xóa tình nguyện viên này không?</p>
        <p>
          Nếu muốn họ tham gia sự kiện, bạn sẽ phải gửi lại lời mời tham gia
        </p>
      </Modal>
      <Modal
        title={`Đánh giá tình nguyện viên ${displayName}`}
        open={openModalRating}
        onOk={handleRatingVolunteer}
        onCancel={handleCloseRating}
      >
        <Rate onChange={handleRating} />
        <TextArea
          className="w-96 my-4"
          size="small"
          maxLength={1000}
          placeholder="Bình luận tối đa 1000 kí tự"
          showCount
          ref={textAreaRef}
        />
      </Modal>
      <Modal
        title="Xem đánh giá"
        open={openModalViewRated}
        onOk={handleUpdateRating}
        onCancel={handleCloseViewRated}
        okText="Cập nhật"
      >
        <Rate
          defaultValue={objectVolunteer.feedback?.star}
          onChange={handleRating}
        />
        <TextArea
          className="w-96 my-4"
          size="small"
          maxLength={1000}
          placeholder="Bình luận tối đa 1000 kí tự"
          showCount
          defaultValue={objectVolunteer.feedback?.feedback}
          ref={textAreaRefUpdate}
        />
      </Modal>
    </div>
  );
};

export default Volunteer;
