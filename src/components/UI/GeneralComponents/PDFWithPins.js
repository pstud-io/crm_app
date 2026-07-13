import React, { useEffect, useState, useMemo, useRef } from "react";
import { View, ActivityIndicator } from "react-native";
import WebView from "react-native-webview";
import { Buffer } from "buffer";
import { openNewPinCommentBottomSheet } from "../../common/NewPinCommentBottomSheetService";
import { SH, SW } from "../../../utils";

export default function PDFWithPins({
  uri,
  newPinCommentBottomSheetRef,
  urlRefForMedia,
  item,
  setShowActionButtonsNCS,
  setActiveChain,
  setShowActionButtonsVCS,
  viewPinCommentBottomSheetRef,
  activeMediaPinCommentsData,
}) {
  const webRef = useRef(null);
  const [pdfReady, setPdfReady] = useState(false);
  useEffect(() => {
    if (!webRef.current || !activeMediaPinCommentsData) return;

    const payload = JSON.stringify(activeMediaPinCommentsData);

    webRef.current.injectJavaScript(`
    (function() {
      window.renderPins(JSON.parse(${JSON.stringify(payload)}));
    })();
    true;
  `);
  }, [activeMediaPinCommentsData]);

  const html = useMemo(() => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
<script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"></script>
<style>
  body { margin:0; background:#f5f5f5; overflow-x:hidden; }
    * {
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    user-select: none;
  }
  #container { position: relative; }
  canvas { display:block; margin:0 auto; }
  .pin {
    position:absolute;
    border-radius:12px;
    background:#1976d2;
    z-index:9999;
  }
      .pin svg {
    width:80%;
    height:80%;
  }
</style>
</head>

<body>
<div id="container"></div>

<script>
pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

let totalHeight = 0;
let pdfWidth = 0;
let container = document.getElementById("container");

async function loadPDF() {
const loadingTask = pdfjsLib.getDocument({
    url: "${uri}",
    cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
    cMapPacked: true,
});

  const pdf = await loadingTask.promise;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
  const page = await pdf.getPage(pageNumber);

  const unscaledViewport = page.getViewport({ scale: 1 });
  const scale = window.innerWidth / unscaledViewport.width;

  const QUALITY_FACTOR = 0.75;

  const devicePixelRatio = window.devicePixelRatio || 2;

  const viewport = page.getViewport({
    scale: scale * devicePixelRatio,
  });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // High resolution canvas
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // Visually scale it down
  canvas.style.width = viewport.width / devicePixelRatio + "px";
  canvas.style.height = viewport.height / devicePixelRatio + "px";

  container.appendChild(canvas);

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  if (pageNumber === 1) {
    pdfWidth = viewport.width / devicePixelRatio;
  }

  totalHeight += viewport.height / devicePixelRatio;
}

  window.ReactNativeWebView.postMessage(JSON.stringify({
    type: "PDF_READY"
  }));
}

function renderPins(pins) {
  document.querySelectorAll(".pin").forEach(p => p.remove());

  pins.forEach(pin => {
    if (!pin.x_coordinate || !pin.y_coordinate) return;

    const el = document.createElement("div");
    el.className = "pin";

    const relativeX = pin.x_coordinate / 10000;
    const relativeY = pin.y_coordinate / 40000;

    const pinSize = ${SW(20)};

    el.style.position = "absolute";
    el.style.width = pinSize + "px";
    el.style.height = pinSize + "px";
    el.style.left = (relativeX * pdfWidth - ${SW(6)}) + "px";
    el.style.top = (relativeY * totalHeight - ${SH(6)}) + "px";
    el.style.zIndex = "9999";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";

    /* ===== CREATE SVG PROPERLY ===== */

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 -960 960 960");
    svg.setAttribute("width", "60%");
    svg.setAttribute("height", "60%");
    svg.setAttribute("fill", "#fff");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d",
      "M365-580Zm-5 540-40-40v-240H120v-80l80-80v-280h-40v-80h285q-18 17-32.5 37T387-760H280v314l-46 46h263q24 14 49.5 23.5T600-363v43H400v240l-40 40Zm280-600q25 0 42.5-17.5T700-700q0-25-17.5-42.5T640-760q-25 0-42.5 17.5T580-700q0 25 17.5 42.5T640-640Zm0 120q31 0 56.5-14.5T739-573q-22-13-47-20t-52-7q-27 0-52 7t-47 20q17 24 42.5 38.5T640-520Zm0 80q-83 0-141.5-58.5T440-640q0-83 58.5-141.5T640-840q83 0 141.5 58.5T840-640q0 83-58.5 141.5T640-440Z"
    );

    svg.appendChild(path);
    el.appendChild(svg);

    el.onclick = () => {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: "PIN_CLICK",
        id: pin.id
      }));
    };

    container.appendChild(el);
  });
}



