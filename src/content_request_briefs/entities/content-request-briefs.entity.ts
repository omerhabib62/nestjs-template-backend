import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('content_request_briefs')
export class ContentRequestBrief {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'content_request_id' })
  contentRequestId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'text', array: true, name: 'social_media_links', nullable: true })
  socialMediaLinks: string[];

  @Column({ type: 'text', nullable: true, name: 'brand_overview' })
  brandOverview: string;

  @Column({ type: 'text', nullable: true, name: 'product_overview' })
  productOverview: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  selection: string;

  @Column({ type: 'boolean', default: false })
  shipment: boolean;

  @Column({ type: 'text', nullable: true, name: 'required_actions' })
  requiredActions: string;

  @Column({ type: 'text', nullable: true })
  storyline: string;

  @Column({ type: 'text', nullable: true, name: 'b_rolls' })
  bRolls: string;

  @Column({ type: 'text', nullable: true, name: 'target_audience' })
  targetAudience: string;

  @Column({ type: 'text', array: true, nullable: true, name: 'ideal_creator_type' })
  idealCreatorType: string[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
