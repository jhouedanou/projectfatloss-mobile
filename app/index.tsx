import { Redirect } from "expo-router";

export default function Index() {
  // Cette fonction redirige automatiquement vers l'écran d'accueil dans l'onglet
  return <Redirect href="/(tabs)" />;
}
