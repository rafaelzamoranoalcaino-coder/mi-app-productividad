import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { useTema } from '../contexto-tema';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

function DiaPersonalizado({ date, state, marking, onPress, acento, header }: any) {
  const hoy = new Date();
  const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;
  const esHoy = date.dateString === hoyStr;
  const esSeleccionado = marking?.selected;

  return (
    <TouchableOpacity onPress={() => onPress(date)} style={styles2.diaWrap}>
      <View style={[
        styles2.dia,
        esHoy && [styles2.diaHoy, { backgroundColor: acento || '#3B6D11' }],
        esSeleccionado && [styles2.diaSeleccionado, { backgroundColor: header || '#1A1917' }],
        esHoy && esSeleccionado && [styles2.diaHoySeleccionado, { backgroundColor: header || '#1A1917', borderColor: acento || '#3B6D11' }],
      ]}>
        <Text style={[
          styles2.diaTxt,
          state === 'disabled' && styles2.diaDeshabilitado,
          esHoy && styles2.diaTxtHoy,
          esSeleccionado && styles2.diaTxtSeleccionado,
        ]}>{date.day}</Text>
      </View>
      {marking?.marked && (
        <View style={[styles2.punto, { backgroundColor: marking.dotColor || '#378ADD' }]} />
      )}
    </TouchableOpacity>
  );
}

const styles2 = StyleSheet.create({
  diaWrap: { alignItems: 'center', justifyContent: 'center', width: 36, height: 46 },
  dia: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  diaHoy: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#3B6D11' },
  diaSeleccionado: { backgroundColor: '#1A1917', borderRadius: 16 },
  diaTxt: { fontSize: 14, color: '#1A1917' },
  diaTxtHoy: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  diaTxtSeleccionado: { color: '#FFFFFF' },
  diaDeshabilitado: { color: '#CCC9C0' },
  punto: { width: 5, height: 5, borderRadius: 3, marginTop: 2 },
  diaHoySeleccionado: { backgroundColor: '#1A1917', borderWidth: 3, borderColor: '#3B6D11' },
});

export default function CalendarioScreen() {
  const { paleta } = useTema();
  const [tareas, setTareas] = useState<{id: number, texto: string, hecha: boolean, fecha?: string}[]>([]);
  const [recordatorios, setRecordatorios] = useState<{id: number, texto: string, fecha: string, hora: string}[]>([]);
  const [diarias, setDiarias] = useState<{id: number, texto: string, hecha: boolean}[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState('');

  useFocusEffect(
    useCallback(() => {
      const cargar = async () => {
        const guardadas = await AsyncStorage.getItem('tareas');
        if (guardadas) setTareas(JSON.parse(guardadas));
        const guardadosRec = await AsyncStorage.getItem('recordatorios');
        if (guardadosRec) setRecordatorios(JSON.parse(guardadosRec));
        const guardadasDiarias = await AsyncStorage.getItem('diarias');
        if (guardadasDiarias) setDiarias(JSON.parse(guardadasDiarias));
      };
      cargar();
    }, [])
  );

  const markedDates: any = {};
  tareas.forEach(t => {
    if (t.fecha) {
      try {
        const d = new Date(t.fecha);
        const fecha = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        markedDates[fecha] = { marked: true, dotColor: t.hecha ? '#3B6D11' : '#D85A30' };
      } catch(e) {}
    }
  });

  recordatorios.forEach(r => {
    if (r.fecha) {
      markedDates[r.fecha] = { ...markedDates[r.fecha], marked: true, dotColor: '#378ADD' };
    }
  });

  if (diaSeleccionado) {
    markedDates[diaSeleccionado] = { ...markedDates[diaSeleccionado], selected: true, selectedColor: '#1A1917' };
  }

  const tareasDia = tareas.filter(t => {
    if (!t.fecha) return false;
    const d = new Date(t.fecha);
    const fecha = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    return fecha === diaSeleccionado;
  });

  const recordatoriosDia = recordatorios.filter(r => r.fecha === diaSeleccionado);

  const hoy = new Date();
  const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;
  const totalDiarias = diarias.length;
  const hechasDiarias = diarias.filter(t => t.hecha).length;
  const porcentajeDiarias = totalDiarias === 0 ? 0 : Math.round(hechasDiarias / totalDiarias * 100);
  const recordatoriosHoy = recordatorios.filter(r => r.fecha === hoyStr).length;
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: paleta.fondo }}>
      <View style={[styles.header, { backgroundColor: paleta.header }]}>
        <Text style={styles.headerFecha}>{dias[hoy.getDay()]}, {hoy.getDate()} de {meses[hoy.getMonth()]}</Text>
        <Text style={styles.headerTitulo}>Calendario</Text>
      </View>

      <View style={[styles.calWrap, { borderColor: paleta.borde }]}>
        <Calendar
          markedDates={markedDates}
          onDayPress={(day: any) => setDiaSeleccionado(day.dateString)}
          dayComponent={(props: any) => (
            <DiaPersonalizado {...props} onPress={(date: any) => setDiaSeleccionado(date.dateString)} acento={paleta.acento} header={paleta.header} />
          )}
          theme={{
            backgroundColor: paleta.superficie,
            calendarBackground: paleta.superficie,
            todayTextColor: '#FFFFFF',
            todayBackgroundColor: paleta.acento,
            selectedDayBackgroundColor: paleta.header,
            selectedDayTextColor: '#FFFFFF',
            arrowColor: paleta.header,
            monthTextColor: paleta.texto,
            dayTextColor: paleta.texto,
            textDisabledColor: paleta.borde,
            todayDotColor: '#FFFFFF',
          }}
        />
      </View>

      <View style={[styles.resumenWrap, { backgroundColor: paleta.superficie, borderColor: paleta.borde }]}>
        <Text style={[styles.resumenTitulo, { color: paleta.textoSuave }]}>HOY</Text>
        <View style={styles.resumenRow}>
          <View style={[styles.resumenCard, { backgroundColor: paleta.fondo, borderColor: paleta.borde }]}>
            <Text style={[styles.resumenNum, { color: paleta.texto }]}>{tareas.filter(t => !t.hecha).length}</Text>
            <Text style={[styles.resumenLabel, { color: paleta.textoMuted }]}>Tareas{'\n'}pendientes</Text>
          </View>
          <View style={[styles.resumenCard, { backgroundColor: paleta.fondo, borderColor: paleta.borde }]}>
            <Text style={[styles.resumenNum, { color: paleta.acento }]}>{porcentajeDiarias}%</Text>
            <Text style={[styles.resumenLabel, { color: paleta.textoMuted }]}>Diarias{'\n'}completadas</Text>
          </View>
          <View style={[styles.resumenCard, { backgroundColor: paleta.fondo, borderColor: paleta.borde }]}>
            <Text style={[styles.resumenNum, { color: paleta.texto }]}>{recordatoriosHoy}</Text>
            <Text style={[styles.resumenLabel, { color: paleta.textoMuted }]}>Recordatorios{'\n'}hoy</Text>
          </View>
        </View>
