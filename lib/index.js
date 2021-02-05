"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const marked_1 = __importDefault(require("marked"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const utils_1 = require("./utils");
exports.default = async (input, options) => {
    var _a, _b, _c;
    const filename = path_1.default.resolve(input);
    const output = path_1.default.resolve((_a = options.output) !== null && _a !== void 0 ? _a : input.replace(/\.\S+$/, '.png'));
    const width = (_b = options.width) !== null && _b !== void 0 ? _b : 600;
    const deviceScaleFactor = (_c = options.scale) !== null && _c !== void 0 ? _c : 2;
    const exist = await utils_1.exists(filename);
    if (exist === false) {
        throw new Error(`The specified input does not exist: ${input}`);
    }
    if (exist === 'dir' || exist === 'other') {
        throw new Error(`The specified input is not a file: ${input}`);
    }
    // read markdown doc content
    const document = await utils_1.read(filename);
    // remove front matter if exists
    const content = document.replace(/^---$.*^---$\n/ms, '');
    // get user config
    const config = await utils_1.getConfig();
    // rendering markdown
    const markdown = config.markdown.replace(utils_1.placeholder, content);
    const rendered = marked_1.default(markdown);
    const result = config.html.replace(utils_1.placeholder, rendered);
    // capture screenshot
    const browser = await puppeteer_1.default.launch();
    const page = await browser.newPage();
    await page.setViewport({ width, height: 80, deviceScaleFactor });
    await page.setContent(result);
    await page.screenshot({ path: output, fullPage: true });
    await browser.close();
    return output;
};
