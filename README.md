# MXCHIP AZ1366 TOOLBOX

Welcome to the **Mxchip AX1366 Toolbox** 🛠️, your gateway to a limitless realm of **IoT and Embedded Systems** projects! With this toolbox at your fingertips, you'll delve into the exciting world of device development, from crafting intricate button and LED interactions to seamlessly transmitting sensor data to your [Azure Platform](https://portal.azure.com).

But that's just the beginning! In upcoming releases, get ready to **expand connectivity options** 🚀:
- ✅ **MQTT Integration**: Effortlessly publish and subscribe to topics using [Mosquitto MQTT](https://mosquitto.org/) or [Azure IoT Hub](https://learn.microsoft.com/en-us/azure/iot-hub).
- 🌐 **Node-RED Connectivity**: Use the intuitive **flow-based programming** of [Node-RED](https://nodered.org) for rapid prototyping.
- ⚡ **Azure Event Grid Support**: Harness **real-time event-driven** architecture with [Event Grid](https://learn.microsoft.com/en-us/azure/event-grid/overview).
- 📶 **Advanced Protocol Support**: Work with **Wi-Fi, MQTT, and HTTP APIs** to enable **seamless device-to-cloud communication**.

Join us as we transform your development experience into a **thrilling adventure** where innovation knows no bounds! 🌟

---

## **✨ New Features in This Release**
### **🔹 MQTT Support**
- Easily **publish sensor data** to an MQTT broker using **Mosquitto**.
- Subscribe to topics and control your MXChip remotely via MQTT messages.
- Connect with **popular MQTT brokers**, including:
  - [Mosquitto MQTT Broker](https://mosquitto.org/)
  - [HiveMQ Public Broker](https://www.hivemq.com/public-mqtt-broker/)
  - [Azure IoT Hub MQTT](https://learn.microsoft.com/en-us/azure/iot-hub/iot-hub-mqtt-support)
  - [Adafruit IO](https://io.adafruit.com/)
  
💡 **Example:** Publish temperature sensor data to an MQTT topic:
```c
mqtt_publish("devices/mxchip/sensors", "{\"temperature\": 24.5, \"humidity\": 60}");
```

---

## **Current Features**
- **Project Scaffolding**: Scaffold a new project with predefined templates 📝.
- **Mxchip Example Projects**: Included in this toolbox are some example projects to help interact with the Mxchip Az1366 🎓.
- **Easy Driver Installation**: Supports downloading and extracting project templates automatically from GitHub 💻.
- **MQTT Integration**: Connect to an MQTT broker, publish sensor data, and control the devkit remotely. 🚀

---

## **Example Projects Available**
- **Button Screen RGB**: Interact with buttons and LEDs and watch the OLED screen change on the MXchip 🎨.
- **Button Screen Counter**: Initiate a count system on the dev board and display it on the screen 🔢.
- **Dino Game**: Play the **Google Chrome Dino game** on your Mxchip devkit 🦖.
- **Ping Pong Game**: Enjoy the classic **Ping Pong** game on your MXChip 🏓.
- **IoT Hub Telemetry**: Read sensor data from the devkit and publish it to **Azure IoT Hub** 📈.
- **MQTT Client Example**: Publish and subscribe to MQTT topics in real-time 📡.

---

## **🖥️ Setup Guide**
### **For Windows Users**
1. Run this command in **PowerShell as Admin**:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
   ```
2. Press **Y**, then Enter.
3. Press `F1`, type and select `Mxchip Create New MXCHIP AZ1366 Project`.
4. Open the project in a **new window**.
5. Press `F1`, select **`Mxchip Install Drivers`**.
   - This will install `cmake`, `GCC ARM Toolchain`, and other dependencies.
   - *(Note: This step may take some time, so grab a coffee ☕.)*
6. Restart VSCode, then press `F1`, type **`Mxchip Upload Project`**, and connect your MXchip.
7. Wait for the build to complete and the firmware to install.

### **For Linux Users**
1. Press `F1`, type and select `Mxchip Create New MXCHIP AZ1366 Project`.
2. Open the project in a new window.
3. Press `F1`, select **`Mxchip Install Drivers`** (Enter your password to install `cmake`).
4. Restart VSCode, then press `F1`, type **`Mxchip Upload Project`**, and connect your MXchip.
5. Wait for the build and installation to complete.

---

## **🚧 Upcoming Features**
### 🌐 **Node-RED Integration**
- Seamlessly integrate with **Node-RED** to visualize and control sensor data.
- Drag-and-drop MQTT blocks for **low-code automation**.

### ☁️ **Azure Event Grid**
- Use **Azure Event Grid** for **real-time IoT event-driven applications**.
- Stream data directly from MXChip to **serverless functions & cloud services**.

---

## **📅 Roadmap**
✔ **Current:** MQTT integration with Mosquitto and other Brookers.  
🔜 **Coming Soon:** Node-RED integration for flow-based programming.  
🔜 **Coming Soon:** Azure Event Grid setup for cloud event automation.  

---

## **🔧 Extension Settings**

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
- `mxchip-az1366.MXCHIPExampleMQTTClient`: Mxchip Example: MQTT Client.

---

## **📜 License**
This project is licensed under the **MIT License**.  
See the [LICENSE](https://github.com/Arnold208/mxchip-az1366-extension/blob/main/LICENSE) file for details.

---

**🚀 Enjoy developing with MXChip!** 🎉

## 🚧 Known Issues

- **macOS and iOS Systems Not Supported**: Release for macOS and iOS will be out soon.
- **Path Length Limitations(Windows)**: Enabling long paths in Windows can introduce potential compatibility issues with older applications or tools that do not support long paths. Additionally, certain file system tools might not handle long paths correctly, which can affect the integrity of backups or other file system operations. Long and complex paths might also make it more challenging to manage and audit user permissions, and malware or malicious users might take advantage of long paths to hide files or directories.
  - **Solution**: To enable long paths in Windows, you can follow these steps:
    1. Open the `Local Group Policy Editor` by typing `gpedit.msc` in the Run dialog (Win + R).
    2. Navigate to `Local Computer Policy` > `Computer Configuration` > `Administrative Templates` > `System` > `Filesystem`.
    3. Double-click on `Enable NTFS long paths` and set it to `Enabled`.
    4. Click `OK` and restart your computer.


## 🤝 Credits

Special thanks to the original creators of the code:

- [Microsoft Learn Tutorial for MXCHIP AZ3166](https://learn.microsoft.com/en-us/azure/iot/tutorial-devkit-mxchip-az3166-iot-hub)
- [Eclipse ThreadX Getting Started Guide](https://github.com/eclipse-threadx/getting-started)
- [Eclipse ThreadX IoT DevKit Starter Application](https://github.com/eclipse-threadx/iot-devkit)


## For More Information

- [Visit the Extension Repository](https://github.com/Arnold208/mxchip-az1366-extension)
- [MXCHIP Devkit](https://github.com/Arduinolibrary/MXChip-Microsoft-Azure-IoT-Developer-Kit/blob/master/az3166-pin-breakout.pdf)

## For more Hands-on Demo and Projects on the Mxchip Az1366 devkit.

- [Subscribe to the IoT Tuesday Show on YouTube by Samuel Adranyi](https://www.youtube.com/@sadranyi)
- [IoT Tuesday Show Series on the MXChip](https://www.youtube.com/watch?v=XN3sm4AvYFg)

- [Arnold Kimkpe's Blog for IoT & Node-RED Tutorials](https://arnold8kimkpe.hashnode.dev/) *(Stay tuned for the Node-RED tutorial!)*


## 🛠 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository on GitHub.
2. Create a new branch from `main`.
3. Make your changes and commit them with clear messages.
4. Push your changes to your forked repository.
5. Create a Pull Request (PR) to the `main` branch of the original repository.

Please ensure your code adheres to our coding standards and includes tests where applicable.

## 🐛 Issue Tracking

Found a bug or have a feature request? Please open an issue on our [GitHub Issues](https://github.com/Arnold208/mxchip-az1366-extension/issues) page.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Arnold208/mxchip-az1366-extension/blob/main/LICENSE) file for details.
 
**Enjoy!** 🎉
