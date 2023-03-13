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
  Avatar,
  Button,
  Menu,
  Portal,
  Modal,
  IconButton,
  Searchbar,
  Chip,
  ActivityIndicator,
} from "react-native-paper";
import { Text, View, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { doctorLandStyle as dls } from "../../styles/land.style";
import { doctorPatientProfileStyle as dps } from "../../styles/land.style";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import reportData from "../../../assets/fakedata/reportData.json";

import { getAuthData, removeAuthData } from "../../backend/authHelper";
import { getRecordsByPID, getUserDatabyUID } from "../../backend/dbHelper";
import { SafeAreaView } from "react-native-safe-area-context";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
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

const RenderPatientId = ({ theme, userData }) => {
  console.log(userData);
  return (
    <View style={{ padding: 32, paddingTop: 0, paddingBottom: 0 }}>
      <Text
        style={{
          color: theme.colors.secondary,
          ...dls.text10,
        }}
      >
        Patient ID
      </Text>
      <View
        style={{
          ...dls.view7,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Text style={{ ...dls.text11, color: theme.colors.onPrimaryContainer }}>
          {userData.uid.substring(0, 20)}...
        </Text>
        <TouchableRipple
          onPress={() => {}}
          rippleColor="rgba(0,0,0,0.1)"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#3b82f6", fontFamily: "Inter-Medium" }}>
            Copy
          </Text>
        </TouchableRipple>
      </View>
    </View>
  );
};

export const RandomColorString = () => {
  const colors = ["#fae8ff", "#d8b4fe", "#fffbeb", "#a5b4fc", "#f0f9ff"];
  const randomElement = colors[Math.floor(Math.random() * colors.length)];
  return randomElement;
};

const Signature = () => {
  return (
    <>
      <Text style={dls.text18}>Made with ❤️ by Dreamers</Text>
    </>
  );
};

const RenderReportTable = ({ navigation, theme, recordData }) => {
  const [sortId, setsortId] = useState();
  const toggleSortId = (id) => {
    setsortId(sortId !== id ? id : null);
  };
  const [mindt, setmindt] = useState(null);

  const [searchString, setsearchString] = useState("");

  return (
    <>
      <View style={{ width: "100%", padding: 32 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: theme.colors.secondary,
              fontSize: 14,
              fontFamily: "Inter-Medium",
            }}
          >
            Your Reports
          </Text>
          <IconButton
            icon={"refresh"}
            style={{
              width: 32,
              height: 32,
              backgroundColor: "#f5f5f5",
              borderRadius: 6,
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: 42,
            marginTop: 8,
            marginBottom: 12,
          }}
        >
          <Searchbar
            icon={"magnify"}
            placeholder="Search Reports"
            elevation={0}
            value={searchString}
            onChangeText={(t) => setsearchString(t)}
            inputStyle={{
              fontSize: 14,
            }}
            style={{
              width: "100%",
              height: 42,
              backgroundColor: "#f5f5f5",
              borderRadius: 12,
            }}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            display: "flex",
            flexDirection: "row",
            paddingVertical: 6,
            marginBottom: 12,
          }}
        >
          <Button
            icon={"calendar-edit"}
            onPress={() => {
              if (!mindt) {
                DateTimePickerAndroid.open({
                  value: new Date(),
                  maximumDate: new Date(),
                  minimumDate: new Date(1950, 0, 1),
                  onChange: (event, date) => {
                    let dte = new Date(date);
                    setmindt(dte);
                  },
                });
              } else {
                setmindt(null);
              }
            }}
          >
            From {mindt && mindt.getDate() + " " + months[mindt.getMonth()]}
          </Button>
          <Chip
            compact
            selected={sortId == 0}
            onPress={() => {
              toggleSortId(0);
            }}
            style={{
              backgroundColor: "#f5f5f5",
              marginRight: 8,
            }}
            textStyle={{ color: "#000", fontSize: 12 }}
          >
            Most Lastest
          </Chip>
          <Chip
            compact
            onPress={() => {
              toggleSortId(1);
            }}
            selected={sortId == 1}
            style={{
              backgroundColor: "#f5f5f5",
              marginRight: 8,
            }}
            textStyle={{ color: "#000", fontSize: 12 }}
          >
            Most Treated
          </Chip>
          <Chip
            compact
            selected={sortId == 2}
            onPress={() => {
              toggleSortId(2);
            }}
            style={{
              backgroundColor: "#f5f5f5",
              marginRight: 8,
            }}
            textStyle={{ color: "#000", fontSize: 12 }}
          >
            Most Visited Doctor
          </Chip>
        </ScrollView>

        {recordData ? (
          recordData.map((e, i) => {
            let cdte = new Date(Date.parse(e.created_at));
            let month = months[cdte.getMonth()];
            // let month = cdte.toLocaleString("default", { month: "short" });
            if (mindt && cdte) {
              if (mindt > cdte) return null;
            }

            if (
              searchString.length > 0 &&
              !e.treat_id.toLowerCase().includes(searchString.toLowerCase()) &&
              !e.treat_id.toLowerCase().includes(searchString.toLowerCase())
            )
              return null;
            return (
              <TouchableRipple
                key={i}
                rippleColor="rgba(0,0,0,0.09)"
                onPress={() => {
                  navigation.navigate("doctorpatientreport", {
                    cid: e.id,
                  });
                }}
                style={{
                  paddingBottom: 5,
                  paddingTop: 5,
                  borderBottomColor: "#e0e0e0",
                  borderBottomWidth: 1,
                  borderRadius: 12,
                  zIndex: 0,
                }}
              >
                <View style={dps.view5}>
                  <View style={dps.view6}>
                    <Text style={dps.text3}>{e.treat_id.substring(0, 22)}</Text>
                    <Text
                      style={{ fontSize: 12, color: theme.colors.secondary }}
                    >
                      {e.id}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: theme.colors.onSurface,
                      ...dps.text4,
                    }}
                  >
                    {cdte.getDate()} {month}
                  </Text>
                </View>
              </TouchableRipple>
            );
          })
        ) : (
          <Text>No Records Founds</Text>
        )}
      </View>
    </>
  );
};

