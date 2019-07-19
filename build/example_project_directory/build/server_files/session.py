"""
Holds a collection of players and starts the game when session is full,
simply a way of connecting a number of players currently online
"""
import sqltasks
import game

class Session:
	def __init__(self, player, game_mode, topic):
		"""
		Constructor
		"""
		self.id = str(self)
		self.players = [] # collection of players in session
		game_options = sqltasks.get_game_mode_by_id(game_mode)
		self.max_players = game_options["max_players"]
		self.topic = topic # the topic chosen by the host/player who created this session
		self.disconnected_players = 0

		self.game_mode = game_mode # the game_mode chosen by the host/player who created this session

		self.is_full = False # a boolean indicating the state of the session
		self.game = None # game object, initialized when session has required number of players

		self.add_player(player) # add the creator of the session to the list of players

		


	def remove_player(self, player):
		"""
		Removes a player from the session, usually happens from a player
		disconnect, if a game is currently running,
		it alerts the game object
		"""

		players = self.players

		# if the player they are looking for is not here, exit
		# otherwise problems can occur
		if player in players:
			players.remove(player)

		# if a game exists and is running, alert it so it can be handled
		if (self.game):
			if (self.game.is_running == True):
				self.game.player_disconnect(player)
				self.game = None
			else:
				print("disconnect player")
				self.disconnected_players += 1
		else:
			self.is_full = False

		# sync the new player count with the remaining players
		self.sync_player_count()

		print(len(players))

	def add_player(self, player):
		"""
		adds a player to the session
		"""

		# don't alter the session if it is full and ongoing
		if player in self.players or (self.game and self.game.is_running):
			return None

		# add the player
		self.players.append(player)
		player.set_chosen_game_mode(self.game_mode)
		player.session = self

		# check if the session is now full
		self.check_is_full()

		# let the current players know how many players are needed
		self.sync_player_count()

	def replay(self, player):
		# check if the game exists and is running
		if (self.game and self.game.is_running):
			return None

		if (self.game is not None):
			self.game = None
			self.players = []

		self.add_player(player)

	def check_is_full(self):
		"""
		Checks if the session is full, if it is, start the game
		"""
		if len(self.players) == self.max_players and not self.game:
			self.is_full = True
			self.create_game()

		if self.disconnected_players > 0:
			self.disconnected_players = 0
			print("is_full false")
			self.is_full = False

	def create_game(self):
		"""
		This is where the game object of the session is constructed
		"""
		print("start game")
		self.game = game.Game(self.players, self.game_mode, self.topic)


	def sync_player_count(self):
		"""
		Notifies the players in the session of the amount of players in the
		session, and the amount of players needed before the game begins
		"""

		players_in_session = len(self.players)
		players_needed = self.max_players


		for player in self.players:
			player.update_player_count(players_in_session, players_needed)

	def matches_attributes(self, topic, game_mode):
		"""
		checks if this session is available and the argument topic and
		game mode match the ones of this session
		"""
		if (len(self.players) < self.max_players and
				topic == self.topic and
				game_mode == self.game_mode):

			return True
		return False

	def get_data(self):
		"""

		"""
		data = {}
		data["id"] = self.id
		data["topicName"] = sqltasks.get_topic_name_by_id(self.topic)
		data["gameModeName"] = sqltasks.get_game_mode_name_by_id(self.game_mode)
		data["maxPlayers"] = self.max_players
		data["currentPlayers"] = len(self.players)
		return data

