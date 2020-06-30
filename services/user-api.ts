import { ErrorObject } from './services-types';
import { UserData } from '../types';

export const getProfile = async (spotifyToken: string): Promise<UserData> => {
  try {
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });
    const profileData = await profileResponse.json();

    const userData: UserData = {
      country: profileData.country,
      displayName: profileData.display_name,
      email: profileData.email,
    };

    return userData;
  } catch (error) {
    throw error;
  }
};
