const EXPORT_HIGHCHART_ENDPOINT = "https://export.highcharts.com";

const exportHighChart = async options => {
  return fetch(EXPORT_HIGHCHART_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(options)
  });
};

const toImageData = async blob =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export { toImageData, exportHighChart };
