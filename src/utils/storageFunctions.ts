import AsyncStorage from "@react-native-async-storage/async-storage";

export enum StorageKeys {
  TOKEN_KEY = "token",
  REFRESH_TOKEN = "refresh_token",
  THEME_KEY = "theme",
  USER = "user",
  PROFILE = "profile",
}

export const storage = {
  async get<T>(key: StorageKeys): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },

  async set<T>(key: StorageKeys, value: T) {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: StorageKeys) {
    return AsyncStorage.removeItem(key);
  },

  async clear() {
    return AsyncStorage.clear();
  },
};
