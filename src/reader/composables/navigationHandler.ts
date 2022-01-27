import { reactive, readonly } from 'vue';

interface NavigationJSON {
  type: 'book' | 'front_matter' | 'chapter' | 'text' | 'back_matter';
  data: string;
  page: number;
  active?: boolean;
}

const navigations = reactive(<NavigationJSON[]>[]);

export default function handleNavigations() {
  const addNav = (nav: NavigationJSON) => {
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
