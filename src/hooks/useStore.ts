// `src/renderer/hooks/useStore.ts`
import { createUseStore } from '@zubridge/electron';

// Create a hook to access the store
export const useStore = createUseStore<any>();
