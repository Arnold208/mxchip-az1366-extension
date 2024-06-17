# Getting Started with Azure RTOS and Azure IoT

![](https://github.com/azure-rtos/getting-started/workflows/Markdown%20links/badge.svg)

The Getting Started guides will help you get started with Azure RTOS. Each guide will step through from toolchain installation to connecting the device to Azure IoT using IoT Plug and Play.

For more information on Azure IoT Device Development:
* [Azure IoT Device Development Documentation](https://docs.microsoft.com/azure/iot-develop) - Get started with Azure IoT device development 📚
* For product issues, bugs, or feature requests please use our GitHub issues pages for the dedicated middleware (e.g., for ThreadX: https://github.com/azure-rtos/threadx/issues). 🛠️
* [Azure RTOS Q&A](https://aka.ms/QnA/azure-rtos) - Ask a question ❓

## Recent Changes

### 🕰️ Temporary Fix for SNTP Servers

In response to issues with SNTP servers, we've implemented a temporary fix by using the compiled date and time to set up the SNTP time. This ensures that your device can initialize correctly even when SNTP servers are unreachable. Future updates will include an HTTPS time client for a more robust solution.

### 📺✨ Customization for IoT Tuesday Sessions

This SDK has been customized for IoT Tuesday Sessions hosted by Samuel Adranyi. Join the sessions every Tuesday at 9:00 PM GMT on the [YouTube channel](https://www.youtube.com/@sadranyi).

Subscribe, like, and hit the notification bell 🔔 for new updates. 👍👍

Stay tuned for more exciting customizations to come! 🚀

## 📝 Prerequisites

- 🖥️ A PC running Windows 10 or Windows 11
- ☁️ An active Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
- 🛠️ Git for cloning the repository
- 🔧 Azure CLI. You have two options for running Azure CLI commands in this tutorial:
  - **Option 1**: Use the Azure Cloud Shell, an interactive shell that runs CLI commands in your browser. This option is recommended because you don't need to install anything. If you're using Cloud Shell for the first time, sign in to the [Azure portal](https://portal.azure.com). Follow the steps in [Cloud Shell quickstart](https://docs.microsoft.com/azure/cloud-shell/quickstart) to start Cloud Shell and select the Bash environment.
  - **Option 2**: Run Azure CLI on your local machine. If Azure CLI is already installed, run `az upgrade` to upgrade the CLI and extensions to the current version. To install Azure CLI, see [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).
- 🛠️ **Hardware**:
  - The MXCHIP AZ3166 IoT DevKit (MXCHIP DevKit)
  - Wi-Fi 2.4 GHz
  - USB 2.0 A male to Micro USB male cable

## 🚀 Steps to Setup

1. **Clone this repository**:
   git clone https://github.com/Arnold208/mxchip-AZ3166-getting-started.git

2. **Install the development tools:**
- Go to the `mxchip-AZ3166-getting-started/tools` directory
- **Windows:** Run the `get-toolchain.bat` file
- **Linux/Mac:** Run the `get-toolchain.sh` file

3. **Add Wi-Fi and Azure IoT configuration to the config file:**
- Edit the file `mxchip-AZ3166-getting-started\MXChip\AZ3166\app\azure_config.h` with your configuration details.

4. **Build the binary image:**
- Go to the `mxchip-AZ3166-getting-started\MXChip\AZ3166\tools` directory
- **Windows:** Run the `rebuild.bat` file
- **Linux/Mac:** Run the `rebuild.sh` file

5. **Flash the image to the device by copying the image file to the AZ3166 drive:**
- Go to the `mxchip-AZ3166-getting-started\MXChip\AZ3166\build\app\mxchip_azure_iot.bin` directory

6. **Configure a serial port app at baud rate `115200` to monitor the device output.**

## 🤝 Contributing

For details on contributing to this repository, see the [contributing](CONTRIBUTING.md) guide.

## 🔒 Reporting Security Vulnerabilities

If you believe you have found a security vulnerability in any Microsoft-owned repository that meets Microsoft's definition of a security vulnerability, please report it to the [Microsoft Security Response Center](SECURITY.md).

## 📄 License

The Azure RTOS Getting Started guides are licensed under the [MIT](LICENSE.txt) license.
