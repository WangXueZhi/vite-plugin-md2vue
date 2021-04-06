# vite-plugin-md2vue

vite插件，可使导入的markdown模块转成vue组件导出

## install
```
npm i vite-plugin-md2vue --save-dev

yarn add vite-plugin-md2vue -D
```

## use
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

## options

renderWrapperClass: 作为渲染结果最外层容器的class
