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
			vscode.ViewColumn.Beside,
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
		// oHtml = querystring;
		oHtml = processYaml(querystring);
		// for (const line of querystring.split(/[\r\n]+/)){
		// 	oHtml += '<p>' + line + '/<p>';
		//   }
		return oHtml;
	}

	function processYaml(yaml: string): string {
		var sOut = "<ul>";
		const newline = '</span></li></ul>';
		const beginLine = '<ul><li><span>';

		var lines = yaml.split(/[\r\n]+/);
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i].split(":");
			var tmpLine = "";
			for (var j = 1; j <= line.length; j++) {
				if (line[j]) { tmpLine += ((j > 1) ? ":" : "") + line[j]; }
			}
			var spaces;
			var tmpSpace;
			switch (line[0].trim()) {
				case "experimental":
					// $('#experiment_checkbox')[0].checked = (tmpLine.trim() == 'true');
					break;
				case "experiment_id":
					// $('#experiment_id').val(tmpLine.trim().substring(1, tmpLine.trim().length - 1));
					break;
				case "- name":
					spaces = line[0].split("- name");
					tmpSpace = spaces[0];
					sOut += beginLine + tmpSpace + "- title: " + tmpLine + newline + tmpSpace + "  toc: " + tmpLine + newline;
					break;
				case "items":
					spaces = line[0].split("items");
					tmpSpace = spaces[0];
					sOut += tmpSpace + "folder: true" + newline;
					sOut += tmpSpace + "children: " + newline;
					break;
				default:
					sOut += lines[i] + newline;
					break;
			}
		}

		return sOut += "</ul>";
	}
}