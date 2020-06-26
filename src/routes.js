import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./pages/login/";
import Exames from "./pages/exames/";
import Home from "./pages/home/";
import Pdf from "./pages/pdf";

const AppStack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="Login" component={Login} />
        <AppStack.Screen name="Exames" component={Exames} />
        <AppStack.Screen name="Pdf" component={Pdf} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
