import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle } from 'react-native-svg';

export default function DiariasScreen() {
  const [diarias, setDiarias] = useState<{id: number, texto: string, hecha: boolean, seccion: 'mañana' | 'tarde' | 'noche'}[]>([]);
  const [nuevaDiaria, setNuevaDiaria] = useState('');
  const [seccionActiva, setSeccionActiva] = useState<'mañana' | 'tarde' | 'noche'>('mañana');
  const [cargado, setCargado] = useState(false);

  const cargarDiarias = async () => {
    const guardadas = await AsyncStorage.getItem('diarias');
    const fechaGuardada = await AsyncStorage.getItem('fecha_diarias');
    const hoy = new Date().toDateString();
    let lista = guardadas ? JSON.parse(guardadas) : [];
    if (fechaGuardada !== hoy) {
      lista = lista.map((t: any) => ({ ...t, hecha: false }));
      await AsyncStorage.setItem('diarias', JSON.stringify(lista));
      await AsyncStorage.setItem('fecha_diarias', hoy);
    }
    setDiarias(lista);
    setCargado(true);
  };

  const guardarDiarias = async (nuevas: typeof diarias) => {
    await AsyncStorage.setItem('diarias', JSON.stringify(nuevas));
  };

  if (!cargado) cargarDiarias();

  const limpiarDiarias = async () => {
    await AsyncStorage.removeItem('diarias');
    await AsyncStorage.removeItem('fecha_diarias');
    setDiarias([]);
  };

  const agregarDiaria = () => {
    if (nuevaDiaria.trim() === '') return;
    const nuevas = [...diarias, { id: Date.now(), texto: nuevaDiaria, hecha: false, seccion: seccionActiva }];
    setDiarias(nuevas);
    guardarDiarias(nuevas);
    setNuevaDiaria('');
  };

  const toggleDiaria = (id: number) => {
    const nuevas = diarias.map(t => t.id === id ? { ...t, hecha: !t.hecha } : t);
    setDiarias(nuevas);
    guardarDiarias(nuevas);
  };

  const eliminarDiaria = (id: number) => {
    const nuevas = diarias.filter(t => t.id !== id);
    setDiarias(nuevas);
    guardarDiarias(nuevas);
  };

  const total = diarias.length;
  const hechas = diarias.filter(t => t.hecha).length;
  const porcentaje = total === 0 ? 0 : Math.round((hechas / total) * 100);
  const radio = 54;
  const circunferencia = 2 * Math.PI * radio;
  const progreso = total === 0 ? 0 : (hechas / total) * circunferencia;

  const renderSeccion = (nombre: 'mañana' | 'tarde' | 'noche', emoji: string) => {
    const tareasFiltradas = diarias.filter(t => t.seccion === nombre);
    return (
      <View style={styles.seccion}>
        <Text style={styles.secTitulo}>{emoji} {nombre.charAt(0).toUpperCase() + nombre.slice(1)}</Text>
        {tareasFiltradas.length === 0 ? (
          <View style={styles.tarjeta}>
            <Text style={styles.tarjetaTexto}>No hay tareas para la {nombre}</Text>
          </View>
        ) : (
          tareasFiltradas.map(t => (
            <View key={t.id} style={styles.tareaItem}>
              <TouchableOpacity onPress={() => toggleDiaria(t.id)} style={styles.tareaRow}>
                <View style={[styles.circulo, t.hecha && styles.circuloHecho]}>
                  {t.hecha && <Text style={styles.check}>✓</Text>}
                </View>
                <Text style={[styles.tareaTexto, t.hecha && styles.tareaHecha]}>{t.texto}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarDiaria(t.id)}>
                <Text style={styles.eliminar}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>⭐ Diarias</Text>
      </View>

      <View style={styles.anilloWrap}>
        <Svg width={140} height={140} viewBox="0 0 140 140">
          <Circle cx="70" cy="70" r={radio} stroke="#E5E2DA" strokeWidth="10" fill="none" />
          <Circle
            cx="70" cy="70" r={radio}
            stroke="#1bcabc"
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${progreso} ${circunferencia}`}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
        </Svg>
        <View style={styles.anilloCentro}>
          <Text style={styles.anilloNumero}>{hechas}/{total}</Text>
          <Text style={styles.anilloPct}>{porcentaje}%</Text>
        </View>
      </View>

      <View style={styles.seccion}>
        <View style={styles.selectorRow}>
          {(['mañana', 'tarde', 'noche'] as const).map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.selectorBtn, seccionActiva === s && styles.selectorActivo]}
              onPress={() => setSeccionActiva(s)}>
              <Text style={[styles.selectorTexto, seccionActiva === s && styles.selectorTextoActivo]}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={`Nueva tarea para la ${seccionActiva}...`}
            value={nuevaDiaria}
            onChangeText={setNuevaDiaria}
            onSubmitEditing={agregarDiaria}
          />
          <TouchableOpacity style={styles.btnAgregar} onPress={agregarDiaria}>
            <Text style={styles.btnTexto}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderSeccion('mañana', '🌅')}
      {renderSeccion('tarde', '☀️')}
      {renderSeccion('noche', '🌙')}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F6F2' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#1A1917' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF' },
  anilloWrap: { alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 8 },
  anilloCentro: { position: 'absolute', alignItems: 'center' },
  anilloNumero: { fontSize: 22, fontWeight: 'bold', color: '#9d14dd' },
  anilloPct: { fontSize: 13, color: '#8421bd' },
  seccion: { padding: 16 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#E5E2DA' },
  tarjetaTexto: { fontSize: 14, color: '#A8A59E' },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  input: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E5E2DA', fontSize: 14 },
  btnAgregar: { backgroundColor: '#1A1917', borderRadius: 10, width: 46, alignItems: 'center', justifyContent: 'center' },
  btnTexto: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  tareaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 6, borderWidth: 1, borderColor: '#E5E2DA' },
  tareaRow: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  circulo: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#CCC9C0', alignItems: 'center', justifyContent: 'center' },
  circuloHecho: { backgroundColor: '#3B6D11', borderColor: '#3B6D11' },
  check: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  tareaTexto: { fontSize: 14, color: '#1A1917', flex: 1 },
  tareaHecha: { textDecorationLine: 'line-through', color: '#A8A59E' },
  eliminar: { fontSize: 16, color: '#A8A59E', paddingLeft: 8 },
  selectorRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  selectorBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E5E2DA', backgroundColor: '#FFFFFF', alignItems: 'center' },
  selectorActivo: { backgroundColor: '#1A1917', borderColor: '#1A1917' },
  selectorTexto: { fontSize: 13, fontWeight: '500', color: '#6B6860' },
  selectorTextoActivo: { color: '#FFFFFF' }
});