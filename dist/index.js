"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const marked = require("marked");
const hljs = require("highlight.js");
function vitePluginMd2Vue(options) {
    const classArray = ["md2vue-wrapper"];
    if (options && options.renderWrapperClass) {
        if (typeof options.renderWrapperClass === "string") {
            classArray.push(options.renderWrapperClass);
        }
        if (Array.isArray(options.renderWrapperClass)) {
            classArray.push(...options.renderWrapperClass);
        }
    }
    const defaultRenderer = {};
    marked.use({
        renderer: options && options.markedRender ? { ...defaultRenderer, ...options.markedRender } : defaultRenderer,
    });
    const defaultMarkedOptions = {
        highlight: function (code) {
            return `<div class="md-code-hijs">${hljs.highlightAuto(code).value}</div>`;
        },
    };
    marked.setOptions(options && options.markedOptions
        ? { ...defaultMarkedOptions, ...options.markedOptions }
        : defaultMarkedOptions);
    return {
        name: "vitePluginMd2Vue",
        transform(src, id) {
            if (id.endsWith(".md")) {
                return {
                    code: `import {h, defineComponent} from "vue";
          const _sfc_md = defineComponent({
            name: "Markdown",
          });
          
          const _sfc_render =() => {
            return h("div", {
              class: ${JSON.stringify(classArray)},
              innerHTML: ${JSON.stringify(marked(src))},
            })
          };
          
          _sfc_md.render = _sfc_render
          export default _sfc_md`,
                    map: null,
                };
            }
        },
    };
}
exports.default = vitePluginMd2Vue;
//# sourceMappingURL=index.js.map