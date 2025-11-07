import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";
import "photoswipe/style.css";
import { FileImageOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

const preloadImg = (src) =>
  new Promise((res, rej) => {
    const img = new Image();
    img.onload = (result) => res(img);
    img.onerror = (error) => rej(error);
    img.src = src;
  });

const LoadWidthHeight = ({ children, src }) => {
  const [state, setState] = useState({});

  useEffect(() => {
    (async () => {
      const result = await preloadImg(src);
      setState({ width: result.width, height: result.height });
    })();
  }, []);

  return children(state);
};

const HyperLink = ({ hyperlink, base64 }) => {
  const wrapperRef = useRef();

  useEffect(() => {
    let lightbox;

    setTimeout(() => {
      if (!wrapperRef.current) return;

      lightbox = new PhotoSwipeLightbox({
        gallery: wrapperRef.current,
        children: "a",
        pswpModule: PhotoSwipe,
        imageClickAction: "zoom",
        doubleTapAction: "zoom",
        wheelToZoom: true,
      });

      lightbox.on("uiRegister", function () {
        lightbox.pswp.ui.registerElement({
          name: "download-button",
          order: 8,
          isButton: true,
          tagName: "a",
          html: {
            isCustomSVG: true,
            inner:
              '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
            outlineID: "pswp__icn-download",
          },
          onInit: (el, pswp) => {
            el.setAttribute("download", base64.name || "downloaded-file.png");
            el.setAttribute("target", "_blank");
            el.setAttribute("rel", "noopener");

            pswp.on("change", () => {
              el.href = pswp.currSlide.data.src;
            });
          },
        });
      });

      lightbox.init();
    });

    return () => {
      if (lightbox) {
        lightbox.destroy();
        lightbox = null;
      }
    };
  }, []);

  if (base64) {
    return (
      <div ref={wrapperRef} style={{ display: "inline-block" }}>
        <LoadWidthHeight key={base64.name} src={base64.base64Image}>
          {({ width, height }) => (
            <a href={base64.base64Image} data-pswp-width={width} data-pswp-height={height}>
              <FileImageOutlined style={{ fontSize: "18px" }} />
            </a>
          )}
        </LoadWidthHeight>
      </div>
    );
  }
};

export default HyperLink;
