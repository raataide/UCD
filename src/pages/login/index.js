import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Picker,
} from "react-native";

import logo from "../../assets/logo_principal.png";

import styles from "./styles";

import { useNavigation } from "@react-navigation/native";
import { FloatingTitleTextInputField } from "../../components/input";
import api from "../../services/api";

export default function Login({ route }) {
  const [tipoLogin, setTipoLogin] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [formValido, setFormValido] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState("Posto");

  const RenderPicker = () => {
    return (
      <View style={styles.viewPicker}>
        <Text style={styles.labelTipo}>Acesso:</Text>
        <View style={styles.picker}>
          <Picker
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
    await api
      .post("login", {
        tipo: tipoUsuario,
        email: email,
        senha: senha,
      })
      .then(async (res) => {
        let usuario = await JSON.stringify(res.data.usuario);
        if (usuario) {
          navigation.navigate("Exames");
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
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
        titleActiveSize={16}
        titleInActiveSize={20}
      />
      <FloatingTitleTextInputField
        attrName="senha"
        title="Senha"
        value={senha}
        secureTextEntry={true}
        updateMasterState={_updateMasterState}
        titleActiveSize={16}
        titleInActiveSize={20}
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
          onPress={"_onPress"}
        >
          <Text style={styles.txtButton}>Cadastrar/Recuperar minha Senha</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
}
