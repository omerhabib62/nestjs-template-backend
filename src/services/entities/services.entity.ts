import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'content_request_id' })
  contentRequestId: number;

  @Column({ type: 'varchar', length: 255, name: 'service_name' })
  serviceName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255, name: 'video_type' })
  videoType: string;

  @Column({ type: 'int', name: 'nr_of_creators' })
  nrOfCreators: number;

  @Column({ type: 'varchar', length: 255, name: 'video_duration' })
  videoDuration: string;

  @Column({ type: 'varchar', length: 255 })
  formats: string;

  @Column({ type: 'text', array: true, name: 'add_ons' })
  addOns: string[];

  @Column({ type: 'varchar', length: 255, name: 'creator_type' })
  creatorType: string;

  @Column({ type: 'boolean', name: 'in_house_services', default: false })
  inHouseServices: boolean;

  @Column({ type: 'boolean', name: 'full_usage_rights', default: false })
  fullUsageRights: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
