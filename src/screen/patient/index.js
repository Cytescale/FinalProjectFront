import React, { useRef, useMemo, useCallback } from "react";
import {
  TouchableRipple,
  useTheme,
  BottomNavigation,
  Avatar,
  IconButton,
} from "react-native-paper";
import { Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { doctorIndexStyle as dis } from "../../styles/land.style";

import PatientHomeSreen from "./land";

const PatientLandScreen = ({ navigation }) => {
  const [index, setIndex] = React.useState(0);
  const theme = useTheme();
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    home: PatientHomeSreen,
  });

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#fefefe" style={"dark"} animated />
      <View style={dis.view3}>
        <PatientHomeSreen />
        {/* <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          activeColor="#000"
          inactiveColor="#454545"
          sceneAnimationEnabled
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default PatientLandScreen;
