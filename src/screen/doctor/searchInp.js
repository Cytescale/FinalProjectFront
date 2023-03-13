import React, { useState } from "react";
import {
  TouchableRipple,
  TextInput,
} from "react-native-paper";
import { Text, View } from "react-native";


const MTextInput = (props) => {
  const [en, sen] = useState(false);
  return (
    <View
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        position: "relative",
        zIndex: 100,
      }}
    >
      <TextInput
        {...props}
        value={props.text}
        onChangeText={(t) => {
          sen(false);
          props.setText(t);
        }}
      />
      {props.text && !en && props.text.length > 0 && (
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            position: "absolute",
            top: 0,
            backgroundColor: "#fefefe",
            height: "auto",
            elevation: 3,

            borderRadius: 7,
            marginTop: 62,
            zIndex: 100000,
          }}
        >
          {props.dataMap.map((e, i) => {
            if (!e.text.toLowerCase().includes(props.text.toLowerCase())) {
              return null;
            }
            if (i < 5)
              return (
                <TouchableRipple
                  key={i}
                  onPress={() => {
                    props.setText(e.text);
                    sen(true);
                  }}
                  rippleColor="rgba(0,0,0,0.1)"
                  style={{
                    display: "flex",
                    borderBottomWidth: 1,
                    paddingLeft: 16,
                    borderBottomColor: "#e0e0e0",
                    justifyContent: "center",
                    padding: 14,
                    zIndex: 100,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Inter-Medium",
                      color: "#454545",
                    }}
                  >
                    {e.text}
                  </Text>
                </TouchableRipple>
              );
          })}
        </View>
      )}
    </View>
  );
};

export default MTextInput;
