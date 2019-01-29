import React from "react";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
} from "react-navigation";
import { Icon } from "react-native-elements";

import { AuthNavigator } from "./Auth/router";
import { MainNavigator } from "./Main/router";
import { LoadingNavigator } from "./Loading/router";

export const AppContainer = createSwitchNavigator(
  {
    Auth: AuthNavigator,
    Loading: LoadingNavigator,
    Main: MainNavigator,
  },
  {
    // initialRouteName: "Auth",
    initialRouteName: "Loading", // for debug
  }
);
