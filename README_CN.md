# vite-plugin-md2vue

## 介绍

vite插件，将markdown模块以vue组件导出

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

| 名称    | 说明     |
| ------- | -------- |
| renderWrapperClass    | 作为渲染结果最外层容器的class |
| markedOptions | marked的[setOptions配置](https://marked.js.org/using_advanced#options) |
| markedRender | marked的[render配置](https://marked.js.org/using_pro#renderer) |


## 支持

你可以使用[Mermaid](https://mermaid-js.github.io/mermaid/#/)语法在markdown中创建各种图表


