 # MXCHIP AZ1366 TOOLBOX
Welcome to the **Mxchip AX1366 Toolbox**, your gateway to a limitless realm of IoT and Embedded Systems projects! With this toolbox at your fingertips, you'll delve into the exciting world of device development, from crafting intricate button and LED interactions to seamlessly transmitting sensor data to your [Azure Platform](https://portal.azure.com).

But that's just the beginning! In upcoming releases, brace yourself for a journey into connectivity mastery. Picture this: effortlessly linking your devkit to diverse platforms like the intuitive flow-based programming of [Node-RED](https://nodered.org), harnessing the immense capabilities of [Azure IoT Hub](https://learn.microsoft.com/en-us/azure/iot-hub), or orchestrating events with lightning speed using [Event Grid](https://learn.microsoft.com/en-us/azure/event-grid/overview). All this magic unfolds through cutting-edge protocols like MQTT or the ever-reliable Wi-Fi.

Join us as we transform your development experience into a thrilling adventure where innovation knows no bounds!

## Current Features

- **Project Scaffolding**: Scaffold a new project with predefined templates.
- **Mxchip Example Projects**: included in this toolbox are some examples project to help interact with the Mxchip Az1366.
- **Easy Driver Installation for Project**: Supports downloading and extracting project templates automatically from a GitHub repository.

## Example Projects Avaialable
- **Button Screen RGB** : Interact with buttons and leds and watch OLED screen change on the MXchip.
- **Button Screen Counter** : By pressing the onboard buttons, initiate a count system on the devboard and display on the screen.
- **Dino Gamer** : Test the popular dino game from [Google Chrome](https://www.google.com/chrome) on your favorite Mxchip devkit.
- **Ping Pong Game** : Play the classic ping pong game on your mxchip now.
- **Iot Hub Telemetry** : Read sensor data from the devkit and publish to IoT Hub.

### Screenshots
![alt text](https://th.bing.com/th/id/R.3395ddef35554bc223c95c8f66609a5b?rik=8itn3S%2bTmNHZfQ&riu=http%3a%2f%2fwww.cnx-software.com%2fwp-content%2fuploads%2f2017%2f06%2fMXCHIP-Azure-IoT-Devkit.jpg&ehk=S7IU0FnclXa55Rw%2fpq6w1N44vejmZIVx5r2Ep4j5G7s%3d&risl=&pid=ImgRaw&r=0)
 
 
## Requirements

### For Windows users
- For first time users, run this command in powershell as an **Admin**, `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned`.
- After that type **Y** and press Enter.
- Press `F1` and Type and select the command `Mxchip Create New MXCHIP AZ1366 Project`
- After the the project has been scaffold, open in new window or current.
- Press `F1` and Type the command `Mxchip Install Drivers` and select. Click yes to the prompt to install `cmake`.
- (Please note this step maytake sometime so please grab a  cup of coffee and wait)
- Once drivers installed, we need to include cmake in the enviromental path.See gif below for guide.
- Restart Vscode, then press `F1`, type the command `Mxchip Upload Project`, make sure your MXchip is connected to the hostmachine.
- Wait for program to build and install to the devkit.


### For Linux users
- For first time users, Press `F1` and Type and select the command `Mxchip Create New MXCHIP AZ1366 Project`
- After the the project has been scaffold, open in new window or current.
- Press `F1` and Type the command `Mxchip Install Drivers` and select. Enter your passsword to install `cmake`.
- Once drivers installed, restart Vscode, then press `F1`, type the command `Mxchip Upload Project`, make sure your MXchip is connected to the hostmachine.
- Wait for program to build and install to the devkit.


Ensure the following requirements are met before using this extension:

- Visual Studio Code version 1.87.0 or higher.
- Arduino Ide

## Extension Settings

This extension contributes the following settings:

* `mxchip-az1366.enable`: Enable/disable this extension.
* `mxchip-az1366.templateRepoUrl`: Set the URL for the GitHub repository containing the template.
* `mxchip-az1366.MXCHIPCreateProject`:  Mxchip Create New MXCHIP AZ1366 Project
* `mxchip-az1366.MXCHIPUploadProject`: Mxchip Upload Project
* `mxchip-az1366.MXCHIPExampleButtonScreenCounter`: Mxchip Example: Button Screen Counter
* `mxchip-az1366.MXCHIPExampleButtonScreenRGB`: Mxchip Example: Button Screen RGB
* `mxchip-az1366.MXCHIPExampleDinoGame`: Mxchip Example: Dino Game
* `mxchip-az1366.MXCHIPExamplePingPongGame`: Mxchip Example: Ping Pong Game
* `mxchip-az1366.MXCHIPInstallDrivers`:  Mxchip Install Drivers


## Known Issues

- macbook and IOS systems not supported at the moment. Release for macbook and IOS will be out soon.

 

## Following extension guidelines

Ensure that you've read through the extension guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
