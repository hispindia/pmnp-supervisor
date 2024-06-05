const EXPORT_HIGHCHART_ENDPOINT = "https://export.highcharts.com";

const exportHighChart = async (options) => {
  return fetch(EXPORT_HIGHCHART_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
};

const toImageData = async (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const convertSVGToBase64 = (svgString) => {
  return new Promise(async (resolve, reject) => {
    const parser = new DOMParser();
    const svgElem = parser.parseFromString(
      svgString,
      "image/svg+xml"
    ).documentElement;

    // Serialize the SVG element to string
    const svgXml = new XMLSerializer().serializeToString(svgElem);
    const blob = new Blob([svgXml], { type: "image/svg+xml" });
    const svgBase64 = await toImageData(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const base64Image = canvas.toDataURL("image/png"); // 'image/jpeg' nếu bạn muốn định dạng khác
      resolve(base64Image);
    };
    img.onerror = (error) => reject(error);
    img.src = svgBase64;
  });
};

export { toImageData, exportHighChart, convertSVGToBase64 };
