import { useState, useCallback, useRef, useEffect } from "react";

export type SensorStatus = "not-tested" | "testing" | "available" | "limited" | "not-available" | "not-supported";

export interface SensorResult {
  id: string;
  name: string;
  status: SensorStatus;
  value?: string;
  details?: string;
  data?: any;
}

interface SensorState {
  accelerometer: SensorResult;
  gyroscope: SensorResult;
  orientation: SensorResult;
  ambientLight: SensorResult;
  proximity: SensorResult;
  screenOrientation: SensorResult;
  touch: SensorResult;
  biometric: SensorResult;
  lid: SensorResult;
}

const initialSensors: SensorState = {
  accelerometer: { id: "accelerometer", name: "Accelerometer", status: "not-tested" },
  gyroscope: { id: "gyroscope", name: "Gyroscope", status: "not-tested" },
  orientation: { id: "orientation", name: "Orientation Sensor", status: "not-tested" },
  ambientLight: { id: "ambient-light", name: "Ambient Light", status: "not-tested" },
  proximity: { id: "proximity", name: "Proximity Sensor", status: "not-tested" },
  screenOrientation: { id: "screen-orientation", name: "Screen Orientation", status: "not-tested" },
  touch: { id: "touch", name: "Touchscreen", status: "not-tested" },
  biometric: { id: "biometric", name: "Biometric Sensor", status: "not-tested" },
  lid: { id: "lid", name: "Lid / Visibility", status: "not-tested" },
};

export interface AccelerometerData { x: number; y: number; z: number; }
export interface GyroscopeData { x: number; y: number; z: number; }
export interface OrientationData { alpha: number; beta: number; gamma: number; }
export interface TouchPoint { x: number; y: number; id: number; }

