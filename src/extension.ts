import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const dmcURI: string = 'https://cillroy.github.io/dmc-toc-helper/?';

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.docs-toc', () => {
			// Launch dmc-toc-helper in browser with yaml or md querystring
			// https://code.visualstudio.com/api/references/vscode-api#env
			// IGNORE ERROR AND LAUNCH DEBUG
			if (vscode.window.activeTextEditor !== undefined) {
				const editor: vscode.TextEditor = vscode.window.activeTextEditor;
				const lang = editor.document.languageId;
				const querystring = editor.document.getText();
				vscode.env.openExternal(vscode.Uri.parse(dmcURI + (lang === 'markdown' ? 'markdown' : 'yaml') + '=' + encodeURIComponent(escape(querystring))));
			} else {
				vscode.window.showErrorMessage('There was a problem reading your table of contents file, please make sure you have your file open and it is the active window.');
			}
		}));
}