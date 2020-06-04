import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";

import logo from "../../assets/logo_principal.png";

import styles from "./styles";

import { useNavigation } from "@react-navigation/native";
export default function Exames() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Login", {
            tipoLogin: "protocolo",
          })
        }
      >
        <Text style={styles.txtButton}>Protocolo e Senha</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login", { tipoLogin: "email" })}
      >
        <Text style={styles.txtButton}>E-mail e Senha</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
