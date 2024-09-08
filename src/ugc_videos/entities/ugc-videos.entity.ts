import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('ugc_videos')
export class UgcVideo {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'content_creator_id' })
  contentCreatorId: number;

  @Column({ type: 'text', name: 'video_url' })
  videoUrl: string;

  @Column({ type: 'varchar', length: 255, name: 'video_niche' })
  videoNiche: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({ type: 'timestamp', name: 'uploaded_at' })
  uploadedAt: Date;
}
