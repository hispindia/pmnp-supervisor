import { useEffect, useRef } from "react";

const useDisableSwipeDownRefresh = () => {
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      touchEndY.current = e.touches[0].clientY;
      const isScrollingDown = touchStartY.current < e.touches[0].clientY;
      // const isBody = e.target === document.body;
      console.log(e);
      if (isScrollingDown && window.scrollY === 0) {
        e.preventDefault();
      }
    };

    const onTouchEnd = () => {
      touchStartY.current = 0;
      touchEndY.current = 0;
    };

    document.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("touchstart", onTouchStart, {
        passive: false,
      });
      document.removeEventListener("touchmove", onTouchMove, {
        passive: false,
      });
      document.removeEventListener("touchend", onTouchEnd, { passive: false });
    };
  }, []);
};

export default useDisableSwipeDownRefresh;
