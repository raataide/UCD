import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Picker,
  AsyncStorage,
} from "react-native";

import logo from "../../assets/logo_principal.png";

import styles from "./styles";

import { useNavigation } from "@react-navigation/native";
import { FloatingTitleTextInputField } from "../../components/input";
import api from "../../services/api";
import { MyModal } from "../../components/modal";

export default function Login({ route }) {
  const [tipoLogin, setTipoLogin] = useState("");
  const [email, setEmail] = useState("raataide@gmail.com");
  const [senha, setSenha] = useState("814496");
  // const [email, setEmail] = useState("754210");
  // const [senha, setSenha] = useState("52B5FC");
  // const [email, setEmail] = useState("");
  // const [senha, setSenha] = useState("");
  const [emailReset, setEmailReset] = useState("");
  const [formValido, setFormValido] = useState(true);
  const [modalValido, setModalValido] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState("Funcionario");
  const [visibleModal, setVisibleModal] = useState(false);
  const [resetEmailError, setResetEmailError] = useState(false);

  const RenderPicker = () => {
    return (
      <View style={styles.viewPicker}>
        <Text style={styles.labelTipo}>Acesso:</Text>
        <View style={styles.picker}>
          <Picker
            style={{ height: 40 }}
            selectedValue={tipoUsuario}
            onValueChange={(itemValue) => setTipoUsuario(itemValue)}
          >
            <Picker.Item label="Funcionário" value="Funcionario" />
            <Picker.Item label="Médico" value="Medico" />
            <Picker.Item label="Posto" value="Posto" />
            <Picker.Item label="Paciente" value="Paciente" />
          </Picker>
        </View>
      </View>
    );
  };

  const _updateMasterState = async (attrName, value) => {
    var parse_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (attrName == "email") {
      await setEmail(value);
    }

    if (attrName == "senha") {
      await setSenha(value);
    }

    if (attrName == "emailReset") {
      await setEmailReset(value);
      if (parse_email.test(emailReset)) {
        setModalValido(true);
      } else {
        setModalValido(false);
      }
    }

    if (tipoLogin !== "protocolo") {
      if (parse_email.test(email) && senha.length >= 3) {
        setFormValido(true);
      } else {
        setFormValido(false);
      }
    }
  };

  useEffect(() => {
    setTipoLogin(route.params.tipoLogin);
  });

  const navigation = useNavigation();

  const entrar = async () => {
    if (tipoLogin == "protocolo") {
      navigation.navigate("Exames", {
        protocolo: email,
        senha: senha,
        tipoLogin: "protocolo",
      });
    } else {
      await api
        .post("login", {
          tipo: tipoUsuario,
          email: email,
          senha: senha,
        })
        .then(async (res) => {
          const usuario = await JSON.stringify(res.data.usuario);
          if (usuario) {
            await AsyncStorage.setItem("@UCDApp:token", res.data.token);
            await AsyncStorage.setItem("@UCDApp:usuario", usuario);
            navigation.navigate("Exames", { tipoLogin: "email" });
          }
        });
    }
  };

  const resetSenha = async () => {
    await setResetEmailError(false);
    await api
      .post("solicitarNovaSenha", {
        tipo: tipoUsuario,
        email: email,
      })
      .then(async (res) => {
        if (res.status == 200) {
          onPress;
          console.log("Email enviado");
        }
      })
      .catch(async (error) => {
        await setResetEmailError(true);
      });
  };

  const onPress = () => {
    setEmailReset("");
    setResetEmailError(false);
    setModalValido(false);
    setVisibleModal(!visibleModal);
  };

  const backHome = () => {
    navigation.navigate("Home");
  };
  return (
    <SafeAreaView style={styles.container}>
      <MyModal
        visible={visibleModal}
        onRequestClose={onPress}
        onPressOverlay={onPress}
      >
        <View>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Cadastrar/Recuperar senha</Text>

            {RenderPicker()}
            <FloatingTitleTextInputField
              attrName="emailReset"
              title="Email"
              value={emailReset}
              autoCompleteType={"email"}
              keyboardType={"email-address"}
              updateMasterState={_updateMasterState}
            />
            <TouchableOpacity
              style={[
                styles.button,
                modalValido ? {} : { backgroundColor: "gray" },
              ]}
              disabled={modalValido ? false : true}
              onPress={resetSenha}
            >
              <Text style={[styles.txtButton, styles.txtEntrar]}>
                Enviar email
              </Text>
            </TouchableOpacity>
            {resetEmailError ? (
              <Text style={{ color: "red", fontSize: 16 }}>
                Falha ao enviar o e-mail, tente novamente mais tarde!
              </Text>
            ) : null}
          </View>
        </View>
      </MyModal>
      <Image style={styles.logo} source={logo} />
      {tipoLogin !== "protocolo" ? RenderPicker() : <></>}
      <FloatingTitleTextInputField
        attrName="email"
        title={tipoLogin !== "protocolo" ? "Email" : "Protocolo"}
        value={email}
        // autoCompleteType={"email"}
        keyboardType={
          tipoLogin !== "protocolo"
            ? "email-address"
            : "numbers-and-punctuation"
        }
        updateMasterState={_updateMasterState}
        titleActiveSize={12}
        titleInActiveSize={16}
      />
      <FloatingTitleTextInputField
        attrName="senha"
        title="Senha"
        value={senha}
        secureTextEntry={true}
        updateMasterState={_updateMasterState}
        titleActiveSize={12}
        titleInActiveSize={16}
      />
      <TouchableOpacity
        style={[styles.button, formValido ? {} : { backgroundColor: "gray" }]}
        disabled={formValido ? false : true}
        onPress={entrar}
      >
        <Text style={[styles.txtButton, styles.txtEntrar]}>Entrar</Text>
      </TouchableOpacity>
      {tipoLogin !== "protocolo" ? (
        <TouchableOpacity
          style={[styles.button, styles.buttonRecuperar]}
          onPress={onPress}
        >
          <Text style={styles.txtButton}>Cadastrar/Recuperar Senha</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <TouchableOpacity style={{ paddingTop: 10 }} onPress={backHome}>
        <Text style={{ textDecorationLine: "underline", fontSize: 16 }}>
          Voltar
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
