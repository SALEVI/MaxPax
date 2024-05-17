import { PropsWithChildren, createContext, useContext } from 'react';

const SensorContext = createContext({});

const SensorProvider = ({ children }: PropsWithChildren) => {
  const presetAway = [
    { category: 'motions', id: 3, name: 'ldr', status: 'on' },
    { category: 'motions', id: 4, name: 'led1', status: 'on' },
    { category: 'windows', id: 5, name: 'vibration', status: 'on' },
    { category: 'doors', id: 6, name: 'keypad', status: 'on' },
    { category: 'alarms', id: 7, name: 'siren', status: 'on' },
    { category: 'doors', id: 8, name: 'RFID', status: 'on' },
  ];

  const presetHome = [
    { category: 'motions', id: 3, name: 'ldr', status: 'off' },
    { category: 'motions', id: 4, name: 'led1', status: 'off' },
    { category: 'windows', id: 5, name: 'vibration', status: 'on' },
    { category: 'doors', id: 6, name: 'keypad', status: 'on' },
    { category: 'alarms', id: 7, name: 'siren', status: 'on' },
    { category: 'doors', id: 8, name: 'RFID', status: 'on' },
  ];

  const presetDisarmed = [
    { category: 'motions', id: 3, name: 'ldr', status: 'off' },
    { category: 'motions', id: 4, name: 'led1', status: 'off' },
    { category: 'windows', id: 5, name: 'vibration', status: 'off' },
    { category: 'dooors', id: 6, name: 'keypad', status: 'off' },
    { category: 'alarms', id: 7, name: 'siren', status: 'off' },
    { category: 'doors', id: 8, name: 'RFID', status: 'off' },
  ];

  return (
    <SensorContext.Provider value={{ presetAway, presetHome, presetDisarmed }}>
      {children}
    </SensorContext.Provider>
  );
};

export default SensorProvider;

//custom built Hook
export const useSensor = () => useContext(SensorContext);
