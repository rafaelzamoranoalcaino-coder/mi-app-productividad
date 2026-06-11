 import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Paletas, PaletaNombre } from '@/constants/theme';

type TemaContextType = {
  paleta: typeof Paletas.oscuro;
  paletaNombre: PaletaNombre;
  cambiarPaleta: (nombre: PaletaNombre) => void;
};

const TemaContext = createContext<TemaContextType>({
  paleta: Paletas.oscuro,
  paletaNombre: 'oscuro',
  cambiarPaleta: () => {},
});

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [paletaNombre, setPaletaNombre] = useState<PaletaNombre>('oscuro');

  React.useEffect(() => {
    const cargar = async () => {
      const guardada = await AsyncStorage.getItem('paleta');
      if (guardada && guardada in Paletas) {
        setPaletaNombre(guardada as PaletaNombre);
      }
    };
    cargar();
  }, []);

  const cambiarPaleta = async (nombre: PaletaNombre) => {
    setPaletaNombre(nombre);
    await AsyncStorage.setItem('paleta', nombre);
  };

  return (
    <TemaContext.Provider value={{ paleta: Paletas[paletaNombre], paletaNombre, cambiarPaleta }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  return useContext(TemaContext);
}
