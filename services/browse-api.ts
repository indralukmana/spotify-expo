import { FeaturedPlaylist, Track } from '../types';

export const getFeaturedPlaylists = async (
  spotifyToken: string,
  country: string,
  limit: number,
): Promise<FeaturedPlaylist[]> => {
  try {
    const featuredPlaylistsResponse = await fetch(
      `https://api.spotify.com/v1/browse/featured-playlists?country=${country}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      },
    );
    const featuredPlaylistsData = await featuredPlaylistsResponse.json();
    const playlists = featuredPlaylistsData.playlists;

    return playlists.items;
  } catch (error) {
    throw error;
  }
};

export const getPlaylistItems = async (
  spotifyToken: string,
  playlistId: string,
): Promise<Track[]> => {
  try {
    const playlistItemsResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      },
    );
    const playlistItemsData = await playlistItemsResponse.json();
    const playlistItems: Track[] = playlistItemsData.items
      .map((item: any) => item.track)
      .filter((item: any) => item !== null);

    return playlistItems;
  } catch (error) {
    throw error;
  }
};
