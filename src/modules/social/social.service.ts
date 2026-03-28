import { SocialRepository } from './social.repository';
import { ProfileRepository } from '../profile/profile.repository';
import { UserFormatter } from '../../utils/user-formatter';
import { FlatFormatter } from '../../utils/flat-formatter';

const socialRepo = new SocialRepository();
const profileRepo = new ProfileRepository();

export class SocialService {
  async toggleSaveProfile(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new Error('You cannot save your own profile');
    }

    // Check if target user exists
    const targetUser = await profileRepo.findById(targetUserId);
    if (!targetUser) {
      throw new Error('Target profile not found');
    }

    const isAlreadySaved = await socialRepo.checkIfSaved(userId, targetUserId);

    if (isAlreadySaved) {
      await socialRepo.unsaveProfile(userId, targetUserId);
      return { isSaved: false, message: 'Profile unsaved successfully' };
    } else {
      await socialRepo.saveProfile(userId, targetUserId);
      return { isSaved: true, message: 'Profile saved successfully' };
    }
  }

  async getSavedProfiles(userId: string) {
    const savedRecords = await socialRepo.getSavedProfiles(userId);
    
    return savedRecords.map(record => {
      let user = record.saved_user as any;
      
      // Format the user's flats
      if (user.flats && Array.isArray(user.flats)) {
        user.flats = user.flats.map((f: any) => FlatFormatter.formatFlat(f));
      }
      
      // Format the user object itself
      return UserFormatter.formatUser(user);
    });
  }
}
