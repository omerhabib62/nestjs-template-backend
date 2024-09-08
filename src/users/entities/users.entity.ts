import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true },)
  provider: string;

  @Column({ type: 'varchar', name: 'provider_id', nullable: true })
  providerId: string;

  @Column({ type: 'varchar', name: 'access_token', nullable: true })
  accessToken: string;

  @Column({ type: 'varchar', name: 'refresh_token', nullable: true  })
  refreshToken: string;

  @Column({ type: 'varchar', name: 'token_expiry', nullable: true  })
  tokenExpiry: string;

  @Column({ type: 'varchar', name: 'reset_token', nullable: true })
  resetToken: string;

  @Column({ type: 'timestamp', name: 'reset_token_expiry', nullable: true  })
  resetTokenExpiry: Date;

  @Column({ type: 'varchar', name: 'verification_code' })
  verificationCode: string;

  @Column({ type: 'varchar', name: 'verification_expiry' })
  verificationExpiry: string;

  @Column({ type: 'boolean', name: 'is_verified', default: false })
  isVerified: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
