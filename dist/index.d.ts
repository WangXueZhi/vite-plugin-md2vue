export declare type OptionsObject = {
    renderWrapperClass?: string | string[];
    markedOptions?: Object;
    markedRender?: Object;
    mermaidLoadingHtml?: string;
};
export default function vitePluginMd2Vue(options?: OptionsObject): {
    name: string;
    transform(src: any, id: any): {
        code: string;
        map: null;
    } | undefined;
};
