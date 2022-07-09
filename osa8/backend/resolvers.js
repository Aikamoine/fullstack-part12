const { UserInputError, AuthenticationError} = require('apollo-server')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const JWT_SECRET = process.env.SECRET

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let books
      if (args.genre) {
        books = await Book.find({ genres: { $in: [args.genre] } })
      } else {
        books = await Book.find({})
      }

      return books
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      console.log(context)
      return {
        id: context._id,
        username: context.username,
        favoriteGenre: context.favoriteGenre,
      }
    },
  },
  Book: {
    author: async (root) => {
      const thisAuthor = await Author.findById(root.author)
      return thisAuthor
    },
  },
  Author: {
    bookCount: async ({ name }) => {
      const authorId = await Author.findOne({ name: name })
      const books = await Book.find({ author: authorId })
      return books.length
    },
    born: (root) => {
      if (root.born) {
        return root.born
      }
      return null
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      console.log('addbook', args)
      const currentUser = context.username
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        try {
          const newAuthor = new Author({ name: args.author })
          author = await newAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }

      const book = new Book({ ...args, author: author })

      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      console.log(book)
      pubsub.publish('BOOK_ADDED', {bookAdded: book})
      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.username
      console.log('editauthor, context', context)
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      console.log('editauthor', args)
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      console.log('login args', args)
      const user = await User.findOne({ username: args.username })
      console.log('user', user)
      if (!user || args.password !== 'secret1') {
        throw new UserInputError('Wrong credientials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers