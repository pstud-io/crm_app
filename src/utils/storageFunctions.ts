import AsyncStorage from "@react-native-async-storage/async-storage";

export enum StorageKeys {
  TOKEN_KEY = "token",
  RefreshToken = "refresh_token",
  THEME_KEY = "theme",
  User = "user",
}

export const storage = {
  async get(key: StorageKeys) {
    return AsyncStorage.getItem(key);
  },

  async set(key: StorageKeys, value: string) {
    return AsyncStorage.setItem(key, value);
  },

  async remove(key: StorageKeys) {
    return AsyncStorage.removeItem(key);
  },

  async clear() {
    return AsyncStorage.clear();
  },
};