const DoctorProfileModal = ({
  navigation,
  visible,
  hideModal,
  theme,
  userData,
}) => {
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

const PatientHomeSreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [userData, setUserData] = useState(null);
  const [recordData, setRecordData] = useState(null);
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
      const recordsDataRes = await getRecordsByPID(authData.uid);
      if (!recordsDataRes.errorBool) {
        const recordDataPar = recordsDataRes.response;
        setRecordData(recordDataPar);
      }
      setLoading(false);
    };
    run();
  }, []);

  if (loading) {
    return (
      <>
        <SafeAreaView
          style={{
            // height: "100%",
            backgroundColor: "#fff",
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color="#000" size={"large"} />
        </SafeAreaView>
      </>
    );
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <ScrollView>
        <View style={dls.view16}>
          <View style={dls.view17}>
            <View>
              <Text style={{ ...dls.text20, color: theme.colors.secondary }}>
                Welcome 👋
              </Text>
              <Text style={dls.text21}>
                {userData.fname + " " + userData.lname}
              </Text>
            </View>
            <TouchableRipple onPress={showModal} rippleColor="rgba(0,0,0,0.1)">
              <Avatar.Text label="DA" size={42} />
            </TouchableRipple>
          </View>
          <RenderToolTip theme={theme} />
          <RenderPatientId theme={theme} userData={userData} />

          <DoctorProfileModal
            navigation={navigation}
            theme={theme}
            userData={userData}
            hideModal={hideModal}
            visible={visible}
          />

          <RenderReportTable
            theme={theme}
            navigation={navigation}
            recordData={recordData}
          />
          <Signature />
        </View>
      </ScrollView>
    </View>
  );
};

export default PatientHomeSreen;
