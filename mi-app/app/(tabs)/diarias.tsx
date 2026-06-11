import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle } from 'react-native-svg';
import { useTema } from '../contexto-tema';

export default function DiariasScreen() {
  const { paleta } = useTema();
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

  const secciones = [
    { id: 'mañana' as const, emoji: '🌅', label: 'Mañana' },
    { id: 'tarde' as const, emoji: '☀️', label: 'Tarde' },
    { id: 'noche' as const, emoji: '🌙', label: 'Noche' },
  ];

  const renderSeccion = (nombre: 'mañana' | 'tarde' | 'noche', emoji: string, label: string) => {
    const tareasFiltradas = diarias.filter(t => t.seccion === nombre);
    if (tareasFiltradas.length === 0) return null;
    return (
      <View key={nombre} style={styles.seccion}>
        <Text style={[styles.secTitulo, { color: paleta.textoSuave }]}>{emoji} {label}</Text>
        {tareasFiltradas.map(t => (
          <View key={t.id} style={[styles.tareaItem, { backgroundColor: paleta.superficie, borderColor: paleta.borde }]}>
            <TouchableOpacity onPress={() => toggleDiaria(t.id)} style={styles.tareaRow}>
              <View style={[styles.circulo, t.hecha && { backgroundColor: paleta.acento, borderColor: paleta.acento }]}>
                {t.hecha && <Text style={styles.check}>✓</Text>}
              </View>
              <Text style={[styles.tareaTexto, { color: paleta.texto }, t.hecha && styles.tareaHecha]}>{t.texto}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => eliminarDiaria(t.id)}>
              <Text style={styles.eliminar}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: paleta.fondo }}>
      <View style={[styles.header, { backgroundColor: paleta.header }]}>
        <Text style={styles.headerTitulo}>Diarias</Text>
      </View>

      <View style={styles.anilloWrap}>
        <Svg width={140} height={140} viewBox="0 0 140 140">
          <Circle cx="70" cy="70" r={radio} stroke={paleta.borde} strokeWidth="10" fill="none" />
          <Circle
            cx="70" cy="70" r={radio}
            stroke={paleta.acento}
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${progreso} ${circunferencia}`}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
        </Svg>
        <View style={styles.anilloCentro}>
          <Text style={[styles.anilloNumero, { color: paleta.texto }]}>{hechas}/{total}</Text>
          <Text style={[styles.anilloPct, { color: paleta.textoSuave }]}>{porcentaje}%</Text>
        </View>
      </View>

      <View style={[styles.inputWrap, { backgroundColor: paleta.superficie, borderColor: paleta.borde }]}>
        <View style={styles.selectorRow}>
          {secciones.map(s => (
            <TouchableOpacity
              key={s.id}
              style={[styles.selectorBtn, { backgroundColor: paleta.fondo, borderColor: paleta.borde },
                seccionActiva === s.id && { backgroundColor: paleta.header, borderColor: paleta.header }]}
              onPress={() => setSeccionActiva(s.id)}>
              <Text style={styles.selectorEmoji}>{s.emoji}</Text>
              <Text style={[styles.selectorTexto, { color: paleta.textoSuave },
                seccionActiva === s.id && { color: '#FFFFFF' }]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { backgroundColor: paleta.fondo, borderColor: paleta.borde }]}
            placeholder={`Agregar a la ${seccionActiva}...`}
            value={nuevaDiaria}
            onChangeText={setNuevaDiaria}
            onSubmitEditing={agregarDiaria}
          />
          <TouchableOpacity style={[styles.btnAgregar, { backgroundColor: paleta.header }]} onPress={agregarDiaria}>
            <Text style={styles.btnTexto}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.lista} contentContainerStyle={{paddingBottom: 20}}>
        {diarias.length === 0 ? (
          <View style={styles.seccion}>
            <View style={[styles.tarjeta, { backgroundColor: paleta.superficie, borderColor: paleta.borde }]}>
              <Text style={[styles.tarjetaTexto, { color: paleta.textoMuted }]}>No hay tareas diarias aún</Text>
            </View>
          </View>
        ) : (
          secciones.map(s => renderSeccion(s.id, s.emoji, s.label))
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3EE' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#1A1917' },
  headerTitulo: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  anilloWrap: { alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 8 },
  anilloCentro: { position: 'absolute', alignItems: 'center' },
  anilloNumero: { fontSize: 22, fontWeight: 'bold', color: '#1A1917' },
  anilloPct: { fontSize: 13, color: '#6B6860' },
  inputWrap: { margin: 16, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E5E2DA' },
  selectorRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  selectorBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E5E2DA', backgroundColor: '#F5F3EE', alignItems: 'center' },
  lista: { flex: 1 },
  selectorActivo: { backgroundColor: '#1A1917', borderColor: '#1A1917' },
  selectorEmoji: { fontSize: 16, marginBottom: 2 },
  selectorTexto: { fontSize: 12, fontWeight: '500', color: '#6B6860' },
  selectorTextoActivo: { color: '#FFFFFF' },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: '#F5F3EE', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E5E2DA', fontSize: 14 },
  btnAgregar: { backgroundColor: '#1A1917', borderRadius: 10, width: 46, alignItems: 'center', justifyContent: 'center' },
  btnTexto: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  seccion: { paddingHorizontal: 16, paddingBottom: 8 },
  secTitulo: { fontSize: 13, fontWeight: '600', color: '#6B6860', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E2DA' },
  tarjetaTexto: { fontSize: 14, color: '#A8A59E' },
  tareaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 6, borderWidth: 1, borderColor: '#E5E2DA' },
  tareaRow: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  circulo: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#CCC9C0', alignItems: 'center', justifyContent: 'center' },
  circuloHecho: { backgroundColor: '#3B6D11', borderColor: '#3B6D11' },
  check: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  tareaTexto: { fontSize: 14, color: '#1A1917', flex: 1 },
  tareaHecha: { textDecorationLine: 'line-through', color: '#A8A59E' },
  eliminar: { fontSize: 16, color: '#CCC9C0', paddingLeft: 8 },
});