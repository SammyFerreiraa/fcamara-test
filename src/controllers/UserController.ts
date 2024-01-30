import { Request, Response } from 'express'
import { UserRepository } from '../repositories/userRepository'
import bcrypt from 'bcrypt'

export class UserController {
  async create (req : Request, res: Response) {
    try {
      const { name, email, address, city, password } = req.body

      const userExists = await UserRepository.findOne({ where: { email } })
      if (userExists) return res.status(400).json({'message': 'User already exists'})

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = UserRepository.create({
        name,
        email,
        address,
        city,
        password: hashedPassword
      })
      await UserRepository.save(newUser)

      return res.status(201).json({'message': 'User created'})
    } catch (error) {
      console.log(error)
    }  
  }

    async getUser (req: Request, res: Response) {
      try {
        return res.status(200).json(req.user)
      } catch (error) {
        console.log(error)
      }
    }

    async updateUser (req: Request, res: Response) {
      try {
        const { name, email, address, city, password } = req.body
        const user = req.user

        const hashedPassword = await bcrypt.hash(password, 10)
        
        user.name = name
        user.email = email
        user.address = address
        user.city = city
        user.password = hashedPassword

        await UserRepository.save(user)

        return res.status(200).json({'message': 'User updated'})
      } catch (error) {
        console.log(error)
      }
    }
}