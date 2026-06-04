import { StyleSheet, Text, View} from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function CalendarioScreen() {
  const [tareas, setTareas] = useState<{id: number, texto: string, hecha: boolean, fecha?: string}[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState('');

  useEffect(() => {
    const cargar = async () => {
      const guardadas = await AsyncStorage.getItem('tareas');
      if (guardadas) setTareas(JSON.parse(guardadas));
    };
    cargar();
  }, []);

  const markedDates: any = {};
  tareas.forEach(t => {
    if (t.fecha) {
      try {
        const d = new Date(t.fecha);
        const fecha = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        markedDates[fecha] = {
          marked: true,
          dotColor: t.hecha ? '#3B6D11' : '#D85A30',
        };
      } catch(e) {}
    }
  });

  if (diaSeleccionado) {
    markedDates[diaSeleccionado] = {
      ...markedDates[diaSeleccionado],
      selected: true,
      selectedColor: '#1A1917',
    };
  }

  const tareasDia = tareas.filter(t => {
    if (!t.fecha) return false;
    const d = new Date(t.fecha);
    const fecha = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    return fecha === diaSeleccionado;
  });


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>📅 Calendario</Text>
      </View>

      <Calendar
        markedDates={markedDates}
        onDayPress={(day: any) => setDiaSeleccionado(day.dateString)}
        theme={{
          backgroundColor: '#F7F6F2',
          calendarBackground: '#F7F6F2',
          todayTextColor: '#3B6D11',
          selectedDayBackgroundColor: '#1A1917',
          arrowColor: '#1A1917',
        }}
      />

      {diaSeleccionado ? (
        <View style={styles.seccion}>
          <Text style={styles.secTitulo}>Tareas para {diaSeleccionado}</Text>
          {tareasDia.length === 0 ? (
            <View style={styles.tarjeta}>
              <Text style={styles.tarjetaTexto}>Sin tareas para este día</Text>
            </View>
          ) : (
            tareasDia.map(t => (
              <View key={t.id} style={styles.tareaItem}>
                <View style={[styles.circulo, t.hecha && styles.circuloHecho]}>
                  {t.hecha && <Text style={styles.check}>✓</Text>}
                </View>
                <Text style={[styles.tareaTexto, t.hecha && styles.tareaHecha]}>{t.texto}</Text>
              </View>
            ))
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F6F2' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#1A1917' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF' },
  seccion: { padding: 16 },
  secTitulo: { fontSize: 16, fontWeight: '600', color: '#1A1917', marginBottom: 10 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#E5E2DA' },
  tarjetaTexto: { fontSize: 14, color: '#A8A59E' },
  tareaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 6, borderWidth: 1, borderColor: '#E5E2DA', gap: 12 },
  circulo: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#CCC9C0', alignItems: 'center', justifyContent: 'center' },
  circuloHecho: { backgroundColor: '#3B6D11', borderColor: '#3B6D11' },
  check: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  tareaTexto: { fontSize: 14, color: '#1A1917', flex: 1 },
  tareaHecha: { textDecorationLine: 'line-through', color: '#A8A59E' },
});