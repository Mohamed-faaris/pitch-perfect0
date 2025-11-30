declare module "html-to-image" {
    export type HtmlToImageOptions = {
        cacheBust?: boolean;
        backgroundColor?: string;
        pixelRatio?: number;
        skipFonts?: boolean;
    };

    export function toPng(
        node: HTMLElement,
        options?: HtmlToImageOptions,
    ): Promise<string>;
}
