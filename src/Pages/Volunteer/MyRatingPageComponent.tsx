import { ConfigProvider, Dropdown, message, Modal, Rate } from "antd";
import { MyRatingType } from "../../model/ShowEventModel/MyRatingType";
import { SlOptions } from "react-icons/sl";
import { MenuProps } from "antd/lib";
import { useRef, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import api from "../../apiService/useFetch";

const MyRatingPageComponent: React.FC<{
  listRating: MyRatingType[];
  index: number;
  object: MyRatingType;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResetKey: React.Dispatch<React.SetStateAction<number>>;
}> = ({ listRating, index, object, setIsLoading, setResetKey }) => {
  const [valueRate, setValueRate] = useState<number>(object.star);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openRemove, setOpenRemove] = useState<boolean>(false);
  const textAreaRefUpdate = useRef<any>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const items: MenuProps["items"] = [
    {
      label: <div onClick={(e) => handleClickUpdate(e)}>Cập nhật đánh giá</div>,
      key: "0",
    },
    {
      label: <div onClick={(e) => handleClickRemove(e)}>Xóa đánh giá</div>,
      key: "1",
    },
  ];
  const handleClickEvent = (eventId: number) => {
    window.open(`/detail-event/${eventId}`, "_blank");
  };

  const handleClickUpdate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenUpdate(true);
  };

  const handleCloseViewRated = () => {
    setOpenUpdate(false);
  };

  const handleUpdateRating = async (idFeed: number) => {
    try {
      const { data } = await api.put(`/feedback/update-feedback-event`, {
        feedbackId: idFeed,
        star: valueRate,
        feedback:
          textAreaRefUpdate.current?.resizableTextArea?.textArea.value || "",
      });
      messageApi.success("Cập nhật đánh giá sự kiện thành công!");
      setTimeout(() => {
        setIsLoading(false);
        setOpenUpdate(false);
        setResetKey((prev) => ++prev);
      }, 1000);
    } catch (error: any) {
      if (error.response.data.Message === "Update feedback time is over") {
        messageApi.error("Quá hạn cập nhật đánh giá!");
      }
    } finally {
    }
  };

  const handleClickRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenRemove(true);
  };

  const handleCloseRemove = () => {
    setOpenRemove(false);
  };

  const handleRemoveRating = async (idFeed: number) => {
    try {
      const { data } = await api.delete(`/feedback/remove-feedback-event`, {
        params: { feedbackId: idFeed },
      });
    } catch (error: any) {
    } finally {
      messageApi.success("Xóa đánh giá sự kiện thành công!");
      setTimeout(() => {
        setIsLoading(false);
        setOpenRemove(false);
        setResetKey((prev) => ++prev);
      }, 1000);
    }
  };

  const handleRating = (value: number) => {
    setValueRate(value);
  };
  return (
    <>
      {contextHolder}
      <div
        className={`relative p-2 flex items-center gap-4 select-none hover:bg-stone-200 rounded-md transition-all ${
          index !== listRating.length - 1 ? "mb-6" : ""
        } `}
      >
        <div className="flex-1">
          <div>Sự kiện: {object.eventName}</div>
          <div>
            <ConfigProvider
              theme={{
                components: {
                  Rate: {
                    starSize: 14,
                  },
                },
              }}
            >
              <Rate disabled value={object.star} />
            </ConfigProvider>
          </div>
          <div className="mb-2">{object.feedback}</div>
          <div className="text-stone-500">
            {new Date(object.time).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </div>
        </div>
        <div
          onClick={() => handleClickEvent(object.eventId)}
          className="hover:scale-105 transition-all cursor-pointer bg-primary-color"
        >
          <img
            src={object.thumbnail}
            className="w-32 h-16 bg-primary-color shadow-xl object-contain"
            alt=""
            onError={(e) =>
              (e.currentTarget.src = "/materials/placeholder-image.jpg")
            }
          />
        </div>
        <Dropdown
          menu={{ items }}
          trigger={["hover"]}
          placement="bottomRight"
          getPopupContainer={(trigger) =>
            trigger.parentElement || document.body
          }
        >
          <div className="absolute right-1 top-0 z-10 rounded-full p-1">
            <SlOptions className="text-lg text-primary-color hover:cursor-pointer cursor-pointer scale-105" />
          </div>
        </Dropdown>
        <Modal
          title="Xem đánh giá"
          open={openUpdate}
          onOk={() => handleUpdateRating(object.id)}
          onCancel={handleCloseViewRated}
          okText="Cập nhật"
        >
          <Rate defaultValue={object.star} onChange={handleRating} />
          <TextArea
            className="w-96 my-4"
            size="small"
            maxLength={1000}
            placeholder="Bình luận tối đa 1000 kí tự"
            showCount
            defaultValue={object.feedback}
            ref={textAreaRefUpdate}
          />
        </Modal>
        <Modal
          title="Cảnh báo"
          open={openRemove}
          onOk={() => handleRemoveRating(object.id)}
          onCancel={handleCloseRemove}
          okText="Xóa đánh giá"
        >
          <span>Bạn có chắc muốn xóa đánh giá này không?</span>
        </Modal>
      </div>
    </>
  );
};

export default MyRatingPageComponent;
