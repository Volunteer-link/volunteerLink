// index.tsx

import React, { useEffect, useState } from 'react';
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

interface LanguageProviderProps {
  children: React.ReactNode;
}
const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('language') || 'vi');

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLang(lng);
      dayjs.locale(lng);
      localStorage.setItem('language', lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    i18n.changeLanguage(lang);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [lang]);

  const antdLocale = lang === 'vi' ? viVN : enUS;
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3BA769',
        },
      }}
      locale={antdLocale}
    >
      {children}
    </ConfigProvider>
  );
};

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <AntdApp>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </AntdApp>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);
