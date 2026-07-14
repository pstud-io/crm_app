import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { ChevronUp, CloseOutlineIcon, LeftArrowOutlineIcon } from "../../svg";
import { SH, SW } from "../../utils";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native";

const AudioPlayer = ({ uri }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const Audio = useAudioPlayer();

  React.useEffect(() => {
    loadSound();

    return () => {
      console.log("In return of audIo useeffect");
      if (sound) {
        console.log("In if statement of audIo useeffect");
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadSound = async () => {
    if (sound) return;

    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish && !status.isLooping) {
        // Defer position reset to next play call
        setIsPlaying(false);
      }
    });
  };

  const togglePlayPause = async () => {
    if (!sound) {
      await loadSound();
      return;
    }

    const status = await sound.getStatusAsync();

    if (status.isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      if (
        status.didJustFinish ||
        status.positionMillis === status.durationMillis
      ) {
        await sound.setPositionAsync(0); // Reset only once
      }
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.audioPlayer}>
      <TouchableOpacity onPress={togglePlayPause} style={styles.audioButton}>
        <MaterialIcons
          name={isPlaying ? "pause-circle-filled" : "play-circle-filled"}
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
