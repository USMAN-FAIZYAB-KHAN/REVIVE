# 🦵 REVIVE Mobile App (Frontend)

This is the React Native application for the **REVIVE** knee rehabilitation system. It connects to the ESP32 hardware via Bluetooth (BLE) to provide real-time exercise feedback.

## 📥 Setup Instructions

### 1. Clone & Install
```bash
git clone <repository-url>
cd frontend
npm install
```

### 2. Install EAS CLI Globally
To manage builds for our team organization, you must have the EAS CLI installed:
```bash
npm install -g eas-cli
```

### 3. Log into Expo Organization
To access the shared credentials and project dashboard, every member must log in:
```bash
eas login
```
Log in with your individual Expo account. Ensure you have accepted the invitation to the **@team-revive** organization.*

## 🏗️ Building and Testing
Since this project uses **Bluetooth (BLE)**, we cannot use the standard "Expo Go" app. You must use one of our custom build profiles.

### Option A: Development Build (For Active Coding)
Use this when you are writing code and want to see changes instantly on your phone.

1. **Create the Build (if not already done):**
```bash
eas build --platform android --profile development
```

2. **Install the APK:** Download the APK from the link provided in the terminal or from the Expo Dashboard

3. **Run the Server:**
```bash
npx expo start
```

4. **Scan QR Code:** Open the **REVIVE app** you just installed and use its internal scanner to scan the terminal's QR code.

### Option B: Preview Build (For Standalone Testing)
Use this if you want to test the app without having a computer running. It functions like a final app.

1. **Create the Build:**
```bash
eas build --platform android --profile preview
```

2. **Share/Install:** Once the build is green, anyone in the team can install it directly from the website. It does **not** need a development server to run.

## 👥 Team Access (Expo Organization)
All team members must be part of the **@team-revive** organization to:

* **Manage Credentials:** EAS handles our Android Keystore automatically in the cloud.
* **Download Past Builds:** You can view every build created by the team in the Builds Dashboard.
* **Install on Device:** If any member runs a build, you can install it on your device simply by logging into the website and clicking **"Install"**.