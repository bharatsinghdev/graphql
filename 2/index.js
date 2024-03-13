import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import cors from 'cors';

// data
import db from './_db.js'

// types
import { typeDefs } from './schema.js'

// resolvers
const resolvers = {
    Query: {
        games() {
            return db.games
        },
        authors() {
            return db.authors
        },
        reviews() {
            return db.reviews
        },
        review(_, args) {
            return db.reviews.find(review => review.id === args.id)
        },
        author(_, args) {
            return db.authors.find(author => author.id === args.id)
        },
        game(_, args) {
            return db.games.find(game => game.id === args.id)
        }
    },
    Game: {
        reviews(parent) {
            return db.reviews.filter(r => r.game_id === parent.id);
        }
    },
    Review: {
        games(parent) {
            return db.games.filter(r => r.id === parent.game_id)
        },
        authors(parent) {
            return db.authors.filter(r => r.id === parent.author_id)
        }
    },
    Author: {
        reviews(parent) {
            return db.reviews.filter(r => r.author_id === parent.id)
        }
    },
    Mutation: {
        addGame(_, args) {
            let game = {
                ...args.game,
                id: Math.floor(Math.random() * 10000).toString()
            }
            db.games.push(game);
            return game
        },
        deleteGame(_, args) {
            db.games = db.games.filter(r => r.id !== args.id)
            return db.games
        },
        updateGame(_, args) {
            db.games = db.games.map(g => {
                if (g.id === args.id) {
                    return { ...g, ...args.edits }
                }
                return g
            })

            console.log(db.games)
            return db.games.find(g => g.id === args.id)
        }
    }
}

// server setup
const server = new ApolloServer({
    typeDefs,
    resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)



/*
mutation addGameMutation($game : AddGameInput!){
  addGame(game:$game){
      id,
      title
  }
}


mutation DeleteMutation( $deleteGameId: ID!){
  deleteGame(id: $deleteGameId) {
    id,
    title,
    platform
  }
}


mutation EditMutation($edits:EditGameInput,$id:ID!){
  updateGame(edits:$edits,id:$id){
    title,
    platform
  }
}

query ExampleQuery($id: ID!) {
  #  game(id: $id) {
  #    title,
  #    reviews{
  #      content
  #    }
  #  }
  #  authors(id:$id) {
  #    name,
  #    reviews {
  #      content
  #    }
  #  }
   review(id: $id) {
      games {
        title
      }   
      authors {
        name
      }
   }
}

*/