import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function MemoryItem({ memory, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.memoryContainer}>
      {/* Display image from the file system path */}
      <Image source={{ uri: memory.imagePath }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{memory.title}</Text>
        <Text style={styles.date}>{memory.date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  memoryContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
  },
  textContainer: {
    flex: 1,
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    color: 'gray',
  },
});
