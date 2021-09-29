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


[中文文档](./README_CN.md)

## Introduction

vite plugin, import markdown module as vue3 component. Note that this plugin only supports vue3!

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
import Start, { headings }  from 'docs/start.md'

export default defineComponent({
  name: 'App',
  components: {
    Start
  },
})
</script>
```

## module exports
| name               | describe   | type |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------- |
| default            | vue component |    |
| headings            | markdown headings list | {text:string, level: number, raw: string}[] |
| codeBlocks            | markdown code block list | {code: string, infostring: string}[] |


## Options

| name               | type   | describe                                                                                                            |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------- |
| renderWrapperClass | string | as outer container's class attribute                                                                                |
| markedOptions      | object | marked's [setOptions config](https://marked.js.org/using_advanced#options)                                          |
| markedRender       | object | marked's [render config](https://marked.js.org/using_pro#renderer)                                                  |
| mermaidLoadingHtml | string | mermaid loading before rendered, to replace default loading, html must contain `mermaid-loading` as class attribute |

## mermaid

You can create diagrams and visualizations using [Mermaid](https://mermaid-js.github.io/mermaid/#/). You need to add `mermaid` as code block language.

````
//```mermaid
// mermaid code here
// ...
//```
````
