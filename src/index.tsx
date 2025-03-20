// index.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, App as AntdApp } from "antd";
import "./index.css";
import App from "./App"; // Component gốc của bạn
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Provider } from "react-redux";
import { store } from "./redux/store";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
dayjs.locale("vi");
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        locale={locale}
        theme={{
          token: {
            colorPrimary: "#3BA769",
          },
        }}
      >
        <AntdApp>
          <App />
        </AntdApp>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
