# product-interface

前后端共享的 TypeScript 数据类型包，仅声明和导出类型，不包含运行时代码。

当前保留空类型入口。新增公共数据类型后，从 `src/index.ts` 使用 `export type` 导出，
前后端通过 `import type` 引用；框架相关类型保留在对应应用中。

工作区消费者通过 `workspace:*` 声明依赖。类型入口直接指向 `src/index.ts`，
无需提前构建即可开发和检查类型。

- `pnpm --filter product-interface typecheck`：检查类型。
- `pnpm --filter product-interface build`：生成 `dist` 下的声明文件和声明映射。

TypeScript 类型仅用于编译期检查，不负责运行时数据校验。
