"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
function activate(context) {
    console.log('Congratulations, your extension "docs-toc" is now active!');
    const dmcPath = path.join(context.extensionPath, 'dmc-toc-helper');
    context.subscriptions.push(vscode.commands.registerCommand('extension.docs-toc', () => {
        let displayDate = new Date().toLocaleDateString();
        vscode.window.showInformationMessage('Docs: Table of Content Helper (' + displayDate + ')');
    }));
    console.log('Launching HTML based tool');
    context.subscriptions.push(vscode.commands.registerCommand('extension.docs-toc-html', () => {
        try {
            // Launch dmc-toc-helper in browser with yaml or md querystring
            // https://code.visualstudio.com/api/references/vscode-api#env
            // IGNORE ERROR AND LAUNCH DEBUG
            let querystring = vscode.window.activeTextEditor.document.getText();
            let lang = vscode.window.activeTextEditor.document.languageId;
            vscode.env.openExternal(vscode.Uri.parse('https://cillroy.github.io/dmc-toc-helper/?' + (lang === 'markdown' ? 'md' : 'yaml') + '=' + encodeURIComponent(escape(querystring))));
        }
        catch (_a) {
            vscode.window.showErrorMessage('There was a problem reading your table of contents file, please make sure you have your file open and it is the active window.');
        }
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map