import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


export default function MainPage(){
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Welcome to the app!
                </Text>
            </View>

            <View style={styles.body}>
                <View style={styles.bodyText}>
                    <Text style={styles.bodyText}>
                        This is the main page.
                    </Text>
                </View>
            
                <View style={styles.bodyImage}>
                    <Image
                        style={styles.bodyImage}
                        source={require('../../assets/images/mainPage.png')}
                    />
                </View>
            </View>
            
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => {
                        alert('Button pressed!');
                    }}
                >
                    <Text style={styles.footerButtonText}>
                        Press me!
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}