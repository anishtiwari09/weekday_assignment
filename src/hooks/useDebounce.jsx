import React, { useCallback, useEffect, useMemo, useRef } from "react";

export default function useDebounce(delay, func) {
  const debounce = useCallback((delay, func) => {
    let id = 0;
    return function () {
      clearTimeout(id);
      id = setTimeout(() => {
        func();
      }, delay);
    };
  }, []);

  const debounceFn = useMemo(() => {
    return debounce(delay, func);
  }, []);
  return debounceFn;
}
