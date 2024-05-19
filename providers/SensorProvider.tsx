import { useColorScheme } from 'nativewind';
import { PropsWithChildren, createContext, useContext } from 'react';

const SensorContext = createContext({});

const SensorProvider = ({ children }: PropsWithChildren) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <SensorContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </SensorContext.Provider>
  );
};

export default SensorProvider;

//custom built Hook
export const useSensor = () => useContext(SensorContext);
