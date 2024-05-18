import React from "react";
import { useState, useRef, useEffect } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authAPI from "../api/AuthApi";
import conversationApi from "../api/ConversationApi";
import ConversationItem from "../components/conversation/ConversationItem";
import userApi from "../api/UserApi";
import { ScrollView } from "react-native-gesture-handler";
import {
  AntDesignIcon,
  MaterialCommunityIconsIcon,
  IoniconsIcon,
  MaterialIconsIcon,
  FontAwesome5Icon,
  OcticonsIcon,
  EntypoIcon,
  EvilIconsIcon,
} from "../utils/IconUtils";
export default function ConversationScreen({ route }) {
  const [isMessagesChanged, setIsMessagesChanged] = useState(false);
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const [conversationData, setConversationData] = useState([]);
  const navigation = useNavigation();
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");

  // 1. Sau khi đăng nhập --> set Token
  // * Xoá code này: code này để test
  // useEffect(() => {
  //   const fetchDataAndSetToken = async () => {
  //     try {
  //       const data = await authAPI.login({
  //         email: "linh1@livegency.com",
  //         password: "123456",
  //       });
  //       setAccessToken(data.access_token);
  //       // Lưu access token vào AsyncStorage
  //       await AsyncStorage.setItem("accessToken", data.access_token);
  //     } catch (error) {
  //       console.error("Lỗi khi lưu token vào AsyncStorage:", error);
  //     }
  //   };
  //   fetchDataAndSetToken();
  // }, []);
  // 2. Fetch danh sách conversation khi accessToken thay đổi
  const fetchConversationList = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log("get access token:", accessToken);
      const conversations = await conversationApi.fetchConversation(
        accessToken
      );
      const me = await userApi.getMe(accessToken);
      setUserId(me.id);
      setConversationData(conversations.list);
    } catch (error) {
      console.error(error.message + "--" + error.code);
    }
  };

  useEffect(() => {
    fetchConversationList();
  }, [accessToken]);
  useEffect(() => {
    fetchConversationList();
    setIsMessagesChanged(false);
  }, [isMessagesChanged]);
  useEffect(() => {
    fetchConversationList();
    setIsCreateGroup(false);
  }, [isCreateGroup]);
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 70,
      }}
    >
      {/*Header  */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          background: "teal",
          padding: 20,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 30,
          }}
        >
          <AntDesignIcon name="search1" size={18} color="#fff" />
          <Text style={{ color: "#eee", fontSize: 18 }}>Search</Text>
        </View>
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 30,
          }}
          onPress={() =>
            navigation.navigate("CreateGroupScreen", {
              navigation,
              setIsCreateGroup,
            })
          }
        >
          <AntDesignIcon name="addusergroup" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
        }}
      >
        <ScrollView
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "100%",
          }}
        >
          {conversationData.length !== 0 && userId !== "" ? (
            conversationData.map((conversation, index) => (
              <ConversationItem
                key={index}
                conversation={conversation}
                userId={userId}
                navigation={navigation}
                setIsMessagesChanged={setIsMessagesChanged}
              ></ConversationItem>
            ))
          ) : (
            <Text
              style={{
                textAlign: "center",
                padding: 10,
                paddingTop: 15,
                fontSize: 16,
              }}
            >
              Chưa có cuộc trò chuyện nào
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
