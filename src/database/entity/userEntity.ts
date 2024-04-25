export default interface UserEntity {
    UID: string;
	Name: string;
	Email:string;
	Password: string;
	IsAdmin: boolean;
	CreatedAt: Date;
	UpdatedAt?: Date;
}