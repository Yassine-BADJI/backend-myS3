import { Column, Entity, PrimaryColumn, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryColumn('varchar')
    uuid: string;

    @Column('varchar')
    nickname: string;

    @Column('varchar')
    email: string;

    @Column('varchar')
    password: string;

}
