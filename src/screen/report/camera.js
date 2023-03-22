import React, {
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
import { Alert, RefreshControl, Dimensions, Platform } from "react-native";
import {
  TouchableRipple,
  useTheme,
  TextInput,
  Avatar,
  Button,
  Menu,
  Portal,
  Modal,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Text, View, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { doctorLandStyle as dls } from "../../styles/land.style";
import { doctorIndexStyle as dis } from "../../styles/land.style";
import QRCode from "react-native-qrcode-svg";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";

import { cos, set } from "react-native-reanimated";
import MatIcon from "@expo/vector-icons/MaterialIcons";
import { getUserDatabyUID } from "../../backend/dbHelper";

const CameraPlane = ({ setpatientIdInp, setLoading, loading, setscan }) => {
  const [camera, setCamera] = useState(null);
  const [permission, setPrem] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState("4:3");
  const { height, width } = Dimensions.get("window");
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const run = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setPrem(true);
      } else {
        Alert.alert("Access Denied");
      }
    };
    run();
  }, []);
  const prepareRatio = async () => {
    let desiredRatio = "4:3";
    if (Platform.OS === "android") {
      const ratios = await camera.getSupportedRatiosAsync();
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(":");
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        const distance = screenRatio - realRatio;
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      desiredRatio = minDistance;
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      console.log(desiredRatio);
      setImagePadding(remainder);
      setRatio(desiredRatio);
      setIsRatioSet(true);
    }
  };

  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (!loading) {
      setscan(true);
      setpatientIdInp(data);
      setLoading(true);
    }
  };

  if (!permission) {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>No permission granted</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Camera
          ref={(ref) => {
            setCamera(ref);
          }}
          onBarCodeScanned={handleBarCodeScanned}
          onCameraReady={setCameraReady}
          type={type}
          style={[
            {
              flex: 1,
              width: "100%",
              marginBottom: imagePadding + imagePadding,
            },
          ]}
          ratio={ratio}
        >
          <View
            style={{
              width: "100%",
              padding: 32,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text></Text>
            <TouchableRipple
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                borderRadius: 120,
                width: 36,
                height: 36,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MatIcon name="close" color={"#000"} size={20} />
            </TouchableRipple>
          </View>
        </Camera>
      </View>
    );
  }
};

const CameraLand = ({}) => {
  const theme = useTheme();
  const [scan, setscan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientIdInp, setpatientIdInp] = useState("");
  const navigation = useNavigation();

  const processPatientData = async (uid) => {
    try {
      const res = await getUserDatabyUID(uid);
      if (!res.errorBool) {
        navigation.navigate("createreport", {
          pid: patientIdInp,
        });
        setLoading(false);
      } else {
        Alert.alert(res.errorMessage);
        setpatientIdInp(" ");
        setLoading(false);
      }
      // setLoading(false);
      setscan(false);
    } catch (e) {
      console.log(e);
      Alert.alert(e);
    }
  };

  useEffect(() => {
    if (scan && loading && patientIdInp.length > 0) {
      processPatientData(patientIdInp);
    }
  }, [scan, loading]);

  return (
    <>
      <SafeAreaView>
        <View style={dis.view3}>
          <View
            style={{
              backgroundColor: theme.colors.background,
              minHeight: "100%",
            }}
          >
            <StatusBar backgroundColor="#fefefe" style={"dark"} animated />
            <CameraPlane
              setscan={setscan}
              setpatientIdInp={setpatientIdInp}
              loading={loading}
              setLoading={setLoading}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 32,
                backgroundColor: "#fff",
                // height: 200,
                elevation: 5,
                zIndex: 100,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                elevation: 10,
              }}
            >
              <Text
                style={{
                  color: "#000",
                  fontFamily: "Inter-Medium",
                  fontSize: 20,
                  marginBottom: 22,
                }}
              >
                Scan Patient QR
              </Text>
              {/* <Text style={{ marginBottom: 8, fontSize: 14 }}>Patient ID</Text> */}
              <TextInput
                textColor="#000"
                placeholder="Enter patient profile id"
                value={patientIdInp}
                onChangeText={setpatientIdInp}
                cursorColor={"#000"}
                label="Patient Unique Id"
                mode="outlined"
                style={{
                  width: "100%",
                  // height: 52,
                  backgroundColor: "#fff",
                  // borderWidth: 1,
                  // borderColor: "#bdbdbd",
                  borderRadius: 8,
                  // paddingLeft: 12,
                  marginBottom: 22,
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",

                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableRipple
                  onPress={() => {
                    setLoading(true);
                    processPatientData(patientIdInp);
                  }}
                  disabled={loading}
                  style={{
                    width: "100%",
                    flex: 1,
                    backgroundColor: theme.colors.primary,
                    color: "#fff",
                    borderRadius: 120,
                    height: 52,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  textColor="#fff"
                >
                  <Text style={{ color: "#fff" }}>
                    {loading ? (
                      <ActivityIndicator size={"small"} color="#fff" />
                    ) : (
                      "Continue"
                    )}
                  </Text>
                </TouchableRipple>
                <TouchableRipple
                  onPress={() => {
                    setpatientIdInp("");
                    setLoading(false);
                    setscan(false);
                  }}
                  disabled={loading}
                  style={{
                    // backgroundColor: "#D8E7FF",
                    color: "#fff",
                    borderRadius: 8,
                    height: 52,
                    paddingHorizontal: 24,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  textColor="#fff"
                >
                  <Text style={{ color: "#3B82F6" }}>Clear</Text>
                </TouchableRipple>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default CameraLand;
