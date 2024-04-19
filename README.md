# Discord Automation Script

This Playwright script automates logging into Discord, navigating to a server, and interacting with server threads.

## Prerequisites

- Node.js (LTS version recommended)
- npm (usually comes with Node.js)
- Playwright
- OTP library for two-factor authentication (2FA)

## Setup

1. **Install Node.js and npm**: Download and install Node.js from the [official website](https://nodejs.org/).

2. **Clone the repository**:
    ```bash
    git clone https://github.com/CptZO/discordAutomateThreadCreation
    cd discordAutomateThreadCreation
    ```

3. **Install Dependencies**:
    Navigate to the project directory and install the required dependencies using npm.
    ```bash
    npm install
    ```

4. **Environment Variables**:
    Create a `.env` file in the root of your project and define the following variables:
    ```plaintext
    DISCORD_EMAIL=your_email@example.com
    DISCORD_PASSWORD=your_password
    TOTP_SECRET=your_2fa_secret
    DISCORD_SERVER_NAME=your_discord_server_name
    ```

## Running the Script

To run the script, execute the following command in the terminal:
```bash
node discord_automation.js
