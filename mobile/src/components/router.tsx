import React from "react";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
} from "react-navigation";
import { Icon } from "react-native-elements";

import { AuthNavigator } from "./Auth/router";
import { MainNavigator } from "./Main/router";

export const AppContainer = createSwitchNavigator(
  {
    Auth: AuthNavigator,
    Main: MainNavigator,
  },
  {
    // initialRouteName: "Auth",
    initialRouteName: "Main", // for debug
  }
);
