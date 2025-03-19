import { FaMagnifyingGlass } from "react-icons/fa6";
const SearchComponent: React.FC<{
  placeHolder?: string;
  className?: string;
  setValueSearch?: React.Dispatch<React.SetStateAction<string>>;
  setPageNumber?: React.Dispatch<React.SetStateAction<number>>;
}> = ({ placeHolder, className, setValueSearch, setPageNumber }) => {
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(setPageNumber){
      setPageNumber(1);

    }
    if(setValueSearch){
      setValueSearch(event.target.value);

    }
  };
  return (
    <div className={`${className} flex`}>
      <div className="bg-primary-color px-6 text-base text-white flex rounded-l-lg items-center justify-center">
        <FaMagnifyingGlass />
      </div>
      <div>
        <input
          type="text"
          className="border-[0.0625rem] border-r-stone-500 border-t-stone-500 border-b-stone-500 py-1 px-4 outline-none text-base rounded-r-lg"
          placeholder={placeHolder}
          onChange={handleChangeInput}
        />
      </div>
    </div>
  );
};

export default SearchComponent;
