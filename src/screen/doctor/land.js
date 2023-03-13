import React, {
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
import {
  TouchableRipple,
  useTheme,
  Avatar,
  Button,
  Menu,
  Portal,
  Modal,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { Text, View, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { doctorLandStyle as dls } from "../../styles/land.style";
import { doctorPatientProfileStyle as dps } from "../../styles/land.style";
import { removeAuthData } from "../../backend/authHelper";
import patientData from "../../../assets/fakedata/patientData.json";
import { getUserDatabyUID, getRelationsByDID } from "../../backend/dbHelper";
import { getAuthData } from "../../backend/authHelper";
import { SafeAreaView } from "react-native-safe-area-context";

const deco1URL =
  "https://imgproxy-us-east-2-new.icons8.com/vC80ClJOre5_BE5uX__tMKuq4A7vagxv71MEKkx0vQg/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvODY2/LzJlZjcyYWZjLTli/ODYtNGY5NC04NDU4/LTdmYzMyYWE5ODM3/Mi5zdmc.png";
const deco2URL =
  "https://imgproxy-us-east-2-new.icons8.com/rIo-fSu8V7uAx2fsXQLbK_wsCtZHzJSncyj3WJ4CEtQ/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMTIv/MThhNDllODgtMjg1/Ny00MDQ2LWI3MTkt/MzUwZjhkNTI5ZGY3/LnN2Zw.png";

const RenderToolTip = ({ theme }) => {
  return (
    <View style={{ padding: 32, paddingTop: 0, paddingBottom: 0 }}>
      <Text
        style={{
          color: theme.colors.secondary,
          ...dls.text10,
        }}
      >
        Today's tip
      </Text>
      <View
        style={{ ...dls.view7, backgroundColor: theme.colors.primaryContainer }}
      >
        <Text style={{ ...dls.text11, color: theme.colors.onPrimaryContainer }}>
          💡 You can change the color
        </Text>
      </View>
    </View>
  );
};

export const RandomColorString = () => {
  const colors = ["#fae8ff", "#d8b4fe", "#fffbeb", "#a5b4fc", "#f0f9ff"];
  const randomElement = colors[Math.floor(Math.random() * colors.length)];
  return randomElement;
};

const RenderPatientTable = ({ theme, pData }) => {
  const navigation = useNavigation();

  return (
    <>
      <View
        style={{
          width: "100%",
          marginTop: 32,
          padding: 32,
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <View style={dls.view8}>
          <Text
            style={{
              color: theme.colors.secondary,
              ...dls.text12,
            }}
          >
            Your Patients
          </Text>
          <IconButton icon={"refresh"} onPress={()=>{}} />
          {/*           
          <TouchableRipple onPress={() => {}} rippleColor={"rgba(0,0,0,0.1)"}>
            <Text style={{ color: "#3b82f6" }}>Refresh</Text>
          </TouchableRipple> */}
        </View>
        <View style={dls.view9}>
          {pData.map((e, i) => {
            if (i < 5)
              return (
                <TouchableRipple
                  key={i}
                  rippleColor="rgba(0,0,0,0.09)"
                  onPress={() => {
                    navigation.navigate("doctorpatient", {
                      uid: e.patientData.uid,
                    });
                  }}
                  style={{
                    ...dls.touch1,
                    borderBottomWidth: i != pData.length-1 || i == 4 ? 1 : 0,
                    borderBottomColor: '#e0e0e0',
                  }}
                >
                  <View style={dls.view11}>
                    <View style={dls.view12}>
                      <Avatar.Text
                        size={32}
                        label={e.patientData.fname[0]}
                        color={theme.colors.onSurface}
                        style={{ backgroundColor: RandomColorString() }}
                      />
                      <Text style={dls.text15}>
                        {e.patientData.fname} {e.patientData.lname}
                      </Text>
                    </View>
                    {/* <Text
                      style={{ ...dls.text16, color: theme.colors.onSurface }}
                    >
                    active
                    </Text> */}
                  </View>
                </TouchableRipple>
              );
          })}
          <TouchableRipple style={{
            width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: 52,
            borderTopColor: '#e0e0e0',
            borderTopWidth:1,
          
          }}>
              <Text>View All</Text>
            </TouchableRipple>
        </View>
      </View>
    </>
  );
};


const BannerDeco = ({ theme }) => {
  return (
    <View style={{ padding: 24, paddingTop: 0, paddingBottom: 0 }}>
      <LinearGradient
        colors={["#a78bfa", "#f472b6"]}
        style={{
          backgroundColor: theme.colors.tertiaryContainer,
          ...dls.view13,
        }}
      >
        <Text
          style={{
            ...dls.text19,
            color: theme.colors.onPrimary,
          }}
        >
          Somebetter tagline for doctors
        </Text>
        <Image style={{ width: 100, height: 100 }} source={{ uri: deco1URL }} />
      </LinearGradient>
    </View>
  );
};

const BannerDeco2 = ({ theme }) => {
  return (
    <View style={{ padding: 24, paddingTop: 0, paddingBottom: 0 }}>
      <View
        style={{
          // backgroundColor: theme.colors.tertiaryContainer,
          borderRadius: 12,
          width: "100%",
          marginTop: 12,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image style={{ width: 150, height: 150 }} source={{ uri: deco2URL }} />
        <Text
          style={{
            maxWidth: "60%",
            fontFamily: "Inter-Bold",
            fontSize: 22,
            padding: 24,
            color: theme.colors.tertiary,
          }}
        >
          Somebetter tagline for doctors
        </Text>
      </View>
    </View>
  );
};

const DoctorProfileModal = ({ visible, hideModal, theme, userData }) => {
  const navigation = useNavigation();
  console.log(userData);
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          borderRadius: 12,
          marginLeft: 22,
          marginRight: 22,
          padding: 32,
        }}
      >
        <Button
          icon={"cog-outline"}
          textColor={theme.colors.primary}
          style={{
            height: 52,
            display: "flex",
            justifyContent: "center",
            // marginTop: 22,
            backgroundColor: theme.colors.primaryContainer,
          }}
          onPress={() => {
            navigation.navigate("profileedit", {
              uid: userData.uid,
            });
            hideModal();
          }}
        >
          Edit Profile
        </Button>
        <Button
          mode="contained-tonal"
          icon={"logout"}
          textColor={theme.colors.error}
          style={{
            display: "flex",
            justifyContent: "center",
            height: 52,
            marginTop: 12,
            backgroundColor: theme.colors.errorContainer,
          }}
          onPress={async () => {
            await removeAuthData();
            navigation.reset({
              index: 0,
              routes: [{ name: "login" }],
            });
          }}
        >
          Logout
        </Button>
      </Modal>
    </Portal>
  );
};

const DoctorHomeSreen = ({}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [userData, setUserData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    const run = async () => {
      let authData = await getAuthData();
      authData = JSON.parse(authData);
      const userDataRes = await getUserDatabyUID(authData.uid);
      if (!userDataRes.errorBool) {
        const userDataPar = userDataRes.response;
        if (!userDataPar.initiated) {
          navigation.reset({
            index: 0,
            routes: [{ name: "profileedit", params: { uid: userDataPar.uid } }],
          });
        }
        setUserData(userDataPar);
      }
      const relationDataRes = await getRelationsByDID(authData.uid);
      if (!relationDataRes.errorBool) {
        setPatientData(relationDataRes.response);
        // console.log(relationDataRes);
      }
      setLoading(false);
    };
    run();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <ScrollView>
        <View style={dls.view16}>
          <View style={dls.view17}>
            <View>
              <Text style={{ ...dls.text20, color: theme.colors.secondary }}>
                Welcome 👋
              </Text>
              <Text style={dls.text21}>
                {userData ? userData.fname + " " + userData.lname : " "}
              </Text>
            </View>
            <TouchableRipple onPress={showModal} rippleColor="rgba(0,0,0,0.1)">
              <Avatar.Text
                label={userData && userData.fname[0] + userData.lname[0]}
                size={42}
              />
            </TouchableRipple>
          </View>
          <RenderToolTip theme={theme} />
          <BannerDeco theme={theme} />
          {/* <BannerDeco2 theme={theme} /> */}

          {loading ? (
            <ActivityIndicator
              animating={true}
              style={{ marginTop: 32 }}
              color={"#000"}
            />
          ) : patientData ? (
            <RenderPatientTable theme={theme} pData={patientData} />
          ) : (
            <View
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 22,
              }}
            >
              <Text>No Patient Records</Text>
            </View>
          )}

          <DoctorProfileModal
            navigation={navigation}
            theme={theme}
            userData={userData}
            hideModal={hideModal}
            visible={visible}
          />
      
        </View>
      </ScrollView>
    </View>
  );
};

export default DoctorHomeSreen;
