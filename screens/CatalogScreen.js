import React from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux"; 
import { removeSong } from "../store"; 
import { db } from "../FirebaseConfig"; 
import { getDocs, deleteDoc, collection, query, where} from "firebase/firestore"; 

export default function CatalogScreen() {
  const dispatch = useDispatch();
  
  // Get the catalog from the Redux store
  const catalog = useSelector((state) => state.catalog.catalog);

  const removeSongFromFirestore = async (song) => {
    try {
      const trackId = song.trackId; 
      console.log(`Attempting to delete song with trackId: ${trackId}`);

      // Query Firestore for the song document where trackId matches the song's trackId field
      const songsRef = collection(db, 'songs');
      const q = query(songsRef, where("trackId", "==", trackId)); // Query the 'songs' collection for matching trackId

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          // Once we find the matching song, delete it
          console.log("Found song document with trackId: ", trackId);
          
          // Get the document reference and delete the document
          await deleteDoc(doc.ref);
          console.log("Song removed with trackId: ", trackId);
        });
      } else {
        console.log("No song found with trackId: ", trackId);
      }
    } catch (error) {
      console.error("Error removing song from Firestore: ", error);
    }
  };


  // Function to handle the "Remove" button press
  const handleRemoveSong = (song) => {
    dispatch(removeSong(song));
    removeSongFromFirestore(song);

    Alert.alert("Success", `${song.trackName} has been removed from your catalog.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Music Catalog</Text>

      {/* Display the list of songs in the catalog */}
      <FlatList
        data={catalog}
        keyExtractor={(item) => item.trackId.toString()}
        renderItem={({ item }) => (
          <View style={styles.songItem}>
            <Image
              source={{uri: item.artworkUrl100}}
              style={styles.albumArt} 
            />
            <Text style={styles.songName}>{item.trackName} by {item.artistName}</Text>
            {/* "Remove" button next to each song */}
            <Button title="Remove" onPress={() => handleRemoveSong(item)} />
          </View>
        )}
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
  songItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  songName: {
    fontSize: 16,
    flex: 1,
  },
  albumArt: {
    height: 50,
    width: 50,
    marginRight: 10
  }
});
