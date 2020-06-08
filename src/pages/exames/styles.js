import { StyleSheet, StatusBar } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: "5%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    height: "10%",
  },
  viewlogo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonBack: {
    paddingRight: 20,
  },
  headerTextTitulo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTextDesc: {
    fontSize: 14,
  },
  exameList: {
    marginTop: 20,
  },
  exame: {
    padding: 24,
    paddingTop: 10,
    borderRadius: 8,
    backgroundColor: "#FFF",
    marginBottom: 16,
  },
  exameTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,
  },
  exameDesc: {
    fontSize: 16,
  },
  viewDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    height: 40,
    backgroundColor: "#007bff",
    marginTop: 20,
    borderRadius: 9,
  },
  buttonShare: {
    backgroundColor: "#808080",
  },
  textButton: {
    fontSize: 18,
    color: "white",
  },
  viewButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
