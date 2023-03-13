import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import {
  TouchableRipple,
  useTheme,
  Appbar,
  Avatar,
  Modal,
  Portal,
  Provider,
  IconButton,
  Chip,
  Button,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { doctorPatientProfileStyle as dps } from "../../styles/land.style";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserDatabyUID, updateUserData } from "../../backend/dbHelper";
import { removeAuthData } from "../../backend/authHelper";

const ProfileEdit = ({ route, navigation }) => {
  const pram = route ? route.params : null;
  const [userData, setUserData] = useState(null);
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [loading, setloading] = useState(true);
  const [init, setinit] = useState(false);

  const saveProcess = async () => {
    if (!fname || !lname) {
      ToastAndroid.show("Enter all details", ToastAndroid.SHORT);
      return;
    }
    if (fname.length < 4) {
      ToastAndroid.show("Enter longer first name", ToastAndroid.SHORT);
      return;
    }
    if (lname.length < 4) {
      ToastAndroid.show("Enter longer last name", ToastAndroid.SHORT);
      return;
    }

    let res = await updateUserData(userData.uid, fname, lname, true);
    if (res.errorBool) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("Profile Updated", ToastAndroid.SHORT);
      if (Number.parseInt(userData.account_type) == 0) {
        console.log("patient");
        navigation.navigate("patientland");
      } else {
        console.log("doctor");
        navigation.navigate("doctorland");
      }
    }
  };

  useLayoutEffect(() => {
    if (pram) {
      const run = async () => {
        const userDataRes = await getUserDatabyUID(pram.uid);
        if (!userDataRes.errorBool) {
          const userDataPar = userDataRes.response;
          setUserData(userDataPar);
          setinit(userDataPar.initiated);
          setfname(userDataPar.fname);
          setlname(userDataPar.lname);
        }
        setloading(false);
      };
      run();
    }
  }, []);

  if (loading)
    return (
      <>
        <SafeAreaView
          style={{
            // height: "100%",
            backgroundColor: "#fff",
            flexGrow: 1,
            display: "flex",
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 2,
              borderBottomColor: "#f1f1f1",
              borderBottomWidth: 1,
              // backgroundColor: "#eee",
              padding: 12,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                icon="arrow-left"
                onPress={() => {
                  if (!init) {
                    removeAuthData()
                      .then(() => {
                        navigation.reset({
                          index: 0,
                          routes: [{ name: "login" }],
                        });
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                    return;
                  }
                  navigation.goBack();
                }}
              />

              <Text
                style={{
                  fontSize: 18,
                  // marginLeft: 12,
                  fontFamily: "Inter-Medium",
                }}
              >
                Edit Profile
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={"large"} color="#000" />
          </View>
        </SafeAreaView>
      </>
    );

  return (
    <>
      <SafeAreaView
        style={{
          // height: "100%",
          backgroundColor: "#fff",
          flexGrow: 1,
          display: "flex",
        }}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 2,
            borderBottomColor: "#f1f1f1",
            borderBottomWidth: 1,
            // backgroundColor: "#eee",
            padding: 12,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              icon="arrow-left"
              onPress={() => {
                if (!init) {
                  removeAuthData()
                    .then(() => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "login" }],
                      });
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                  return;
                }
                navigation.goBack();
              }}
            />
            <Text
              style={{
                fontSize: 18,
                // marginLeft: 12,
                fontFamily: "Inter-Medium",
              }}
            >
              Edit Profile
            </Text>
          </View>

          <Button
            labelStyle={{ fontSize: 16 }}
            textColor="#3B82F6"
            onPress={saveProcess}
          >
            Save
          </Button>
        </View>
        <ScrollView
          style={{
            padding: 32,
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar.Text label={"A"} size={102} />
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              marginTop: 12,
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 2, color: "#555555" }}>
              First Name
            </Text>
            <TextInput
              value={fname}
              placeholder="Enter your first name"
              onChangeText={setfname}
              style={{
                color: "#000",
                fontSize: 19,
                height: 42,
                borderBottomColor: "#bdbdbd",
                borderBottomWidth: 1,
              }}
            />
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              marginTop: 22,
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 2, color: "#555555" }}>
              Last Name
            </Text>
            <TextInput
              value={lname}
              placeholder="Enter your last name"
              onChangeText={setlname}
              style={{
                color: "#000",
                fontSize: 18,
                height: 42,
                borderBottomColor: "#bdbdbd",
                borderBottomWidth: 1,
              }}
            />
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              marginTop: 32,
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 2, color: "#555555" }}>
              Account Type
            </Text>
            <Text
              style={{
                color: "#000",
                fontSize: 18,
                fontStyle: "Inter-Medium",
                height: 42,
              }}
            >
              {userData && Number.parseInt(userData.account_type) == 0
                ? "Patient"
                : "Doctor"}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              marginTop: 8,
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 2, color: "#555555" }}>
              Account ID
            </Text>

            <Text
              style={{
                color: "#000",
                fontSize: 18,
                fontStyle: "Inter-Medium",
                // height: 42,
              }}
            >
              {userData && userData.uid}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ProfileEdit;
