class SessionConfig:
	def __init__(self, player, game_modes, hosting_options, topics):
		"""
		sets up a simple model to keep track of the players session config data
		eg. Topic they want to play, topics they can choose from, game_mode
		chosen etc
		"""
		self.player = player

		# lists of options the client needs to see
		self.available_sessions = [] # sessions that exist matching the chosen topic
		self.hosting_options = hosting_options # hosting options to choose from
		self.topics = topics # topics to choose from
		self.game_modes = game_modes # available game modes to choose from

		self.max_players = 0
		self.current_players = 0

		# needed when creating sessions, client updates these later
		self.chosen_game_mode = "" # chosen game mode
		self.chosen_topic = "" # chosen topic

		self.sync_with_client()

	def update_player_count(self, current_players, max_players):
		self.max_players = max_players
		self.current_players = current_players
		self.sync_with_client()

	def update_available_sessions(self, sessions):
		"""
		available sessions are subject to change server-side,
		if such a change is made,
		this method will be called to notify the player
		"""

		self.available_sessions = sessions
		self.sync_with_client()

	def sync_with_client(self):
		# creates the dict
		data = {
			"allTopics" : self.topics,
			"allHostingOptions" : self.hosting_options,
			"allGameModes" : self.game_modes,
			"sessionsAvailable" : self.available_sessions,
			"maxPlayers" : self.max_players,
			"currPlayers" : self.current_players
		}

		#sends the message
		self.player.send_to_self(data, "update_session_config")

class GameData:
	def __init__(self, player):
		"""
		holds the game data unique to each player during a game
		"""
		self.player = player

		self.score = 0
		self.opponent_scores = {}
		self.current_question = ""
		self.current_answers = []
		self.time_to_answer = 0
		self.round_number = 0
		self.max_rounds = 0
		self.outcome = "Loser"

		pass

	def update_question(self, question, answers, time_to_answer, round_number,
		max_rounds):
		"""
		lets the player know when a new question is posed
		"""
		self.question  = question
		self.answers = answers
		self.time_to_answer = time_to_answer
		self.round_number = round_number
		self.max_rounds = max_rounds


		self.sync_with_client("new_question")

	def update_opponent_scores(self, opponent_scores):
		"""
		every time an opponent answers a question, user gets notified here
		"""
		self.opponent_scores = opponent_scores
		self.sync_with_client("update_game_data")

	def update_score(self, score):
		self.score = score
		self.sync_with_client("update_game_data")

	def end_game(self):
		"""
		tells the client the game is over
		"""
		self.sync_with_client("game_over")

		self.score = 0
		self.opponent_scores = {}
		self.current_question = ""
		self.current_answers = []
		self.time_to_answer = 0
		self.round_number = 0
		self.max_rounds = 0
		self.outcome = "Loser"


	def sync_with_client(self, type):
		data = {
			"score" : self.score,
			"question" : self.question,
			"answers" : self.answers,
			"time_to_answer" : self.time_to_answer,
			"round_number" : self.round_number,
			"max_rounds" : self.max_rounds,
			"opponent_scores" : self.opponent_scores,
			"game_outcome" : self.outcome
		}
		self.player.send_to_self(data, type)



class StatHandler():
	def __init__():
		pass