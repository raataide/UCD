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
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 9,
    marginVertical: 10,
  },
  buttonRecuperar: {
    backgroundColor: "#DDDDDD",
  },
  txtButton: {
    fontSize: 18,
    color: "black",
    fontWeight: "600",
  },
  txtEntrar: {
    color: "white",
  },
  logo: {
    marginTop: 30,
    marginBottom: 30,
  },
  labelTipo: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 9,
    width: "100%",
    height: 40,
  },
  viewPicker: {
    width: "100%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 30,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
