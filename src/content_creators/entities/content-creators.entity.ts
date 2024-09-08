import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('content_creators')
export class ContentCreator {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'int', name: 'step_id', nullable:true})
  stepId: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  surname: string;

  @Column({ type: 'date' ,nullable:true})
  dob: Date;

  @Column({ type: 'varchar',nullable:true })
  location: string;

  @Column({ type: 'text', array: true, name: 'languages_spoken',nullable:true })
  languagesSpoken: string[];

  @Column({ type: 'text', name: 'profile_image',nullable:true })
  profileImage: string;

  @Column({ type: 'varchar',nullable:true })
  country: string;

  @Column({ type: 'varchar' ,nullable:true})
  city: string;

  @Column({ type: 'text', array: true ,nullable:true})
  niche: string[];

  @Column({ type: 'int',nullable:true })
  experience: number;

  @Column({ type: 'varchar',nullable:true })
  gender: string;

  @Column({ type: 'text', array: true, name: 'collaborators_interests' ,nullable:true})
  collaboratorsInterests: string[];

  @Column({ type: 'text', array: true, name: 'special_attributes',nullable:true })
  specialAttributes: string[];

  @Column({ type: 'text',nullable:true })
  about: string;

  @Column({ type: 'int', name: 'ugc_videos_uploaded', default: 0 ,nullable:true})
  ugcVideosUploaded: number;

  @Column({ type: 'jsonb', name: 'social_media_links',nullable:true })
  socialMediaLinks: Record<string, any>;

  @Column({ type: 'varchar', name: 'contact_email', length: 255,nullable:true })
  contactEmail: string;

  @Column({ type: 'varchar', name: 'contact_phone', length: 20,nullable:true })
  contactPhone: string;

  @Column({ type: 'decimal', name: 'average_rating', precision: 3, scale: 2,nullable:true })
  averageRating: number;

  @Column({ type: 'int', name: 'review_count' ,nullable:true})
  reviewCount: number;

  @Column({ type: 'text', array: true,nullable:true })
  tags: string[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
