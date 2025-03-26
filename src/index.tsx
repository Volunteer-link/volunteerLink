// index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, App as AntdApp } from 'antd';
import './index.css';
import App from './App';

// Ant Design
import viVN from 'antd/locale/vi_VN';
import enUS from 'antd/locale/en_US';

// dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

// redux
import { Provider } from 'react-redux';
import { store } from './redux/store';

// i18n
import { I18nextProvider } from 'react-i18next';
import i18n from './ultils/i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
dayjs.locale('vi');
const currentLang = i18n.language;
const antdLocale = currentLang === 'vi' ? viVN : enUS;

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <ConfigProvider
          locale={antdLocale}
          theme={{
            token: {
              colorPrimary: '#3BA769',
            },
          }}
        >
          <AntdApp>
            <App />
          </AntdApp>
        </ConfigProvider>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);
