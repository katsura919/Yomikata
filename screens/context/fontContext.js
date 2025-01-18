import React, { createContext, useContext} from 'react';
import { useFonts } from 'expo-font';

const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Light': require('../../assets/fonts/Poppins-Light.ttf'),
  });

  return (
    <FontContext.Provider value={{ fontsLoaded }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => useContext(FontContext);
