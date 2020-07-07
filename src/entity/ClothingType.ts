import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class ClothingType extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    clothing_type_id: string;

    @Column({
        type: 'varchar'
        , nullable: false
        , length: 100
    })
    description: string;

    @Column({
        type: 'char',
        nullable: true,
        default: '1',
        length: 1,
    })
    status: string;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: true,
        default: () => "CURRENT_TIMESTAMP(6)",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        nullable: true,
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: 'CURRENT_TIMESTAMP(6)'
    })
    updated_at: Date;
}