# MXCHIP AZ1366 TOOLBOX

Welcome to the **Mxchip AX1366 Toolbox** 🛠️, your gateway to a limitless realm of IoT and Embedded Systems projects! With this toolbox at your fingertips, you'll delve into the exciting world of device development, from crafting intricate button and LED interactions to seamlessly transmitting sensor data to your [Azure Platform](https://portal.azure.com).

But that's just the beginning! In upcoming releases, brace yourself for a journey into connectivity mastery. Picture this: effortlessly linking your devkit to diverse platforms like the intuitive flow-based programming of [Node-RED](https://nodered.org) 🌐, harnessing the immense capabilities of [Azure IoT Hub](https://learn.microsoft.com/en-us/azure/iot-hub) ☁️, or orchestrating events with lightning speed using [Event Grid](https://learn.microsoft.com/en-us/azure/event-grid/overview) ⚡. All this magic unfolds through cutting-edge protocols like MQTT or the ever-reliable Wi-Fi 📶.

Join us as we transform your development experience into a thrilling adventure where innovation knows no bounds! 🌟

## Current Features

- **Project Scaffolding**: Scaffold a new project with predefined templates 📝.
- **Mxchip Example Projects**: Included in this toolbox are some example projects to help interact with the Mxchip Az1366 🎓.
- **Easy Driver Installation for Project**: Supports downloading and extracting project templates automatically from a GitHub repository 💻.

## Example Projects Available

- **Button Screen RGB**: Interact with buttons and LEDs and watch the OLED screen change on the MXchip 🎨.
- **Button Screen Counter**: By pressing the onboard buttons, initiate a count system on the dev board and display on the screen 🔢.
- **Dino Game**: Test the popular Dino game from [Google Chrome](https://www.google.com/chrome) on your favorite Mxchip devkit 🦖.
- **Ping Pong Game**: Play the classic Ping Pong game on your Mxchip now 🏓.
- **IoT Hub Telemetry**: Read sensor data from the devkit and publish it to IoT Hub 📈.

### Screenshots

![alt text](https://th.bing.com/th/id/R.3395ddef35554bc223c95c8f66609a5b?rik=8itn3S%2bTmNHZfQ&riu=http%3a%2f%2fwww.cnx-software.com%2fwp-content%2fuploads%2f2017%2f06%2fMXCHIP-Azure-IoT-Devkit.jpg&ehk=S7IU0FnclXa55Rw%2fpq6w1N44vejmZIVx5r2Ep4j5G7s%3d&risl=&pid=ImgRaw&r=0)

## Requirements

### For Windows Users

- For first-time users, run this command in PowerShell as an **Admin**: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned`.
- After that, type **Y** and press Enter.
- Press `F1` and type and select the command `Mxchip Create New MXCHIP AZ1366 Project`.
- After the project has been scaffolded, open it in a new window or the current one.
- Press `F1` and type the command `Mxchip Install Drivers` and select it. Click yes to the prompt to install `cmake`.
  - (Please note this step may take some time, so please grab a cup of coffee ☕ and wait).
- Once the drivers are installed, include cmake in the environmental path. See the gif below for a guide.
- Restart VSCode, then press `F1`, type the command `Mxchip Upload Project`, and make sure your MXchip is connected to the host machine.
- Wait for the program to build and install on the devkit.

### For Linux Users

- For first-time users, press `F1` and type and select the command `Mxchip Create New MXCHIP AZ1366 Project`.
- After the project has been scaffolded, open it in a new window or the current one.
- Press `F1` and type the command `Mxchip Install Drivers` and select it. Enter your password to install `cmake`.
- Once the drivers are installed, restart VSCode, then press `F1`, type the command `Mxchip Upload Project`, and make sure your MXchip is connected to the host machine.
- Wait for the program to build and install on the devkit.

Ensure the following requirements are met before using this extension:

- Visual Studio Code version 1.87.0 or higher.
- Arduino IDE.

## Extension Settings

This extension contributes the following settings:

- `mxchip-az1366.enable`: Enable/disable this extension.
- `mxchip-az1366.templateRepoUrl`: Set the URL for the GitHub repository containing the template.
- `mxchip-az1366.MXCHIPCreateProject`: Mxchip Create New MXCHIP AZ1366 Project.
- `mxchip-az1366.MXCHIPUploadProject`: Mxchip Upload Project.
- `mxchip-az1366.MXCHIPExampleButtonScreenCounter`: Mxchip Example: Button Screen Counter.
- `mxchip-az1366.MXCHIPExampleButtonScreenRGB`: Mxchip Example: Button Screen RGB.
- `mxchip-az1366.MXCHIPExampleDinoGame`: Mxchip Example: Dino Game.
- `mxchip-az1366.MXCHIPExamplePingPongGame`: Mxchip Example: Ping Pong Game.
- `mxchip-az1366.MXCHIPInstallDrivers`: Mxchip Install Drivers.

## Roadmap / Upcoming Features 🌟

- **Node-RED Integration**: Intuitive flow-based programming for your Mxchip.
- **Azure Event Grid**: Orchestrate events with lightning speed.
- **.NET Nano Framework**: Enhanced capabilities for your Mxchip projects.

## Known Issues

- macOS and iOS systems are not supported at the moment. The release for macOS and iOS will be out soon.

## For More Information

- [Visit the Extension Repository](https://github.com/Arnold208/mxchip-az1366-extension)
- [MXCHIP Devkit](https://github.com/Arduinolibrary/MXChip-Microsoft-Azure-IoT-Developer-Kit/blob/master/az3166-pin-breakout.pdf)

## For more Hands-on Demo and Projects on the Mxchip Az1366 devkit.

- [Subscribe to the IoT Tuesday Show on YouTube by Samuel Adranyi](https://www.youtube.com/@sadranyi)
- [IoT Tuesday Show Series on the MXChip](https://www.youtube.com/watch?v=XN3sm4AvYFg)

**Enjoy!** 🎉
