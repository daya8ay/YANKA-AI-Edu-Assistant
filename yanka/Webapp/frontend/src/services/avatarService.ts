export interface HeyGenAvatarData {
  avatar_id: string;
  avatar_name: string;
  gender?: string | null;
  preview_image_url?: string | null;
  preview_video_url?: string | null;
  premium?: boolean | null;
  type?: string | null;
  tags?: string | null;
  default_voice_id?: string | null;
}

export interface SavedAvatar {
  avatar_id: number;
  name?: string | null;
  voice_id?: string | null;
  type?: string | null;
  heygen_data?: HeyGenAvatarData | null;
}

export interface SaveAvatarRequest {
  heygen_data: HeyGenAvatarData;
}

export interface SaveAvatarResponse {
  success: boolean;
  message: string;
  avatar_id: number;
}

export interface DeleteAvatarResponse {
  success: boolean;
  message: string;
}

/**
 * Avatar persistence service for saving and retrieving user avatars
 */
export class AvatarService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Save a user's selected avatar to their collection
   */
  async saveUserAvatar(
    avatarData: HeyGenAvatarData,
    authFetch: (url: string, options?: RequestInit) => Promise<Response>
  ): Promise<SaveAvatarResponse> {
    const payload: SaveAvatarRequest = {
      heygen_data: avatarData
    };

    const response = await authFetch(`${this.baseUrl}/users/me/avatars`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save avatar: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Get all avatars saved by the current user
   */
  async getUserAvatars(
    authFetch: (url: string, options?: RequestInit) => Promise<Response>
  ): Promise<SavedAvatar[]> {
    const response = await authFetch(`${this.baseUrl}/users/me/avatars`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get user avatars: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Delete a saved avatar from the current user's collection
   */
  async deleteUserAvatar(
    avatarId: number,
    authFetch: (url: string, options?: RequestInit) => Promise<Response>
  ): Promise<DeleteAvatarResponse> {
    const response = await authFetch(`${this.baseUrl}/users/me/avatars/${avatarId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete avatar: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Check if a specific avatar is already saved by the user
   */
  async isAvatarSaved(
    avatarId: string,
    authFetch: (url: string, options?: RequestInit) => Promise<Response>
  ): Promise<boolean> {
    try {
      const savedAvatars = await this.getUserAvatars(authFetch);
      return savedAvatars.some(avatar =>
        avatar.heygen_data?.avatar_id === avatarId
      );
    } catch (error) {
      console.error('Error checking if avatar is saved:', error);
      return false;
    }
  }
}

// Export a default instance
export const avatarService = new AvatarService();