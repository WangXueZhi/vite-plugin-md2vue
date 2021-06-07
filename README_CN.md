# vite-plugin-md2vue

<p>
<a href="https://www.npmjs.com/package/vite-plugin-md2vue" target="_blank">
  <img alt="NPM package" src="https://img.shields.io/npm/v/vite-plugin-md2vue.svg?style=flat">
</a>
<a href="https://www.npmjs.com/package/vite-plugin-md2vue" target="_blank">
  <img alt="downloads" src="https://img.shields.io/npm/dt/vite-plugin-md2vue.svg?style=flat">
</a>
<a href="https://github.com/vitejs/awesome-vite#transformers" target="_blank">
  <img src="https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg" alt="Awesome">
</a>
</p>

## 介绍

vite插件，将markdown模块以vue3组件导出，注意本插件只支持vue3！

## 安装
```
npm i vite-plugin-md2vue --save-dev

yarn add vite-plugin-md2vue -D
```

## 使用
```javascript
// vite.config.js
import { defineConfig } from "vite";
import vitePluginMd2Vue from "vite-plugin-md2vue";

export default defineConfig({
  ...
  plugins: [vue(), vitePluginMd2Vue()]
});
```

```javascript
// xx.vue
<template>
  <Start />
</template>

<script>
import { defineComponent } from 'vue'
import Start from 'docs/start.md'

export default defineComponent({
  name: 'App',
  components: {
    Start
  },
})
</script>
```

## 配置选项

| 名称    | 类型  | 说明     |
| ------- | -------- | -------- |
| renderWrapperClass  |  string  | 作为渲染结果最外层容器的class |
| markedOptions |  object  | marked的[setOptions配置](https://marked.js.org/using_advanced#options) |
| markedRender |  object  | marked的[render配置](https://marked.js.org/using_pro#renderer) |
| mermaidLoadingHtml |  string  | mermaid渲染前的loading效果，用来替换默认loading， html必须包含```mermaid-loading```作为class |

## mermaid

你可以使用[Mermaid](https://mermaid-js.github.io/mermaid/#/)语法在markdown中创建各种图表, 代码块必须设置语言为```mermaid```

```
//```mermaid
// mermaid code here
// ...
//```


