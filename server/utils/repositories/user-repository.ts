import type { IUser } from '../models/user'
import User from '../models/user'

class UserRepository {
  async findByEmail(email: string) {
    return await User.findOne({ email })
  }

  async create(userData: Partial<IUser>) {
    return await User.create(userData)
  }
}

export default new UserRepository()
