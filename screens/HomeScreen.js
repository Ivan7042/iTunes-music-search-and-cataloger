import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, Button, FlatList, View, Alert, TouchableOpacity, Image } from "react-native";
import { useDispatch } from "react-redux";
import { addSong } from "../store";
import { setCatalog } from "../store";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import { db } from "../FirebaseConfig"; 
import { getDocs, addDoc, collection } from "firebase/firestore"; 

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [songs, setSongs] = useState([]); 
  const dispatch = useDispatch(); 
  const navigation = useNavigation();

  //load user's catalog to redux store
  useEffect(() => {
    const songsRef = collection(db, "songs");

    const loadCatalogFromFirestore = async () => {
      try {
        const snapshot = await getDocs(songsRef); 
        const catalog = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); // Get the song data and document ID

        // Dispatch the fetched catalog to Redux
        dispatch(setCatalog(catalog)); 
      } catch (error) {
        console.error("Error loading catalog from Firestore: ", error);
      }
    };

    loadCatalogFromFirestore(); 
  }, []); 


  const addSongToFirestore = async (song) => {
    try {
      // Reference to the 'songs' collection
      const songsRef = collection(db, 'songs');
  
      // Add the song document to Firestore
      const docRef = await addDoc(songsRef, song);
  
      console.log("Song added with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding song to Firestore: ", error);
    }
  };
  
  // Manage current song and play state per song
  const [playingSongs, setPlayingSongs] = useState({}); 

  const playSong = (songUrl, trackId) => {
    // Create a new sound object for the selected song
    const sound = new Audio.Sound();
    sound.loadAsync({ uri: songUrl }).then(() => {
      sound.playAsync().then(() => {
        setPlayingSongs(prev => ({
          ...prev,
          [trackId]: {
            sound: sound,
            isPlaying: true,
          },
        }));

        sound.setOnPlaybackStatusUpdate(status => {
          if (!status.isPlaying && status.didJustFinish) {
            setPlayingSongs(prev => ({
              ...prev,
              [trackId]: { ...prev[trackId], isPlaying: false },
            }));
          }
        });
      }).catch(error => console.error("Error playing song:", error));
    });
  };

  const stopSong = (trackId) => {
    if (playingSongs[trackId]?.sound) {
      playingSongs[trackId].sound.stopAsync();
      setPlayingSongs(prev => ({
        ...prev,
        [trackId]: { ...prev[trackId], isPlaying: false },
      }));
    }
  };

  const togglePlayStop = (songUrl, trackId) => {
    if (playingSongs[trackId]?.isPlaying) {
      stopSong(trackId);
    } else {
      playSong(songUrl, trackId);
    }
  };

  const fetchSongs = async () => {
    try {
      if (searchTerm.trim() === "") {
        Alert.alert("Error", "Please enter a search term");
        return;
      }
      const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&media=music&limit=10`);
      const data = await response.json(); 

      if (data.results) {
        setSongs(data.results); 
      } else {
        Alert.alert("No Results", "No songs found for this search.");
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
      Alert.alert("Error", "Could not fetch songs from iTunes API");
    }
  };

  const handleAddSong = (song) => {
    dispatch(addSong(song));
    addSongToFirestore(song);

    Alert.alert("Success", `${song.trackName} has been added to your catalog.`);
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Songs</Text>
      <TouchableOpacity
        style={styles.favoritesButton}
        onPress={() => navigation.navigate('Catalog')} 
      >
        <Text style={styles.favoritesButtonText}>Favorites</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter song name"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={fetchSongs} 
      />
      <Button title="Search" onPress={fetchSongs} />
      
      <FlatList
        data={songs}
        keyExtractor={(item) => item.trackId.toString()}
        renderItem={({ item }) => {
          // Access isPlaying state from the playingSongs object
          const isPlaying = playingSongs[item.trackId]?.isPlaying;
          return (
            <View>
              <View style={styles.songItem}>
                <Image
                  source={{uri: item.artworkUrl100}}
                  style={styles.albumArt} 
                />
                <View>
                  <Text style={styles.songName}>{item.trackName} by {item.artistName}</Text>
                  
                  <View>
                    <TouchableOpacity onPress={() => togglePlayStop(item.previewUrl, item.trackId)}>
                      <Text style={styles.controlText} >{isPlaying ? "Stop" : "Play"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.addStyle} onPress={() => handleAddSong(item)}>
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  songItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "left",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  songInfo:{
    alignItems: "left"
  },
  songName: {
    fontSize: 16,
  },
  addStyle: {
    position: "absolute",
    right: 20,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "blue"
  },
  favoritesButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  favoritesButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  albumArt: {
    height: 50,
    width: 50,
    marginRight: 10
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  controlText: {
    fontSize: 14,
    color: "blue",
    marginRight: 10,
  },
});
