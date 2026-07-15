import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  createAudioPlayer,
  setAudioModeAsync,
  useAudioPlayerStatus,
} from "expo-audio";

const AudioPlayer = ({ uri }) => {
  const [player] = useState(() => createAudioPlayer({ uri }));
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });

    return () => {
      player.remove();
    };
  }, [player]);

  const togglePlayPause = async () => {
    if (status.playing) {
      player.pause();
      return;
    }

    if (status.duration > 0 && status.currentTime >= status.duration) {
      player.seekTo(0);
    }

    player.play();
  };

  return (
    <View style={styles.audioPlayer}>
      <TouchableOpacity onPress={togglePlayPause} style={styles.audioButton}>
        <MaterialIcons
          name={status.playing ? "pause-circle-filled" : "play-circle-filled"}
          size={64}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  audioPlayer: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    width: "100%",
  },
  audioButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});
