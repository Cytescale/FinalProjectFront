import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  TouchableRipple,
  useTheme,
  Avatar,
  TextInput,
  Searchbar,
  IconButton,
  ActivityIndicator,
  Appbar,
} from "react-native-paper";
import {
  Text,
  View,
  Image,
  Button,
  ScrollView,
  FlatList,
  SectionList,
  VirtualizedList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { customerArr, RandomColorString } from "./land";
import { useNavigation } from "@react-navigation/native";
import { doctorPatientStyle as dps } from "../../styles/land.style";
import patientData from "../../../assets/fakedata/patientData.json";
import { StatusBar } from "expo-status-bar";
import { getAuthData } from "../../backend/authHelper";
import { getUserDatabyUID, getRelationsByDID } from "../../backend/dbHelper";
import { doctorIndexStyle as dis } from "../../styles/land.style";

const RenderPatientGridTable = ({ searchString, pData }) => {
  const navigation = useNavigation();
  return (
    <>
      <FlatList
        data={pData}
        style={{
          marginTop: 22,
          padding: 24,
          paddingTop: 0,
        }}
        renderItem={(item) => {
          let e = item.item.patientData;
          return (
            <TouchableRipple
              key={item.index}
              rippleColor="rgba(0,0,0,0.09)"
              onPress={() => {
                navigation.navigate("doctorpatient", {
                  uid: e.uid,
                });
              }}
              style={{
                display: "flex",
                width: "50%",
                padding: 12,
                paddingVertical: 22,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar.Text
                  size={72}
                  label={e.fname[0]}
                  color="#000"
                  style={{ backgroundColor: RandomColorString() }}
                />
                <Text
                  style={{
                    fontSize: 17,
                    textAlign: "center",
                    textAlignVertical: "center",
                    marginTop: 12,
                    fontFamily: "Inter-Medium",
                  }}
                >
                  {e.fname} {e.lname}
                </Text>
                <Text style={dps.text4}>
                  #
                  {e.uid.substr(1, 4) +
                    "....." +
                    e.uid.substr(e.uid.length - 4, e.uid.length)}
                </Text>
              </View>
            </TouchableRipple>
          );
        }}
        numColumns={2}
        keyExtractor={(item, index) => index}
      />
    </>
  );
};

const RenderPatientTable = ({ searchString, pData }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <>
      <View style={dps.view1}>
        <FlatList
          data={pData}
          style={{
            padding: 18,
            paddingTop: 0,
          }}
          renderItem={(item) => {
            let e = item.item.patientData;
            if (
              searchString.length > 0 &&
              !e.fname.toLowerCase().includes(searchString.toLowerCase()) &&
              !e.lname.toLowerCase().includes(searchString.toLowerCase())
            )
              return null;
            return (
              <TouchableRipple
                key={item.index}
                rippleColor="rgba(0,0,0,0.09)"
                onPress={() => {
                  navigation.navigate("doctorpatient", {
                    uid: e.uid,
                  });
                }}
                style={{
                  ...dps.touch1,
                }}
              >
                <View style={dps.view3}>
                  <View style={dps.view4}>
                    <Avatar.Text
                      size={42}
                      label={e.fname[0]}
                      color="#000"
                      style={{ backgroundColor: RandomColorString() }}
                    />
                    <View style={{ marginLeft: 8 }}>
                      <Text style={dps.text3}>
                        {e.fname} {e.lname}
                      </Text>
                      <Text style={dps.text4}>
                        #
                        {e.uid.substr(1, 4) +
                          "....." +
                          e.uid.substr(e.uid.length - 4, e.uid.length)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableRipple>
            );
          }}
        />
      </View>
    </>
  );
};
const DoctorPatientScreen = ({ navigation }) => {
  const [searchString, setsearchString] = useState("");
  const [gridView, setgridView] = useState(false);
  const toggleGridView = () => setgridView(!gridView);

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

  const theme = useTheme();
  return (
    <>
      <Appbar.Header mode="small">
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Patients" />
      </Appbar.Header>
      <View style={dis.view3}>
        <View
          style={{
            backgroundColor: theme.colors.background,
            minHeight: "100%",
          }}
        >
          <View style={{ ...dps.view5 }}>
            <View style={dps.view13}>
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  borderRadius: 120,
                  height: 42,
                  alignItems: "center",
                  backgroundColor: theme.colors.secondaryContainer,
                }}
              >
                <Searchbar
                  icon={"magnify"}
                  placeholder="Search Patients"
                  value={searchString}
                  onChangeText={(t) => setsearchString(t)}
                  inputStyle={{
                    fontSize: 15,
                  }}
                  iconColor={theme.colors.secondary}
                  style={{
                    elevation: 0,
                    height: 42,
                    backgroundColor: theme.colors.secondaryContainer,
                    borderRadius: 120,
                    display: "flex",
                    flexGrow: 1,
                  }}
                  elevation={0}
                />
                <IconButton
                  icon={!gridView ? "dots-grid" : "view-list"}
                  iconColor={theme.colors.secondary}
                  backgroundColor={theme.colors.secondaryContainer}
                  size={19}
                  style={{ borderRadius: 120 }}
                  onPress={() => {
                    toggleGridView();
                  }}
                />
              </View>
            </View>
            {loading ? (
              <ActivityIndicator
                animating={true}
                style={{ marginTop: 32 }}
                color={"#000"}
              />
            ) : !gridView ? (
              <RenderPatientTable
                searchString={searchString}
                pData={patientData}
              />
            ) : (
              <RenderPatientGridTable
                searchString={searchString}
                pData={patientData}
              />
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default DoctorPatientScreen;
