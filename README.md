# Mayday Re.Poem

一个完全在浏览器本地运行的五月天歌词拼贴诗小工具。

```bash
bun install
bun run dev
```

项目是标准 Vite + React 单页应用：无路由、无接口请求、不依赖外部资源。词库和诗句用的朱雀仿宋字体（`app/assets/`，已裁剪为词库子集）随应用一起打包，图片也在浏览器中生成。

代码按职责组织：

- `app/App.tsx`：页面组合、诗歌历史和编辑／预览切换。
- `app/components/`：编辑器、预览、选词区、移动端的词片抽屉（`BankSheet`）、完整词库弹窗，以及共用的词片列表。
- `app/hooks/`：拖拽交互、随机推荐／搜索状态和断点判断。推荐状态保留在页面层，切换预览不会重置。
- `app/lib/`：词库数据准备、词片倾角、图片导出和文字分享。
- `app/poem-state.ts`：诗歌编辑及撤销／重做的 reducer。
- `app/styles.css`：统一样式。纸感拼贴风格、蓝色点缀与动效都在这里；≥1024px 时切换为「左诗稿、右词库」双栏布局；小于该宽度时词库是固定在底部、可拖拽吸附（收起 / 半屏 / 全屏）的「词片键盘」。

验证：`bun test`、`bun run typecheck`、`bun run build`。
