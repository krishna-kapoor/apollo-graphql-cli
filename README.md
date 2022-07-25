# Apollo Server Boilerplate (CLI)

> Latest Release: v1.0.1

This CLI allows you to create your server by running just one command: `apollo-server-boilerplate`. The server runs using the following libraries:

1. Apollo Server Express (`apollo-server-express`)
2. PrismaJS (`@prisma/client` and `prisma`)
3. ExpressJS (`express`)
4. GraphQL (`graphql`)

## Usage

**Without a git repo**

```bash
apollo-server-boilerplate [Project folder name]
```

**With a git repo**

```bash
apollo-server-boilerplate [Project folder name] --git (or -g)
```

### Questions asked

1. Which GraphQL schema generator should be used? (choose NexusJS, since only this is supported in v1)
2. Development Server port (default: `8080`)
3. GraphQL schema path (default: `/graphql`)
4. Server URL after deployment (can be filled in later if left empty)
5. Database URL (can be filled in later if left empty)

**That's it!**

> Later releases post v1 will support `type-graphql` too
