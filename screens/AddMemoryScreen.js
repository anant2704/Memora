import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  Keyboard,
  ToastAndroid,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveMemory } from '../storage/memoryStorage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';


export default function AddMemoryScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [titleHeight, setTitleHeight] = useState(40);
  const [descHeight, setDescHeight] = useState(100);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your media library to pick images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      setImages(prev => [...prev, ...result.assets.map(a => a.uri)]);
    }
  };

  const showSuccessToast = () => {
    Platform.OS === 'android'
      ? ToastAndroid.show('Memory saved successfully!', ToastAndroid.SHORT)
      : Alert.alert('Success', 'Memory saved successfully!');
  };

  const save = async () => {
    Keyboard.dismiss();
    if (!title.trim() || !description.trim() || images.length === 0) {
      Alert.alert('Missing Fields', 'Please fill all fields and select at least one image.');
      return;
    }

    const memory = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      images,
      date: new Date().toLocaleString(),
    };

    await saveMemory(memory);
    showSuccessToast();
    navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F0F9F3' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <TextInput
            placeholder="Memory Title"
            placeholderTextColor="white"
            style={[styles.input, { height: titleHeight }]}
            value={title}
            onChangeText={setTitle}
            onContentSizeChange={(contentWidth, contentHeight) => setTitleHeight(contentHeight)}
          />
          <TextInput
            placeholder="Describe your memory..."
            placeholderTextColor="white"
            style={[styles.input, styles.textArea, { height: descHeight }]}
            value={description}
            onChangeText={setDescription}
            multiline
            onContentSizeChange={(contentWidth, contentHeight) => setDescHeight(contentHeight)}
          />
          <View style={{ alignItems: 'flex-end' }}>
  <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
    <Icon name="cloud-upload" size={24} color="#ffffff" />
  </TouchableOpacity>
</View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.imagePreview} />
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.saveButton} onPress={save}>
            <MaterialIcons name="save" size={32} color="#fff" />
          </TouchableOpacity>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    paddingBottom: 100, // Add some bottom padding to avoid text field overlap
  },
  input: {
    backgroundColor: '#161b22',
    color: '#c9d1d9',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    textAlignVertical: 'top',
  },
  pickButton: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 50,
    marginBottom: 16,
    width: 50,
    height: 50,
  },
  imageContainer: {
    marginBottom: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  saveButton: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -40 }],
    backgroundColor: '#000',
    width: 80,  // Make it circular
    height: 80, // Make it circular
    borderRadius: 40, // Circular shape
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
