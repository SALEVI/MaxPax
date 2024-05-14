import { PropsWithChildren, createContext, useContext } from 'react';

const SensorContext = createContext({});

const SensorProvider = ({ children }: PropsWithChildren) => {
  return <SensorContext.Provider value={{ sensors: [1, 2, 3] }}>{children}</SensorContext.Provider>;
};

export default SensorProvider;

//custom built Hook
export const useSensor = () => useContext(SensorContext);
