import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Hola Rafa! 👋</Text>
      <Text style={styles.sub}>Tu app de productividad</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F6F2',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1917',
  },
  sub: {
    fontSize: 16,
    color: '#6B6860',
    marginTop: 8,
  },
});