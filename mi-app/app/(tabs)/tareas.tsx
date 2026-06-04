 import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function TareasScreen() {
const [tareas, setTareas] = useState<{id: number, texto: string, hecha: boolean, fecha?: Date}[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [cargado, setCargado] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined);
  const [mostrarFecha, setMostrarFecha] = useState(false);

  const cargarTareas = async () => {
    const guardadas = await AsyncStorage.getItem('tareas');
    const fechaGuardada = await AsyncStorage.getItem('fecha');
    const hoy = new Date().toDateString();
    if (fechaGuardada !== hoy) {
      await AsyncStorage.setItem('tareas', JSON.stringify([]));
      await AsyncStorage.setItem('fecha', hoy);
      setTareas([]);
    } else if (guardadas) {
      setTareas(JSON.parse(guardadas));
    }
    setCargado(true);
  };

  const guardarTareas = async (nuevasTareas: typeof tareas) => {
    await AsyncStorage.setItem('tareas', JSON.stringify(nuevasTareas));
  };

  if (!cargado) cargarTareas();

  const programarNotificaciones = async (tarea: {id: number, texto: string, fecha?: Date}) => {
    if (!tarea.fecha) return;
    await Notifications.requestPermissionsAsync();
    
    const fecha = new Date(tarea.fecha);
    const ahora = new Date();

    const notificaciones = [
      { dias: 7, mensaje: `⏰ En 7 días vence: ${tarea.texto}` },
      { dias: 3, mensaje: `⚠️ En 3 días vence: ${tarea.texto}` },
      { dias: 1, mensaje: `🚨 ¡Mañana vence!: ${tarea.texto}` },
      { dias: 0, mensaje: `🔴 ¡Hoy vence!: ${tarea.texto}` },
    ];

    for (const n of notificaciones) {
      const fechaNotif = new Date(fecha);
      fechaNotif.setDate(fechaNotif.getDate() - n.dias);
      fechaNotif.setHours(9, 0, 0, 0);
      if (fechaNotif > ahora) {
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Recordatorio de tarea', body: n.mensaje },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fechaNotif },
        });
      }
    }
  };

  const agregarTarea = () => {
    if (nuevaTarea.trim() === '') return;
    const nuevaTareaObj = { id: Date.now(), texto: nuevaTarea, hecha: false, fecha: fechaSeleccionada };
    const nuevas = [...tareas, nuevaTareaObj];
    setTareas(nuevas);
    guardarTareas(nuevas);
    programarNotificaciones(nuevaTareaObj);
    setNuevaTarea('');
    setFechaSeleccionada(undefined);
  };

  const toggleTarea = (id: number) => {
    const nuevas = tareas.map(t => t.id === id ? { ...t, hecha: !t.hecha } : t);
    const ordenadas = [
      ...nuevas.filter(t => !t.hecha),
      ...nuevas.filter(t => t.hecha),
    ];
    setTareas(ordenadas);
    guardarTareas(ordenadas);
  };

  const eliminarTarea = (id: number) => {
    const nuevas = tareas.filter(t => t.id !== id);
    setTareas(nuevas);
    guardarTareas(nuevas);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>📋 Tareas</Text>
      </View>
      <View style={styles.seccion}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Nueva tarea..."
            value={nuevaTarea}
            onChangeText={setNuevaTarea}
            onSubmitEditing={agregarTarea}
          />
          <TouchableOpacity style={styles.btnFecha} onPress={() => setMostrarFecha(true)}>
            <Text style={styles.btnFechaTexto}>📅</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnAgregar} onPress={agregarTarea}>
            <Text style={styles.btnTexto}>+</Text>
          </TouchableOpacity>
        </View>
        {fechaSeleccionada && (
          <Text style={styles.fechaPreview}>
            📅 {fechaSeleccionada.toLocaleDateString('es-CL')}
          </Text>
        )}
        {mostrarFecha && (
          <DateTimePicker
            value={fechaSeleccionada || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setMostrarFecha(false);
              if (date) setFechaSeleccionada(date);
            }}
          />
        )}
        {tareas.length === 0 ? (
          <View style={styles.tarjeta}>
            <Text style={styles.tarjetaTexto}>No hay tareas por hoy</Text>
          </View>
        ) : (
          tareas.map(t => (
            <View key={t.id} style={styles.tareaItem}>
              <TouchableOpacity onPress={() => toggleTarea(t.id)} style={styles.tareaRow}>
                <View style={[styles.circulo, t.hecha && styles.circuloHecho]}>
                  {t.hecha && <Text style={styles.check}>✓</Text>}
                </View>
                <View style={{flex:1}}>
                  <Text style={[styles.tareaTexto, t.hecha && styles.tareaHecha]}>{t.texto}</Text>
                  {t.fecha && <Text style={styles.fechaTarea}>📅 {new Date(t.fecha).toLocaleDateString('es-CL')}</Text>}
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarTarea(t.id)}>
                <Text style={styles.eliminar}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F6F2' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#1A1917' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF' },
  seccion: { padding: 16 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#E5E2DA' },
  tarjetaTexto: { fontSize: 14, color: '#A8A59E' },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  input: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E5E2DA', fontSize: 14 },
  btnAgregar: { backgroundColor: '#1A1917', borderRadius: 10, width: 46, alignItems: 'center', justifyContent: 'center' },
  btnTexto: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  tareaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 6, borderWidth: 1, borderColor: '#E5E2DA', gap: 12 },
  circulo: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#CCC9C0', alignItems: 'center', justifyContent: 'center' },
  circuloHecho: { backgroundColor: '#3B6D11', borderColor: '#3B6D11' },
  check: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  tareaTexto: { fontSize: 14, color: '#1A1917', flex: 1 },
  tareaHecha: { textDecorationLine: 'line-through', color: '#A8A59E' },
  btnFecha: { backgroundColor: '#FFFFFF', borderRadius: 10, width: 46, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E2DA' },
  btnFechaTexto: { fontSize: 20 },
  fechaPreview: { fontSize: 12, color: '#6B6860', marginBottom: 8, paddingLeft: 4 },
  fechaTarea: { fontSize: 11, color: '#A8A59E', marginTop: 2 },
  tareaRow: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  eliminar: { fontSize: 16, color: '#A8A59E', paddingLeft: 8 },
});
