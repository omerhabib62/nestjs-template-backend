import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('content_requests')
export class ContentRequest {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'int', name: 'brand_id' })
    brandId: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_order_value' })
    totalOrderValue: number;

    @Column({ type: 'boolean', default: false, name: 'is_paid' })
    isPaid: boolean;

    @Column({ type: 'varchar', length: 50 })
    status: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
}
