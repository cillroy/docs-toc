"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    const dmcURI = 'https://cillroy.github.io/dmc-toc-helper/?';
    context.subscriptions.push(vscode.commands.registerCommand('extension.docs-toc', () => {
        if (vscode.window.activeTextEditor !== undefined) {
            const editor = vscode.window.activeTextEditor;
            const lang = editor.document.languageId;
            const querystring = editor.document.getText();
            vscode.env.openExternal(vscode.Uri.parse(dmcURI + (lang === 'markdown' ? 'markdown' : 'yaml') + '=' + encodeURIComponent(escape(querystring))));
        }
        else {
            vscode.window.showErrorMessage('There was a problem reading your table of contents file, please make sure you have your file open and it is the active window.');
        }
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map