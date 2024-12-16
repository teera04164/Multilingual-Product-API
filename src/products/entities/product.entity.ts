import { Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { ProductTranslation } from './product-translation.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'create_at' })
  create_at: Date;

  @OneToMany(() => ProductTranslation, (translation) => translation.product, { cascade: true })
  translations: ProductTranslation[];
}
