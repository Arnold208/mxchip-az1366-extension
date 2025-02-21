import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import extract from 'extract-zip';
import { exec } from 'child_process';
import { pipeline, Readable } from 'stream';
import * as dotenv from 'dotenv';
import { promisify } from 'util';

dotenv.config();

const streamPipeline = promisify(pipeline);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;


const TEMPLATE_REPO_URL = 'https://github.com/Arnold208/Template/archive/refs/heads/master.zip';

const EXAMPLE_PROJECTS = {
    exampleButtonScreenCounter: {
        url: 'https://github.com/Arnold208/Counter/archive/refs/heads/master.zip',
        name: 'Counter'
    },
    exampleButtonScreenRGB: {
        url: 'https://github.com/Arnold208/Button/archive/refs/heads/master.zip',
        name: 'Button'
    },
    exampleDinoGame: {
        url: 'https://github.com/Arnold208/Dino/archive/refs/heads/master.zip',
        name: 'Dino'
    },
    examplePingPongGame: {
        url: 'https://github.com/Arnold208/PingPong/archive/refs/heads/master.zip',
        name: 'PingPong'
    },
    exampleIoTHubTelemetry: {
        url: 'https://github.com/Arnold208/Telemetry/archive/refs/heads/master.zip',
        name: 'Telemetry'
    },
    exampleMQTTClient: {
        url: 'https://github.com/Arnold208/MQTTClient.git', // Change URL to actual Git repository
        name: 'MQTTClient'
    }
};
    
async function downloadTemplate(url: string, destination: string): Promise<void> {
    const headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/vnd.github.v3.raw'
    };

    if (GITHUB_TOKEN) {
        headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const res = await fetch(url, { headers, redirect: 'follow' });

    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    }

    if (!res.body) {
        throw new Error("Response body is null.");
    }

    const fileStream = fs.createWriteStream(destination);
    await streamPipeline(res.body as any, fileStream);
}

//same
async function extractTemplate(zipPath: string, extractTo: string): Promise<void> {
    await extract(zipPath, { dir: extractTo });
}

async function renameFolder(oldPath: string, newPath: string): Promise<void> {
    await fs.promises.rename(oldPath, newPath);
}

function runBashScript(scriptPath: string) {
    return new Promise<void>((resolve) => {
        exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.warn(`Warning: ${stderr}`);  // Log as a warning instead of failing
                vscode.window.showWarningMessage(`Warning: ${stderr}`);
            } else {
                vscode.window.showInformationMessage(`Success: ${stdout}`);
            }
            resolve(); // Always resolve to prevent failures
        });
    });
}


function runBashScriptPass(scriptPath: string) {
    return new Promise<void>((resolve) => {
        vscode.window.showInputBox({
            prompt: 'Enter your password',
            password: true
        }).then(password => {
            if (!password) {
                vscode.window.showWarningMessage('Password is required but was not provided.');
                return resolve(); // Allow execution to continue
            }

            exec(`echo "${password}" | sudo -S bash ${scriptPath}`, (error, stdout, stderr) => {
                if (error) {
                    console.warn(`Warning: ${stderr}`);
                    vscode.window.showWarningMessage(`Warning: ${stderr}`);
                } else {
                    vscode.window.showInformationMessage(`Success: ${stdout}`);
                }
                resolve(); // Continue execution even if errors occur
            });
        });
    });
}


function runPowerShellScript(scriptPath: string) {
    return new Promise<void>((resolve) => {
        exec(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.warn(`Warning: ${stderr}`);
                vscode.window.showWarningMessage(`Warning: ${stderr}`);
            } else {
                vscode.window.showInformationMessage(`Success: ${stdout}`);
            }
            resolve(); // Continue even if an error occurs
        });
    });
}


