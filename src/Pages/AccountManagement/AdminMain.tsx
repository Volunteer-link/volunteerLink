import { Layout } from 'antd';
import { useState } from 'react';
import SideBar from './SideBar';
import AccountComponent from './AccountComponent';
import FinanceComponent from './FinanceComponent';
import CreateRequestComponent from './CreateRequestComponent';
import ChangeRequestComponent from './ChangeRequestComponent';
import DetailCreateRequestComponent from './DetailCreateRequestComponent';
const { Content } = Layout;

const AdminMain = () => {
  const [mode, setMode] = useState<string>('account');
  const [idDetailRequest, setIdDetailRequest] = useState<number>(0);

  return (
    <Layout className="min-h-screen">
      <SideBar mode={mode} setMode={setMode} />

      <Content className="p-6 flex-1">
        {mode === 'account' && <AccountComponent />}
        {mode === 'finance' && <FinanceComponent />}
        {mode === 'create' && (
          <CreateRequestComponent
            setMode={setMode}
            setIdDetailRequest={setIdDetailRequest}
          />
        )}
        {mode === 'change' && <ChangeRequestComponent setMode={setMode} />}
        {mode === 'detailCreate' && (
          <DetailCreateRequestComponent
            setMode={setMode}
            idDetailRequest={idDetailRequest}
          />
        )}
      </Content>
    </Layout>
  );
};

export default AdminMain;
