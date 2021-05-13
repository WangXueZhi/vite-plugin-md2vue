# vite-plugin-md2vue

[中文文档](./README_CN.md)

## Introduction

vite plugin, import markdown module as vue component

## Install
```
npm i vite-plugin-md2vue --save-dev

yarn add vite-plugin-md2vue -D
```

## Use
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

## Options

| name    | describe |
| ------- | -------- |
| renderWrapperClass  | as outer container's class attribute |
| markedOptions | marked's [setOptions config](https://marked.js.org/using_advanced#options) |
| markedRender | marked's [render config](https://marked.js.org/using_pro#renderer) |

## Support

You can create diagrams and visualizations using [Mermaid](https://mermaid-js.github.io/mermaid/#/)

