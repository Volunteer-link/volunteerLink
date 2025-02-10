import { useState } from "react";
import SideBar from "./SideBar";
import AccountComponent from "./AccountComponent";

const AdminMain = () => {
  const [mode, setMode] = useState<string>("account");
  return (
    <div className="lg:flex">
      <SideBar mode={mode} setMode={setMode} />
      {mode === "account" && <AccountComponent />}
    </div>
  );
};

export default AdminMain;
