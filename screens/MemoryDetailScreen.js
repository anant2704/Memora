import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

export default function MemoryDetailScreen({ route }) {
  const { memory } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{memory.title}</Text>
      <Text style={styles.date}>📅 {memory.date}</Text>
      <Text style={styles.description}>{memory.description}</Text>

      <View style={styles.imageContainer}>
        {memory.images.length > 0 ? (
          memory.images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))
        ) : (
          <Text style={styles.noImageText}>No images to display.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#F0F9F3',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#6B4F4F',
    marginBottom: 10,
    fontFamily: 'JetBrainsMono_700Bold',
  },
  date: {
    fontSize: 14,
    alignSelf: 'flex-end',
    color: '#787F79',
    marginBottom: 20,
    fontFamily: 'JetBrainsMono_400Regular',
  },
  description: {
    fontSize: 16,
    color: '#6B4F4F',
    marginBottom: 20,
    lineHeight: 22,
    fontFamily: 'JetBrainsMono_400Regular',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
  },
  image: {
    width: (Dimensions.get('window').width - 50) / 2,
    height: 180,
    borderRadius: 12,
    marginBottom: 15,
    borderColor: '#F4D1D0',
    borderWidth: 1,
  },
  noImageText: {
    fontSize: 16,
    color: '#8b949e',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'JetBrainsMono_400Regular',
  },
});
