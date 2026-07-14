import { useCallback, useRef, useState } from "react";

/**
 * Absolute PDF coordinate system
 * Y = 0 is top of page 1
 */
export function usePDFPinCoordinates({ pageHeight, pageSpacing = 16 }) {
  const scaleRef = useRef(1);
  const pageLayoutsRef = useRef([]);
  const containerHeightRef = useRef(0);

  const [ready, setReady] = useState(false);

  /** Called once PDF layout stabilizes */
  const registerPages = useCallback(
    (pageCount) => {
      const layouts = [];
      let offsetY = 0;

      for (let i = 0; i < pageCount; i++) {
        layouts.push({
          pageIndex: i,
          top: offsetY,
          bottom: offsetY + pageHeight,
        });
        offsetY += pageHeight + pageSpacing;
      }

      pageLayoutsRef.current = layouts;
      setReady(true);
    },
    [pageHeight, pageSpacing],
  );

  /** Track zoom (from onScaleChanged) */
  const onScaleChanged = useCallback((scale) => {
    scaleRef.current = scale;
  }, []);

  /** Container height */
  const onContainerLayout = useCallback((e) => {
    containerHeightRef.current = e.nativeEvent.layout.height;
  }, []);

  /** Convert long-press → absolute PDF Y */
  const getPinFromPress = useCallback(
    (nativeEvent) => {
      if (!ready) return null;

      const { locationY } = nativeEvent;
      const scale = scaleRef.current;

      const absoluteY = locationY / scale;

      const page = pageLayoutsRef.current.find(
        (p) => absoluteY >= p.top && absoluteY <= p.bottom,
      );

      if (!page) return null;

      // Reject spacing taps
      const isInSpacing =
        absoluteY > page.bottom && absoluteY < page.bottom + pageSpacing;

      if (isInSpacing) return null;

      return {
        y: Math.round(absoluteY),
      };
    },
    [ready, pageSpacing],
  );

  /** Convert stored pin → screen position */
  const getPinPosition = useCallback(
    (pin) => {
      if (!ready) return null;

      const scale = scaleRef.current;

      const page = pageLayoutsRef.current.find(
        (p) => pin.y >= p.top && pin.y <= p.bottom,
      );

      if (!page) return null;

      const yOnPage = pin.y - page.top;

      return {
        top: (page.top + yOnPage) * scale,
      };
    },
    [ready],
  );

  return {
    ready,
    registerPages,
    onScaleChanged,
    onContainerLayout,
    getPinFromPress,
    getPinPosition,
  };
}
