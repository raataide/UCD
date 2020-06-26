import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import PDFView from "react-native-view-pdf";
import Icon from "react-native-vector-icons/AntDesign";

import styles from "./styles";
import Share from "react-native-share";
import { useNavigation } from "@react-navigation/native";

export default function Pdf({ route }) {
  const [base64pdf, setBase64pdf] = useState("");

  const navigation = useNavigation();

  const onShare = async () => {
    const url = "data:application/pdf;base64," + base64pdf;
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

  useEffect(() => {
    if (route.params.base64) {
      console.log("sucesso 2");
    } else {
      console.log("erro 2");
    }
    setBase64pdf(route.params.base64);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          alignItems: "center",
          height: 60,
          paddingLeft: 10,
          paddingRight: 10,
          borderBottomWidth: 1,
          borderBottomColor: "grey",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Exames")}>
          <Icon name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onShare()} style={styles.button}>
          <Text style={styles.textButton}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
      <PDFView
        fadeInDuration={250.0}
        style={{ flex: 1 }}
        resource={base64pdf}
        resourceType={"base64"}
        onLoad={() => console.log(`PDF rendered from ${"file"}`)}
        onError={() => console.log("Cannot render PDF")}
      />
    </View>
  );
}
