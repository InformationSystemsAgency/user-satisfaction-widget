import { createFetch } from '@vueuse/core';

export default defineNuxtPlugin(async ({ $config }) => {
  const useNPSApi = createFetch({
    baseUrl: $config.public.apiUrl,
    options: {
      onFetchError: ctx => {
        console.log(ctx);

        return ctx;
      },
    },
    fetchOptions: {
      mode: 'cors',
    },
  });

  return {
    provide: {
      useNPSApi,
    },
  };
});
