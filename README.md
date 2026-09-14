# Mayday Re.Poem

一个完全在浏览器本地运行的五月天歌词拼贴诗小工具。

```bash
bun install
bun run dev
```

项目是标准 Vite + React 单页应用：无路由、无接口请求、无外部字体。词库随应用一起打包，图片也在浏览器中生成。

代码按职责组织：

- `app/App.tsx`：页面组合、诗歌历史和编辑／预览切换。
- `app/components/`：编辑器、预览、选词区、完整词库弹窗，以及共用的词片列表。
- `app/hooks/`：拖拽交互和随机推荐／搜索状态。推荐状态保留在页面层，切换预览不会重置。
- `app/lib/`：词库数据准备、图片导出和文字分享。
- `app/poem-state.ts`：诗歌编辑及撤销／重做的 reducer。
- `app/styles.css`：统一样式。

验证：`bun test`、`bun run typecheck`、`bun run build`。
