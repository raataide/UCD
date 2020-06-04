import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: "10%",
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 60,
    backgroundColor: "#007bff",
    borderRadius: 9,
    marginVertical: 10,
  },
  buttonRecuperar: {
    backgroundColor: "#DDDDDD",
  },
  txtButton: {
    fontSize: 20,
    color: "black",
    fontWeight: "600",
  },
  txtEntrar: {
    color: "white",
  },
  logo: {
    width: 150,
    height: 94,
    marginBottom: 30,
  },
  labelTipo: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 9,
    width: "100%",
  },
  viewPicker: {
    width: "100%",
  },
});
