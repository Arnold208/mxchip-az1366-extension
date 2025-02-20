import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import extract from 'extract-zip';
import { exec } from 'child_process';
import { pipeline } from 'stream';
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
        url: 'https://github.com/Arnold208/MQTTClient/archive/refs/heads/master.zip', // ✅ Fixed capitalization
        name: 'MQTTClient'
    }
};

// ✅ Improved download function with token authentication and error handling
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

    if (!fs.existsSync(destination)) {
        throw new Error(`ZIP file was not downloaded: ${destination}`);
    }
}

// ✅ Improved extraction function with error handling
async function extractTemplate(zipPath: string, extractTo: string): Promise<void> {
    try {
        await extract(zipPath, { dir: extractTo });
        console.log(`Extracted ZIP to ${extractTo}`);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error(`Error: ${errMsg}`);
        vscode.window.showErrorMessage('Failed to create C project: ' + errMsg);
    }
}

// ✅ Safely rename the extracted folder
async function renameFolder(oldPath: string, newPath: string): Promise<void> {
    if (!fs.existsSync(oldPath)) {
        throw new Error(`Folder not found: ${oldPath}`);
    }
    await fs.promises.rename(oldPath, newPath);
}

// ✅ Detect the correct extracted folder (prevents missing folder errors)
function findExtractedFolder(basePath: string, projectName: string): string | null {
    const extractedFolder = fs.readdirSync(basePath).find(folder => folder.startsWith(projectName));
    return extractedFolder ? path.join(basePath, extractedFolder) : null;
}

// ✅ Handles example project creation with better error handling
async function handleExampleProject(example: { url: string, name: string }, context: vscode.ExtensionContext) {
    const storagePath = context.globalStorageUri.fsPath;
    await fs.promises.mkdir(storagePath, { recursive: true });

    const zipPath = path.join(storagePath, 'template.zip');

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

        await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "Downloading template" }, async () => {
            await downloadTemplate(example.url, zipPath);
        });

        console.log(`Extracting template to ${selectedFolder}`);
        await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "Extracting template" }, async () => {
            await extractTemplate(zipPath, selectedFolder);
        });

        const extractedFolderPath = findExtractedFolder(selectedFolder, example.name);
        if (!extractedFolderPath) {
            throw new Error(`Extracted folder not found in ${selectedFolder}`);
        }

        const renamedFolder = path.join(selectedFolder, example.name);
        await renameFolder(extractedFolderPath, renamedFolder);

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

// ✅ Extension activation
export function activate(context: vscode.ExtensionContext) {
    const exampleProjects = Object.entries(EXAMPLE_PROJECTS).map(([key, example]) =>
        vscode.commands.registerCommand(`mxchip-az1366.${key}`, async () => {
            await handleExampleProject(example, context);
        })
    );

    context.subscriptions.push(...exampleProjects);
}

// ✅ Extension deactivation
export function deactivate() { }