window.renderPinsFromRN = function(pins) {
  renderPins(pins);
};

/* ===== LONG PRESS (UNCHANGED LOGIC) ===== */

let pressTimer = null;
let startX = 0;
let startY = 0;
let moved = false;

const LONG_PRESS_DURATION = 500;
const MOVE_THRESHOLD = 10;

document.addEventListener("touchstart", function(event) {
  const touch = event.touches[0];
  startX = touch.pageX;
  startY = touch.pageY;
  moved = false;

  pressTimer = setTimeout(() => {
    if (!moved) {
      handleLongPress(startX, startY);
    }
  }, LONG_PRESS_DURATION);
});

document.addEventListener("touchmove", function(event) {
  const touch = event.touches[0];
  const dx = Math.abs(touch.pageX - startX);
  const dy = Math.abs(touch.pageY - startY);

  if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
    moved = true;
    clearTimeout(pressTimer);
  }
});

document.addEventListener("touchend", function() {
  clearTimeout(pressTimer);
});

function handleLongPress(pageX, pageY) {
  const rect = container.getBoundingClientRect();
  const scrollY = window.scrollY || window.pageYOffset;

  const pdfX = pageX - rect.left;
  const pdfY = pageY - (rect.top + scrollY);

  const relativeXFromPDF = pdfX / pdfWidth;
  const relativeYFromPDF = pdfY / totalHeight;

  window.ReactNativeWebView.postMessage(JSON.stringify({
    type: "CREATE_PIN",
    relativeXFromLeftOfPDF: relativeXFromPDF,
    relativeYFromTopOfPDF: relativeYFromPDF
  }));
}

window.onload = loadPDF;
</script>
</body>
</html>
`;
  }, [uri]);

  return (
    <View style={{ width: "100%", height: "100%", position: "relative" }}>
      {!pdfReady && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            zIndex: 1000,
          }}
        >
          <ActivityIndicator size={SH(32)} />
        </View>
      )}
      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html, baseUrl: "https://app.projectstudio.ai" }}
        javaScriptEnabled
        domStorageEnabled={true}
        allowFileAccess={true}
        cacheEnabled={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        mixedContentMode="always"
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);

          if (data.type === "PDF_READY") {
            setPdfReady(true);
            if (webRef.current) {
              webRef.current.postMessage(
                JSON.stringify({
                  type: "RENDER_PINS",
                  pins: activeMediaPinCommentsData || [],
                }),
              );

              webRef.current.injectJavaScript(
                "window.renderPinsFromRN(" +
                  JSON.stringify(activeMediaPinCommentsData || []) +
                  "); true;",
              );
            }
          }

          if (data.type === "PIN_CLICK") {
            const chain = activeMediaPinCommentsData.find(
              (c) => c.id === data.id,
            );
            setActiveChain(chain);
            setShowActionButtonsVCS(false);
            viewPinCommentBottomSheetRef.current?.expand();
          }

          if (data.type === "CREATE_PIN") {
            const pin = {
              x: Math.round(data.relativeXFromLeftOfPDF * 10000),
              y: Math.round(data.relativeYFromTopOfPDF * 40000),
            };

            setShowActionButtonsNCS(false);

            openNewPinCommentBottomSheet(
              {
                context_id: item.id,
                pin_comment_chain_id: null,
                pin,
              },
              newPinCommentBottomSheetRef,
              urlRefForMedia,
            );
          }
        }}
      />
    </View>
  );
}
