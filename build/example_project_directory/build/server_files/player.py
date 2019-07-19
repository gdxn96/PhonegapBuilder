import models

class Player:
	def __init__(self, socket, game_modes, hosting_options, topics):
		"""
		Constructor
		"""

		self.socket = socket # websocket client object used to contact client-side
		self.session = False # players need to interact with session
		self.in_session = False # bool needed

		# create models
		self.session_config = models.SessionConfig(self,game_modes,
				hosting_options, topics)

		self.game_data = models.GameData(self)

	def leave_session(self):
		"""

		"""
		if (self.session):
			self.session.remove_player(self)

	def update_score(self, score):
		"""
		updates the score inside the game_data model, once received it will
		sync the game_data with the client
		"""
		self.game_data.update_score(score)

	def update_opponent_scores(self, scores):
		"""
		updates the opponent scores inside the game_data model, once received
		it will sync the game_data with the client
		"""
		self.game_data.update_opponent_scores(scores)

	def end_game(self):
		"""
		called once the game is ended
		"""
		self.game_data.end_game()
		self.session_config.update_player_count(0,0)

	def get_score(self):
		"""
		simple getter
		"""
		return self.game_data.score

	def answer_question(self, answer_data):
		"""
		calledf once the player answers a question, simply passes it on to the
		connected game object
		"""
		if (self.session.game):
			self.session.game.player_answered(self, answer_data["answerId"],
				answer_data["timeLeft"])

	def update_question(self,
					question,
					answers,
					time_to_answer,
					round_number,
					max_rounds):
		"""
		updates the current question inside the game_data model,
		once received it will sync the game_data with the client
		"""
		self.game_data.update_question(question, answers, time_to_answer,
			round_number, max_rounds)

	def set_game_outcome(self, outcome):
		"""
		simple setter
		"""
		self.game_data.outcome = outcome

	def update_player_count(self, current_players, max_players):
		"""
		updates the score inside the session_config model, once received it will
		sync the session_config_data with the client
		"""
		self.session_config.update_player_count(current_players, max_players)

	def get_chosen_game_mode(self):
		"""
		Simple getter
		"""
		return self.session_config.chosen_game_mode

	def get_chosen_topic(self):
		"""
		Simple getter
		"""
		return self.session_config.chosen_topic

	def set_chosen_game_mode(self, game_mode):
		"""
		Simple setter
		"""

		self.session_config.chosen_game_mode = game_mode

	def set_chosen_topic(self, topic):
		"""
		Simple setter
		"""

		self.session_config.chosen_topic = topic

	def update_available_sessions(self, sessions):
		"""
		available sessions are subject to change server-side,
		if such a change is made,
		this method will be called to notify the player
		"""

		self.session_config.update_available_sessions(sessions)

	def send_to_self(self, data, type):
		"""
		sends message to client
		"""
		message = self.structure_message(data, type)
		self.socket.write_message(message)

	def structure_message(self, data, type):
		"""
		simply formats the message into a data field and a type field,
		just to reduce the amount of code
		"""
		message = {}
		message["type"] = type
		message["data"] = data

		return message











