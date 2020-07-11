import { UserEntity } from './models/user'
import { createConnection, Connection } from 'typeorm'

let connection: Connection = null
export const dbConnection = async () => {
  if (!connection) {
    connection = await createConnection({
      type: 'postgres',
      host: 'motty.db.elephantsql.com',
      port: 5432,
      username: 'ahqlymsk',
      password: 'P2LxGvaBzEucURU5An198BoGuF6XxZ6L',
      database: 'ahqlymsk',
      entities: [UserEntity],
      synchronize: true,
      logging: false,
    })
  }
  return connection
}
