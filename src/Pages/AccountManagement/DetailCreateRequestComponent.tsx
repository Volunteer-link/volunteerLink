const DetailCreateRequestComponent: React.FC<{
  setMode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setMode }) => {
  const handleChangeMode = () => {
    setMode("create");
  };
  return (
    <div className="p-12 lg:flex-1">
      <div
        onClick={handleChangeMode}
        className="text-sm mb-4 cursor-pointer hover:opacity-100 opacity-80"
      >
        Yêu cầu tạo tài khoản
      </div>
      <div className="text-2xl mb-4 lg:mb-0">
        Đội sinh viên tình nguyện ĐH Bách Khoa
      </div>
    </div>
  );
};

export default DetailCreateRequestComponent;
