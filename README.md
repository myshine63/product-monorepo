# monorepo-product

基于 pnpm workspace 的在线购物项目基础工程。

## 环境

- Node.js >= 22（推荐 Node.js 24 LTS）
- pnpm 12.11.2

## 目录

```text
apps/
  product-web/          # Next.js App Router + Ant Design + Zustand
  product-backend/      # NestJS HTTP API
packages/
  product-interface/   # 前后端共享的数据类型（仅类型）
pnpm-workspace.yaml    # 工作区配置
tsconfig.base.json     # 共用 TypeScript 配置
```

## 本地开发

```sh
pnpm install
pnpm dev               # 同时启动前端和后台
```

前端地址为 http://localhost:3000，后台默认监听 3001 端口。
当前前端为空白页面，后台保留启动模块，尚未注册业务接口。
Ant Design 已配置中文语言和服务端样式，Zustand 已安装，尚未创建业务 store。

也可以分别使用 `pnpm dev:web` 和 `pnpm dev:backend` 启动。

前端通过 Next.js rewrite 将 `/api/*` 代理到后台，浏览器请求保持同源。
默认后台地址是 `http://localhost:3001`；如需修改，将 `apps/product-web/.env.example`
复制为同目录的 `.env.local` 并调整 `API_URL`，修改后重启前端。
后台端口可通过环境变量 `PORT` 设置。
后台 `.env.example` 仅供参考，当前未接入自动加载 `.env` 的配置模块。

## 构建与运行

```sh
pnpm typecheck
pnpm build
pnpm --filter product-backend start
# 在另一个终端中运行
pnpm --filter product-web start
```

`pnpm clean` 清理所有工作区构建产物。生产部署时，在前端构建前设置 `API_URL`，
该地址必须能被运行 Next.js 的服务访问。

## 工作区依赖与共享类型

在 `apps/*` 或 `packages/*` 中添加包含 `package.json` 的目录，然后执行 `pnpm install`。
使用 `pnpm --filter <包名> add <依赖>` 添加包依赖，使用 `pnpm add -Dw <开发依赖>` 添加根开发依赖。

前端和后台均通过 `workspace:*` 依赖 `product-interface`。
新增公共数据类型时放入 `packages/product-interface/src/`，从 `index.ts` 使用 `export type` 导出，
消费者使用 `import type` 引用。该包直接暴露源码类型入口，无需预构建；构建时仅生成声明文件。
当前所有包均为 `private`。
