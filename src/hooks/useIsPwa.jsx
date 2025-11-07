import { useEffect, useState } from "react";

const useIsPwa = () => {
  const [isPwa, setIsPwa] = useState(false);

  useEffect(() => {
    window.addEventListener("appinstalled", () => {
      location.reload();
    });

    const timerId = setTimeout(
      () => setIsPwa(window.matchMedia("(display-mode: standalone)").matches),
      0
    );

    return () => clearTimeout(timerId);
  }, []);

  return isPwa;
};

export default useIsPwa;
