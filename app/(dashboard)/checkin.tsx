import React from "react";
import { View, Text, StyleSheet } from "react-native"

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check - in</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0FDF4", 
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0F172A",
  },
})
