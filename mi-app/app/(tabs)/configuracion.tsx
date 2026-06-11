 import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useTema } from '../contexto-tema';
import { Paletas, PaletaNombre } from '@/constants/theme';

const paletasInfo = [
  { id: 'oscuro' as PaletaNombre, nombre: '🌙 Oscuro', descripcion: 'Header negro, fondo crema' },
  { id: 'pastel' as PaletaNombre, nombre: '🌸 Pastel', descripcion: 'Tonos violeta suave' },
  { id: 'vivos' as PaletaNombre, nombre: '🎨 Vivos', descripcion: 'Azul y naranja' },
  { id: 'grises' as PaletaNombre, nombre: '🪨 Grises', descripcion: 'Tonos grises neutros' },
  { id: 'natural' as PaletaNombre, nombre: '🌿 Natural', descripcion: 'Verde oscuro y beige' },
];

export default function ConfiguracionScreen() {
  const { paleta, paletaNombre, cambiarPaleta } = useTema();

  return (
    <View style={[styles.container, { backgroundColor: paleta.fondo }]}>
      <View style={[styles.header, { backgroundColor: paleta.header }]}>
        <Text style={styles.headerTitulo}>⚙️ Configuración</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.seccion}>
          <Text style={[styles.secTitulo, { color: paleta.textoSuave }]}>TEMA DE COLORES</Text>

          {paletasInfo.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.paletaItem, {
                backgroundColor: paleta.superficie,
                borderColor: paletaNombre === p.id ? Paletas[p.id].acento : paleta.borde,
                borderWidth: paletaNombre === p.id ? 2 : 1,
              }]}
              onPress={() => cambiarPaleta(p.id)}
            >
              <View style={[styles.paletaPreview, { backgroundColor: Paletas[p.id].header }]} />
              <View style={[styles.paletaPreview, { backgroundColor: Paletas[p.id].fondo }]} />
              <View style={[styles.paletaPreview, { backgroundColor: Paletas[p.id].acento }]} />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={[styles.paletaNombre, { color: paleta.texto }]}>{p.nombre}</Text>
                <Text style={[styles.paletaDesc, { color: paleta.textoMuted }]}>{p.descripcion}</Text>
              </View>
              {paletaNombre === p.id && (
                <Text style={[styles.check, { color: Paletas[p.id].acento }]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60 },
  headerTitulo: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  seccion: { padding: 16 },
  secTitulo: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  paletaItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, marginBottom: 8 },
  paletaPreview: { width: 24, height: 24, borderRadius: 6, marginRight: 4 },
  paletaNombre: { fontSize: 14, fontWeight: '600' },
  paletaDesc: { fontSize: 12, marginTop: 2 },
  check: { fontSize: 18, fontWeight: 'bold' },
});
