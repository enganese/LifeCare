import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native-paper";


export default function LoginInput() {
    return (
        <View>
            <View>
                <Image src={{uri: ""}} />
            </View>
    
            <View style={{flexDirection="row"}}>
                <Text style={{textAlign: "left", fontFamily: "Rubik"}}>
                    Профиль
                </Text>
                <Image src={{uri: ""}} />
            </View>
        </View>
    );
}