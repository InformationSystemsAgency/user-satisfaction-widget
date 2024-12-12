import type { RouterConfig } from '@nuxt/schema';

export default <RouterConfig>{
  async scrollBehavior(to, _, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 30,
        behavior: 'smooth',
      };
    }

    if (savedPosition) return savedPosition;

    return { top: 0 };
  },
};
