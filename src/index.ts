const marked = require("marked");

export type OptionsObject = {
  renderWrapperClass?: string | string[];
};

export default function vitePluginMd2Vue(options?: OptionsObject) {
  const classArray: string[] = ["md2vue-wrapper"];
  if (options && options.renderWrapperClass) {
    if (typeof options.renderWrapperClass === "string") {
      classArray.push(options.renderWrapperClass);
    }
    if (Array.isArray(options.renderWrapperClass)) {
      classArray.push(...options.renderWrapperClass);
    }
  }

  return {
    name: "vitePluginMd2Vue",
    transform(src: any, id: any) {
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
