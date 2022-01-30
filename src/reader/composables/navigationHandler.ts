import { reactive, readonly } from 'vue';

import { NavigationInterface } from 'src/reader/interfaces';

const navigations = reactive(<NavigationInterface[]>[]);

export default function handleNavigations() {
  const addNav = (nav: NavigationInterface) => {
    if (!('active' in nav)) {
      nav.active = false;
    }
    navigations.push(nav);
  };

  const clearNav = () => {
    navigations.length = 0;
  };

  return { navigations: readonly(navigations), addNav, clearNav };
}
