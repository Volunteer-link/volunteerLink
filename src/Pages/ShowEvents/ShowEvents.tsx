import { IoLocation } from "react-icons/io5";
const ShowEvent = () => {
  return (
    <div>
      <div className="w-full relative">
        <img
          src="/materials/image 4.png"
          alt=""
          className="w-full scale-110 mb-4 h-56 object-cover"
        />
        <div className="lg:w-[36rem] w-full bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-between">
          <input
            type="text"
            placeholder="Tên sự kiện..."
            className="w-3/4 outline-none p-3 rounded-full relative text-base"
          />
          <div className="flex pr-2 items-center gap-4 ">
            <IoLocation className="text-2xl text-primary-color" />
            <div className="bg-primary-color text-white px-4 py-2 text-sm rounded-3xl">
              Tìm kiếm
            </div>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-8 px-4 mb-4">
        <div></div>
        <div className="bg-red-400 col-span-2">
          <div className="inline-block mr-1 text-sm">Kết quả:</div>
          <div className="inline-block text-base font-medium text-primary-color">
            4 sự kiện
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-8 px-4">abc</div>
    </div>
  );
};

export default ShowEvent;
