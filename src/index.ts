// const marked = require("marked");
const hljs = require("highlight.js");
const { escape } = require("marked/src/helpers.js");
import { marked } from "marked";
import codeRenderVue2, { switchCodeScriptArrType } from "./code-render-vue2";

export type codeRunnerTypes = "vue2" | "vue3";

export type OptionsObject = {
  renderWrapperClass?: string | string[];
  markedOptions?: Object;
  markedRender?: {
    heading?: Function;
    code?: Function;
  };
  mermaidLoadingHtml?: string;
  codeRunner?: Function | codeRunnerTypes;
};

type headingType = {
  text: string;
  level: number;
  raw: string;
};

type codeType = {
  code: string;
  infostring: string;
};

let headingsInfoList: headingType[] = [];
let codeInfoList: codeType[] = [];

let demoIndex = 0;
let activeId = "";
let vueComponentArr: string[] = [];
let switchCodeScriptArr: switchCodeScriptArrType[] = [];

let codeRunner: Function | codeRunnerTypes | undefined;

const markedInit = function (options: OptionsObject = {}) {
  marked.defaults.renderer = undefined;

  const defaultRenderer = {
    heading(text: string, level: number, raw: string, slugger: any) {
      headingsInfoList.push({ text, level, raw });
      if (options.markedRender && options.markedRender.heading) {
        return options.markedRender.heading(...arguments);
      }
      return `<h${level} id="${text}">${raw}</h${level}>`;
    },
    code(code: string, infostring: string): string {
      const langArr = infostring.match(/\S*/);
      const lang = langArr ? langArr[0] : "";
      codeInfoList.push({ code, infostring });

      if (options.markedRender && options.markedRender.code) {
        return options.markedRender.code(...arguments);
      }

      if (infostring === "mermaid") {
        return `<pre><code class="language-mermaid"><div class='mermaidWrapper' style="position: relative">
          ${
            options && options.mermaidLoadingHtml
              ? options.mermaidLoadingHtml
              : '<div class="mermaid-loading" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: rgba(0, 0, 0, 0.54)">loading...</div>'
          }
            <div class='mermaid' style="opacity: 0">${code}</div>
        </div></code></pre>`;
      }

      // @ts-ignore
      const hightLightedCode = this.options.highlight(code);
      // @ts-ignore
      const preCodeText = lang
        ? `<pre><code class="${(this as any).options.langPrefix}${escape(
            lang,
            true
          )} hljs">${hightLightedCode}</code></pre>\n`
        : `<pre><code class="hljs">${hightLightedCode}</code></pre>\n`;

      if (infostring.includes("vue run")) {
        if (
          codeRunner &&
          typeof codeRunner === "string" &&
          codeRunner === "vue2"
        ) {
          return codeRenderVue2({
            activeId: activeId,
            demoIndex: demoIndex,
            code: code,
            vueComponentArr: vueComponentArr,
            switchCodeScriptArr: switchCodeScriptArr,
            infostring: infostring,
            preCodeText: preCodeText,
          });
        }
      }
      return `
        <div class="md-code-hijs">
        ${preCodeText}
    </div>`;
    },
  };

  marked.use({
    renderer:
      options && options.markedRender
        ? { ...options.markedRender, ...defaultRenderer }
        : defaultRenderer,
  });

  const defaultMarkedOptions = {
    highlight: function (code: string, lang: string) {
      return hljs.highlightAuto(code).value;
    },
  };

  marked.setOptions(
    options && options.markedOptions
      ? { ...defaultMarkedOptions, ...options.markedOptions }
      : defaultMarkedOptions
  );
};

export default function vitePluginMd2Vue(options?: OptionsObject) {
  codeRunner = options?.codeRunner;

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
        markedInit(options);
        headingsInfoList = [];
        let mermaidRenderCode = "";
        if (src.includes("```mermaid")) {
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
                window._mermaidModule = res.default
                renderMermaid(res.default, mermaidDoms)
              })
            }
          }
          `;
        }

        const markdownHtml = marked(src);
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
          export const headings = ${JSON.stringify(headingsInfoList)}
          export const codeBlocks = ${JSON.stringify(codeInfoList)}`,
          map: null,
        };
      }
    },
  };
}
