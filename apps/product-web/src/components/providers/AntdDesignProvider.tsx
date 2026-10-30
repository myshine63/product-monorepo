'use client';

import type { ReactNode } from 'react';
import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

export function AntdDesignProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={zhCN}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
