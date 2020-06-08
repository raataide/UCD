import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../services/api";

import logo from "../../assets/logo.png";
import Icon from "react-native-vector-icons/AntDesign";

import styles from "./styles";

export default function Exames() {
  const [usuario, setUsuario] = useState({});
  const [exames, setExames] = useState([]);
  const [showitem, setShowItem] = useState(5);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  async function loadMore() {
    await setShowItem(showitem + 5);
  }

  async function getUsuarioAS() {
    try {
      const valueString = await AsyncStorage.getItem("@UCDApp:usuario");
      const value = JSON.parse(valueString);
      await setUsuario(value);
    } catch (error) {
      alert("Ocorreu um erro ao acessar a tela de exames!");
      navigation.navigate("Home");
    }
  }

  async function getExames() {
    const tokenString = await AsyncStorage.getItem("@UCDApp:token");

    await api
      .post("examesPorUsuario", {
        token: tokenString,
      })
      .then(async (res) => {
        if (res) {
          setLoading(true);
          await setExames(res.data.exames);
        }
      });
  }

  useEffect(() => {
    getUsuarioAS();
    getExames();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewlogo}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.buttonBack}
          >
            <Icon name="arrowleft" size={30} color="black" />
          </TouchableOpacity>
          <Image source={logo} />
        </View>
        <View>
          <Text style={styles.headerTextTitulo}>{usuario.nome}</Text>
          <Text style={styles.headerTextDesc}>{usuario.tipo}</Text>
        </View>
      </View>
      <View style={{ borderBottomWidth: 1, borderBottomColor: "gray" }}></View>
      <View>
        <Text>Pesquisar</Text>
      </View>

      {!loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={60} color="#8B0000" />
        </View>
      ) : (
        <FlatList
          data={exames.slice(0, showitem)}
          keyExtractor={(exames) => String(exames.hash)}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          renderItem={({ item: exame }) => (
            <View style={styles.exame}>
              <Text style={styles.exameTitle}>Paciente:</Text>
              <Text style={styles.exameDesc}>{exame.nomePaciente}</Text>
              <Text style={styles.exameTitle}>Tipo:</Text>
              <Text style={styles.exameDesc}>{exame.tipoExame}</Text>
              <View style={styles.viewDetail}>
                <View>
                  <Text style={styles.exameTitle}>Data:</Text>
                  <Text style={styles.exameDesc}>{exame.dataExame}</Text>
                </View>
                <View>
                  <Text style={styles.exameTitle}>Código:</Text>
                  <Text style={styles.exameDesc}>{exame.cdProtocolo}</Text>
                </View>
                <View>
                  <Text style={styles.exameTitle}>Exame:</Text>
                  <Text style={styles.exameDesc}>{exame.cdExame}</Text>
                </View>
              </View>
              <View style={styles.viewButtons}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    onShare(exame.hash);
                  }}
                >
                  <Text style={styles.textButton}>Visualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonShare]}
                  onPress={() => {
                    onShare(exame.hash);
                  }}
                >
                  <Text style={styles.textButton}>Compartilhar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        ></FlatList>
      )}
    </SafeAreaView>
  );
}
