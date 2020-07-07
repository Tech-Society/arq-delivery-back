import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Employee extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    employee_id: string;

    @Column({
        type: 'varchar'
        , nullable: false
        , length: 100
    })
    name: string;

    @Column({
        type: 'varchar'
        , length: 100
        , nullable: false
    })
    full_name: string;

    @Column({
        type: 'varchar'
        , length: 20
        , nullable: false
    })
    phone: string;

    @Column({
        type: 'varchar'
        , nullable: false
        , length: 255
    })
    address: string;

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