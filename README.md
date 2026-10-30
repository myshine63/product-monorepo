# monorepo-product

基于 pnpm workspace 和 Turborepo 的在线购物项目基础工程。

## 环境

- Node.js >= 22（推荐 Node.js 24 LTS）
- pnpm 12.11.2

可使用 `nvm use` 切换到 `.nvmrc` 指定的 Node.js 24。Node 类型定义使用 22 版，
确保编译期 API 与最低支持版本一致。

## 目录

```text
apps/
  product-web/          # Next.js App Router + Ant Design + Zustand
  product-backend/      # NestJS HTTP API
packages/
  product-interface/   # 前后端共享的数据类型（仅类型）
turbo.json             # 任务依赖、构建缓存和环境变量配置
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
后台通过 `@nestjs/config` 自动加载 `apps/product-backend/.env`，
可复制同目录的 `.env.example` 创建本地配置。`PORT` 默认值为 3001，必须为 1–65535 的整数；
外部环境变量优先于 `.env`，也可通过 `PORT=3002 pnpm dev:backend` 修改端口。

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

根目录的构建、类型检查、开发和清理命令由 Turborepo 调度：

- `pnpm build`：先构建工作区依赖，再并行构建前端和后台。
- `pnpm build:web` / `pnpm build:backend`：构建指定应用及其依赖。
- `pnpm typecheck`：按工作区依赖顺序检查类型，前端先运行 `next typegen` 生成路由类型。
- `pnpm dev`：同时启动两个应用，开发任务持续运行且不缓存。
- `pnpm clean`：清理构建产物、Next.js 生成的类型和增量编译缓存，保留 Turbo 缓存以便下次恢复。

构建缓存包含 `dist` 和 Next.js 生产产物，排除 Next.js 内部缓存与开发产物。
根 TypeScript 配置、工作区源码、`.env*` 文件以及构建环境变量 `API_URL`、`NODE_ENV`
的变化会影响构建缓存。新增构建时环境变量应在 `turbo.json` 的 `env` 中声明。
开发任务透传 `API_URL`、`PORT`、`NODE_ENV`；如 `PORT=3002 pnpm dev:backend`。
`.turbo/` 和 Next.js 自动生成的 `next-env.d.ts` 已被 Git 忽略。
类型检查缓存会保存前端生成的类型文件，清理后再次检查也会恢复这些文件。

## 工作区依赖与共享类型

在 `apps/*` 或 `packages/*` 中添加包含 `package.json` 的目录，然后执行 `pnpm install`。
使用 `pnpm --filter <包名> add <依赖>` 添加包依赖，使用 `pnpm add -Dw <开发依赖>` 添加根开发依赖。

前端和后台均通过 `workspace:*` 依赖 `product-interface`。
新增公共数据类型时放入 `packages/product-interface/src/`，从 `index.ts` 使用 `export type` 导出，
消费者使用 `import type` 引用。该包直接暴露源码类型入口，无需预构建；构建时仅生成声明文件。
当前所有包均为 `private`。
