const pkg = require("./package");
const fs = require("fs");
const {chainingCheck} = require("hefang-js");
const PLUGIN_NAME = pkg.name.replace("gitbook-plugin-", "");

const moduleRender = {
    /**
     * @param {DonateModule} module
     */
    donate(module) {
        if (!module) return "";
        if (module === true) {
            module = {};
        }
        if (chainingCheck(module, "buttonRadius") && module.buttonRadius === +module.buttonRadius) {
            module.buttonRadius = module.buttonRadius + "px";
        }
        const qrCodeHtml = (module.qrCodes || []).map(code => {
            return `<div class="extra-html-donate-qrcode-item"><img src="${code.image}" alt="${code.label}"/><p>${code.label}</p></div>`
        }).join("");
        return `<div class="extra-html-donate">
<p>${module.description || "赠人玫瑰，手有余香"}</p>
<button style="border-radius: ${module.buttonRadius || "3px"}">${module.buttonText || "赞赏"}</button>
<div class="extra-html-donate-qrcode">${qrCodeHtml}</div>
</div>`;
    },
    /**
     * @param {DividerModule} module
     * @return string
     */
    divider(module) {
        if (!module) return "";
        if (module === true) {
            module = {};
        }
        return `<hr class='extra-html-donate hr-${module.type || "solid"}'/>`
    }
};

/**
 * @param {Plugin} me
 * @param {string[]} files
 * @return string
 */
function file2text(me, files) {
    if (!Array.isArray(files)) return "";
    return files.map(file => {
        if (fs.existsSync(file)) {
            return fs.readFileSync(file, {encoding: "utf-8"})
        } else {
            me.log.warn(`File "${file}" not exists, load failed!!`);
            return "";
        }
    }).join("")
}

/**
 * @param {Plugin} me
 * @param {Module} modules
 */
function module2text(me, modules) {
    let buffer = "";
    for (const name in modules) {
        if (!(name in moduleRender)) {
            me.log.warn(`module "${name}" is not exists`);
            continue;
        }
        buffer += moduleRender[name](modules[name])
    }
    return buffer;
}

/**
 *
 * @type {Plugin}
 */
module.exports = {
    book: {
        assets: "./assets",
        css: [
            "plugin.css"
        ],
        js: [
            "plugin.js"
        ]
    },
    hooks: {
        /**
         * @param {Page} page
         * @returns Page
         */
        page(page) {
            const config = this.config.values.pluginsConfig[PLUGIN_NAME];

            let headerHtml = "";
            let footerHtml = "";
            const headerModules = chainingCheck(config, "header.modules") || {};
            const footerModules = chainingCheck(config, "footer.modules") || {};

            headerHtml += module2text(this, headerModules) + file2text(this, chainingCheck(config, "header.files"));
            footerHtml += module2text(this, footerModules) + file2text(this, chainingCheck(config, "footer.files"));
            page.content = `<header>${headerHtml}</header>${page.content}<footer>${footerHtml}</footer>`;
            return page;
        }
    }
};