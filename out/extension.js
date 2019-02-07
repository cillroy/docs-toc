"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
function activate(context) {
    console.log('Congratulations, your extension "docs-toc" is now active!');
    context.subscriptions.push(vscode.commands.registerCommand('extension.docs-toc', () => {
        let displayDate = new Date().toLocaleDateString();
        vscode.window.showInformationMessage('Docs: Table of Content Helper (' + displayDate + ')');
    }));
    console.log('Launching HTML based tool');
    context.subscriptions.push(vscode.commands.registerCommand('extension.docs-toc-html', () => {
        DocsToCPanel.createOrShow(context.extensionPath);
    }));
}
exports.activate = activate;
class DocsToCPanel {
    constructor(panel, extensionPath) {
        this._disposables = [];
        this._panel = panel;
        this._extensionPath = extensionPath;
        // Set the webview's initial html content 
        this._update();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                this._update();
            }
        }, null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    static createOrShow(extensionPath) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        // If we already have a panel, show it.
        if (DocsToCPanel.currentPanel) {
            DocsToCPanel.currentPanel._panel.reveal(column);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(DocsToCPanel.viewType, "Docs Table of Contents Helper", column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.file(path.join(extensionPath, 'dmc-toc-helper'))
            ]
        });
        DocsToCPanel.currentPanel = new DocsToCPanel(panel, extensionPath);
    }
    static revive(panel, extensionPath) {
        DocsToCPanel.currentPanel = new DocsToCPanel(panel, extensionPath);
    }
    doRefactor() {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        this._panel.webview.postMessage({ command: 'refactor' });
    }
    dispose() {
        DocsToCPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _update() {
        const z = 1 + 2;
        // Vary the webview's content based on where it is located in the editor.
        switch (this._panel.viewColumn) {
            case vscode.ViewColumn.Two:
                this._updateForCat('Compiling Table of Contents');
                return;
            case vscode.ViewColumn.Three:
                this._updateForCat('Testing Table of Contents');
                return;
            case vscode.ViewColumn.One:
            default:
                this._updateForCat('Coding Table of Contents');
                return;
        }
    }
    _updateForCat(location) {
        this._panel.title = location;
        // this._panel.webview.html = this._getHtmlForWebview(cats[catName]);
        //this._panel.webview.html = this._getHtmlForWebview();
        this._getHtmlForWebview();
    }
    _getHtmlForWebview() {
        // let sOut: string = '';
        const filePath = vscode.Uri.file(path.join(this._extensionPath, 'dmc-toc-helper', 'index.html'));
        // console.log('filePath: ' + filePath.toString());
        vscode.workspace.openTextDocument(filePath).then((document) => {
            let text = document.getText();
            //console.log('text :' + text);
            this._panel.webview.html = text;
            //return text;
        });
        // console.log('text [as string]: ' + text as string);
        // console.log('sOut [after]: ' + sOut);
        // return sOut;
    }
    _getHtmlForWebview_old(catGif) {
        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'media', 'main.js'));
        // And the uri we use to load this script in the webview
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
                -->
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cat Coding</title>
            </head>
            <body>
                <img src="${catGif}" width="300" />
                <h1 id="lines-of-code-counter">0</h1>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}
DocsToCPanel.viewType = 'docs-toc';
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=extension.js.map