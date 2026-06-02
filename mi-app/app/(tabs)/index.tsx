import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.saludo}>¡Hola, Rafa! 👋</Text>
        <Text style={styles.fecha}>{new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.secTitulo}>📅 Calendario</Text>
        <View style={styles.tarjeta}>
          <Text style={styles.tarjetaTexto}>Próximamente...</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F6F2' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#1A1917' },
  saludo: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF' },
  fecha: { fontSize: 14, color: '#A8A59E', marginTop: 4, textTransform: 'capitalize' },
  seccion: { padding: 16 },
  secTitulo: { fontSize: 16, fontWeight: '600', color: '#1A1917', marginBottom: 10 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#E5E2DA' },
  tarjetaTexto: { fontSize: 14, color: '#A8A59E' },
});