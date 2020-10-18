const graphql = require("graphql");
const _ = require("lodash");
const Player = require("../models/player");
const League = require("../models/league");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// ---------------------- player type def
const PlayerType = new GraphQLObjectType({
  name: "Player",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    league: {
      type: LeagueType,
      resolve(parent, args) {
        //    return  _.find(leagues,{ id: parent.leagueId})
        return League.findById(parent.leagueId);
      },
    },
  }),
});

// ----------------------- league type  def
const LeagueType = new GraphQLObjectType({
  name: "League",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    country: { type: GraphQLString },
    players: {
      type: new GraphQLList(PlayerType),
      resolve(parent, args) {
        //     return _.filter(players ,{leagueId: parent.id})
        return Player.find({ leagueId: parent.id });
      },
    },
  }),
});

//------------------------------------- root query type def------------------------
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    player: {
      type: PlayerType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get book's data from db or other source
        // return  _.find(players, {id: args.id});
        return Player.findById(args.id);
      },
    },
    league: {
      type: LeagueType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get author data from db or other source
        // return  _.find(leagues, {id: args.id});
        return League.findById(args.id);
      },
    },
    players: {
      type: new GraphQLList(PlayerType),
      resolve(parent, args) {
        return Player.find({});
      },
    },
    leagues: {
      type: new GraphQLList(LeagueType),
      resolve(parent, args) {
        return League.find({});
      },
    },
  },
});

// -------------------------------------------- MUTATION --------------------------------
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // ----------------- add league mutation
    addLeague: {
      type: LeagueType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let league = new League({
          name: args.name,
          country: args.country,
        });
        return league.save();
      },
    },

    // -------------------- add player mutation
    addPlayer: {
      type: PlayerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        leagueId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let player = new Player({
          name: args.name,
          age: args.age,
          leagueId: args.leagueId,
        });
        return player.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
