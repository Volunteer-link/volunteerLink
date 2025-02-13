import { FaUser } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";
import { TiMinus } from "react-icons/ti";
const SideBar: React.FC<{
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ mode, setMode }) => {
  const [showSub, setShowSub] = useState(false);
  const handleChangeMode = (mode: string) => {
    setMode(mode);
    if (mode === "create" || mode === "change") {
      setShowSub(true);
    } else {
      setShowSub(false);
    }
  };

  return (
    <div className="bg-primary-color hidden lg:min-h-screen lg:block lg:p-10 lg:w-72 select-none">
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
          onClick={() => handleChangeMode("create")}
          className="my-6 hover:scale-110 transition-all cursor-pointer origin-left hover:opacity-90 flex items-center gap-2"
        >
          {mode === "request" && <FaChevronRight />}
          <IoDocumentText />
          Thông tin tổ chức
        </div>
        {showSub && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={
              showSub
                ? { maxHeight: 200, opacity: 1 }
                : { maxHeight: 0, opacity: 0 }
            }
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-6 text-sm">
              <div
                onClick={() => handleChangeMode("create")}
                className="mb-4 hover:scale-105 transition-all cursor-pointer hover:opacity-90 flex items-center gap-2"
              >
                {(mode === "create" || mode === "detailCreate") && <TiMinus />}
                Yêu cầu tạo tài khoản
              </div>
              <div
                onClick={() => handleChangeMode("change")}
                className="my-4 hover:scale-105 transition-all cursor-pointer hover:opacity-90 flex items-center gap-2"
              >
                {mode === "change" && <TiMinus />}
                Yêu cầu đổi tên
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
