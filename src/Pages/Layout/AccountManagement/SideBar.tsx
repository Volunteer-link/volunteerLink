import { FaUser } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";
const SideBar: React.FC<{
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ mode, setMode }) => {
  const handleChangeMode = (mode: string) => {
    setMode(mode);
  };
  return (
    <div className="bg-primary-color hidden lg:h-screen lg:block lg:p-10">
      <div className="text-base text-white text-shadow-lg">
        <div
          onClick={() => handleChangeMode("account")}
          className="my-6 hover:scale-110 transition-all cursor-pointer origin-left hover:opacity-90 flex items-center gap-2"
        >
          {mode === "account" && <FaChevronRight />}
          <FaUser />
          Quản lý tài khoản
        </div>
        <div
          onClick={() => handleChangeMode("finance")}
          className="my-6 hover:scale-110 transition-all cursor-pointer origin-left hover:opacity-90 flex items-center gap-2"
        >
          {mode === "finance" && <FaChevronRight />}
          <MdAttachMoney className="" />
          Quản lý tài chính
        </div>
        <div
          onClick={() => handleChangeMode("request")}
          className="my-6 hover:scale-110 transition-all cursor-pointer origin-left hover:opacity-90 flex items-center gap-2"
        >
          {mode === "request" && <FaChevronRight />}
          <IoDocumentText />
          Thông tin tổ chức
        </div>
      </div>
    </div>
  );
};

export default SideBar;
