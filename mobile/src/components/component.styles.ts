import { StyleSheet, TextStyle, ViewStyle, TextStyleIOS } from 'react-native';

interface Style {
  screenContainer: ViewStyle;
  titleBarContainer: ViewStyle;
  titleBarNameContainer: ViewStyle;
  titleBarName: TextStyle;
  horizontalRule: ViewStyle;
  subtitle: TextStyle;
  spacing: ViewStyle;

  text: TextStyle;
  rollType: TextStyle;
  artistName: TextStyle;
  noArtist: TextStyle;
  creator: TextStyle;
  provider: TextStyle;

  footerView: ViewStyle;
  newButton: ViewStyle;
  buttonText: TextStyle;
}

export default StyleSheet.create<Style>({
  // General Container
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Title Bar for Playroll
  titleBarContainer: {
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
  },
  titleBarNameContainer: {
    flex: 1,
  },
  titleBarName: {
    fontSize: 20,
    // color: 'black',
  },
  horizontalRule: {
    width: '90%',
    marginVertical: 5,
    borderBottomColor: 'lightgray',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  subtitle: {
    fontSize: 15,
    color: 'gray',
  },

  // Horizontal Spacer between rows
  spacing: {
    width: '90%',
    marginVertical: 10,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  // Text for Rows (Search and RollList)
  text: {
    fontFamily: 'Avenir',
  },
  rollType: {
    fontSize: 14,
    // color: 'purple',
  },
  artistName: {
    fontSize: 17,
    color: 'purple',
    fontWeight: 'bold',
  },
  noArtist: {
    fontFamily: 'Avenir',
    fontSize: 15,
    color: 'lightgrey',
  },
  // Creator (of the Album/Playlist/Track)
  creator: {
    fontWeight: 'bold',
  },
  // Providers: Spotify, etc.
  provider: {
    fontSize: 14,
    color: 'lightgray',
  },

  // Bottom View for Button
  footerView: {
    backgroundColor: '#fff',
    flex: 1,
    position: 'absolute',
    bottom: 0, // stick to bottom
    left: 0, // stretch to left
    right: 0, // stretch to right
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // float on top
  },

  // Bottom Button
  newButton: {
    width: '90%',
    backgroundColor: '#af00bc', // brighter purple
    borderRadius: 3,
    height: 40,

    // Center text contents
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Avenir',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
