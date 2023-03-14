import React, { useRef, useMemo, useCallback } from "react";
import {
  TouchableRipple,
  useTheme,
  BottomNavigation,
  Avatar,
  IconButton,
  Button,
} from "react-native-paper";
import { Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import DoctorHomeSreen from "./land";
import DoctorPatientScreen from "./patients";
import { doctorIndexStyle as dis } from "../../styles/land.style";
import { useNavigation } from "@react-navigation/native";
DoctorLandScreen = ({ navigation }) => {
  const [index, setIndex] = React.useState(0);
  const theme = useTheme();
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "patients",
      title: "Patients",
      focusedIcon: "account-multiple",
      unfocusedIcon: "account-multiple-outline",
    },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    home: DoctorHomeSreen,
    patients: DoctorPatientScreen,
  });
  return <DoctorHomeSreen navigation={navigation} />;
  return (
    <SafeAreaView>
      <FabButton navigation={navigation} index={index} />

      <StatusBar backgroundColor="#fefefe" style={"dark"} animated />
      <View style={dis.view3}>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          activeColor="#000"
          inactiveColor="#454545"
          sceneAnimationEnabled
        />
      </View>
    </SafeAreaView>
  );
};

export default DoctorHomeSreen;
