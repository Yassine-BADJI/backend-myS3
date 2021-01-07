import { Column, Entity, PrimaryColumn, BaseEntity, OneToMany } from "typeorm";
import { Blob } from "./Blob";

@Entity()
export class Bucket extends BaseEntity {

    @PrimaryColumn('varchar')
    uuid: string;

    @Column('varchar')
    name: string;

    @Column('varchar')
    uuid_user: string;

    @OneToMany(() => Blob, blob => blob.bucket)
    blobs: Blob[];
}
