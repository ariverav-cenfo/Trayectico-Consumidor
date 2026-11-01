import { Component } from '@angular/core';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { ProfileSummary } from '../../components/profile/profile-summary/profile-summary';
import { ProfileData } from '../../components/profile/profile-data/profile-data';
import { ProfileActions } from '../../components/profile/profile-actions/profile-actions';
@Component({
  selector: 'app-profile',
  imports: [AiMessage, ProfileSummary, ProfileData, ProfileActions],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {}

