const marked = require("marked");
const hljs = require("highlight.js");

export type OptionsObject = {
  renderWrapperClass?: string | string[];
  markedOptions?: Object;
  markedRender?: Object;
  mermaidLoadingHtml?: string;
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

  const defaultRenderer = {};

  marked.use({
    renderer:
      options && options.markedRender
        ? { ...defaultRenderer, ...options.markedRender }
        : defaultRenderer,
  });

  const defaultMarkedOptions = {
    highlight: function (code: string, lang: string) {
      if (lang === "mermaid") {
        return `<div class='mermaidWrapper' style="position: relative">
          ${options && options.mermaidLoadingHtml ? options.mermaidLoadingHtml : '<div class="mermaid-loading" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: rgba(0, 0, 0, 0.54)">loading...</div>'}
          <div class='mermaid' style="opacity: 0">${code}</div>
        </div>`;
      }
      return `<div class="md-code-hijs">${
        hljs.highlightAuto(code).value
      }</div>`;
    },
  };

  marked.setOptions(
    options && options.markedOptions
      ? { ...defaultMarkedOptions, ...options.markedOptions }
      : defaultMarkedOptions
  );

  return {
    name: "vitePluginMd2Vue",
    transform(src: any, id: any) {
      if (id.endsWith(".md")) {
        let mermaidRenderCode = ''
        if(src.includes('```mermaid')){
          mermaidRenderCode = `
          const renderMermaid = function(mermaidModule, mermaidDoms){
            mermaidModule.initialize({
              theme: 'forest'
            })
            mermaidDoms.forEach((dom,index)=>{
              mermaidModule.render('mermaid'+index, dom.innerText, (t)=>{
                dom.innerHTML = t
                dom.style.opacity = 1
                dom.parentNode.removeChild(dom.parentNode.querySelector('.mermaid-loading'))
              })
            })
          }
          const mermaidDoms = document.querySelectorAll('.mermaid')
          if(mermaidDoms && mermaidDoms.length>0){
            if(window._mermaidLoaded && window._mermaidModule){
              renderMermaid(window._mermaidModule, mermaidDoms)
            } else {
              import('mermaid').then(res=>{
                window._mermaidLoaded = true
                window._mermaidModule = res
                renderMermaid(res, mermaidDoms)
              })
            }
          }
          `
        }
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
          _sfc_md.mounted = ()=>{
            ${mermaidRenderCode}
          }
          export default _sfc_md`,
          map: null,
        };
      }
    },
  };
}
