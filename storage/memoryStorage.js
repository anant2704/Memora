import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@memories';

// Save a memory
export const saveMemory = async (memory) => {
  try {
    let memories = await AsyncStorage.getItem(STORAGE_KEY);
    memories = memories ? JSON.parse(memories) : [];
    const newMemory = { ...memory, id: Date.now().toString() }; // Use date timestamp as the unique ID
    memories.push(newMemory);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch (error) {
    console.error('Error saving memory:', error);
  }
};

// Get all memories in "latest to oldest" order
export const getAllMemories = async () => {
  try {
    const memories = await AsyncStorage.getItem(STORAGE_KEY);
    const parsedMemories = memories ? JSON.parse(memories) : [];
    // Sort the memories by the ID (timestamp), in descending order (latest first)
    return parsedMemories.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error('Error loading memories:', error);
    return [];
  }
};


// Delete memory by ID
export const deleteMemory = async (id) => {
  try {
    let memories = await AsyncStorage.getItem(STORAGE_KEY);
    memories = memories ? JSON.parse(memories) : [];
    const updatedMemories = memories.filter((memory) => memory.id !== id); // Ensure proper filtering
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemories));
  } catch (error) {
    console.error('Error deleting memory:', error);
  }
};