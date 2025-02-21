import { useState } from "react";
import SideBar from "./SideBar";
import AccountComponent from "./AccountComponent";
import FinanceComponent from "./FinanceComponent";
import CreateRequestComponent from "./CreateRequestComponent";
import DetailCreateRequestComponent from "./DetailCreateRequestComponent";
import ChangeRequestComponent from "./ChangeRequestComponent";

const AdminMain = () => {
  const [mode, setMode] = useState<string>("account");
  const [idDetailRequest, setIdDetailRequest] = useState<number>(0);

  return (
    <div className="lg:flex relative">
      <SideBar mode={mode} setMode={setMode} />
      {mode === "account" && <AccountComponent />}
      {mode === "finance" && <FinanceComponent />}
      {mode === "create" && (
        <CreateRequestComponent
          setMode={setMode}
          setIdDetailRequest={setIdDetailRequest}
        />
      )}
      {mode === "change" && <ChangeRequestComponent setMode={setMode} />}
      {mode === "detailCreate" && (
        <DetailCreateRequestComponent
          setMode={setMode}
          idDetailRequest={idDetailRequest}
        />
      )}
    </div>
  );
};

export default AdminMain;
