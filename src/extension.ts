import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import extract from 'extract-zip';
import { exec } from 'child_process';

const TEMPLATE_REPO_URL = 'https://github.com/Arnold208/mxchip-standalone-sdk/archive/refs/heads/master.zip';

const EXAMPLE_PROJECTS = {
    exampleButtonScreenCounter: {
        url: 'https://github.com/Arnold208/mxchip-button_screen_counter/archive/refs/heads/master.zip',
        name: 'mxchip-button_screen_counter'
    },
    exampleButtonScreenRGB: {
        url: 'https://github.com/Arnold208/mxchip_button__screen_rgb/archive/refs/heads/master.zip',
        name: 'mxchip_button__screen_rgb'
    },
    exampleDinoGame: {
        url: 'https://github.com/Arnold208/mxchip_dino_game/archive/refs/heads/master.zip',
        name: 'mxchip_dino_game'
    },
    examplePingPongGame: {
        url: 'https://github.com/Arnold208/mxchip_ping_pong_game/archive/refs/heads/master.zip',
        name: 'mxchip_ping_pong_game'
    }
};

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

function runBashScriptPass(scriptPath: string) {
    return new Promise<void>((resolve, reject) => {
        vscode.window.showInputBox({
            prompt: 'Enter your password',
            password: true
        }).then(password => {
            if (!password) {
                vscode.window.showErrorMessage('Password is required to run the script.');
                reject(new Error('Password is required'));
                return;
            }

            exec(`echo "${password}" | sudo -S bash ${scriptPath}`, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Error: ${stderr}`);
                    reject(error);
                } else {
                    vscode.window.showInformationMessage(`Success: ${stdout}`);
                    resolve();
                }
            });
        });
    });
}

function runPowerShellScript(scriptPath: string) {
    return new Promise<void>((resolve, reject) => {
        exec(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, (error, stdout, stderr) => {
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



async function handleExampleProject(example: { url: string, name: string }, context: vscode.ExtensionContext) {
    const storagePath = context.globalStorageUri.fsPath;

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
        console.log(`Downloading template from ${example.url} to ${zipPath}`);

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Downloading template",
            cancellable: false
        }, async (progress) => {
            await downloadTemplate(example.url, zipPath);
        });

        console.log(`Extracting template to ${selectedFolder}`);
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Extracting template",
            cancellable: false
        }, async (progress) => {
            await extractTemplate(zipPath, selectedFolder);
        });

        const extractedFolder = path.join(selectedFolder, `${example.name}-master`);
        const renamedFolder = path.join(selectedFolder, example.name);

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

        if (result === openInNewWindow) {
            await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(renamedFolder), true);

            // Ensure the folder is opened before attempting to open the file
            setTimeout(async () => {
                const mainCPath = path.join(renamedFolder, 'main.c'); // Update this based on the actual path
                const document = await vscode.workspace.openTextDocument(mainCPath);
                await vscode.window.showTextDocument(document);
            }, 2000);

        } else if (result === openInCurrentWindow) {
            await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(renamedFolder), false);

            // Ensure the folder is opened before attempting to open the file
            setTimeout(async () => {
                const mainCPath = path.join(renamedFolder, 'main.c'); // Update this based on the actual path
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
}

export function activate(context: vscode.ExtensionContext) {
    let createProjectDisposable = vscode.commands.registerCommand('mxchip-az1366.MXCHIPCreateProject', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        // if (!workspaceFolders) {
        //     vscode.window.showErrorMessage('Please open a workspace folder first.');
        //     return;
        // }

        const storagePath = context.globalStorageUri.fsPath;

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

            if (result === openInNewWindow) {
                await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(renamedFolder), true);

                // Ensure the folder is opened before attempting to open the file
                setTimeout(async () => {
                    const mainCPath = path.join(renamedFolder, 'MXChip/AZ3166/app/main.c');
                    const document = await vscode.workspace.openTextDocument(mainCPath);
                    await vscode.window.showTextDocument(document);
                }, 2000);

            } else if (result === openInCurrentWindow) {
                await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(renamedFolder), false);

                // Ensure the folder is opened before attempting to open the file
                setTimeout(async () => {
                    const mainCPath = path.join(renamedFolder, 'MXChip/AZ3166/app/main.c');
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
            if (process.platform === 'win32') {
                const powershellScriptPath = path.join(workspacePath, 'win-upload.ps1');
                if (fs.existsSync(powershellScriptPath)) {
                    await vscode.window.withProgress({
                        location: vscode.ProgressLocation.Notification,
                        title: 'Windows: Building and Uploading Firmware, Please wait...',
                        cancellable: false
                    }, async () => {
                        await runPowerShellScript(powershellScriptPath);
                    });
                } else {
                    vscode.window.showErrorMessage('win-upload.ps1 script not found in the workspace root.');
                }
            } else if (process.platform === 'linux' || process.platform === 'darwin') {
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: `${process.platform}: Building and Uploading Firmware, Please wait...`,
                    cancellable: false
                }, async () => {
                    await runBashScript(scriptPath);
                });
            } else {
                console.log(`Unsupported platform: ${process.platform}. Cannot upload project.`);
            }
        } catch (error) {
            console.error(`Error running upload script: ${error}`);
        }
    });
    
    let installProjectdriversDisposable = vscode.commands.registerCommand('mxchip-az1366.MXCHIPInstallDrivers', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Please open a workspace folder first.');
            return;
        }
    
        const workspacePath = workspaceFolders[0].uri.fsPath;
        const scriptPath = path.join(workspacePath, 'tools/get-toolchain.sh');
    
        if (!fs.existsSync(scriptPath)) {
            vscode.window.showErrorMessage('Driver script not found in the workspace root.');
            return;
        }
    
        try {
            if (process.platform === 'win32') {
                const powershellScriptPath = path.join(workspacePath, 'tools/get-toolchain.ps1');
                if (fs.existsSync(powershellScriptPath)) {
                    await vscode.window.withProgress({
                        location: vscode.ProgressLocation.Notification,
                        title: 'Windows: Installing Drivers, Please wait...',
                        cancellable: false
                    }, async () => {
                        await runPowerShellScript(powershellScriptPath);
                    });
                } else {
                    vscode.window.showErrorMessage('tools/get-toolchain.ps1 script not found in the workspace root.');
                }
            } else if (process.platform === 'linux') {
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: `${process.platform}: Installing Drivers, Please wait...`,
                    cancellable: false
                }, async () => {
                    await runBashScriptPass(scriptPath);
                });
            } else {
                console.log(`Unsupported platform: ${process.platform}. Cannot install drivers.`);
            }
        } catch (error) {
            console.error(`Error running install drivers script: ${error}`);
        }
    });
    let exampleButtonScreenCounterDisposable = vscode.commands.registerCommand('mxchip-az1366.MXCHIPExampleButtonScreenCounter', async () => {
        await handleExampleProject(EXAMPLE_PROJECTS.exampleButtonScreenCounter, context);
    });

    let exampleButtonScreenRGBDisposable = vscode.commands.registerCommand('mxchip-az1366.MXCHIPExampleButtonScreenRGB', async () => {
        await handleExampleProject(EXAMPLE_PROJECTS.exampleButtonScreenRGB, context);
    });

    let exampleDinoGameDisposable = vscode.commands.registerCommand('mxchip-az1366.MXCHIPExampleDinoGame', async () => {
        await handleExampleProject(EXAMPLE_PROJECTS.exampleDinoGame, context);
    });

    let examplePingPongGameDisposable = vscode.commands.registerCommand('mxchip-az1366.MXCHIPExamplePingPongGame', async () => {
        await handleExampleProject(EXAMPLE_PROJECTS.examplePingPongGame, context);
    });

    context.subscriptions.push(createProjectDisposable);
    context.subscriptions.push(uploadProjectDisposable);
    context.subscriptions.push(installProjectdriversDisposable);
    context.subscriptions.push(exampleButtonScreenCounterDisposable);
    context.subscriptions.push(exampleButtonScreenRGBDisposable);
    context.subscriptions.push(exampleDinoGameDisposable);
    context.subscriptions.push(examplePingPongGameDisposable);
}

export function deactivate() { }
