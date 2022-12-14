const md5 = require("js-md5");
// const compiler = require("vue-template-compiler");
import compiler from "vue-template-compiler"

export type switchCodeScriptArrType = {
  scriptContent: string;
  switchButtonId: string;
  switchFunction: string;
};

export type OptionType = {
  activeId: string | Number;
  demoIndex: string | Number;
  code: string;
  vueComponentArr: string[];
  switchCodeScriptArr: switchCodeScriptArrType[];
  infostring: string;
  preCodeText: string;
};

export function codeRunner(options: OptionType): string
export default function codeRunner(options: OptionType) {
  // 组件代码渲染
  const demoId = `demo${md5(options.activeId)}${options.demoIndex}`;
  //   options.demoIndex++;
  const sfc = compiler.parseComponent(options.code);

  const componentOptions = sfc.script
    ? sfc.script.content.match(/(?<=export default \{)[\s\S]*(?=\})/m)![0]
    : "";
  const optionsEndWidthComma = componentOptions
    .substr(componentOptions.length - 2)
    .includes(",");
  const elseScriptText = sfc.script
    ? sfc.script.content
        .match(/[\w\W]*export default \{/)![0]
        .replace("export default {", "")
    : "";
  // 处理组件代码
  options.vueComponentArr.push(`
  ;(function(){
    ${elseScriptText}
    const Comp${demoId} = VueRunTime.extend({
        ${
          optionsEndWidthComma
            ? componentOptions
            : componentOptions.replace(/[\S|\n]*/g, "")
            ? componentOptions.replace(/([\w\W]*)(\n)/, "$1,$2")
            : ""
        }
        template: \`${sfc.template!.content}\`,
    })
    new Comp${demoId}().$mount('#${demoId}')
  }());
  `);

  // 处理样式
  const stylesStr = sfc.styles
    .map((sty) => {
      return `<style id="style_${demoId}}">${sty.content}</style>`;
    })
    .join("\n");

  // 添加展开收起代码脚本
  options.switchCodeScriptArr.push({
    scriptContent: `let showCodeState_${demoId} = false;
    function switchCodeState_${demoId} () {
      if(showCodeState_${demoId}){
        document.getElementById("md-demo-wrapper-code_${demoId}").classList.remove('showCode')
        document.getElementById("md-demo-wrapper-code-showSwitch_${demoId}").innerHTML = '显示代码'
      } else {
        document.getElementById("md-demo-wrapper-code_${demoId}").classList.add('showCode')
        document.getElementById("md-demo-wrapper-code-showSwitch_${demoId}").innerHTML = '隐藏代码'
      }
      showCodeState_${demoId} = !showCodeState_${demoId}
    }`,
    switchButtonId: `md-demo-wrapper-code-showSwitch_${demoId}`,
    switchFunction: `switchCodeState_${demoId}`,
  });

  const codePartText = options.infostring.includes("hide")
    ? ""
    : `<div id="md-demo-wrapper-code_${demoId}" class='md-demo-wrapper-code'>
    <div class="md-code-hijs">
      ${options.preCodeText}
    </div>
  </div>
  <div id="md-demo-wrapper-code-showSwitch_${demoId}" class='md-demo-wrapper-code-showSwitch'>
    显示代码
  </div>`;

  return `<div>
                <div class='md-demo-wrapper'>
                  <div class='md-demo-wrapper-component'>
                    <div id='${demoId}'></div>
                    ${stylesStr}
                  </div>
                  ${codePartText}
                </div>
              </div>
            `;
}
