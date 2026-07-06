import { Role } from "@/types/AuthTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";
import { Dispatch, SetStateAction } from "react";
import { storage, StorageKeys } from "./storageFunctions";
// const secretKey = process.env.EXPO_TOKEN_SECRET_KEY;
const secretKey = "secret" as const;
const tokenKey = StorageKeys.TOKEN_KEY;

export const encryptToken = (token: string): string => {
  console.log("Env variables", tokenKey, secretKey);
  return CryptoJS.AES.encrypt(token, secretKey).toString();
};

export const decryptToken = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const storeToken = async (token: string): Promise<void> => {
  const encrypted = encryptToken(token);
  await storage.set(tokenKey, encrypted);
};

export const getToken = async (): Promise<string | null> => {
  console.log("Run getToken with key,", tokenKey, secretKey);
  const encrypted = await storage.get(tokenKey);
  if (!encrypted) return null;
  return decryptToken(encrypted);
};

export const removeToken = async (): Promise<void> => {
  await storage.remove(tokenKey);
};

export async function loadAuth(
  setRole: Dispatch<SetStateAction<Role>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
): Promise<void> {
  try {
    setLoading(true);
    const token = await getToken();
    if (token) {
      setRole(Role.USER);
    } else {
      setRole(Role.GUEST);
    }
  } catch (error) {
    console.log("ERR_Auth", error);
  } finally {
    setLoading(false);
  }
}
