"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    const dmcURI = 'https://cillroy.github.io/dmc-toc-helper/?';
    context.subscriptions.push(vscode.commands.registerCommand('extension.docs-toc', () => {
        try {
            // Launch dmc-toc-helper in browser with yaml or md querystring
            // https://code.visualstudio.com/api/references/vscode-api#env
            // IGNORE ERROR AND LAUNCH DEBUG
            const editor = vscode.window.activeTextEditor;
            const lang = editor.document.languageId;
            const querystring = editor.document.getText();
            vscode.env.openExternal(vscode.Uri.parse(dmcURI + (lang === 'markdown' ? 'markdown' : 'yaml') + '=' + encodeURIComponent(escape(querystring))));
        }
        catch (_a) {
            vscode.window.showErrorMessage('There was a problem reading your table of contents file, please make sure you have your file open and it is the active window.');
        }
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map