async function handleExampleProject(example: { url: string, name: string }, context: vscode.ExtensionContext) {
    const storagePath = context.globalStorageUri.fsPath;

    // Ensure storage path exists
    await fs.promises.mkdir(storagePath, { recursive: true });

    // Ask the user to select a directory to store the cloned repository
    const selectedFolders = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: 'Select folder to clone repository'
    });

    if (!selectedFolders || selectedFolders.length === 0) {
        vscode.window.showErrorMessage('No folder selected. Project cloning cancelled.');
        return;
    }

    const selectedFolder = selectedFolders[0].fsPath;
    const targetPath = path.join(selectedFolder, example.name);

    try {
        vscode.window.showInformationMessage(`Cloning repository ${example.url}...`);

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Cloning ${example.name} repository`,
            cancellable: false
        }, async () => {
            // If the repository already exists, pull the latest changes
            if (fs.existsSync(targetPath)) {
                vscode.window.showInformationMessage(`Repository already exists. Pulling latest changes...`);
                await execPromise(`git -C "${targetPath}" pull origin main`);
            } else {
                // Clone the repository WITHOUT `--recurse-submodules`
                await execPromise(`git clone "${example.url.replace('/archive/refs/heads/master.zip', '.git')}" "${targetPath}"`);
            }
        });

        vscode.window.showInformationMessage('Repository cloned successfully!');

        // Open the new project in a new window
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(targetPath), true);

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            vscode.window.showErrorMessage(`Failed to clone repository: ${error.message}`);
        } else {
            console.error('Unknown error occurred');
            vscode.window.showErrorMessage('Failed to clone repository: An unknown error occurred');
        }
    }
}

// Utility function to execute shell commands
function execPromise(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${stderr}`);
                reject(error);
            } else {
                console.log(`Success: ${stdout}`);
                resolve();
            }
        });
    });
}




async function handleTemplateProject(context: vscode.ExtensionContext) {
    const storagePath = context.globalStorageUri.fsPath;

    // Ensure storage path exists
    await fs.promises.mkdir(storagePath, { recursive: true });

    const zipPath = path.join(storagePath, 'template.zip');

    // Ask the user to enter the name for the new project
    const projectName = await vscode.window.showInputBox({
        prompt: 'Enter the name for the new project (lowercase, no symbols, max 15 letters)',
        validateInput: (input) => {
            if (!input || input.length > 15 || !/^[a-z0-9]+$/.test(input)) {
                return 'Invalid project name. Please enter a name with lowercase letters, numbers, and no symbols, up to 15 characters long.';
            }
            return null;
        }
    });

    if (!projectName) {
        vscode.window.showErrorMessage('Project name is required. Project creation cancelled.');
        return;
    }

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

        const extractedFolder = path.join(selectedFolder, 'Template-main');
        const renamedFolder = path.join(selectedFolder, projectName);

        // Rename the extracted folder
        await renameFolder(extractedFolder, renamedFolder);

        vscode.window.showInformationMessage('C project created successfully!');

        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(renamedFolder), true);
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
        await handleTemplateProject(context);
    });

    let uploadProjectDisposable = vscode.commands.registerCommand('mxchip-az1366.MXCHIPUploadProject', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Please open a workspace folder first.');
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const scriptPath = path.join(workspacePath, 'scripts/upload.sh');

        if (!fs.existsSync(scriptPath)) {
            vscode.window.showErrorMessage('upload.sh script not found in the workspace root.');
            return;
        }

        try {
            if (process.platform === 'win32') {
                const powershellScriptPath = path.join(workspacePath, 'scripts/win-upload.ps1');
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

    let exampleIoTHubTelemetryDisposable = vscode.commands.registerCommand('mxchip-az1366.MXCHIPExampleIoTHubTelemetry', async () => {
        await handleExampleProject(EXAMPLE_PROJECTS.exampleIoTHubTelemetry, context);
    });

    let exampleMQTTClientDisposable = vscode.commands.registerCommand('mxchip-az1366.MXCHIPMQTTClient', async () => {
        await handleExampleProject(EXAMPLE_PROJECTS.exampleMQTTClient, context);
    });

    context.subscriptions.push(createProjectDisposable);
    context.subscriptions.push(uploadProjectDisposable);
    context.subscriptions.push(installProjectdriversDisposable);
    context.subscriptions.push(exampleButtonScreenCounterDisposable);
    context.subscriptions.push(exampleButtonScreenRGBDisposable);
    context.subscriptions.push(exampleDinoGameDisposable);
    context.subscriptions.push(examplePingPongGameDisposable);
    context.subscriptions.push(exampleIoTHubTelemetryDisposable);
    context.subscriptions.push(exampleMQTTClientDisposable);

}

export function deactivate() { }