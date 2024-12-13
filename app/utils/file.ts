export const importFolder = (glob: Record<string, { default: string }>) =>
  Object.fromEntries(
    Object.entries(glob).map(([key, value]) => {
      const filename = key.split('/').pop();

      return [filename, value.default];
    }),
  );
