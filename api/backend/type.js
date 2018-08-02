const outputTypeDefs = `
  # Statictics data from Matomo
  type Stats {
    # How many unique visits the entity has gotten
    visits: Int!

    # How many non-unique visits the entity has gotten
    views: Int!

    # How long it took to preset the page to the user
    avgGeneration: Float!

    # Approximately how long the user stayed on the page (seconds)
    avgRetention: Float!

    # How many visitors left after viewing the page (as opposed to viewing another)
    #
    # (percent)
    exitRate: String!

    # How many visitors left after viewing just this page
    #
    # (percent)
    bounceRate: String!

    # How many seconds users spent viewing this entity in total
    totalTime: Int!
  }

  type User {
    _id:            ID!
    username:       String!
    displayname:    String!
    avatarUrl:      String!
    smallAvatarUrl: String!
    lastSeen:       String!
    lastSeenReason: String!
    createdAt:      String!
    lastUpdate:     String!
    bio:            String!
    donationUrl:    String!
    stats:          Stats!
  }

  # A \`Session\` is an entity users log in with and deal in protected areas
  # Contains a JSON web token that MUST be present in the \`authorization\` header
  type Session {
    _id:       ID!
    user:      User!
    token:     String!
    expiresAt: String!
    createdAt: String!
    ip:        String!
    ua:        String!
  }

  type ThemeVairableOption {
    name:  String!
    label: String!
    value: String!
  }

  type ThemeVariable {
    type:    String!
    label:   String!
    name:    String!
    value:   String
    default: String!
    options: [ThemeVairableOption!]
  }

  type Rating {
    _id:   ID!
    user:  User!
    theme: Theme!
    value: Int!
  }

  type Theme {
    _id:         ID!
    user:        User!
    title:       String!
    description: String!
    content:     String!
    createdAt:   String!
    lastUpdate:  String!
    version:     String!
    screenshots: [String]
    license:     String!
    variables:   [ThemeVariable]
    stats:       Stats!
  }

  type SearchResults {
    users:  [User]
    themes: [Theme]
  }

  type Version {
    revisionLong:   String!
    revisionShort:  String!
    revisionTag:    String!
    revisionBranch: String!
  }

  type License {
    package:    String
    repository: String
    license:    String
    source:     String
    sourceText: String
  }

  # A \`Topic\` is an object that we derive from NodeBB's REST API
  type Topic {
    title: String!
    url: String!
    created: String!
    author: String!
  }
`

const inputTypeDefs = `
  input ThemeQuery {
    id:   ID
    user: String
  }

  input ThemeVariableOptionInput {
    name:  String!
    label: String!
    value: String!
  }

  input ThemeVariableInput {
    type:    String!
    label:   String!
    name:    String!
    value:   String
    default: String!
    options: [ThemeVariableOptionInput!]
  }
`

const queries = `
  type Query {
    # The currently logged in user
    viewer: User

    # Verifies that the current session token is still valid
    verifyToken: Session!

    # The global version object that is generated when the API is built
    version: Version!

    # A list of licenses for packages that require licenses to be shown
    licenses: [License]!

    # A list of sessions owned by the currently logged in user
    sessions: [Session]!

    # Gets topics from the forum
    #
    # (announcements ID is \`11\`)
    forumTopics(
      id: Int!
    ): [Topic]!

    theme(
      id: ID!
    ): Theme!

    user(
      id: ID!
    ): User!

    # Gets all themes a user owns
    userThemes(
      id: ID!
    ): [Theme]!

    search(
      terms: String!
      limit: Int
      skip:  Int
    ): SearchResults!

    latestThemes(
      limit: Int
    ): [Theme]!

    popularThemes(
      limit: Int
    ): [Theme]!

    # Gets ratings for the theme you provide an ID for
    ratings(
      id: ID!
    ): [Rating]!
  }
`

const mutations = `
  type Mutation {
    # The currently logged in use
    viewer: User

    # Delete the current session from the database (log out the currently
    # logged in user)
    logout: Boolean!

    # Resend the e-mail address verification message
    resendVerification: Boolean!

    # Verify the e-mail address by providing the token received via e-mail
    verifyEmail(
      token: String!
    ): Boolean!

    register(
      displayname: String!
      email:       String!
      password:    String!
    ): User!

    login(
      email:    String!
      password: String!
    ): Session!

    deleteTheme(
      id: ID!
    ): Boolean!

    # If ID does not exist, create a theme. Otherwise, modify the given theme
    theme(
      id:          ID
      title:       String!
      description: String!
      content:     String!
      version:     String!
      screenshots: [String]
      variables:   [ThemeVariableInput]!
      license:     String!
    ): Theme!

    # Change account information
    #
    # At least one option is required
    account(
      password:    String
      displayname: String
      email:       String
      bio:         String
      donationUrl: String
    ): User!

    # Submits a rating for a theme. Value can range from 1-5
    rate(
      id:    ID!
      value: Int!
    ): Rating!
  }
`

export default [
  outputTypeDefs,
  inputTypeDefs,
  queries,
  mutations,
].join('\n')
