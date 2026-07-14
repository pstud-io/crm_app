import { useState, useEffect, useCallback } from "react";
import { Image } from "react-native";

export function useImagePinCoordinates(imageUrl, fileExtension) {
  const [containerLayout, setContainerLayout] = useState(null);
  const [imageSize, setImageSize] = useState(null);

  // Get original image dimensions
  useEffect(() => {
    if (!imageUrl) return;

    Image.getSize(
      imageUrl,
      (width, height) => {
        setImageSize({ width, height });
      },
      (error) => {
        console.log("Failed to get image size", error);
      },
    );
  }, [imageUrl]);

  // Calculate rendered image rect for resizeMode="contain"
  const getRenderedImageRect = useCallback(() => {
    if (!containerLayout || !imageSize) return null;

    const containerRatio = containerLayout.width / containerLayout.height;
    const imageRatio = imageSize.width / imageSize.height;

    let width, height, x, y;

    if (imageRatio > containerRatio) {
      // Fit width
      width = containerLayout.width;
      height = width / imageRatio;
      x = 0;
      y = (containerLayout.height - height) / 2;
    } else {
      // Fit height
      height = containerLayout.height;
      width = height * imageRatio;
      y = 0;
      x = (containerLayout.width - width) / 2;
    }

    return { x, y, width, height };
  }, [containerLayout, imageSize]);

  // Convert press → normalized image coordinates
  const getPinFromPress = useCallback(
    (nativeEvent) => {
      const imageRect = getRenderedImageRect();
      if (!imageRect) return null;

      const { locationX, locationY } = nativeEvent;

      const isInsideImage =
        locationX >= imageRect.x &&
        locationX <= imageRect.x + imageRect.width &&
        locationY >= imageRect.y &&
        locationY <= imageRect.y + imageRect.height;

      if (!isInsideImage) return null;

      return {
        x: Math.round(((locationX - imageRect.x) / imageRect.width) * 10000),
        y: Math.round(((locationY - imageRect.y) / imageRect.height) * 10000),
      };
    },
    [getRenderedImageRect],
  );

  function getPinPosition(pin, imageRect) {
    if (!imageRect) return null;

    return {
      left: imageRect.x + (pin.x / 10000) * imageRect.width,
      top: imageRect.y + (pin.y / 10000) * imageRect.height,
    };
  }

  return {
    onContainerLayout: (e) => setContainerLayout(e.nativeEvent.layout),
    getPinFromPress,
    imageReady: !!containerLayout && !!imageSize,
    getRenderedImageRect,
    getPinPosition,
  };
}
