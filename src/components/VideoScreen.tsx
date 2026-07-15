import { memo, useEffect } from "react";
import { StyleSheet } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

const VideoPlayer = ({ uri }: { uri: string }) => {
  const videoSource =
    "https://dytjimnn1nskw.cloudfront.net/87dfeb53-8bd1-487b-9615-2270be0d7abd/a72a1a94-b3ea-44ef-9a16-8053637c7b72/20260715T082132701ZVIDEO_1784103691074.mp4";

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener(
      "statusChange",
      ({ status, error }) => {
        console.log("Video Status:", status);

        if (error) {
          console.error("Video Error:", error);
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <VideoView
      player={player}
      style={styles.video}
      nativeControls
      contentFit="contain"
      allowsPictureInPicture
    />
  );
};

export default memo(VideoPlayer);

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: "100%",
  },
});