</View>

      {diaSeleccionado ? (
        <View style={styles.seccion}>
          <Text style={[styles.secTitulo, { color: paleta.textoSuave }]}>📋 Tareas</Text>
          {tareasDia.length === 0 ? (
            <View style={[styles.tarjeta, { backgroundColor: paleta.superficie, borderColor: paleta.borde }]}>
              <Text style={[styles.tarjetaTexto, { color: paleta.textoMuted }]}>Sin tareas para este día</Text>
            </View>
          ) : (
            tareasDia.map(t => (
              <View key={t.id} style={[styles.tareaItem, { backgroundColor: paleta.superficie, borderColor: paleta.borde }]}>
                <View style={[styles.circulo, t.hecha && { backgroundColor: paleta.acento, borderColor: paleta.acento }]}>
                  {t.hecha && <Text style={styles.check}>✓</Text>}
                </View>
                <Text style={[styles.tareaTexto, { color: paleta.texto }, t.hecha && styles.tareaHecha]}>{t.texto}</Text>
              </View>
            ))
          )}
          {recordatoriosDia.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.secTitulo, { color: paleta.textoSuave }]}>🔔 Recordatorios</Text>
              {recordatoriosDia.map(r => (
                <View key={r.id} style={[styles.recItem, { backgroundColor: paleta.acentoSuave }]}>
                  <View style={[styles.recIconWrap, { backgroundColor: paleta.borde }]}>
                    <Text style={{ fontSize: 16 }}>🔔</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.recTexto, { color: paleta.texto }]}>{r.texto}</Text>
                    <Text style={[styles.recHora, { color: paleta.acento }]}>🕐 {r.hora}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3EE' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#1A1917' },
  headerFecha: { fontSize: 12, color: '#A8A59E', marginBottom: 4, textTransform: 'capitalize' },
  headerTitulo: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  calWrap: { margin: 16, backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E2DA' },
  seccion: { padding: 16 },
  secTitulo: { fontSize: 13, fontWeight: '600', color: '#6B6860', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E2DA' },
  tarjetaTexto: { fontSize: 14, color: '#A8A59E' },
  tareaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 6, borderWidth: 1, borderColor: '#E5E2DA', gap: 12 },
  circulo: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#CCC9C0', alignItems: 'center', justifyContent: 'center' },
  circuloHecho: { backgroundColor: '#3B6D11', borderColor: '#3B6D11' },
  check: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  tareaTexto: { fontSize: 14, color: '#1A1917', flex: 1 },
  tareaHecha: { textDecorationLine: 'line-through', color: '#A8A59E' },
  recItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EAF3DE', borderRadius: 12, padding: 12, marginBottom: 6, gap: 10 },
  recIconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#C0DD97', alignItems: 'center', justifyContent: 'center' },
  recTexto: { fontSize: 14, color: '#27500A', fontWeight: '500' },
  recHora: { fontSize: 11, color: '#3B6D11', marginTop: 2 },
  diariasResumen: { marginBottom: 16 },
  diariasBar: { height: 6, backgroundColor: '#E5E2DA', borderRadius: 3, overflow: 'hidden', marginVertical: 6 },
  diariasProgreso: { height: 6, backgroundColor: '#3B6D11', borderRadius: 3 },
  diariasTexto: { fontSize: 12, color: '#6B6860' },
  resumenWrap: { margin: 16, borderRadius: 16, padding: 14, borderWidth: 1 },
  resumenTitulo: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  resumenRow: { flexDirection: 'row', gap: 8 },
  resumenCard: { flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, alignItems: 'center' },
  resumenNum: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  resumenLabel: { fontSize: 11, textAlign: 'center', lineHeight: 15 },
});