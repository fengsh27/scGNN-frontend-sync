export const getFetchUrl = (subPath: string, path: string) => (
  subPath.length > 0 && subPath !== "/" ? subPath + path : path
);
    