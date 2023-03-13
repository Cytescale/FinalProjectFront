import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignupScreen from "./src/screen/signup";
import ProfileEdit from "./src/screen/profile/profileedit";
import LoginScreen from "./src/screen/login";
import DoctorLandScreen from "./src/screen/doctor";
import DoctorAddPatientScreen from "./src/screen/doctor/addpatient";
import DoctorPatientProfileScreen from "./src/screen/doctor/patientprofile";
import DoctorPatientReportScreen from "./src/screen/doctor/report";
import PatientLandScreen from "./src/screen/patient";
import lighttheme from "./assets/theme";
import { useEffect, useLayoutEffect, useState } from "react";
import { getAuthData, removeAuthData } from "./src/backend/authHelper";
import { getUserDatabyUID } from "./src/backend/dbHelper";
const Stack = createNativeStackNavigator();

export default function App() {
  const [auth, setAuth] = useState(false);
  const [atype, setatype] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    "Inter-Black": require("./assets/fonts/Inter/static/Inter-Black.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter/static/Inter-Bold.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter/static/Inter-Medium.ttf"),
    "Inter-Regular": require("./assets/fonts/Inter/static/Inter-Regular.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter/static/Inter-SemiBold.ttf"),
  });

  useLayoutEffect(() => {
    getAuthData().then(async (r) => {
      if (r) {
        const accType = Number.parseInt(JSON.parse(r).account_type);
        if (accType) {
          setatype(accType);
        }
        setAuth(true);
        setLoading(false);
      } else {
        setAuth(false);
        setLoading(false);
      }
    });
  }, []);

  if (fontsLoaded && !loading) {
    return (
      <PaperProvider theme={lighttheme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={`${
              auth
                ? Number.parseInt(atype) == 0
                  ? "patientland"
                  : "doctorland"
                : "login"
            }`}
          >
            <Stack.Screen
              name="login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="doctorland"
              component={DoctorLandScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="doctoradd"
              component={DoctorAddPatientScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="doctorpatient"
              component={DoctorPatientProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="doctorpatientreport"
              component={DoctorPatientReportScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="patientland"
              component={PatientLandScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="profileedit"
              component={ProfileEdit}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  }
}
