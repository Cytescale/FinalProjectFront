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
import MatIcon from "@expo/vector-icons/MaterialIcons"
export const FabButton = ({ navigation, index }) => {
  const theme = useTheme();
  return (
    <View style={dis.view1}>
      <TouchableRipple
        icon={"account-plus"}
        onPress={() => {
          navigation.navigate("doctoradd");
        }}
        iconColor={theme.colors.secondary}
        style={{
          width: "100%",
          height: 52,
          borderRadius: 12,
          display: 'flex',
          justifyContent: 'center',
          alignItems:'center',
          backgroundColor: theme.colors.primary,
          elevation: 10,
        }}
      >
        <View style={{display:'flex',flexDirection:'row', justifyContent:'center',alignItems:'center'}}>
          <MatIcon name="add" size={22} color={theme.colors.onPrimary} />
          <Text style={{ fontSize: 16,marginLeft:6, color:theme.colors.onPrimary, fontFamily: "Inter-Medium" }}>Add Report</Text>
        </View>
      </TouchableRipple>
    </View>
  );
};
const DoctorLandScreen = ({ navigation }) => {
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

export default DoctorLandScreen;
