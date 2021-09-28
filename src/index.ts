const marked = require("marked");
const hljs = require("highlight.js");

export type OptionsObject = {
  renderWrapperClass?: string | string[];
  markedOptions?: Object;
  markedRender?: {
    heading?: Function,
    code?: Function
  };
  mermaidLoadingHtml?: string;
};

let keyWordsInOneMd: string[] = []

const markedInit = function(options: OptionsObject = {}){
  marked.defaults.renderer = null

  const defaultRenderer = {
    heading(text: string, level: number, raw: string, slugger:any){
      keyWordsInOneMd.push(text)
      return `<h${level} id="${text}">${raw}</h${level}>`
    },
    code(code: string, infostring: string, escape: Function): string{
      const langArr = infostring.match(/\S*/);
      const lang = langArr?langArr[0]:'';

      if (infostring === 'mermaid') {
        return `<div class='mermaidWrapper' style="position: relative">
          ${options && options.mermaidLoadingHtml ? options.mermaidLoadingHtml : '<div class="mermaid-loading" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: rgba(0, 0, 0, 0.54)">loading...</div>'}
          <div class='mermaid' style="opacity: 0">${code}</div>
        </div>`;
        // return `<div class='mermaid'>${code}</div>`;
      }
      
      // @ts-ignore
      const hightLightedCode = this.options.highlight(code)
      // @ts-ignore
      const preCodeText = lang ? `<pre><code class="${this.options.langPrefix}${escape(lang, true)} hljs">${hightLightedCode}</code></pre>\n` 
      : `<pre><code class="hljs">${hightLightedCode}</code></pre>\n`;

      return `
        <div class="md-code-hijs">
        ${preCodeText}
    </div>`;
    }
  };

  // 处理自定义heading渲染
  if(options.markedRender && options.markedRender.heading){
    const {heading, ...restRender} = options.markedRender
    options.markedRender = restRender
    defaultRenderer.heading = function(text: string, level: number, raw: string, slugger:any){
      keyWordsInOneMd.push(text)
      return heading(text, level, raw, slugger)
    }
  }

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

      return hljs.highlightAuto(code).value
    },
  };

  marked.setOptions(
    options && options.markedOptions
      ? { ...defaultMarkedOptions, ...options.markedOptions }
      : defaultMarkedOptions
  );
}

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
        markedInit(options)
        keyWordsInOneMd = []
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

        const markdownHtml = marked(src)
        return {
          code: `import {h, defineComponent} from "vue";
          const _sfc_md = defineComponent({
            name: "Markdown",
          });
          
          const _sfc_render =() => {
            return h("div", {
              class: ${JSON.stringify(classArray)},
              innerHTML: ${JSON.stringify(markdownHtml)},
            })
          };
          
          _sfc_md.render = _sfc_render
          _sfc_md.mounted = ()=>{
            ${mermaidRenderCode}
          }
          export default _sfc_md
          export const headings = ${JSON.stringify(keyWordsInOneMd)}`,
          map: null,
        };
      }
    },
  };
}
