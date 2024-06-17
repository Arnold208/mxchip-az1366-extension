import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import extract from 'extract-zip';
import { exec } from 'child_process';

const TEMPLATE_REPO_URL = 'https://github.com/Arnold208/mxchip-standalone-sdk/archive/refs/heads/master.zip';

async function downloadTemplate(url: string, destination: string): Promise<void> {
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        },
        redirect: 'follow'
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    }

    const buffer = await res.arrayBuffer();
    await fs.promises.writeFile(destination, Buffer.from(buffer));
}

async function extractTemplate(zipPath: string, extractTo: string): Promise<void> {
    await extract(zipPath, { dir: extractTo });
}

async function renameFolder(oldPath: string, newPath: string): Promise<void> {
    await fs.promises.rename(oldPath, newPath);
}

function runBashScript(scriptPath: string) {
    return new Promise<void>((resolve, reject) => {
        exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Error: ${stderr}`);
                reject(error);
            } else {
                vscode.window.showInformationMessage(`Success: ${stdout}`);
                resolve();
            }
        });
    });
}

export function activate(context: vscode.ExtensionContext) {
    let createProjectDisposable = vscode.commands.registerCommand('mxchip-az1366.MXCHIPCreateProject', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Please open a workspace folder first.');
            return;
        }

        const storagePath = context.storagePath;

        if (!storagePath) {
            vscode.window.showErrorMessage('Failed to determine storage path for the extension.');
            return;
        }

        // Ensure storage path exists
        await fs.promises.mkdir(storagePath, { recursive: true });

        const zipPath = path.join(storagePath, 'template.zip');

        // Ask the user to select a directory to store the template
        const selectedFolders = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false,
            openLabel: 'Select folder to extract template'
        });

        if (!selectedFolders || selectedFolders.length === 0) {
            vscode.window.showErrorMessage('No folder selected. Project creation cancelled.');
            return;
        }

        const selectedFolder = selectedFolders[0].fsPath;

        try {
            vscode.window.showInformationMessage('Starting project creation...');
            console.log(`Downloading template from ${TEMPLATE_REPO_URL} to ${zipPath}`);

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Downloading template",
                cancellable: false
            }, async (progress) => {
                await downloadTemplate(TEMPLATE_REPO_URL, zipPath);
            });

            console.log(`Extracting template to ${selectedFolder}`);
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Extracting template",
                cancellable: false
            }, async (progress) => {
                await extractTemplate(zipPath, selectedFolder);
            });

            const extractedFolder = path.join(selectedFolder, 'mxchip-standalone-sdk-master');
            const renamedFolder = path.join(selectedFolder, 'mxchip-standalone-sdk');
            
            // Rename the extracted folder
            await renameFolder(extractedFolder, renamedFolder);

            vscode.window.showInformationMessage('C project created successfully!');

            const openInNewWindow = "Open in New Window";
            const openInCurrentWindow = "Open in Current Window";
            const result = await vscode.window.showInformationMessage(
                'Do you want to open the project in a new window or the current window?',
                openInNewWindow,
                openInCurrentWindow
            );

            const mainCPath = path.join(renamedFolder, 'MXChip/AZ3166/app/main.c');

            if (result === openInNewWindow) {
                await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(renamedFolder), true);

                // Ensure the folder is opened before attempting to open the file
                setTimeout(async () => {
                    const document = await vscode.workspace.openTextDocument(mainCPath);
                    await vscode.window.showTextDocument(document);
                }, 2000);

            } else if (result === openInCurrentWindow) {
                await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(renamedFolder), false);

                // Ensure the folder is opened before attempting to open the file
                setTimeout(async () => {
                    const document = await vscode.workspace.openTextDocument(mainCPath);
                    await vscode.window.showTextDocument(document);
                }, 2000);
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                vscode.window.showErrorMessage('Failed to create C project: ' + error.message);
            } else {
                console.error('Unknown error occurred');
                vscode.window.showErrorMessage('Failed to create C project: An unknown error occurred');
            }
        }
    });

    let uploadProjectDisposable = vscode.commands.registerCommand('mxchip-az1366.MXCHIPUploadProject', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Please open a workspace folder first.');
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const scriptPath = path.join(workspacePath, 'upload.sh');

        if (!fs.existsSync(scriptPath)) {
            vscode.window.showErrorMessage('upload.sh script not found in the workspace root.');
            return;
        }

        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Building and Uploading Firmware, Please wait...",
                cancellable: false
            }, async (progress) => {
                await runBashScript(scriptPath);
            });
        } catch (error) {
            console.error(`Error running upload script: ${error}`);
        }
    });

    context.subscriptions.push(createProjectDisposable);
    context.subscriptions.push(uploadProjectDisposable);
}

export function deactivate() {}
