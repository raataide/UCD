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
import Share from "react-native-share";

import api from "../../services/api";

import logo from "../../assets/logo.png";
import Icon from "react-native-vector-icons/AntDesign";

import styles from "./styles";

export default function Exames({ route }) {
  const [usuario, setUsuario] = useState({});
  const [exames, setExames] = useState([]);
  const [showitem, setShowItem] = useState(5);
  const [loading, setLoading] = useState(false);
  const [base64pdf, setBase64pdf] = useState("");

  const tipoLogin = route.params ? route.params.tipoLogin : "";
  const protocolo = route.params ? route.params.protocolo : "";
  const navigation = useNavigation();

  async function loadMore() {
    await setShowItem(showitem + 5);
  }

  async function getFile(hash) {
    let options = {};
    const token = await AsyncStorage.getItem("@UCDApp:token");
    console.log(token);
    options.hash = hash;
    if (tipoLogin == "protocolo") {
      options.protocolo = protocolo;
      options.senha = route.params.senha;
    } else {
      options.token = token;
    }
    console.log(options);
    const result = await api.post("pegarArquivo", options);
    return result;
  }

  const onViewPdf = async (hash) => {
    setBase64pdf("asdasd");

    const b64Pdf = await getFile(hash);

    setBase64pdf(b64Pdf.data);

    if (base64pdf) {
      navigation.navigate("Pdf", { base64: base64pdf });
    } else {
      alert("Falha ao visualizar o PDF, tente novamente!");
    }
  };

  const onShare = async (hash) => {
    const b64Pdf = await getFile(hash);
    const url = "data:application/pdf;base64," + b64Pdf.data;
    const title = "Resultado do exame";
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            // For sharing url with custom title.
            placeholderItem: { type: "url", content: url },
            item: {
              default: { type: "url", content: url },
            },
            subject: {
              default: title,
            },
            linkMetadata: {
              originalUrl: url,
              url,
              title: title,
            },
          },
        ],
      },
      android: {
        title: title,
        subject: title,
        url: url,
      },
    });
    Share.open(options);
  };

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
    if (tipoLogin == "protocolo") {
      await api
        .post("examesPorProtocolo", {
          protocolo: protocolo,
          senha: route.params.senha,
        })
        .then(async (res) => {
          if (res) {
            setLoading(true);
            setExames(res.data.exames);
          }
        });
    } else {
      const tokenString = await AsyncStorage.getItem("@UCDApp:token");

      await api
        .post("examesPorUsuario", {
          token: tokenString,
        })
        .then(async (res) => {
          if (res) {
            setLoading(true);
            setExames(res.data.exames);
          }
        });
    }
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
          <Text style={styles.headerTextTitulo}>
            {tipoLogin == "protocolo" ? "Protocolo" : usuario.nome}
          </Text>
          <Text style={styles.headerTextDesc}>
            {tipoLogin == "protocolo" ? protocolo : usuario.tipo}
          </Text>
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
                    onViewPdf(exame.hash);
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
