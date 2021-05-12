# vite-plugin-md2vue

vite插件，将markdown模块以vue组件导出

vite plugin, import markdown module as vue component

## 安装 install
```
npm i vite-plugin-md2vue --save-dev

yarn add vite-plugin-md2vue -D
```

## 使用 use
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

## 配置选项 options

| 名称    | 说明     |
| ------- | -------- |
| renderWrapperClass    | 作为渲染结果最外层容器的class |
| markedOptions | marked的[setOptions配置](https://marked.js.org/using_advanced#options) |
| markedRender | marked的[render配置](https://marked.js.org/using_pro#renderer) |


## 支持 support

可在markdown中直接编写甘特图，时序图等图表，[mermaid文档](https://mermaid-js.github.io/mermaid/#/)