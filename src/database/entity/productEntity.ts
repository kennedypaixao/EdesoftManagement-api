export default interface ProductEntity {
    UID: string;
	Name: string;
	Quantity: number;
	Picture: string;
	Price: number;
	Active: boolean;
	CreatedAt: Date;
	CreatedBy?: string;
	UpdatedAt?: Date;
    UpdatedBy?: string;
}