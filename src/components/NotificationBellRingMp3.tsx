import useBellSound from "@/stores/use-bell-sound";
import React, { useEffect, useRef } from "react";

const NotificationBellRingMp3 = () => {
  const isRing = useBellSound((state) => state.isRing);
  const clear = useBellSound((state) => state.clear);
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log(isRing);
    if (isRing) {
      ref.current?.play();
    }

    const ub = setTimeout(() => {
      clear();
    }, 2000);

    return () => {
      clearTimeout(ub);
    };
  }, [isRing]);

  return (
    <audio
      ref={ref}
      controls
      className="hidden"
      preload="auto"
      onLoadedData={() => console.log("Audio loaded")}
      onError={(e) => console.error("Audio error:", e)}
    >
      <source src="/bell-sound.mp3" type="audio/mp3" />
    </audio>
  );
};

export default NotificationBellRingMp3;
