import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const dmcURI: string = 'https://cillroy.github.io/dmc-toc-helper/?';
	const activeEditorError: string = 'There was a problem reading your table of contents file, please make sure you have your file open and it is the active window.';

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.docs-toc-local', () => {

			if (vscode.window.activeTextEditor !== undefined) {
				const editor: vscode.TextEditor = vscode.window.activeTextEditor;
				const lang = editor.document.languageId;
				const querystring = editor.document.getText();
				sendToWebPanel(querystring);
			}
			else {
				vscode.window.showErrorMessage(activeEditorError);
			}
		}),
		vscode.commands.registerCommand('extension.docs-toc-online', () => {

			if (vscode.window.activeTextEditor !== undefined) {
				const editor: vscode.TextEditor = vscode.window.activeTextEditor;
				const lang = editor.document.languageId;
				const querystring = editor.document.getText();
				sendToHosted(lang, querystring);
			}
			else {
				vscode.window.showErrorMessage(activeEditorError);
			}
		})
	);

	function sendToWebPanel(querystring: string) {
		// Create and show panel
		const panel = vscode.window.createWebviewPanel(
			'dmc-toc-helper',
			'ToC Helper',
			vscode.ViewColumn.One,
			{}
		);

		// And set its HTML content
		panel.webview.html = convertToC(querystring);
	}
	function sendToHosted(lang: string, querystring: string) {
		vscode.env.openExternal(vscode.Uri.parse(dmcURI + (lang === 'markdown' ? 'markdown' : 'yaml') + '=' + encodeURIComponent(escape(querystring))));
	}

	function convertToC(querystring: string): string {
		var oHtml = "";
		oHtml = querystring;
		return oHtml;
	}
}