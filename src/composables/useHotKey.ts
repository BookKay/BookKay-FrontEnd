// import { Ref } from 'vue';

// import { useEventListener } from 'src/composables/useEventListener';

// interface HotkeyOptions {
//   // target element can be a reactive ref
//   target: Ref<EventTarget> | EventTarget;
//   shiftKey: boolean;
//   ctrlKey: boolean;
//   exact: boolean;
// }

// export function useHotkey(
//   key: string,
//   onKeyPressed: () => any,
//   opts?: Partial<HotkeyOptions>
// ) {
//   // get the target element
//   const target = opts?.target || window;
//   useEventListener(target, 'keydown', (e: KeyboardEvent) => {
//     const options = opts || {};
//     if (e.key === key && matchesKeyScheme(options, e)) {
//       e.preventDefault();
//       onKeyPressed();
//     }
//   });
// }

// function matchesKeyScheme(
//   opts: Pick<Partial<HotkeyOptions>, 'shiftKey' | 'ctrlKey' | 'exact'>,
//   evt: KeyboardEvent
// ) {
//   const ctrlKey = opts.ctrlKey ?? false;
//   const shiftKey = opts.shiftKey ?? false;
//   if (opts.exact) {
//     return ctrlKey === evt.ctrlKey && shiftKey == evt.shiftKey;
//   }
//   const satisfiedKeys: boolean[] = [];
//   satisfiedKeys.push(ctrlKey === evt.ctrlKey);
//   satisfiedKeys.push(shiftKey === evt.shiftKey);
//   return satisfiedKeys.every((key) => key);
// }
