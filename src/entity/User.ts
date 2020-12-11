import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm";

@Entity()
export class User {

    @PrimaryColumn('varchar')
    uuid: string;

    @Column('varchar')
    nickname: string;

    @Column('varchar')
    email: string;

    @Column('varchar')
    password: string;

}
