import { FeaturedPlaylist } from "../types";

export const getFeaturedPlaylists = async (
  spotifyToken: string,
  country: string,
  limit: number
): Promise<FeaturedPlaylist[]> => {
  try {
    const featuredPlaylistsResponse = await fetch(
      `https://api.spotify.com/v1/browse/featured-playlists?country=${country}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    );
    const featuredPlaylistsData = await featuredPlaylistsResponse.json();
    const playlists = featuredPlaylistsData.playlists;

    console.log({ featuredPlaylistsData });

    return playlists.items;
  } catch (error) {
    throw error;
  }
};
