import { Column, Entity, ManyToOne, PrimaryColumn, BaseEntity } from "typeorm";
import { Bucket } from "./Bucket";

@Entity()
export class Blob extends BaseEntity {

  @PrimaryColumn('varchar')
  uuid: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  url: string;

  // @Column('varchar')
  // uuid_bucket: string;

  @ManyToOne(() => Bucket, bucket => bucket.blobs)
  bucket: Bucket;

}
