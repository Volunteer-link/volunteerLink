import { FaMagnifyingGlass } from "react-icons/fa6";
const SearchComponent: React.FC<{ placeHolder: string; className: string }> = ({
  placeHolder,
  className,
}) => {
  return (
    <div className={`${className} flex`}>
      <div>
        <input
          type="text"
          className="border-[0.0625rem] border-l-stone-500 border-t-stone-500 border-b-stone-500 py-1 px-4 outline-none text-base rounded-l-lg"
          placeholder={placeHolder}
        />
      </div>
      <div className="bg-primary-color px-6 text-base cursor-pointer hover:opacity-90 text-white flex rounded-r-lg items-center justify-center">
        <FaMagnifyingGlass />
      </div>
    </div>
  );
};

export default SearchComponent;
