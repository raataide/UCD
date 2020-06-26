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
  TextInput,
  Picker,
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
  const [examesBkp, setExamesBkp] = useState([]);
  const [showitem, setShowItem] = useState(5);
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [indexClicked, setIndexClicked] = useState(null);
  const [sharingFile, setSharingFile] = useState(false);
  const [tipoPesquisa, setTipoPesquisa] = useState("Protocolo");

  const tipoLogin = route.params ? route.params.tipoLogin : "";
  const protocolo = route.params ? route.params.protocolo : "";
  const navigation = useNavigation();

  async function loadMore() {
    await setShowItem(showitem + 5);
  }

  async function search(value) {
    let examesFiltered;
    if (tipoPesquisa == "Protocolo") {
      examesFiltered = examesBkp.filter((exame) =>
        exame.cdProtocolo.includes(value)
      );
    }
    if (tipoPesquisa == "Paciente") {
      examesFiltered = examesBkp.filter((exame) =>
        exame.nomePaciente.includes(value)
      );
    }
    if (tipoPesquisa == "Data") {
      examesFiltered = examesBkp.filter((exame) =>
        exame.dataExame.includes(value)
      );
    }
    if (tipoPesquisa == "Exame") {
      examesFiltered = examesBkp.filter((exame) =>
        exame.cdExame.includes(value)
      );
    }
    setExames(examesFiltered);
  }

  async function getFile(hash) {
    let options = {};
    const token = await AsyncStorage.getItem("@UCDApp:token");
    options.hash = hash;
    if (tipoLogin == "protocolo") {
      options.protocolo = protocolo;
      options.senha = route.params.senha;
    } else {
      options.token = token;
    }
    const result = await api.post("pegarArquivo", options);

    return result.data;
  }

  const onViewPdf = async (hash, index) => {
    setIndexClicked(index);
    setLoadingFile(true);
    let b64 = await getFile(hash);
    if (b64) {
      setLoadingFile(false);
      navigation.navigate("Pdf", { base64: b64 });
    } else {
      setLoadingFile(false);
      alert("Falha ao visualizar o PDF, tente novamente!");
    }
  };

  const onShare = async (hash, index) => {
    setIndexClicked(index);
    setSharingFile(true);
    const b64Pdf = await getFile(hash);
    setSharingFile(false);
    const url = "data:application/pdf;base64," + b64Pdf;
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
            setExamesBkp(res.data.exames);
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
            setExamesBkp(res.data.exames);
          }
        });
    }
  }

  useEffect(() => {
    getUsuarioAS();
  }, []);
  useEffect(() => {
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
      <View style={styles.searchSection}>
        <Icon style={styles.searchIcon} name="search1" size={20} color="gray" />
        <TextInput
          style={styles.input}
          placeholder={"Pesquisar por " + tipoPesquisa}
          onChangeText={(value) => {
            search(value);
          }}
          underlineColorAndroid="transparent"
        />
        <Picker
          style={{ height: 40, width: 40 }}
          selectedValue={tipoPesquisa}
          onValueChange={(itemValue) => setTipoPesquisa(itemValue)}
        >
          <Picker.Item label="Paciente" value="Paciente" />
          <Picker.Item label="Data" value="Data" />
          <Picker.Item label="Protocolo" value="Protocolo" />
          <Picker.Item label="Exame" value="Exame" />
        </Picker>
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
          renderItem={({ item: exame, index }) => (
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
                  disabled={!loadingFile && !sharingFile ? false : true}
                  onPress={() => {
                    onViewPdf(exame.hash, index);
                  }}
                >
                  {!loadingFile || index != indexClicked ? (
                    <Text style={styles.textButton}>Visualizar</Text>
                  ) : (
                    <ActivityIndicator size={30} color="white" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonShare]}
                  disabled={!sharingFile && !loadingFile ? false : true}
                  onPress={() => {
                    onShare(exame.hash, index);
                  }}
                >
                  {!sharingFile || index != indexClicked ? (
                    <Text style={styles.textButton}>Compartilhar</Text>
                  ) : (
                    <ActivityIndicator size={30} color="white" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        ></FlatList>
      )}
    </SafeAreaView>
  );
}
