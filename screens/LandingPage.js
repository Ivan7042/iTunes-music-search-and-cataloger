import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { useNavigation } from '@react-navigation/native'; 


export default function LandingPage() {
    const navigation = useNavigation();
    const navigateToLogin = () => {
        navigation.navigate("Login");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎵 iTunes Music Cataloger 🎵</Text>
            <Image
                source={{
                    uri: "https://c.tenor.com/0BE3mYzHl6AAAAAd/tenor.gif",
                }}
                style={styles.logo}
            />
            <Text style={styles.tagline}>
                Organize your favorite songs effortlessly.
            </Text>
            <Text style={styles.description}>
                Discover, catalog, and enjoy music from iTunes in just a few taps. Your
                personalized music library is just a click away.
            </Text>
            <Button title="Get Started" onPress={navigateToLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    color: "#666",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
    color: "#888",
  },
});
