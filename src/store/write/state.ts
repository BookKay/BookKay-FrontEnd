import { SessionStorage } from 'quasar';

import { Manuscript, EmptyManuscript } from '../interfaces';

export interface WriteStateInterface {
  loading: boolean;
  manuscript: Manuscript;
}

export default function (): WriteStateInterface {
  return {
    loading: false,

    manuscript: SessionStorage.getItem('currentManuscript') || EmptyManuscript,
  };
}
