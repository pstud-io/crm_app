import { Role } from "@/types/AuthTypes";
import { Dispatch, SetStateAction } from "react";
import { storage, StorageKeys } from "./storageFunctions";
import * as SecureStore from "expo-secure-store";
import { ProfileSliceState } from "@/store/slices/profileSlice/profileSliceTypes";

export async function storeToken(token: string) {
  await SecureStore.setItemAsync(StorageKeys.TOKEN_KEY, token);
  return;
}

export async function getToken() {
  const token = await SecureStore.getItemAsync(StorageKeys.TOKEN_KEY);
  return token;
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(StorageKeys.TOKEN_KEY);
  return;
}

export async function loadAuth(
  setRole: Dispatch<SetStateAction<Role>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
): Promise<void> {
  try {
    setLoading(true);
    const token = await getToken();
    const profile = await storage.get<ProfileSliceState>(StorageKeys.PROFILE);
    if (token && profile) {
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

export async function logOut(
  setRole: Dispatch<SetStateAction<Role>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
): Promise<void> {
  try {
    setLoading(true);
    setRole(Role.GUEST);
  } catch (error) {
    console.log("ERR_Auth", error);
  } finally {
    setLoading(false);
  }
}
