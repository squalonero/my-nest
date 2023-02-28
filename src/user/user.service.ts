import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
    // return 'This action adds a new user';
  }

  async findAll() {
    return this.userModel.find().exec();
    // return `This action returns all user`;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });
    return user;
  }

  async findOrCreate(user: CreateUserDto): Promise<User> {
    const dbUser = await this.userModel.findOne({ email: user.email });
    const returnUser = dbUser || (await this.create(user));
    return returnUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
