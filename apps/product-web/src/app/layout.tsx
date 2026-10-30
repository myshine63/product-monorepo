import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Providers } from '@/components/providers';
import 'antd/dist/reset.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product 商城',
  description: '在线购物项目',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry><Providers>{children}</Providers></AntdRegistry>
      </body>
    </html>
  );
}
