import { reactive } from 'vue';
import { throttle } from 'quasar';
//Note: Cannot use types yet as there are not type declarations for handsfreejs
import Handsfree from 'handsfree';
import LeftHandClosed from 'src/handsfree/LeftHandClosed';
import LeftHandOpened from 'src/handsfree/LeftHandOpened';

//type GestureCallback = (gesture:string) => void

let handsfree = reactive({});
let isHandsFreeActive = false;

export default function useHandsFree() {
  const initHandsFree = () => {
    handsfree = new Handsfree({ hands: true, debug: false });
    removeDebuggers();

    //Reducing FPS for better performance
    const targetFPS = 1;

    handsfree.model.hands.getData = handsfree.throttle(
      handsfree.model.hands.getData,
      1000 / targetFPS
    );

    //Logger - Uncomment to use it
    // handsfree.use('logger', (data) => {
    //   //console.log(handsfree.data.hands);

    //   if ('gesture' in handsfree.data.hands) {
    //     if (handsfree.data.hands.gesture[0] != null) {
    //       if (handsfree.data.hands.gesture[0].name == 'LeftHandOpened') {
    //         console.log('LeftHandOpened');
    //       }
    //       if (handsfree.data.hands.gesture[0].name == 'LeftHandClosed') {
    //         console.log('LeftHandClosed');
    //       }
    //     }
    //   }
    // });
  };

  const toggleHandsFree = () => {
    if (!isHandsFreeActive) {
      handsfree.start();
      isHandsFreeActive = true;
    } else {
      handsfree.stop();
      isHandsFreeActive = false;
    }
  };

  const startHandsFree = () => {
    // Starts tracking faces and shows the webcam if debug is on
    handsfree.start();
  };

  const stopHandsFree = () => {
    // Stops the webcam
    handsfree.stop();
  };

  const useHandsGesture = (callback) => {
    //If handsfree hasn't been initialised, create it
    if (Object.keys(handsfree).length == 0) {
      initHandsFree();
    }

    handsfree.useGesture(LeftHandOpened);
    handsfree.useGesture(LeftHandClosed);

    handsfree.use('watchGesture', (data) => {
      if ('gesture' in handsfree.data.hands) {
        //console.log('catching gestures - ', handsfree.data.hands.gesture);
        if (handsfree.data.hands.gesture[0] != null) {
          if (handsfree.data.hands.gesture[0].name == 'LeftHandOpened') {
            console.log('LeftHandOpened');
            callback('LeftHandOpened');
          }
          if (handsfree.data.hands.gesture[0].name == 'LeftHandClosed') {
            console.log('LeftHandClosed');
            callback('LeftHandClosed');
          }
        }
      }
    });
  };

  const removeDebuggers = () => {
    const debuggerElement =
      document.getElementsByClassName('handsfree-debugger')[0];
    const debuggerPointers =
      document.getElementsByClassName('handsfree-pointer');

    debuggerElement.remove();

    for (const pointer of debuggerPointers) {
      pointer.remove();
    }
  };

  return {
    initHandsFree,
    useHandsGesture,
    toggleHandsFree,
    startHandsFree,
    stopHandsFree,
  };
}
