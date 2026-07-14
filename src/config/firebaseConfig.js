import { initializeApp, getApps } from "@react-native-firebase/app";

console.log("🔥 Initializing Firebase App");

// Only initialize Firebase if it hasn't been already
if (getApps().length === 0) {
  initializeApp(); // Uses native files: GoogleService-Info.plist / google-services.json
}
