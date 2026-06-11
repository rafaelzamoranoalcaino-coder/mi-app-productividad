 
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

export default function RecordatoriosScreen() {
  const [Recordatorios, setRecordatorios] = useState<{id: number, texto: string, fecha: string, hora: string}[]>([]);
  const [nuevo, setNuevo] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const guardados = await AsyncStorage.getItem('recordatorios');
      if (guardados) setRecordatorios(JSON.parse(guardados));
    };
    cargar();
  }, []);

  const guardar = async (nuevos: typeof Recordatorios) => {
    await AsyncStorage.setItem('recordatorios', JSON.stringify(nuevos));
  };

  const programarNotificacion = async (texto: string, fecha: Date, hora: Date) => {
    await Notifications.requestPermissionsAsync();
    const fechaNotif = new Date(fecha);
    fechaNotif.setHours(hora.getHours(), hora.getMinutes(), 0, 0);
    if (fechaNotif > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: { title: '🔔 Recordatorio', body: texto },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fechaNotif },
      });
    }
  };

  const agregar = () => {
    if (nuevo.trim() === '') return;
    const fechaStr = `${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2,'0')}-${String(fecha.getDate()).padStart(2,'0')}`;
    const horaStr = `${String(hora.getHours()).padStart(2,'0')}:${String(hora.getMinutes()).padStart(2,'0')}`;
    const nuevos = [...Recordatorios, { id: Date.now(), texto: nuevo, fecha: fechaStr, hora: horaStr }];
    setRecordatorios(nuevos);
    guardar(nuevos);
    programarNotificacion(nuevo, fecha, hora);
    setNuevo('');
  };

  const eliminar = (id: number) => {
    const nuevos = Recordatorios.filter(r => r.id !== id);
    setRecordatorios(nuevos);
    guardar(nuevos);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>🔔 Recordatorios</Text>
      </View>

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del recordatorio..."
          value={nuevo}
          onChangeText={setNuevo}
        />
        <View style={styles.fechaRow}>
          <TouchableOpacity style={styles.fechaBtn} onPress={() => setMostrarFecha(true)}>
            <Text style={styles.fechaBtnTexto}>📅 {fecha.toLocaleDateString('es-CL')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fechaBtn} onPress={() => setMostrarHora(true)}>
            <Text style={styles.fechaBtnTexto}>🕐 {String(hora.getHours()).padStart(2,'0')}:{String(hora.getMinutes()).padStart(2,'0')}</Text>
          </TouchableOpacity>
        </View>
        {mostrarFecha && (
          <DateTimePicker value={fecha} mode="date" onChange={(e, d) => { setMostrarFecha(false); if (d) setFecha(d); }} />
        )}
        {mostrarHora && (
          <DateTimePicker value={hora} mode="time" onChange={(e, h) => { setMostrarHora(false); if (h) setHora(h); }} />
        )}
        <TouchableOpacity style={styles.btnAgregar} onPress={agregar}>
          <Text style={styles.btnTexto}>+ Agregar recordatorio</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.lista} contentContainerStyle={{paddingBottom: 20}}>
        <View style={styles.seccion}>
          {Recordatorios.length === 0 ? (
            <View style={styles.tarjeta}>
              <Text style={styles.tarjetaTexto}>Sin recordatorios aún</Text>
            </View>
          ) : (
            Recordatorios.map(r => (
              <View key={r.id} style={styles.item}>
                <View style={styles.itemIconWrap}>
                  <Text style={{fontSize: 18}}>🔔</Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={styles.itemTexto}>{r.texto}</Text>
                  <Text style={styles.itemFecha}>📅 {r.fecha} · 🕐 {r.hora}</Text>
                </View>
                <TouchableOpacity onPress={() => eliminar(r.id)}>
                  <Text style={styles.eliminar}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3EE' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#1A1917' },
  headerTitulo: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  inputWrap: { margin: 16, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E5E2DA' },
  input: { backgroundColor: '#F5F3EE', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E5E2DA', fontSize: 14, marginBottom: 10 },
  fechaRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  fechaBtn: { flex: 1, backgroundColor: '#F5F3EE', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E5E2DA', alignItems: 'center' },
  fechaBtnTexto: { fontSize: 13, color: '#1A1917' },
  btnAgregar: { backgroundColor: '#1A1917', borderRadius: 10, padding: 14, alignItems: 'center' },
  btnTexto: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  lista: { flex: 1 },
  seccion: { paddingHorizontal: 16, paddingTop: 4 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E2DA' },
  tarjetaTexto: { fontSize: 14, color: '#A8A59E' },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 6, borderWidth: 1, borderColor: '#E5E2DA', gap: 10 },
  itemIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EAF3DE', alignItems: 'center', justifyContent: 'center' },
  itemTexto: { fontSize: 14, color: '#1A1917', fontWeight: '500' },
  itemFecha: { fontSize: 11, color: '#A8A59E', marginTop: 2 },
  eliminar: { fontSize: 16, color: '#CCC9C0', paddingLeft: 8 },
});