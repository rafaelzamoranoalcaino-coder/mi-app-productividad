 import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TareasScreen() {
  const [tareas, setTareas] = useState<{id: number, texto: string, hecha: boolean}[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [cargado, setCargado] = useState(false);

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

  const agregarTarea = () => {
    if (nuevaTarea.trim() === '') return;
    const nuevas = [...tareas, { id: Date.now(), texto: nuevaTarea, hecha: false }];
    setTareas(nuevas);
    guardarTareas(nuevas);
    setNuevaTarea('');
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
          <TouchableOpacity style={styles.btnAgregar} onPress={agregarTarea}>
            <Text style={styles.btnTexto}>+</Text>
          </TouchableOpacity>
        </View>
        {tareas.length === 0 ? (
          <View style={styles.tarjeta}>
            <Text style={styles.tarjetaTexto}>No hay tareas por hoy</Text>
          </View>
        ) : (
          tareas.map(t => (
            <TouchableOpacity key={t.id} style={styles.tareaItem} onPress={() => toggleTarea(t.id)}>
              <View style={[styles.circulo, t.hecha && styles.circuloHecho]}>
                {t.hecha && <Text style={styles.check}>✓</Text>}
              </View>
              <Text style={[styles.tareaTexto, t.hecha && styles.tareaHecha]}>{t.texto}</Text>
            </TouchableOpacity>
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
});
