import { useState } from "react";
import SideBar from "./SideBar";
import AccountComponent from "./AccountComponent";
import FinanceComponent from "./FinanceComponent";
import CreateRequestComponent from "./CreateRequestComponent";
import DetailCreateRequestComponent from "./DetailCreateRequestComponent";
import ChangeRequestComponent from "./ChangeRequestComponent";

const AdminMain = () => {
  const [mode, setMode] = useState<string>("account");

  return (
    <div className="lg:flex relative">
      <SideBar mode={mode} setMode={setMode} />
      {mode === "account" && <AccountComponent />}
      {mode === "finance" && <FinanceComponent />}
      {mode === "create" && <CreateRequestComponent setMode={setMode} />}
      {mode === "change" && <ChangeRequestComponent setMode={setMode} />}
      {mode === "detailCreate" && (
        <DetailCreateRequestComponent setMode={setMode} />
      )}
    </div>
  );
};

export default AdminMain;