export function useSensorDetection() {
  const [sensors, setSensors] = useState<SensorState>(initialSensors);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Real-time sensor data
  const [accelerometerData, setAccelerometerData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0 });
  const [gyroscopeData, setGyroscopeData] = useState<GyroscopeData>({ x: 0, y: 0, z: 0 });
  const [orientationData, setOrientationData] = useState<OrientationData>({ alpha: 0, beta: 0, gamma: 0 });
  const [lightLevel, setLightLevel] = useState<number | null>(null);
  const [isNear, setIsNear] = useState<boolean | null>(null);
  const [screenOrientationType, setScreenOrientationType] = useState<string>("");
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [maxTouchPoints, setMaxTouchPoints] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Sensor instances for cleanup
  const sensorRefs = useRef<any[]>([]);

  const updateSensor = useCallback((key: keyof SensorState, update: Partial<SensorResult>) => {
    setSensors(prev => ({
      ...prev,
      [key]: { ...prev[key], ...update }
    }));
  }, []);

  // Accelerometer Detection
  const detectAccelerometer = useCallback(async (): Promise<boolean> => {
    updateSensor("accelerometer", { status: "testing" });

    // Try Generic Sensor API first
    if ('Accelerometer' in window) {
      return new Promise((resolve) => {
        try {
          const accelerometer = new (window as any).Accelerometer({ frequency: 60 });
          let hasReading = false;

          accelerometer.addEventListener('reading', () => {
            hasReading = true;
            const { x, y, z } = accelerometer;
            setAccelerometerData({ x, y, z });
            updateSensor("accelerometer", { 
              status: "available", 
              value: `Active - X: ${x.toFixed(2)}`,
              details: "Real-time motion tracking available"
            });
          });

          accelerometer.addEventListener('error', (e: any) => {
            const errorName = e.error?.name;
            if (errorName === 'NotAllowedError') {
              updateSensor("accelerometer", { 
                status: "not-available", 
                value: "Permission denied",
                details: "Browser blocked sensor access"
              });
            } else if (errorName === 'NotReadableError') {
              updateSensor("accelerometer", { 
                status: "not-available", 
                value: "No hardware",
                details: "Accelerometer hardware not detected"
              });
            } else {
              updateSensor("accelerometer", { 
                status: "not-available", 
                value: "Error",
                details: "Could not access accelerometer"
              });
            }
            resolve(false);
          });

          sensorRefs.current.push(accelerometer);
          accelerometer.start();

          setTimeout(() => {
            if (!hasReading) {
              updateSensor("accelerometer", { 
                status: "not-available", 
                value: "No hardware",
                details: "Motion sensor typically found in mobile devices only"
              });
            }
            resolve(hasReading);
          }, 1000);
        } catch (e: any) {
          updateSensor("accelerometer", { 
            status: "not-available", 
            value: e.name === 'SecurityError' ? "HTTPS required" : "Not accessible",
            details: "Sensor API not accessible on this device"
          });
          resolve(false);
        }
      });
    }

    // Fallback to DeviceMotion
    if ('DeviceMotionEvent' in window) {
      return new Promise((resolve) => {
        let hasData = false;
        const handler = (e: DeviceMotionEvent) => {
          const acc = e.accelerationIncludingGravity;
          if (acc && (acc.x !== null || acc.y !== null || acc.z !== null)) {
            hasData = true;
            setAccelerometerData({ x: acc.x || 0, y: acc.y || 0, z: acc.z || 0 });
            updateSensor("accelerometer", { 
              status: "available", 
              value: "Active (DeviceMotion)",
              details: "Motion tracking via DeviceMotion API"
            });
            window.removeEventListener('devicemotion', handler);
          }
        };

        window.addEventListener('devicemotion', handler);
        setTimeout(() => {
          window.removeEventListener('devicemotion', handler);
          if (!hasData) {
            updateSensor("accelerometer", { 
              status: "not-available", 
              value: "No hardware",
              details: "Motion sensor typically found in mobile devices only"
            });
          }
          resolve(hasData);
        }, 1000);
      });
    }

    updateSensor("accelerometer", { 
      status: "not-supported", 
      value: "API unavailable",
      details: "Browser does not support motion sensor APIs"
    });
    return false;
  }, [updateSensor]);

  // Gyroscope Detection
  const detectGyroscope = useCallback(async (): Promise<boolean> => {
    updateSensor("gyroscope", { status: "testing" });

    if ('Gyroscope' in window) {
      return new Promise((resolve) => {
        try {
          const gyroscope = new (window as any).Gyroscope({ frequency: 60 });
          let hasReading = false;

          gyroscope.addEventListener('reading', () => {
            hasReading = true;
            const { x, y, z } = gyroscope;
            setGyroscopeData({ x, y, z });
            updateSensor("gyroscope", { 
              status: "available", 
              value: "Active",
              details: "Real-time rotation tracking available"
            });
          });

          gyroscope.addEventListener('error', (e: any) => {
            if (e.error?.name === 'NotReadableError') {
              updateSensor("gyroscope", { 
                status: "not-available", 
                value: "No hardware",
                details: "Gyroscope hardware not detected"
              });
            } else {
              updateSensor("gyroscope", { 
                status: "not-available", 
                value: "Error",
                details: "Could not access gyroscope"
              });
            }
            resolve(false);
          });

          sensorRefs.current.push(gyroscope);
          gyroscope.start();

          setTimeout(() => {
            if (!hasReading) {
              updateSensor("gyroscope", { 
                status: "not-available", 
                value: "No hardware",
                details: "Gyroscope typically found in mobile devices only"
              });
            }
            resolve(hasReading);
          }, 1000);
        } catch (e) {
          updateSensor("gyroscope", { 
            status: "not-available", 
            value: "Not accessible",
            details: "Gyroscope API not accessible"
          });
          resolve(false);
        }
      });
    }

    updateSensor("gyroscope", { 
      status: "not-supported", 
      value: "API unavailable",
      details: "Browser does not support Gyroscope API"
    });
    return false;
  }, [updateSensor]);

  // Orientation Sensor Detection
  const detectOrientation = useCallback(async (): Promise<boolean> => {
    updateSensor("orientation", { status: "testing" });

    // Try AbsoluteOrientationSensor first
    if ('AbsoluteOrientationSensor' in window) {
      try {
        const sensor = new (window as any).AbsoluteOrientationSensor({ frequency: 60 });
        let hasReading = false;

        sensor.addEventListener('reading', () => {
          hasReading = true;
          updateSensor("orientation", { 
            status: "available", 
            value: "Absolute orientation",
            details: "Full 3D orientation tracking available"
          });
        });

        sensor.addEventListener('error', () => {
          // Fall through to DeviceOrientation
        });

        sensorRefs.current.push(sensor);
        sensor.start();

        await new Promise(r => setTimeout(r, 500));
        if (hasReading) return true;
      } catch (e) {
        // Continue to fallback
      }
    }

    // Fallback to DeviceOrientation API
    if ('DeviceOrientationEvent' in window) {
      return new Promise(async (resolve) => {
        // iOS 13+ permission request
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          try {
            const permission = await (DeviceOrientationEvent as any).requestPermission();
            if (permission !== 'granted') {
              updateSensor("orientation", { 
                status: "not-available", 
                value: "Permission denied",
                details: "User denied orientation sensor access"
              });
              resolve(false);
              return;
            }
          } catch (e) {
            updateSensor("orientation", { 
              status: "not-available", 
              value: "Permission error",
              details: "Could not request orientation permission"
            });
            resolve(false);
            return;
          }
        }

        let hasData = false;
        const handler = (e: DeviceOrientationEvent) => {
          if (e.alpha !== null || e.beta !== null || e.gamma !== null) {
            hasData = true;
            setOrientationData({
              alpha: e.alpha || 0,
              beta: e.beta || 0,
              gamma: e.gamma || 0
            });
            updateSensor("orientation", { 
              status: "available", 
              value: "Active",
              details: "Real-time orientation tracking via DeviceOrientation"
            });
          }
        };

        window.addEventListener('deviceorientation', handler);
        
        setTimeout(() => {
          if (!hasData) {
            window.removeEventListener('deviceorientation', handler);
            updateSensor("orientation", { 
              status: "not-available", 
              value: "No data",
              details: "Orientation sensor typically found in mobile devices only"
            });
          }
          resolve(hasData);
        }, 1000);
      });
    }

    updateSensor("orientation", { 
      status: "not-supported", 
      value: "API unavailable",
      details: "Browser does not support orientation APIs"
    });
    return false;
  }, [updateSensor]);

  // Ambient Light Sensor Detection
  const detectAmbientLight = useCallback(async (): Promise<boolean> => {
    updateSensor("ambientLight", { status: "testing" });

    if ('AmbientLightSensor' in window) {
      return new Promise((resolve) => {
        try {
          const sensor = new (window as any).AmbientLightSensor();
          let hasReading = false;

          sensor.addEventListener('reading', () => {
            hasReading = true;
            const lux = sensor.illuminance;
            setLightLevel(lux);
            updateSensor("ambientLight", { 
              status: "available", 
              value: `${lux.toFixed(0)} lux`,
              details: "Cover/uncover the sensor to verify"
            });
          });

          sensor.addEventListener('error', (e: any) => {
            if (e.error?.name === 'NotAllowedError') {
              updateSensor("ambientLight", { 
                status: "not-available", 
                value: "Permission denied",
                details: "Enable in browser flags (chrome://flags)"
              });
            } else {
              updateSensor("ambientLight", { 
                status: "not-available", 
                value: "Not accessible",
                details: "Ambient light sensor not available"
              });
            }
            resolve(false);
          });

          sensorRefs.current.push(sensor);
          sensor.start();

          setTimeout(() => {
            if (!hasReading) {
              updateSensor("ambientLight", { 
                status: "not-available", 
                value: "No readings",
                details: "Sensor not responding"
              });
            }
            resolve(hasReading);
          }, 1000);
        } catch (e) {
          updateSensor("ambientLight", { 
            status: "not-supported", 
            value: "API unavailable",
            details: "Enable in browser flags or use Firefox"
          });
          resolve(false);
        }
      });
    }

    updateSensor("ambientLight", { 
      status: "not-supported", 
      value: "API unavailable",
      details: "Limited browser support. Try Firefox or enable Chrome flags."
    });
    return false;
  }, [updateSensor]);

  // Proximity Sensor Detection
  const detectProximity = useCallback(async (): Promise<boolean> => {
    updateSensor("proximity", { status: "testing" });

    if ('ProximitySensor' in window) {
      return new Promise((resolve) => {
        try {
          const sensor = new (window as any).ProximitySensor();
          let hasReading = false;

          sensor.addEventListener('reading', () => {
            hasReading = true;
            setIsNear(sensor.near);
            updateSensor("proximity", { 
              status: "available", 
              value: sensor.near ? "Near" : "Far",
              details: "Wave your hand near the sensor to test"
            });
          });

          sensor.addEventListener('error', () => {
            updateSensor("proximity", { 
              status: "not-available", 
              value: "Not accessible",
              details: "Proximity sensor not available"
            });
            resolve(false);
          });

          sensorRefs.current.push(sensor);
          sensor.start();

          setTimeout(() => {
            if (!hasReading) {
              updateSensor("proximity", { 
                status: "not-available", 
                value: "No hardware",
                details: "Proximity sensors are typically phone-only"
              });
            }
            resolve(hasReading);
          }, 1000);
        } catch (e) {
          updateSensor("proximity", { 
            status: "not-supported", 
            value: "API unavailable",
            details: "Browser does not support Proximity API"
          });
          resolve(false);
        }
      });
    }

    updateSensor("proximity", { 
      status: "not-supported", 
      value: "API unavailable",
      details: "Proximity Sensor API not available in this browser"
    });
    return false;
  }, [updateSensor]);

  // Screen Orientation Detection
  const detectScreenOrientation = useCallback((): boolean => {
    updateSensor("screenOrientation", { status: "testing" });

    if (screen.orientation) {
      const updateOrientation = () => {
        const type = screen.orientation.type;
        const angle = screen.orientation.angle;
        setScreenOrientationType(type);
        updateSensor("screenOrientation", { 
          status: "available", 
          value: `${type.replace('-primary', '').replace('-secondary', '')} (${angle}°)`,
          details: "Rotate your screen to see changes"
        });
      };

      updateOrientation();
      screen.orientation.addEventListener('change', updateOrientation);
      return true;
    }

    // Fallback based on viewport
    const orientation = window.innerHeight > window.innerWidth ? "portrait" : "landscape";
    setScreenOrientationType(orientation);
    updateSensor("screenOrientation", { 
      status: "limited", 
      value: orientation,
      details: "Basic detection via viewport dimensions"
    });
    return true;
  }, [updateSensor]);

  // Touch Detection
  const detectTouch = useCallback((): boolean => {
    updateSensor("touch", { status: "testing" });

    const maxTouch = navigator.maxTouchPoints || 0;
    const hasOntouchstart = 'ontouchstart' in window;
    const hasTouchEvent = 'TouchEvent' in window;
    const hasPointerCoarse = window.matchMedia('(pointer: coarse)').matches;
    const hasAnyPointer = window.matchMedia('(any-pointer: coarse)').matches;

    setMaxTouchPoints(maxTouch);

    if (maxTouch > 0) {
      updateSensor("touch", { 
        status: "available", 
        value: `${maxTouch} touch point${maxTouch > 1 ? 's' : ''} supported`,
        details: "Multi-touch capable. Use the touch test area to verify."
      });
      return true;
    } else if (hasOntouchstart || hasTouchEvent) {
      updateSensor("touch", { 
        status: "available", 
        value: "Touch events supported",
        details: "Touch input available"
      });
      return true;
    } else if (hasAnyPointer || hasPointerCoarse) {
      updateSensor("touch", { 
        status: "limited", 
        value: "Touch input detected",
        details: "Coarse pointer detected (may be touch or stylus)"
      });
      return true;
    }

    updateSensor("touch", { 
      status: "not-available", 
      value: "No touchscreen",
      details: "This device does not have touch capability"
    });
    return false;
  }, [updateSensor]);

  // Biometric Detection (WebAuthn)
  const detectBiometric = useCallback(async (): Promise<boolean> => {
    updateSensor("biometric", { status: "testing" });

    if (!window.PublicKeyCredential) {
      updateSensor("biometric", { 
        status: "not-supported", 
        value: "WebAuthn unavailable",
        details: "Browser does not support WebAuthn API"
      });
      return false;
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      if (available) {
        updateSensor("biometric", { 
          status: "available", 
          value: "Windows Hello / Fingerprint / Face ID",
          details: "Platform authenticator detected and ready"
        });
        return true;
      } else {
        updateSensor("biometric", { 
          status: "not-available", 
          value: "Not configured",
          details: "No biometric authentication set up on this device"
        });
        return false;
      }
    } catch (e) {
      updateSensor("biometric", { 
        status: "not-available", 
        value: "Detection failed",
        details: "Could not query biometric availability"
      });
      return false;
    }
  }, [updateSensor]);

  // Lid / Visibility Detection
  const detectLid = useCallback((): boolean => {
    updateSensor("lid", { status: "testing" });

    if ('hidden' in document) {
      const updateVisibility = () => {
        const visible = !document.hidden;
        setIsVisible(visible);
        updateSensor("lid", { 
          status: "available", 
          value: visible ? "Screen visible" : "Screen hidden",
          details: "Detects when screen is visible. Close/open lid to test."
        });
      };

      updateVisibility();
      document.addEventListener('visibilitychange', updateVisibility);
      return true;
    }

    updateSensor("lid", { 
      status: "limited", 
      value: "Basic detection",
      details: "Full visibility API not supported"
    });
    return false;
  }, [updateSensor]);

  // Request Permissions
  const requestPermissions = useCallback(async () => {
    // iOS DeviceMotion/Orientation permissions
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        await (DeviceMotionEvent as any).requestPermission();
      } catch (e) {
        console.log("DeviceMotion permission request failed");
      }
    }

    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        await (DeviceOrientationEvent as any).requestPermission();
      } catch (e) {
        console.log("DeviceOrientation permission request failed");
      }
    }

    // Generic sensor permissions
    if ('permissions' in navigator) {
      const sensorNames = ['accelerometer', 'gyroscope', 'ambient-light-sensor'];
      for (const name of sensorNames) {
        try {
          await (navigator.permissions as any).query({ name });
        } catch (e) {
          // Permission query not supported
        }
      }
    }

    setPermissionGranted(true);
  }, []);

  // Full Scan
  const runFullScan = useCallback(async () => {
    if (!permissionGranted) {
      await requestPermissions();
    }

    setIsScanning(true);
    setScanProgress(0);

    // Reset all sensors to testing
    Object.keys(sensors).forEach(key => {
      updateSensor(key as keyof SensorState, { status: "testing", value: undefined, details: undefined });
    });

    const steps = [
      { fn: detectAccelerometer, progress: 11 },
      { fn: detectGyroscope, progress: 22 },
      { fn: detectOrientation, progress: 33 },
      { fn: detectAmbientLight, progress: 44 },
      { fn: detectProximity, progress: 55 },
      { fn: detectScreenOrientation, progress: 66 },
      { fn: detectTouch, progress: 77 },
      { fn: detectBiometric, progress: 88 },
      { fn: detectLid, progress: 100 },
    ];

    for (const step of steps) {
      await step.fn();
      setScanProgress(step.progress);
      await new Promise(r => setTimeout(r, 150));
    }

    setIsScanning(false);
  }, [
    permissionGranted, requestPermissions, sensors, updateSensor,
    detectAccelerometer, detectGyroscope, detectOrientation,
    detectAmbientLight, detectProximity, detectScreenOrientation,
    detectTouch, detectBiometric, detectLid
  ]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touches = Array.from(e.touches).map(t => ({
      x: t.clientX,
      y: t.clientY,
      id: t.identifier
    }));
    setTouchPoints(touches);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touches = Array.from(e.touches).map(t => ({
      x: t.clientX,
      y: t.clientY,
      id: t.identifier
    }));
    setTouchPoints(touches);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTouchPoints([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sensorRefs.current.forEach(sensor => {
        try {
          sensor.stop?.();
        } catch (e) {
          // Ignore cleanup errors
        }
      });
    };
  }, []);

  return {
    sensors: Object.values(sensors),
    sensorsMap: sensors,
    isScanning,
    scanProgress,
    permissionGranted,
    accelerometerData,
    gyroscopeData,
    orientationData,
    lightLevel,
    isNear,
    screenOrientationType,
    touchPoints,
    maxTouchPoints,
    isVisible,
    runFullScan,
    requestPermissions,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
