import { useEffect, useState } from 'react';

const useDarkMode = (defaultMode:boolean):boolean => {
  const [darkMode, setDarkMode] = useState(defaultMode);

  const modeMe = (e:any) => {
    setDarkMode(!!e.matches);
  };

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

    setDarkMode(matchMedia.matches);
    matchMedia.addEventListener("change", modeMe);

    return () => matchMedia.removeEventListener("change", modeMe);
  }, []);

  return darkMode;
};
export default useDarkMode;