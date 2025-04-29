import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  FlatList,
  ToastAndroid,
  ScrollView, // Import ScrollView for horizontal scrolling
} from 'react-native';
import { getAllMemories, deleteMemory } from '../storage/memoryStorage';
import Icon from 'react-native-vector-icons/Feather';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMemory, setExpandedMemory] = useState(null); // Track expanded memory

  const loadMemories = async () => {
    try {
      setLoading(true);
      const allMemories = await getAllMemories();
      const sorted = allMemories.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMemories(sorted);
    } catch (error) {
      console.error('Error loading memories:', error);
      setMemories([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadMemories();
    }, [])
  );

  const handleDeleteMemory = async (id) => {
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to delete this memory?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteMemory(id);
            setMemories(prev => prev.filter(m => m.id !== id));
            Platform.OS === 'android'
              ? ToastAndroid.show('Memory deleted!', ToastAndroid.SHORT)
              : Alert.alert('Deleted', 'Memory deleted!');
          },
        },
      ]
    );
  };

  const truncateDescription = (description) => {
    const words = description.split(' ');
    return words.slice(0, 20).join(' ') + (words.length > 20 ? '...' : '');
  };

  const handleExpandDescription = (id) => {
    setExpandedMemory(expandedMemory === id ? null : id);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F7C8D8" />
      </View>
    );
  }

  return (
    <MenuProvider>
      <View style={styles.container}>
        <FlatList
          data={memories}
          keyExtractor={item => item.id}
          renderItem={({ item: memory }) => {
            const isExpanded = expandedMemory === memory.id;
            return (
              <TouchableOpacity
                style={styles.memoryCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('MemoryDetailScreen', { memory })}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.memoryTitle}>{memory.title || 'Untitled'}</Text>
                    <Text style={styles.memoryDate}>{memory.date || 'No date'}</Text>
                  </View>
                  <Menu>
                    <MenuTrigger>
                      <Icon name="more-vertical" size={20} color="#F7C8D8" />
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption onSelect={() => handleDeleteMemory(memory.id)} text="Delete" />
                    </MenuOptions>
                  </Menu>
                </View>

                {/* Render the truncated description */}
                <Text style={styles.memoryDescription}>
                  {isExpanded ? memory.description : truncateDescription(memory.description)}
                  {!isExpanded && memory.description.split(' ').length > 20 && (
                    <Text
                      style={styles.moreText}
                      onPress={() => handleExpandDescription(memory.id)}
                    >
                      {' More'}
                    </Text>
                  )}
                </Text>

                {memory.images?.length > 0 && (
                  <View style={styles.imageContainer}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.imageScrollContainer}
                    >
                      {memory.images.map((uri, idx) => (
                        <Image
                          key={idx}
                          source={{ uri }} // works for Expo file paths
                          style={styles.image}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.noMemoryText}>
              No memories yet. Tap '+' to add.
            </Text>
          }
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddMemoryScreen')}
        >
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      </View>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9F3',
    padding: 16,
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F9',
  },
  memoryCard: {
    backgroundColor: '#E4EDE7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: '#F4D1D0',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  memoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5D2E46',
  },
  memoryDate: {
    fontSize: 12,
    color: '#8F7D8D',
    marginTop: 4,
  },
  memoryDescription: {
    fontSize: 14,
    color: '#5D2E46',
    marginTop: 8,
  },
  moreText: {
    color: '#4C9D69',
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 10,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    borderColor: '#F4D1D0',
    borderWidth: 1,
  },
  noMemoryText: {
    color: '#8F7D8D',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'black',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: '#ffffff',
    fontSize: 36,
  },
});
