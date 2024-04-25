import ProductEntity from "./productEntity";
import UserEntity from "./userEntity";

export default interface OrdersEntity {
    UID: string;
	UserUID: string;
	ProductUID: string;
	Quantity: number;
	CreatedAt: Date;
	CreatedBy?: string;
	UpdatedAt?: Date;
	UpdatedBy?: string;

	Product?: ProductEntity;
	User?: UserEntity;
}