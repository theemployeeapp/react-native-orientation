var Orientation = require('react-native').NativeModules.Orientation;
var DeviceEventEmitter = require('react-native').DeviceEventEmitter;

var listeners = {};
var orientationDidChangeEvent = "orientationDidChange";
var specificOrientationDidChangeEvent = "specificOrientationDidChange";
var locked = false;
var lockedOrientation

var id = 0;
var META = '__listener_id';

function getKey(listener){
  if (!listener.hasOwnProperty(META)){
    if (!Object.isExtensible(listener)) {
      return 'F';
    }
    Object.defineProperty(listener, META, {
      value: 'L' + ++id,
    });
  }
  return listener[META];
};

module.exports = {
  getOrientation(cb) {
    Orientation.getOrientation((error,orientation) =>{
      cb(error, orientation);
    });
  },
  getSpecificOrientation(cb) {
    Orientation.getSpecificOrientation((error,orientation) =>{
      cb(error, orientation);
    });
  },
  lockToPortrait() {
    Orientation.lockToPortrait();
    locked = true;
    lockedOrientation = 'PORTRAIT'
  },
  lockToLandscape() {
    Orientation.lockToLandscape();
    locked = true;
    lockedOrientation = 'LANDSCAPE'
  },
  lockToLandscapeRight() {
    Orientation.lockToLandscapeRight();
    locked = true;
    lockedOrientation = 'LANDSCAPE'
  },
  lockToLandscapeLeft() {
    Orientation.lockToLandscapeLeft();
    locked = true;
    lockedOrientation = 'LANDSCAPE'
  },
  unlockAllOrientations() {
    Orientation.unlockAllOrientations();
    locked = false;
    lockedOrientation = null
  },
  addOrientationListener(cb) {
    var key = getKey(cb);
    listeners[key] = DeviceEventEmitter.addListener(orientationDidChangeEvent,
      (body) => {
        var orientation = body.orientation
        if (locked) orientation = lockedOrientation
        cb(orientation);
      });
  },
  removeOrientationListener(cb) {
    var key = getKey(cb);
    if (!listeners[key]) {
      return;
    }
    listeners[key].remove();
    listeners[key] = null;
  },
  addSpecificOrientationListener(cb) {
    var key = getKey(cb);
    listeners[key] = DeviceEventEmitter.addListener(specificOrientationDidChangeEvent,
      (body) => {
        var orientation = body.orientation
        if (locked) orientation = lockedOrientation
        cb(orientation);
      });
  },
  removeSpecificOrientationListener(cb) {
    var key = getKey(cb);
    if (!listeners[key]) {
      return;
    }
    listeners[key].remove();
    listeners[key] = null;
  },
  getInitialOrientation() {
    return Orientation.initialOrientation;
  }
}
